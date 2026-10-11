import { Route, Routes } from "react-router"; // définit une page par adresse
import MiseEnPage from "./composants/MiseEnPage"; // menu en haut + thème clair/sombre
import Accueil from "./pages/Accueil"; // page d'accueil (présentation + histoires)
import Connexion from "./pages/Connexion"; // page /connexion
import Ecrire from "./pages/Ecrire"; // page /ecrire (publier une histoire)
import Inscription from "./pages/Inscription"; // page /inscription
import Introuvable from "./pages/Introuvable"; // page affichée si l'adresse n'existe pas

export default function App() {
  return (
    <Routes>
      {/* MiseEnPage entoure toutes les pages : menu en haut, page en dessous */}
      <Route element={<MiseEnPage />}>
        {/* "/" : la page d'accueil */}
        <Route index element={<Accueil />} />
        {/* Une page par adresse */}
        <Route path="connexion" element={<Connexion />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="ecrire" element={<Ecrire />} />
        {/* toute autre adresse : page introuvable */}
        <Route path="*" element={<Introuvable />} />
      </Route>
    </Routes>
  );
}
