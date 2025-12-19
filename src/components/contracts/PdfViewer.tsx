import { useEffect, useRef, useState } from "react";
import { Clause } from "../../data/mockContracts";
import type { PdfjsLib, WindowWithPdfjsLib } from "../../types/pdfjs";

interface Props {
  fileUrl?: string;
  overlays?: Clause[];
}

export default function PdfViewer({ fileUrl, overlays = [] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdfJs = async (): Promise<PdfjsLib> => {
      const win = window as WindowWithPdfjsLib;
      if (win.pdfjsLib) {
        return win.pdfjsLib;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js";
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
      if (!win.pdfjsLib) {
        throw new Error("Failed to load PDF.js library");
      }
      const pdfjs: PdfjsLib = win.pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js";
      return pdfjs;
    };

    const render = async () => {
      if (!fileUrl || !canvasRef.current) return;
      try {
        const pdfjs = await loadPdfJs();
        const pdf = await pdfjs.getDocument(fileUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        await page.render(renderContext).promise;
        setIsReady(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to render";
        setError(message);
      }
    };

    render();
  }, [fileUrl]);

  return (
    <div className="relative w-full overflow-hidden border rounded-2xl bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
      <canvas ref={canvasRef} className="block mx-auto" />
      {isReady &&
        overlays.map((overlay) => (
          <div key={overlay.id} className="absolute inset-0 pointer-events-none">
            {overlay.bounds.map((bound, index) => (
              <span
                key={`${overlay.id}-${index}`}
                className={`absolute border-2 rounded-lg ${
                  overlay.risk === "High"
                    ? "border-rose-400 bg-rose-400/20"
                    : overlay.risk === "Medium"
                      ? "border-amber-400 bg-amber-300/20"
                      : "border-emerald-400 bg-emerald-300/20"
                }`}
                style={{
                  top: `${bound.y}px`,
                  left: `${bound.x}px`,
                  width: `${bound.width}px`,
                  height: `${bound.height}px`,
                }}
              ></span>
            ))}
          </div>
        ))}
      {error && <p className="absolute bottom-2 left-2 text-sm text-error-500">{error}</p>}
    </div>
  );
}
