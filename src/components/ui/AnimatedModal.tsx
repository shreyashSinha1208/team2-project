"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnOutsideClick: boolean;
}

interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const Modal = ({
  children,
  isOpen,
  onOpenChange,
  closeOnOutsideClick = true,
}: ModalProps) => {
  // Internal state management as fallback
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external or internal state based on props
  const open = isOpen ?? internalOpen;
  const setOpen = (newState: boolean) => {
    if (onOpenChange) {
      onOpenChange(newState);
    } else {
      setInternalOpen(newState);
    }
  };

  const contextValue = {
    open,
    setOpen,
    closeOnOutsideClick,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal component");
  }
  return context;
};

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "rounded-md text-black dark:text-white text-center relative min-h-[40px]",
        className
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
  width = "758px",
  height = "480px",
  BgImage,
  overflow = "hidden",
}: {
  children: ReactNode;
  className?: string;
  width?: string;
  height?: string;
  BgImage?: string;
  overflow?: "hidden" | "visible" | "scroll" | "auto";
}) => {
  const { open, setOpen, closeOnOutsideClick } = useModal();
  const modalRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useOutsideClick(modalRef, () => {
    if (closeOnOutsideClick) {
      setOpen(false);
    }
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full flex items-center justify-center z-ModalOverlayParent"
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            style={{
              width,
              height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className={cn(
              "bg-white dark:bg-black border border-transparent md:rounded-[32px] relative z-ModalBody flex flex-col overflow-hidden shadow-md shadow-white",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {BgImage && (
              <Image
                src={BgImage}
                alt="BG"
                className="w-[100%] opacity-10 absolute h-[100%] object-cover inset-0 m-auto z-[-1]"
              />
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-center flex-1", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex justify-end p-4 bg-gray-100 -900", className)}>
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-ModalOverlay ${className}`}
    ></motion.div>
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute top-4 right-4 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
