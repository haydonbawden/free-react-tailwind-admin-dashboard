/**
 * TypeScript type definitions for PDF.js library
 * Used for rendering PDF documents in the browser
 */

export interface Viewport {
  height: number;
  width: number;
}

export interface RenderContext {
  canvasContext: CanvasRenderingContext2D;
  viewport: Viewport;
}

export interface RenderTask {
  promise: Promise<void>;
}

export interface Page {
  getViewport: (config: { scale: number }) => Viewport;
  render: (context: RenderContext) => RenderTask;
}

export interface Document {
  getPage: (num: number) => Promise<Page>;
}

export interface GetDocumentResult {
  promise: Promise<Document>;
}

export interface PdfjsLib {
  getDocument: (url: string) => GetDocumentResult;
  GlobalWorkerOptions: {
    workerSrc: string;
  };
}

export interface WindowWithPdfjsLib extends Window {
  pdfjsLib?: PdfjsLib;
}
