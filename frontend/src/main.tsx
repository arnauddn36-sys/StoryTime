import { StrictMode } from "react"; // aide à repérer les erreurs en développement
import { createRoot } from "react-dom/client"; // démarre React dans la page
import { BrowserRouter } from "react-router"; // active la gestion des pages (adresses)
import App from "./App"; // composant principal
import { AuthProvider } from "./auth"; // retient qui est connecté, pour tout le site
import "./index.css"; // styles Tailwind

// On monte l'application dans <div id="root"> de index.html
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);