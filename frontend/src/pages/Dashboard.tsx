import { Upload, FileText, LogOut, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
// @ts-ignore
import Draggable from "react-draggable";
import SignaturePad from "../components/SignaturePad";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Dashboard = () => {

  const [documents, setDocuments] = useState<any[]>([]);
  const [docsToSign, setDocsToSign] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  const [signature, setSignature] = useState<any>(null);

  const [showPad, setShowPad] = useState(false);
  const [clickPosition, setClickPosition] = useState<any>(null);

  const [signerEmail, setSignerEmail] = useState("");
  const [signers, setSigners] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // Fetch documents
  useEffect(() => {

    const fetchDocs = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/docs/my-docs",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDocuments(res.data.documents);
    };

    const fetchDocsToSign = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/docs/to-sign",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDocsToSign(res.data.documents);
    };

    fetchDocs();
    fetchDocsToSign();

  }, []);

  // Fetch signature
  useEffect(() => {

    const fetchSignature = async () => {

      if (!selectedDoc) return;

      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `http://localhost:5000/api/signatures/${selectedDoc._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSignature(res.data);
      } catch {
        setSignature(null);
      }

    };

    fetchSignature();

  }, [selectedDoc]);

  // Fetch signers
  const fetchSigners = async () => {

    if (!selectedDoc) return;

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/signers/${selectedDoc._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSigners(res.data);

    } catch {
      console.error("Failed to fetch signers");
    }
  };

  useEffect(() => {
    if (selectedDoc) fetchSigners();
  }, [selectedDoc]);

  // Upload PDF
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("document", file);

    await axios.post(
      "http://localhost:5000/api/docs/upload",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.reload();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Add signer
  const addSigner = async () => {

    if (!selectedDoc || !signerEmail) return;

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/signers",
        {
          documentId: selectedDoc._id,
          email: signerEmail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSignerEmail("");
      fetchSigners();

    } catch {
      console.error("Failed to add signer");
    }
  };

  // PDF click
  const handlePdfClick = (
    e: React.MouseEvent<HTMLDivElement>,
    pageNumber: number
  ) => {

    if (showPad) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setClickPosition({
      page: pageNumber,
      x,
      y,
    });

    setTimeout(() => setShowPad(true), 100);
  };

  // Save signature
  const saveSignatureImage = async (image: string) => {

    if (!selectedDoc || !clickPosition) return;

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/api/signatures",
      {
        documentId: selectedDoc._id,
        page: clickPosition.page,
        x: clickPosition.x,
        y: clickPosition.y,
        signatureImage: image,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSignature(res.data);
    setShowPad(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

          <h1 className="text-2xl font-semibold">
            Document Signature
          </h1>

          <button
            onClick={handleLogout}
            className="text-red-500 flex gap-2"
          >
            <LogOut size={16}/> Logout
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            My Documents
          </h2>

          <button
            onClick={handleUploadClick}
            className="bg-black text-white px-5 py-2 rounded-lg flex gap-2"
          >
            <Upload size={16}/> Upload PDF
          </button>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileChange}
          />

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {documents.map((doc)=>(

            <div
              key={doc._id}
              onClick={()=>{ setSelectedDoc(doc); setNumPages(0); }}
              className="bg-white p-5 border rounded-xl cursor-pointer hover:shadow"
            >

              <FileText className="text-gray-400 mb-2"/>

              <h3 className="font-medium">
                {doc.originalName}
              </h3>

              <p className="text-sm text-gray-500">
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>

            </div>

          ))}

        </div>

        {docsToSign.length > 0 && (

          <>
            <h2 className="text-xl font-semibold mt-10 mb-4">
              Documents To Sign
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {docsToSign.map((doc)=>(

                <div
                  key={doc._id}
                  onClick={()=>{ setSelectedDoc(doc); setNumPages(0); }}
                  className="bg-yellow-50 p-5 border rounded-xl cursor-pointer hover:shadow"
                >

                  <FileText className="text-gray-400 mb-2"/>

                  <h3 className="font-medium">
                    {doc.originalName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Waiting for your signature
                  </p>

                </div>

              ))}

            </div>
          </>
        )}

      </main>

      {/* MODAL */}
      {selectedDoc && (

        <div className="absolute inset-0 z-50 bg-black/70 p-10">

          <div className="bg-white rounded-xl relative p-6">

            <button
              onClick={()=>setSelectedDoc(null)}
              className="absolute top-4 right-4 z-10 bg-white border rounded p-1"
            >
              <X size={22}/>
            </button>

            {/* Download */}
            <div className="mb-4">
              <button
                onClick={()=>window.open(
                  `http://localhost:5000/api/pdf/sign/${selectedDoc._id}`,
                  "_blank"
                )}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Download Signed PDF
              </button>
            </div>

            {/* Add signer */}
            <div className="mb-6 border p-4 rounded">

              <h3 className="font-semibold mb-2">
                Add Signer
              </h3>

              <div className="flex gap-2">

                <input
                  type="email"
                  placeholder="Enter signer email"
                  value={signerEmail}
                  onChange={(e)=>setSignerEmail(e.target.value)}
                  className="border px-3 py-1 rounded w-64"
                />

                <button
                  onClick={addSigner}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>

              </div>

            </div>

            {/* Signers */}
            <div className="mb-6">

              <h3 className="font-semibold mb-2">
                Signers
              </h3>

              {signers.map((s,i)=>(
                <div key={i} className="text-sm flex gap-2">
                  {s.signed ? "✔" : "❌"} {s.email}
                </div>
              ))}

            </div>

            {/* Signature pad */}
            {showPad && (
              <div className="mb-6">
                <SignaturePad onSave={saveSignatureImage}/>
              </div>
            )}

            {/* PDF */}
            <div className="flex justify-center">

              <Document
                file={`http://localhost:5000/uploads/${selectedDoc.fileName}`}
                onLoadSuccess={({numPages})=>setNumPages(numPages)}
              >

                {Array.from(new Array(numPages),(_,index)=>(

                  <div
                    key={index}
                    className="relative mb-6 cursor-pointer"
                    onClick={(e)=>handlePdfClick(e,index+1)}
                  >

                    <Page
                      pageNumber={index+1}
                      width={800}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />

                    {((signature && signature.page === index+1) ||
                     (clickPosition && clickPosition.page === index+1)) && (

                      <Draggable
                        defaultPosition={{
                          x: (signature ? signature.x : clickPosition.x) * 800,
                          y: (signature ? signature.y : clickPosition.y) * 800
                        }}
                        onStart={(e:any)=>e.stopPropagation()}
                      >
                        <div className="absolute border-2 border-blue-500 bg-white text-xs px-2 py-1 cursor-move z-50">
                          Sign Here
                        </div>
                      </Draggable>

                    )}

                  </div>

                ))}

              </Document>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Dashboard;