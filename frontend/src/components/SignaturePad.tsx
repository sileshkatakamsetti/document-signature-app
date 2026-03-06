import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

interface Props {
  onSave: (image: string) => void;
}

const SignaturePadComponent = ({ onSave }: Props) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {

    if (canvasRef.current) {

      sigPadRef.current = new SignaturePad(canvasRef.current, {
        penColor: "black",
      });

    }

  }, []);

  const clear = () => {
    sigPadRef.current?.clear();
  };

  const save = () => {

    if (!sigPadRef.current) return;

    if (sigPadRef.current.isEmpty()) {
      alert("Please draw signature first");
      return;
    }

    const image = sigPadRef.current.toDataURL("image/png");

    onSave(image);
  };

  return (
    <div className="border p-4 bg-white">

      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        className="border"
      />

      <div className="flex gap-3 mt-3">

        <button
          onClick={clear}
          className="bg-gray-500 text-white px-4 py-1 rounded"
        >
          Clear
        </button>

        <button
          onClick={save}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Save Signature
        </button>

      </div>

    </div>
  );
};

export default SignaturePadComponent;