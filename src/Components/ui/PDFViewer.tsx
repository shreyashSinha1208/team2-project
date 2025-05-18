"use client";

import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

type PDFViewerProps = {
  pdfUrl?: string;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl = "/ck12.pdf" }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isWorkerInitialized, setIsWorkerInitialized] =
    useState<boolean>(false);

  // Initialize the worker
  useEffect(() => {
    const initializeWorker = async () => {
      try {
        // Important: This must be called before any PDF is loaded
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        setIsWorkerInitialized(true);
      } catch (err) {
        console.error("Error initializing PDF worker:", err);
        setError(
          "Failed to initialize PDF worker. Please check the console for details."
        );
      }
    };

    // Only run in browser environment
    if (typeof window !== "undefined" && !isWorkerInitialized) {
      initializeWorker();
    }
  }, [isWorkerInitialized]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("Error loading PDF:", err);
    setError(`Error loading PDF: ${err.message}`);
    setIsLoading(false);
  };

  const prevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prevPage) =>
      numPages ? Math.min(prevPage + 1, numPages) : prevPage
    );
  };

  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.2);
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.6));
  };

  const goToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    }
  };

  if (!isWorkerInitialized && typeof window !== "undefined") {
    return <div className="p-4">Initializing PDF viewer...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="bg-gray-100 border-b border-gray-300 p-3 mb-4 rounded-t-lg shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="px-3 py-1.5 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
            title="Previous page"
          >
            ←
          </button>

          <div className="flex items-center bg-white rounded border border-gray-300 px-2">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={goToPage}
              className="w-12 text-center outline-none"
            />
            <span className="text-gray-600 mx-1">/</span>
            <span>{numPages || 1}</span>
          </div>

          <button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
            title="Next page"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700">Zoom:</span>
          <button
            onClick={zoomOut}
            className="px-2 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Zoom out"
          >
            −
          </button>
          <span className="bg-white px-2 py-1 rounded border border-gray-300 text-sm">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="px-2 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Zoom in"
          >
            +
          </button>
        </div>
        {/*         
        <div className="text-sm text-gray-600">
          {pdfUrl.split('/').pop()}
        </div> */}
      </div>

      <div className="flex flex-col items-center flex-grow">
        {isLoading && (
          <div className="flex items-center justify-center h-96 w-full">
            <div className="text-lg">Loading PDF...</div>
          </div>
        )}

        {error ? (
          <div className="p-4 bg-red-100 text-red-800 rounded ">
            <p>{error}</p>
            <div className="mt-2 text-sm">
              <p>Troubleshooting tips:</p>
              <ul className="list-disc ml-5 mt-1">
                <li>
                  Make sure pdf.worker.min.js exists in your public folder
                </li>
                <li>Try refreshing the page</li>
                <li>Check browser console for additional error details</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="relative border border-gray-300 rounded shadow-lg overflow-x-hidden max-h-[calc(100vh-200px)]">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<p className="p-4">Loading document...</p>}
              noData={<p className="p-4">No PDF file specified</p>}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="page-container"
              />
            </Document>
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
