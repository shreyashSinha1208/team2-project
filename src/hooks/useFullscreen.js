// useFullscreen.js
import { useState, useEffect, useCallback } from "react";

const getBrowserFullscreenApi = () => {
  if (typeof document === "undefined") {
    return {
      fullscreenElement: "fullscreenElement",
      exitFullscreen: "exitFullscreen",
      requestFullscreen: "requestFullscreen",
      fullscreenchange: "fullscreenchange",
    };
  }

  const apis = [
    {
      fullscreenElement: "fullscreenElement",
      exitFullscreen: "exitFullscreen",
      requestFullscreen: "requestFullscreen",
      fullscreenchange: "fullscreenchange",
    },
    {
      fullscreenElement: "webkitFullscreenElement",
      exitFullscreen: "webkitExitFullscreen",
      requestFullscreen: "webkitRequestFullscreen",
      fullscreenchange: "webkitfullscreenchange",
    },
    {
      fullscreenElement: "mozFullScreenElement",
      exitFullscreen: "mozCancelFullScreen",
      requestFullscreen: "mozRequestFullScreen",
      fullscreenchange: "mozfullscreenchange",
    },
    {
      fullscreenElement: "msFullscreenElement",
      exitFullscreen: "msExitFullscreen",
      requestFullscreen: "msRequestFullscreen",
      fullscreenchange: "MSFullscreenChange",
    },
  ];

  return (
    apis.find(
      (api) =>
        document.hasOwnProperty(api.fullscreenElement) ||
        document.hasOwnProperty(`on${api.fullscreenchange.toLowerCase()}`)
    ) || apis[0]
  );
};

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const api = getBrowserFullscreenApi();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document[api.fullscreenElement]));
    };

    document.addEventListener(api.fullscreenchange, handleFullscreenChange);
    setIsFullscreen(Boolean(document[api.fullscreenElement]));

    return () => {
      document.removeEventListener(
        api.fullscreenchange,
        handleFullscreenChange
      );
    };
  }, [api]);

  const enterFullscreen = useCallback(
    async (element) => {
      if (typeof document === "undefined") return;

      try {
        const targetElement = element || document.documentElement;
        const requestMethod = targetElement[api.requestFullscreen];

        if (typeof requestMethod === "function") {
          await requestMethod.call(targetElement);
        }
      } catch (error) {
        console.error("Error entering fullscreen:", error);
      }
    },
    [api]
  );

  const exitFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;

    try {
      const exitMethod = document[api.exitFullscreen];

      if (typeof exitMethod === "function") {
        await exitMethod.call(document);
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  }, [api]);

  const toggleFullscreen = useCallback(
    async (element) => {
      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await enterFullscreen(element);
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen]
  );

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
};

export default useFullscreen;
