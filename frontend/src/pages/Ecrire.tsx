import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, Navigate } from "react-router";
import { api, ErreurApi, nomCourt, type Espace } from "../api";
import { useAuth } from "../auth";

// Style commun des champs de saisie (verre clair, anneau indigo au focus)
const champ =
  "mt-1.5 w-full rounded-xl bg-white/70 px-4 py-3 outline-none ring-1 ring-indigo-950/15 transition placeholder:text-indigo-950/40 focus:ring-2 focus:ring-indigo-600 dark:bg-white/10 dark:ring-white/20 dark:placeholder:text-white/40 dark:focus:ring-violet-300";

const aide = "text-sm text-indigo-950/60 dark:text-white/50";

const carteVerre =
  "rounded-3xl bg-linear-to-br from-white/55 to-white/25 shadow-xl shadow-indigo-600/10 ring-1 ring-white/70 backdrop-blur-xl dark:from-white/10 dark:to-white/5 dark:ring-white/15";

// Vérifie les champs avant d'appeler le serveur (mêmes règles que le backend)
function verifier(
  espace: string,
  titre: string,
  contenu: string,
  avertissement: string,
): string | null {
  const t = titre.trim();
  const c = contenu.trim();

  if (!espace) return "Choisis un espace pour ton histoire";
  if (t.length < 3) return "Le titre doit faire au moins 3 caractères";
  if (t.length > 150) return "Le titre doit faire 150 caractères maximum";
  if (c.length < 50) return "Le récit doit faire au moins 50 caractères";
  if (c.length > 10000) return "Le récit doit faire 10 000 caractères maximum";
  if (avertissement.trim().length > 200) {
    return "L'avertissement doit faire 200 caractères maximum";
  }
  return null;
}

export default function Ecrire() {
  const { utilisateur, deconnexion } = useAuth();
  const [espaces, setEspaces] = useState<Espace[] | null>(null);
  const [espace, setEspace] = useState("");
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [avertissement, setAvertissement] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [publiee, setPubliee] = useState(false);

  // Au démarrage : on charge la liste des espaces
  useEffect(() => {
    api
      .espaces()
      .then((reponse) => setEspaces(reponse.espaces))
      .catch(() =>
        setErreur(
          "Impossible de charger les espaces. Réessaie dans un instant.",
        ),
      );
  }, []);

  // Il faut être connecté pour écrire
  if (!utilisateur) return <Navigate to="/connexion" replace />;

  async function soumettre(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const probleme = verifier(espace, titre, contenu, avertissement);
    if (probleme) {
      setErreur(probleme);
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      await api.publier({
        espace,
        titre: titre.trim(),
        contenu: contenu.trim(),
        avertissement: avertissement.trim() || undefined,
      });
      setPubliee(true);
    } catch (e) {
      // Session expirée : on déconnecte, la page renvoie vers la connexion
      if (e instanceof ErreurApi && e.statut === 401) {
        deconnexion();
        return;
      }
      setErreur(
        e instanceof ErreurApi
          ? e.message
          : "Impossible de joindre le serveur. Réessaie dans un instant.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  function recommencer() {
    setEspace("");
    setTitre("");
    setContenu("");
    setAvertissement("");
    setErreur(null);
    setPubliee(false);
  }

  // Écran de réussite
  if (publiee) {
    return (
      <div className="mx-auto max-w-xl animate-entree">
        <div className={carteVerre + " p-8 text-center sm:p-12"}>
          <p className="text-5xl" aria-hidden="true">
            🤝
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            Ton histoire est publiée
          </h1>
          <p className="mt-3 text-indigo-950/70 dark:text-white/65">
            Merci de l'avoir racontée. Quelqu'un s'y reconnaîtra bientôt.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-full bg-linear-to-r from-indigo-600 to-pink-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:brightness-110 active:scale-95"
            >
              Voir les histoires
            </Link>
            <button
              onClick={recommencer}
              className="rounded-full px-7 py-3 font-semibold ring-1 ring-indigo-950/25 transition hover:bg-white/40 active:scale-95 dark:ring-white/30 dark:hover:bg-white/10"
            >
              Écrire une autre histoire
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-entree">
      <div className={carteVerre + " p-6 sm:p-10"}>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Raconte ton histoire
        </h1>
        <p className="mt-2 text-indigo-950/70 dark:text-white/65">
          Ton pseudo n'apparaît pas sur l'histoire : seule ton expérience est
          partagée.
        </p>

        <form
          onSubmit={soumettre}
          noValidate
          className="mt-8 flex flex-col gap-6"
        >
          {/* Choix de l'espace */}
          <fieldset>
            <legend className="text-sm font-semibold">Espace</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {espaces === null && !erreur && (
                <p className={aide}>Chargement…</p>
              )}
              {espaces?.map((e) => (
                <label key={e.slug} className="cursor-pointer">
                  <input
                    type="radio"
                    name="espace"
                    value={e.slug}
                    checked={espace === e.slug}
                    onChange={() => setEspace(e.slug)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium ring-1 ring-white/70 transition hover:bg-white peer-checked:bg-linear-to-r peer-checked:from-indigo-600 peer-checked:to-pink-600 peer-checked:text-white peer-checked:ring-transparent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 dark:bg-white/10 dark:ring-white/10 dark:hover:bg-white/20">
                    <span aria-hidden="true">{e.emoji}</span>
                    {nomCourt(e.nom)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Titre */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="titre" className="text-sm font-semibold">
                Titre
              </label>
              <span className={aide}>{titre.length} / 150</span>
            </div>
            <input
              id="titre"
              name="titre"
              type="text"
              maxLength={150}
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className={champ}
            />
          </div>

          {/* Récit */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="contenu" className="text-sm font-semibold">
                Ton récit
              </label>
              <span className={aide}>{contenu.length} / 10 000</span>
            </div>
            <textarea
              id="contenu"
              name="contenu"
              rows={10}
              maxLength={10000}
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              className={
                champ + " min-h-48 resize-y font-recit leading-relaxed"
              }
            />
            <p className={aide + " mt-1.5"}>50 caractères minimum.</p>
          </div>

          {/* Avertissement (facultatif) */}
          <div>
            <label htmlFor="avertissement" className="text-sm font-semibold">
              Avertissement de contenu (facultatif)
            </label>
            <input
              id="avertissement"
              name="avertissement"
              type="text"
              maxLength={200}
              value={avertissement}
              onChange={(e) => setAvertissement(e.target.value)}
              className={champ}
            />
            <p className={aide + " mt-1.5"}>
              Prévient les lecteurs d'un sujet sensible (deuil, violence…).
            </p>
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
            {envoi ? "Publication…" : "Publier mon histoire"}
          </button>
        </form>
      </div>
    </div>
  );
}
