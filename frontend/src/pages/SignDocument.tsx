import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";

interface DocumentType {
  _id: string;
  fileName: string;
}

function SignDocument() {

  const { documentId } = useParams<{ documentId: string }>();

  const [doc, setDoc] = useState<DocumentType | null>(null);
  const [showPad, setShowPad] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string>("");

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    const fetchDoc = async () => {

      if (!documentId) return;

      try {

        const res = await axios.get<DocumentType>(
          `http://localhost:5000/api/docs/public/${documentId}`
        );

        setDoc(res.data);

      } catch (err) {

        console.error("Document load error:", err);

      }

    };

    fetchDoc();

  }, [documentId]);


  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setPosition({ x, y });
    setShowPad(true);

  };


  const saveSignature = async () => {

    if (!sigCanvas.current || !position) {
      alert("Signature pad not ready");
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      alert("Please draw signature first");
      return;
    }

    const image = sigCanvas.current.toDataURL("image/png");

    setSignatureImage(image);

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/signatures",
        {
          documentId,
          page: 1,
          x: position.x,
          y: position.y,
          signatureImage: image
        },
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          : {}
      );

      alert("Signature saved successfully");

    } catch (err) {

      console.error("Save signature error:", err);
      alert("Failed to save signature");

    }

  };


  const clearSignature = () => {

    sigCanvas.current?.clear();
    setSignatureImage("");

  };


  if (!doc) {
    return <div>Loading document...</div>;
  }


  return (

    <div style={{ padding: "20px" }}>

      <h2>Document Signature</h2>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "600px"
        }}
      >

        <iframe
          src={`http://localhost:5000/uploads/${doc.fileName}`}
          width="100%"
          height="600px"
          title="PDF"
          style={{ border: "1px solid #ccc" }}
        />

        <div
          onClick={handleDocumentClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "600px",
            cursor: "crosshair",
            zIndex: 10,
            background: "rgba(0,0,0,0.001)"
          }}
        />

        {position && (

          <div
            style={{
              position: "absolute",
              left: `${position.x * 100}%`,
              top: `${position.y * 100}%`,
              transform: "translate(-50%, -50%)",
              background: "yellow",
              border: "2px solid black",
              padding: "6px",
              fontWeight: "bold",
              zIndex: 20
            }}
          >
            Sign Here
          </div>

        )}

      </div>


      {showPad && (

        <div style={{ marginTop: "20px" }}>

          <h3>Draw Your Signature</h3>

          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              style: { border: "1px solid black" }
            }}
            ref={sigCanvas}
          />

          <br />

          <button onClick={saveSignature}>
            Save Signature
          </button>

          <button
            onClick={clearSignature}
            style={{ marginLeft: "10px" }}
          >
            Clear
          </button>


          {signatureImage && (

            <div style={{ marginTop: "20px" }}>

              <h4>Signature Preview</h4>

              <img src={signatureImage} width="200" alt="signature" />

            </div>

          )}

        </div>

      )}


      {signatureImage && (

        <div style={{ marginTop: "20px" }}>

          <button
            onClick={() =>
              window.open(
                `http://localhost:5000/api/pdf/sign/${documentId}`
              )
            }
          >
            Download Signed PDF
          </button>

        </div>

      )}

    </div>

  );

}

export default SignDocument;