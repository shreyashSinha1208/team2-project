import { useEffect, useRef } from "react";

// Track currently open modals by z-index priority
const openModals: { ref: React.RefObject<HTMLElement>; priority: number }[] =
  [];

/**
 * A hook that tracks open components with z-index priority
 * to ensure nested components don't interfere with each other
 *
 * @param isOpen - Whether the component is open
 * @param onClose - Function to close the component
 * @param containerRef - Ref to the component's container
 * @param priority - Z-index priority (higher number = higher priority)
 */
export const useContainedOutsideClick = (
  isOpen: boolean,
  onClose: () => void,
  containerRef: React.RefObject<HTMLElement>,
  priority: number = 1
) => {
  // Track whether this component is registered
  const isRegistered = useRef(false);

  useEffect(() => {
    if (isOpen && !isRegistered.current) {
      // Register this modal when opened
      openModals.push({ ref: containerRef, priority });
      isRegistered.current = true;
    } else if (!isOpen && isRegistered.current) {
      // Remove this modal when closed
      const index = openModals.findIndex((modal) => modal.ref === containerRef);
      if (index !== -1) {
        openModals.splice(index, 1);
      }
      isRegistered.current = false;
    }

    // Handler for click outside
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      // If we're not registered or not open, do nothing
      if (!isRegistered.current || !isOpen) return;

      // Find the highest priority modal that contains the click
      const clickIsInsideHigherPriorityModal = openModals.some(
        (modal) =>
          modal.priority > priority &&
          modal.ref.current &&
          modal.ref.current.contains(e.target as Node)
      );

      // If the click is inside a higher priority modal, don't close this one
      if (clickIsInsideHigherPriorityModal) {
        return;
      }

      // Check if click is inside this container
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        // Find the highest priority modal that doesn't contain the click
        const highestPriorityModalToClose = [...openModals]
          .sort((a, b) => b.priority - a.priority)
          .find(
            (modal) =>
              modal.ref.current && !modal.ref.current.contains(e.target as Node)
          );

        // Only close if we are the highest priority modal that should close
        if (highestPriorityModalToClose?.ref === containerRef) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      // Clean up registration when unmounting
      if (isRegistered.current) {
        const index = openModals.findIndex(
          (modal) => modal.ref === containerRef
        );
        if (index !== -1) {
          openModals.splice(index, 1);
        }
        isRegistered.current = false;
      }
    };
  }, [isOpen, onClose, containerRef, priority]);
};

/**
 * A higher-order function that creates a handler that stops event propagation
 * to prevent parent components from receiving the event
 *
 * @param handler - The original event handler
 * @returns A new handler that stops event propagation
 */
export const createStopPropagationHandler = (
  handler: (e: React.MouseEvent | React.TouchEvent) => void
) => {
  return (e: React.MouseEvent | React.TouchEvent) => {
    // Stop event propagation to prevent parent components from receiving it
    e.stopPropagation();
    // Call the original handler
    handler(e);
  };
};
