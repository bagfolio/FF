import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure React is available globally for all components
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Remove initial loading screen as soon as React mounts
if (typeof window !== 'undefined' && (window as any).removeInitialLoading) {
  (window as any).removeInitialLoading();
}

createRoot(document.getElementById("root")!).render(<App />);
