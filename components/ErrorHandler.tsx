"use client";

import { useEffect } from "react";

export default function ErrorHandler() {
  useEffect(() => {
    // Suppress Chrome extension errors that don't affect the app
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || "";
      
      // Suppress common browser extension errors
      if (
        errorMessage.includes("message channel closed") ||
        errorMessage.includes("asynchronous response") ||
        errorMessage.includes("Extension context invalidated")
      ) {
        event.preventDefault();
        return false;
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason || "";
      const reasonString = String(reason);
      
      // Suppress common browser extension promise rejection errors
      if (
        reasonString.includes("message channel closed") ||
        reasonString.includes("asynchronous response") ||
        reasonString.includes("Extension context invalidated")
      ) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

