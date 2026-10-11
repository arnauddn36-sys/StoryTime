import { useState, type SyntheticEvent } from "react";
import { Link, Navigate } from "react-router";
import { ErreurApi } from "../api";
import { useAuth } from "../auth";

type Props = { mode: "connexion" | "inscription" };

// Les textes de chaque page
const textes = {
  connexion: {
    titre: "Content de te revoir",
    intro: "Connecte-toi pour publier tes histoires et dire « Moi aussi ».",
    bouton: "Se connecter",
    question: "Pas encore de compte ?",
    lien: "Créer un compte",
    versLien: "/inscription",
  },
  inscription: {
    titre: "Crée ton compte",
    intro:
      "Un pseudo et un mot de passe suffisent. Ton pseudo n'apparaît jamais sur tes histoires.",
    bouton: "Créer un compte",
    question: "Déjà inscrit ?",
    lien: "Se connecter",
    versLien: "/connexion",
  },
} as const;

// Style commun des champs de saisie (verre clair, anneau indigo au focus)
const champ =
  "mt-1.5 w-full rounded-xl bg-white/70 px-4 py-3 outline-none ring-1 ring-indigo-950/15 transition placeholder:text-indigo-950/40 focus:ring-2 focus:ring-indigo-600 dark:bg-white/10 dark:ring-white/20 dark:placeholder:text-white/40 dark:focus:ring-violet-300";

const aide = "mt-1.5 text-sm text-indigo-950/60 dark:text-white/50";

// Vérifie les champs avant d'appeler le serveur (mêmes règles que le backend)
function verifier(
  mode: Props["mode"],
  pseudo: string,
  motDePasse: string,
): string | null {
  const p = pseudo.trim();

  if (mode === "connexion") {
    if (!p || !motDePasse) return "Renseigne ton pseudo et ton mot de passe";
    return null;
  }

  if (p.length < 3) return "Le pseudo doit faire au moins 3 caractères";
  if (p.length > 30) return "Le pseudo doit faire 30 caractères maximum";
  if (!/^[a-zA-Z0-9_.-]+$/.test(p)) {
    return "Le pseudo ne peut contenir que des lettres, chiffres, _ . -";
  }
  if (motDePasse.length < 8) {
    return "Le mot de passe doit faire au moins 8 caractères";
  }
  if (motDePasse.length > 72) {
    return "Le mot de passe doit faire 72 caractères maximum";
  }
  return null;
}

export default function FormulaireAuth({ mode }: Readonly<Props>) {
  const { utilisateur, connexion, inscription } = useAuth();
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [visible, setVisible] = useState(false); // afficher le mot de passe ?
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const t = textes[mode];

  // Déjà connecté (ou connexion réussie) : retour à l'accueil
  if (utilisateur) return <Navigate to="/" replace />;

  async function soumettre(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const probleme = verifier(mode, pseudo, motDePasse);
    if (probleme) {
      setErreur(probleme);
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      if (mode === "connexion") await connexion(pseudo.trim(), motDePasse);
      else await inscription(pseudo.trim(), motDePasse);
      // Rien d'autre à faire : la personne est connectée, la page redirige toute seule
    } catch (e) {
      setErreur(
        e instanceof ErreurApi
          ? e.message
          : "Impossible de joindre le serveur. Réessaie dans un instant.",
      );
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto max-w-md animate-entree">
      <div className="rounded-3xl bg-linear-to-br from-white/55 to-white/25 p-8 shadow-xl shadow-indigo-600/10 ring-1 ring-white/70 backdrop-blur-xl sm:p-10 dark:from-white/10 dark:to-white/5 dark:ring-white/15">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.titre}</h1>
        <p className="mt-2 text-indigo-950/70 dark:text-white/65">{t.intro}</p>

        <form
          onSubmit={soumettre}
          noValidate
          className="mt-8 flex flex-col gap-5"
        >
          <div>
            <label htmlFor="pseudo" className="text-sm font-semibold">
              Pseudo
            </label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              autoComplete="username"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className={champ}
            />
            {mode === "inscription" && (
              <p className={aide}>
                3 à 30 caractères : lettres, chiffres, _ . -
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mot-de-passe" className="text-sm font-semibold">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="mot-de-passe"
                name="motDePasse"
                type={visible ? "text" : "password"}
                autoComplete={
                  mode === "connexion" ? "current-password" : "new-password"
                }
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className={champ + " pr-28"}
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                aria-pressed={visible}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600/10 dark:text-violet-200 dark:hover:bg-white/10"
              >
                {visible ? "Masquer" : "Afficher"}
              </button>
            </div>
            {mode === "inscription" && (
              <p className={aide}>8 caractères minimum</p>
            )}
          </div>

          {erreur && (
            <p
              role="alert"
              className="rounded-xl bg-pink-600/10 px-4 py-3 text-sm font-medium text-pink-800 ring-1 ring-pink-600/25 dark:bg-pink-500/15 dark:text-pink-200 dark:ring-pink-400/30"
            >
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={envoi}
            className="rounded-full bg-linear-to-r from-indigo-600 to-pink-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:brightness-110 active:scale-95 disabled:cursor-wait disabled:opacity-70"
          >
            {envoi ? "Un instant…" : t.bouton}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-indigo-950/70 dark:text-white/60">
          {t.question}{" "}
          <Link
            to={t.versLien}
            className="font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-violet-200"
          >
            {t.lien}
          </Link>
        </p>
      </div>
    </div>
  );
}
