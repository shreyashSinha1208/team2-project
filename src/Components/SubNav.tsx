"use client";
import React, { useState, useCallback, useEffect, ReactNode, FC } from "react";
import { Maximize, Minimize } from "lucide-react";
import dynamic from "next/dynamic";
// import PayslipDownload from "./UserProfileData/PaySlipDownload";

const Breadcrumbs = dynamic(() => import("./Breadcrumbs"), {
  ssr: false,
});

interface SubNavProps {
  children?: ReactNode; // Make children optional with ?
}

const SubNav: FC<SubNavProps> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isF11Fullscreen, setIsF11Fullscreen] = useState(false);

  // Function to handle entering fullscreen
  const enterFullscreen = async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error("Error entering fullscreen:", err);
    }
  };

  // Function to handle exiting fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
    }
  };

  const toggleFullscreen = useCallback(async () => {
    const mainContent = document.querySelector(
      ".shadow.flex-col"
    ) as HTMLElement;
    if (!mainContent) return;

    if (!document.fullscreenElement) {
      await enterFullscreen(mainContent);
    } else {
      await exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isInFullscreen);
    };

    // Handle F11 key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault(); // Prevent default F11 behavior
        setIsF11Fullscreen(!isF11Fullscreen);
        const mainContent = document.querySelector(
          ".shadow.flex-col"
        ) as HTMLElement;
        if (mainContent) {
          if (!document.fullscreenElement) {
            enterFullscreen(mainContent);
          } else {
            exitFullscreen();
          }
        }
      }
    };

    // Handle browser's fullscreen change
    const handleBrowserFullscreen = () => {
      const isInFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isInFullscreen);
      setIsF11Fullscreen(isInFullscreen);
    };

    // Add event listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleBrowserFullscreen);

    // Cleanup
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleBrowserFullscreen);
    };
  }, [isF11Fullscreen]);

  return (
    <div className="w-full h-[30px] shadow-sm flex justify-between items-center px-5 rounded-md bg-[#edebeb] dark:bg-gray-800">
      <div className="flex-1">
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center">{children}</div>
      </div>
    </div>
  );
};

export default SubNav;
