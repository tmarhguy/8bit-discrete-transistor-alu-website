'use client';

import { useEffect } from 'react';

export default function DeploymentSafety() {
  useEffect(() => {
    // Helper to reload once
    const reloadOnce = () => {
      if (!sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "1");
        window.location.reload();
      }
    };

    // Listen for chunk errors
    const handleError = (e: ErrorEvent) => {
      const msg = String(e?.message || "");
      // Check for common chunk loading error signatures
      if (msg.includes("chunk") || msg.includes("Loading")) {
        reloadOnce();
      }
    };

    // Listen for unhandled promise rejections (often how chunk errors manifest)
    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = String(e?.reason?.message || e?.reason || "");
      if (msg.includes("chunk")) {
        reloadOnce();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
