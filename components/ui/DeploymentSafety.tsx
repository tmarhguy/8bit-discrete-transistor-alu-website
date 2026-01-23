'use client';

import { useEffect } from 'react';

export default function DeploymentSafety() {
  useEffect(() => {
    // Helper to reload with a cooldown to prevent loops
    const reloadWithCooldown = () => {
      const lastReload = Number(sessionStorage.getItem("last_reload_timestamp") || 0);
      const now = Date.now();
      
      // Only reload if it's been more than 10 seconds since the last reload
      if (now - lastReload > 10000) {
        sessionStorage.setItem("last_reload_timestamp", String(now));
        window.location.reload();
      } else {
        console.error("Skipping reload due to recent reload loop protection.");
      }
    };

    // Listen for chunk errors
    const handleError = (e: ErrorEvent) => {
      const msg = String(e?.message || "");
      // Check for common chunk loading error signatures
      if (msg.includes("chunk") || msg.includes("Loading")) {
        console.warn("Caught chunk load error:", msg);
        reloadWithCooldown();
      }
    };

    // Listen for unhandled promise rejections (often how chunk errors manifest)
    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = String(e?.reason?.message || e?.reason || "");
      if (msg.includes("chunk") || msg.includes("Loading")) {
        console.warn("Caught unhandled rejection related to chunks:", msg);
        reloadWithCooldown();
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
