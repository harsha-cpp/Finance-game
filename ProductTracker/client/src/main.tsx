import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BusinessProvider } from "./context/BusinessContext";

createRoot(document.getElementById("root")!).render(
  <BusinessProvider>
    <App />
  </BusinessProvider>
);
