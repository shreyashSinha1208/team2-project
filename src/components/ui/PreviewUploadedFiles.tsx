import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/Components/ui/Button";
import {
  X,
  File,
  Film,
  Download,
  Eye,
  Maximize,
  ChevronRight,
} from "lucide-react";
import {
  ExpandableCard,
  ExpandedCardContent,
  ExpandedCardContentBeforeExpanding,
} from "./ExpandableCard";
import PDFViewer from "./PDFViewer";

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface PreviewFilesCardsProps {
  files: FileWithPreview[];
  onRemove: (id: string) => void;
  getFileTypeIcon: (fileType: string) => React.ReactNode;
  className?: string;
  showExpandingPreview?: boolean;
}

const PreviewFilesCards: React.FC<PreviewFilesCardsProps> = ({
  files,
  onRemove,
  getFileTypeIcon,
  className,
  showExpandingPreview = true,
}) => {
  if (!files.length) return null;

  return (
    <div className={cn("mt-4 space-y-3", className)}>
      <AnimatePresence>
        {files.map((file) => (
          <FilePreviewCard
            key={file.id}
            file={file}
            onRemove={onRemove}
            getFileTypeIcon={getFileTypeIcon}
            showExpandingPreview={showExpandingPreview}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const FilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  getFileTypeIcon: (fileType: string) => React.ReactNode;
  showExpandingPreview: boolean;
}> = ({ file, onRemove, getFileTypeIcon, showExpandingPreview }) => {
  const [hovered, setHovered] = useState(false);

  if (!showExpandingPreview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/90 dark:to-gray-750 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center gap-4 p-4">
          {file.type.startsWith("image/") && file.preview ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-2 ring-blue-400/30 dark:ring-blue-500/30">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : file.type.startsWith("video/") && file.preview ? (
            <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 ring-2 ring-purple-400/30 dark:ring-purple-500/30 flex items-center justify-center">
              <Film className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-600/80 dark:bg-purple-500/80 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 ring-2 ring-blue-400/30 dark:ring-blue-500/30 flex items-center justify-center">
              {getFileTypeIcon(file.type)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <span className="inline-flex items-center">
                <span className="font-semibold">
                  {(file.size / (1024 * 1024)).toFixed(2)}
                </span>
                <span className="ml-1">MB</span>
              </span>
              <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
              <span className="uppercase tracking-wide font-mono text-blue-600 dark:text-blue-400 text-opacity-80">
                {file.type.split("/")[1]}
              </span>
            </p>
          </div>
          <div className="flex space-x-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();

                const link = document.createElement("a");
                link.href = URL.createObjectURL(file);
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="p-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full aspect-square text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 ring-1 ring-gray-200 dark:ring-gray-700"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(file.id);
              }}
              className="p-1.5 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 rounded-full aspect-square text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-red-200 dark:hover:ring-red-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <ExpandableCard className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/90 dark:to-gray-750 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <ExpandedCardContentBeforeExpanding className="flex items-center gap-4 p-4">
        {file.type.startsWith("image/") && file.preview ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-2 ring-blue-400/30 dark:ring-blue-500/30">
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : file.type.startsWith("video/") && file.preview ? (
          <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 ring-2 ring-purple-400/30 dark:ring-purple-500/30 flex items-center justify-center">
            <Film className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-600/80 dark:bg-purple-500/80 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 ring-2 ring-blue-400/30 dark:ring-blue-500/30 flex items-center justify-center">
            {getFileTypeIcon(file.type)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span className="inline-flex items-center">
              <span className="font-semibold">
                {(file.size / (1024 * 1024)).toFixed(2)}
              </span>
              <span className="ml-1">MB</span>
            </span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
            <span className="uppercase tracking-wide font-mono text-blue-600 dark:text-blue-400 text-opacity-80">
              {file.type.split("/")[1]}
            </span>
          </p>
        </div>
        <div className="flex space-x-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 rounded-full text-blue-600 dark:text-blue-400 transition-colors duration-200 ring-1 ring-blue-200 dark:ring-blue-800 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 aspect-square" />
          </Button>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(file.id);
              }}
              className="p-1.5 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 rounded-full aspect-square text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-red-200 dark:hover:ring-red-800"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </ExpandedCardContentBeforeExpanding>
      <ExpandedCardContent className="w-full max-w-5xl max-h-[80vh]">
        <FileDetailPreview file={file} />
      </ExpandedCardContent>
    </ExpandableCard>
  );
};

const isValidURL = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};

const isLiveURL = (preview?: string) => {
  if (!preview) return false;

  return isValidURL(preview) && !preview.startsWith("blob:");
};

const FileDetailPreview = ({ file }: { file: FileWithPreview }) => {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [isPdfRendererInitialized, setIsPdfRendererInitialized] =
    useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPDFWithLiveURL =
    file.type === "application/pdf" && isLiveURL(file.preview);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobileDevice(mobile);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (
      file.type === "application/pdf" &&
      file.preview &&
      isMobileDevice &&
      !isPdfRendererInitialized &&
      pdfContainerRef.current &&
      !isPDFWithLiveURL
    ) {
      setIsPdfRendererInitialized(true);

      setPdfError("Mobile PDF preview requires additional setup");
    }
  }, [file, isMobileDevice, isPdfRendererInitialized, isPDFWithLiveURL]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50" : "p-6"
      )}
    >
      <div className="flex justify-between items-center mb-6 px-6 pt-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {file.name}
          </h2>
          <div className="flex items-center mt-1.5 text-gray-500 dark:text-gray-400 text-sm">
            <span className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs">
              <span className="font-semibold">{fileSizeMB}</span>
              <span className="ml-0.5">MB</span>
            </span>
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide">
              {file.type.split("/")[1]}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg px-3 py-2 transition-colors"
            onClick={toggleFullscreen}
          >
            <Maximize className="w-4 h-4" />
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 rounded-lg px-3 py-2 transition-colors"
            onClick={() => {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(file);
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "flex-1 px-6 pb-6",
          isFullscreen && "flex items-center justify-center"
        )}
      >
        {file.type.startsWith("image/") && file.preview && (
          <div className="flex justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-2 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <img
              src={file.preview}
              alt={file.name}
              className={cn(
                "max-w-full object-contain rounded-lg shadow-lg",
                isFullscreen ? "max-h-[90vh]" : "max-h-[70vh]"
              )}
            />
          </div>
        )}

        {file.type.startsWith("video/") && file.preview && (
          <div className="flex justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-2 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <video
              src={file.preview}
              controls
              className={cn(
                "max-w-full rounded-lg shadow-lg",
                isFullscreen ? "max-h-[90vh]" : "max-h-[70vh]"
              )}
            />
          </div>
        )}

        {/* PDF Preview with conditional rendering based on URL type */}
        {file.type === "application/pdf" && (
          <div
            className={cn(
              "w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg",
              isFullscreen ? "h-[90vh]" : "h-[70vh]"
            )}
            ref={pdfContainerRef}
          >
            {file.preview ? (
              <>
                {/* If it's a PDF with a live URL, use the PDFViewer component */}
                {isPDFWithLiveURL ? (
                  <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
                    <PDFViewer pdfUrl={file.preview} />
                  </div>
                ) : isMobileDevice ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-blue-100 dark:border-blue-900 shadow-xl mb-6 backdrop-blur-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <File className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                        PDF Preview Not Available
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 mb-6">
                        PDF preview is not fully supported on mobile devices
                        within the browser.
                      </p>
                      <Button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(file);
                          link.download = file.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="text-gray-600 dark:text-gray-300 text-sm max-w-md bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md">
                      <p className="font-medium mb-2">
                        You can use any of these options:
                      </p>
                      <ul className="space-y-2 text-left">
                        <li className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                          <span>
                            Download and view the file in your device's PDF
                            viewer
                          </span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                          <span>Use a third-party PDF viewer application</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                          <span>
                            View this file on a desktop device for full preview
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <iframe
                      src={file.preview}
                      className="w-full h-full border-0"
                      title={file.name}
                      onLoad={() => setPdfLoaded(true)}
                      onError={() => setPdfError("Failed to load PDF preview")}
                    />
                    {(pdfError || !pdfLoaded) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-10 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-lg">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                          <File className="w-10 h-10 text-blue-500" />
                        </div>
                        <p className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                          {file.name}
                        </p>
                        <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                          {pdfError || "Loading PDF preview..."}
                        </p>
                        {pdfError && (
                          <Button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = URL.createObjectURL(file);
                              link.download = file.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg h-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <File className="w-10 h-10 text-blue-500" />
                </div>
                <p className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {file.name}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                  Cannot preview PDF directly. You can download the file to view
                  it.
                </p>
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(file);
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        )}

        {!file.type.startsWith("image/") &&
          !file.type.startsWith("video/") &&
          file.type !== "application/pdf" && (
            <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full border border-gray-200 dark:border-gray-700 mb-6">
                <File className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {file.name}
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-center max-w-md">
                Preview not available for this file type. You can download to
                view the content.
              </p>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(file);
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};

export default PreviewFilesCards;
