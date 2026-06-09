import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DemoStateProvider } from "./lib/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoStateProvider>
      <App />
    </DemoStateProvider>
  </StrictMode>
);
