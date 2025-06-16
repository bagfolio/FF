import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove initial loading screen as soon as React mounts
if (typeof window !== 'undefined' && (window as any).removeInitialLoading) {
  (window as any).removeInitialLoading();
}

createRoot(document.getElementById("root")!).render(<App />);
