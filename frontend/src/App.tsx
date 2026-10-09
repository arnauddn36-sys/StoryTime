import { Route, Routes } from "react-router"; // définit une page par adresse
import MiseEnPage from "./composants/MiseEnPage"; // menu en haut + thème clair/sombre
import Accueil from "./pages/Accueil"; // page d'accueil (liste des histoires)
import Introuvable from "./pages/Introuvable"; // page affichée si l'adresse n'existe pas

export default function App() {
  return (
    <Routes>
      {/* MiseEnPage entoure toutes les pages : menu en haut, page en dessous */}
      <Route element={<MiseEnPage />}>
        {/* "/" : la page d'accueil */}
        <Route index element={<Accueil />} />
        {/* toute autre adresse : page introuvable */}
        <Route path="*" element={<Introuvable />} />
      </Route>
    </Routes>
  );
}