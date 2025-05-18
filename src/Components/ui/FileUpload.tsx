import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/Components/ui/Button";
import { FileUploadIcon } from "../Icons/icons";
import {
  Upload,
  X,
  AlertCircle,
  FileIcon,
  Image as ImageIcon,
  Film,
  File,
  Plus,
} from "lucide-react";
import PreviewFilesCards, { FileWithPreview } from "./PreviewUploadedFiles";

// Original interface for backward compatibility
export interface FileUploadProps {
  maxSize?: number; // in MB
  allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png']
  maxFiles?: number;
  onUpload?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  // New properties
  variant?: "default" | "media";
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  customSize?: { width: string; height: string };
  initialPreview?: string;
  singleFile?: boolean;
  showPreview?: boolean;
  showExpandingPreview?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  // Original props with defaults for backward compatibility
  maxSize = 5,
  allowedTypes = ["image/*", "application/pdf"],
  maxFiles = 5,
  onUpload,
  onError,
  className,
  // New props with defaults
  variant = "default",
  size = "md",
  customSize,
  initialPreview,
  singleFile = false,
  showPreview = true,
  showExpandingPreview = true,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size mapping for different display options
  const sizeMap = {
    sm: { width: "w-32", height: "h-32" },
    md: { width: "w-48", height: "h-48" },
    lg: { width: "w-64", height: "h-64" },
    xl: { width: "w-96", height: "h-96" },
    custom: {
      width: customSize?.width || "w-full",
      height: customSize?.height || "h-64",
    },
  };

  const selectedSize = sizeMap[size];

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  // Validate uploaded files
  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize * 1024 * 1024) {
        return `File size should be less than ${maxSize}MB`;
      }

      const isTypeAllowed = allowedTypes.some((type) => {
        if (type.includes("*")) {
          return file.type.startsWith(type.split("/")[0]);
        }
        return type === file.type;
      });

      if (!isTypeAllowed) {
        return "File type not supported";
      }

      return null;
    },
    [maxSize, allowedTypes]
  );

  // Create preview for appropriate file types
  const createPreview = useCallback((file: File): string | undefined => {
    if (
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type === "application/pdf"
    ) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  // Handle file selection
  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles?.length) return;

      setError(null);
      const fileArray = Array.from(newFiles);

      // Single file mode handling
      if (singleFile) {
        const file = fileArray[0];
        const validationError = validateFile(file);

        if (validationError) {
          setError(validationError);
          onError?.(validationError);
          return;
        }

        // Revoke any existing previews
        files.forEach((existingFile) => {
          if (existingFile.preview) URL.revokeObjectURL(existingFile.preview);
        });

        const fileWithId = Object.assign(file, {
          id: Math.random().toString(36).substring(7),
          preview: createPreview(file),
        }) as FileWithPreview;

        setFiles([fileWithId]);
        return;
      }

      // Multiple file mode
      if (files.length + fileArray.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} files allowed`;
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      const validFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
          return;
        }

        const fileWithId = Object.assign(file, {
          id: Math.random().toString(36).substring(7),
          preview: createPreview(file),
        }) as FileWithPreview;

        validFiles.push(fileWithId);
      });

      if (errors.length) {
        // Just show the first error for simplicity
        setError(errors[0]);
        onError?.(errors[0]);
      }

      if (validFiles.length) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
    },
    [files, maxFiles, validateFile, createPreview, singleFile, onError]
  );

  // Event handlers for drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Remove a file from the selection
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return prev.filter((file) => file.id !== id);
    });
  }, []);

  // Handle the upload process
  const simulateUpload = useCallback(async () => {
    if (!files.length) return;

    setUploading(true);

    try {
      onUpload?.(files);
    } finally {
      setUploading(false);

      // Don't clear files in media variant to keep the preview
      if (variant !== "media") {
        setFiles([]);
      }
    }
  }, [files, onUpload, variant]);

  // Auto-upload for media variant when file changes
  useEffect(() => {
    if (variant === "media" && files.length > 0 && !uploading) {
      simulateUpload();
    }
  }, [files, variant, uploading, simulateUpload]);

  // Helper functions for rendering file info
  const getFileTypeIcon = useCallback((fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="w-6 h-6" />;
    if (fileType.startsWith("video/")) return <Film className="w-6 h-6" />;
    if (fileType.startsWith("application/pdf"))
      return <File className="w-6 h-6" />;
    return <FileIcon className="w-6 h-6" />;
  }, []);

  const getFileTypeLabel = useCallback((fileType: string) => {
    if (fileType.startsWith("image/")) return "Image";
    if (fileType.startsWith("video/")) return "Video";
    if (fileType.startsWith("application/pdf")) return "PDF";
    return "File";
  }, []);

  // Media preview component for the media variant
  const MediaPreview = useCallback(() => {
    const file = files[0];

    if (!file && !initialPreview) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 border-dashed border-2 border-gray-300 dark:border-gray-700">
          <Plus className="w-8 h-8 mb-2 text-gray-400" />
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Click to add{" "}
            {allowedTypes.some((type) => type.startsWith("image")) && "image"}
            {allowedTypes.some((type) => type.startsWith("video")) &&
            allowedTypes.some((type) => type.startsWith("image"))
              ? "/"
              : ""}
            {allowedTypes.some((type) => type.startsWith("video")) && "video"}
          </p>
          <p className="text-xs text-center text-gray-400 mt-1">
            Drop files here or click to browse
          </p>
        </div>
      );
    }

    if (file?.preview) {
      if (file.type.startsWith("image/")) {
        return (
          <>
            <img
              src={file.preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="ghost"
                size="xs"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-red-500/80 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="xs"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-blue-500/80 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </>
        );
      }

      if (file.type.startsWith("video/")) {
        return (
          <>
            <video
              src={file.preview}
              className="w-full h-full object-cover"
              controls
              autoPlay={false}
              controlsList="nodownload"
              playsInline
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering file input click when clicking video controls
              }}
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="ghost"
                size="xs"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-red-500/80 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="xs"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-blue-500/80 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </>
        );
      }

      return (
        <>
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {getFileTypeIcon(file.type)}
            <span className="ml-2 text-sm">{file.name}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
            <p className="text-white text-sm font-medium">Change File</p>
          </div>
        </>
      );
    }

    if (initialPreview) {
      return (
        <>
          <img
            src={initialPreview}
            alt="Initial Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              variant="secondary"
              size="xs"
              className="h-8 w-8 rounded-full bg-black/50 hover:bg-blue-500/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </>
      );
    }

    return null;
  }, [files, initialPreview, allowedTypes, getFileTypeIcon, removeFile]);

  // Render media variant
  if (variant === "media") {
    return (
      <div className={cn("relative", className)}>
        <div
          onClick={(e) => {
            // Only trigger file input click if we're not interacting with the video element
            if (e.target instanceof HTMLVideoElement) return;
            if (e.target instanceof HTMLButtonElement) return;
            fileInputRef.current?.click();
          }}
          className={cn(
            "cursor-pointer relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700",
            "transition-colors duration-200 ease-in-out group",
            selectedSize.width,
            selectedSize.height,
            isDragging && "border-[#0790e8] bg-[#0790e8]/5"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            accept={allowedTypes.join(",")}
            multiple={!singleFile}
          />

          <MediaPreview />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-500 mt-2 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Only show upload button for media if user interaction is needed to confirm upload */}
        {files.length > 0 &&
          !uploading &&
          variant === "media" &&
          !files[0].type.startsWith("image/") &&
          !files[0].type.startsWith("video/") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button
                onClick={simulateUpload}
                className={cn(
                  "w-full py-2 px-4 rounded-md text-white",
                  "bg-[#0790e8] hover:bg-[#0790e8]/90",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Upload className="w-4 h-4" />
                Upload {getFileTypeLabel(files[0].type)}
              </Button>
            </motion.div>
          )}

        {/* Show uploading state */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Uploading...
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  // Render default variant (original behavior with PreviewFilesCards)
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Drop Zone */}
      <motion.div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8",
          "transition-colors duration-200 ease-in-out",
          isDragging
            ? "border-[#0790e8] bg-[#0790e8]/5"
            : "border-gray-300 dark:border-gray-700",
          "hover:border-[#0790e8] dark:hover:border-[#0790e8] cursor-pointer"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          scale: isDragging ? 1.02 : 1,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={!singleFile}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept={allowedTypes.join(",")}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FileUploadIcon
              className={cn(
                "w-12 h-12 mb-4 mx-auto",
                isDragging ? "text-[#0790e8]" : "text-gray-400"
              )}
            />
            <h3 className="text-lg font-semibold">
              Drag & Drop your files here
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or{" "}
              <Button
                className="text-[#0790e8] p-0 hover:underline hover:scale-100 bg-transparent"
                variant="link"
              >
                browse files
              </Button>
            </p>
            <p className="text-xs text-gray-400">
              Supported files:{" "}
              {allowedTypes.map((type) => type.replace("*", "all")).join(", ")}{" "}
              (Max: {maxSize}MB)
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-500 mt-2 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List with Previews using the new component */}
      {showPreview && (
        <PreviewFilesCards
          files={files}
          onRemove={removeFile}
          getFileTypeIcon={getFileTypeIcon}
          showExpandingPreview={showExpandingPreview}
        />
      )}

      {/* Upload Progress */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Uploading...
          </p>
        </motion.div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Button
            onClick={simulateUpload}
            className={cn(
              "w-full py-2 px-4 rounded-md text-white",
              "bg-[#0790e8] hover:bg-[#0790e8]/90",
              "flex items-center justify-center gap-2"
            )}
          >
            <Upload className="w-4 h-4" />
            Upload {files.length} {files.length === 1 ? "file" : "files"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
