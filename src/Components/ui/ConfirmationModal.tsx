"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen?: boolean;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  showCloseIcon?: boolean;
  className?: string;
  position?: "center" | "top";
  // Input confirmation props
  inputConfirmation?: boolean;
  confirmationText?: string;
  inputPlaceholder?: string;
  // Customization props
  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
  headerClassName?: string;
  messageClassName?: string;
  overlayClassName?: string;
  modalClassName?: string;
  closeIconClassName?: string;
  buttonsContainerClassName?: string;
  inputClassName?: string;
}

interface ConfirmationModalTriggerProps {
  children: React.ReactNode;
  onConfirm: () => Promise<void> | void | any;
  onCancel?: () => void;
  modalProps?: Partial<
    Omit<ConfirmationModalProps, "onConfirm" | "onCancel" | "isOpen">
  >;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen = true,
  title = "Confirm?",
  message = "Are you sure?",
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  showCloseIcon = true,
  className = "",
  position = "center",
  // Input confirmation props
  inputConfirmation = false,
  confirmationText = "",
  inputPlaceholder = "Type to confirm",
  // Customization props with defaults
  cancelButtonClassName,
  confirmButtonClassName,
  headerClassName,
  messageClassName,
  overlayClassName,
  modalClassName,
  closeIconClassName,
  buttonsContainerClassName,
  inputClassName,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(!inputConfirmation);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset input value and button state when modal opens/closes
    if (isOpen) {
      setInputValue("");
      setIsConfirmEnabled(!inputConfirmation);
      
      // Focus the input if input confirmation is required, otherwise focus the confirm button
      setTimeout(() => {
        if (inputConfirmation && inputRef.current) {
          inputRef.current.focus();
        } else if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, inputConfirmation]);

  // Check if input matches confirmation text
  useEffect(() => {
    if (inputConfirmation) {
      setIsConfirmEnabled(inputValue === confirmationText);
    }
  }, [inputValue, confirmationText, inputConfirmation]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter" && isConfirmEnabled) {
        // Only trigger confirm on Enter if not focused in input field or if input matches confirmation
        const activeElement = document.activeElement;
        if (activeElement === inputRef.current && !isConfirmEnabled) {
          return;
        }
        onConfirm();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel, onConfirm, isConfirmEnabled]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center z-ModalOverlay",
            position === "center" ? "items-center" : "items-start pt-20",
            overlayClassName
          )}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.article
            ref={modalRef}
            className={cn(
              "w-80 bg-white rounded-xl shadow-lg overflow-hidden",
              modalClassName,
              className
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "w-full flex items-center justify-between bg-gray-100 py-3 px-4",
                headerClassName
              )}
            >
              <span className="text-md font-semibold text-gray-800">
                {title}
              </span>
              {showCloseIcon && (
                <motion.button
                  onClick={onCancel}
                  className={cn(
                    "text-gray-500 hover:text-gray-700 transition-colors",
                    closeIconClassName
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              )}
            </div>

            <div
              className={cn(
                "w-full mb-2 border-b-2 border-gray-300 py-2 px-4",
                messageClassName
              )}
            >
              <span className="text-sm text-gray-600">{message}</span>
            </div>

            {inputConfirmation && (
              <div className="w-full px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  className={cn(
                    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
                    inputClassName
                  )}
                />
                {inputConfirmation && confirmationText && (
                  <p className="text-xs text-gray-500 mt-1">
                    Type "{confirmationText}" to confirm
                  </p>
                )}
              </div>
            )}

            <div
              className={cn(
                "w-full flex items-center justify-end gap-2 pt-1 px-4 pb-3",
                buttonsContainerClassName
              )}
            >
              <motion.button
                onClick={onCancel}
                className={cn(
                  "px-[11px] py-[3px] text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors border-2 border-gray-300",
                  cancelButtonClassName
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelText}
              </motion.button>
              <motion.button
                ref={confirmButtonRef}
                onClick={onConfirm}
                disabled={!isConfirmEnabled}
                className={cn(
                  "px-3 py-1 text-sm text-white rounded-lg transition-colors",
                  isConfirmEnabled
                    ? "bg-[#c70f23] hover:bg-red-600"
                    : "bg-red-300 cursor-not-allowed",
                  confirmButtonClassName
                )}
                whileHover={isConfirmEnabled ? { scale: 1.02 } : {}}
                whileTap={isConfirmEnabled ? { scale: 0.98 } : {}}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ConfirmationModalTrigger: React.FC<
  ConfirmationModalTriggerProps
> = ({ children, onConfirm, onCancel, modalProps = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const handleConfirm = async () => {
    await onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>
      <ConfirmationModal
        isOpen={isOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        {...modalProps}
      />
    </>
  );
};

export default ConfirmationModal;