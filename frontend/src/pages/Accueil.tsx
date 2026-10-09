import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api, type HistoireResume } from "../api";

const espaces = [
  "Football",
  "Couple",
  "Argent",
  "Famille",
  "École",
  "Travail",
  "Quartier",
  "Foi",
  "Musique",
  "Injustice",
];

const etapes = [
  {
    titre: "Écris ton histoire",
    texte:
      "Choisis un espace, donne un titre et raconte ce qui s'est vraiment passé.",
  },
  {
    titre: "Publie sans te montrer",
    texte:
      "Ton récit apparaît sans ton nom ni ton pseudo. Seul ce que tu as vécu compte.",
  },
  {
    titre: "Reçois des « Moi aussi »",
    texte:
      "Chaque personne qui se reconnaît appuie sur le bouton. Tu vois combien ont vécu la même chose.",
  },
];

// Exemple d'histoire pour essayer le bouton « Moi aussi »
function CarteExemple() {
  const [nb, setNb] = useState(128);
  const [fait, setFait] = useState(false);
  const [essai, setEssai] = useState(0); // relance l'animation à chaque clic

  function appuyer() {
    setFait(!fait);
    setNb(fait ? nb - 1 : nb + 1);
    if (!fait) setEssai(essai + 1);
  }

  return (
    <article className="relative rounded-3xl bg-white/70 p-6 shadow-xl shadow-indigo-600/10 ring-1 ring-white/70 backdrop-blur sm:p-8 lg:rotate-1 dark:bg-white/5 dark:ring-white/10">
      <p className="text-sm text-indigo-950/60 dark:text-white/50">
        Exemple d'histoire, espace Football
      </p>
      <h2 className="mt-2 text-xl font-bold">
        Le penalty que je n'ai jamais oublié
      </h2>
      <p className="mt-3 font-recit leading-relaxed text-indigo-950/80 dark:text-white/75">
        Dix ans après, je repense encore à ce penalty raté en finale du
        quartier. Personne ne m'en a jamais reparlé, et pourtant je l'entends
        chaque fois que je croise un ballon.
      </p>

      <div className="relative mt-6 flex items-center justify-between gap-4">
        <button
          onClick={appuyer}
          aria-pressed={fait}
          className={
            "rounded-full px-5 py-2.5 font-semibold transition active:scale-95 " +
            (fait
              ? "bg-linear-to-r from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-600/30"
              : "bg-white text-indigo-600 ring-1 ring-indigo-600/30 hover:ring-indigo-600 dark:bg-white/10 dark:text-violet-200")
          }
        >
          {fait ? "Moi aussi ✓" : "Moi aussi"}
        </button>
        <p className="text-sm text-indigo-950/70 dark:text-white/60">
          {nb} personnes se reconnaissent
        </p>
        {fait && (
          <span
            key={essai}
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 left-8 animate-pouf text-2xl"
          >
            🤝
          </span>
        )}
      </div>
    </article>
  );
}

export default function Accueil() {
  // null = chargement en cours
  const [histoires, setHistoires] = useState<HistoireResume[] | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    api
      .histoires()
      .then((reponse) => setHistoires(reponse.histoires))
      .catch(() => setErreur(true));
  }, []);

  return (
    <div className="flex flex-col gap-24">
      {/* Présentation : le seul moment animé de la page, qui apparaît par étapes */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="animate-entree text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Ce que tu as vécu, d'autres l'ont vécu aussi.
          </h1>
          <p
            className="mt-6 max-w-xl animate-entree text-lg text-indigo-950/75 dark:text-white/70"
            style={{ animationDelay: "150ms" }}
          >
            StoryTime est l'espace où l'on raconte une histoire vraie sans
            montrer son visage ni son nom. Quand quelqu'un se reconnaît, il
            appuie sur « Moi aussi ».
          </p>
        </div>
        <div className="animate-entree" style={{ animationDelay: "300ms" }}>
          <CarteExemple />
        </div>
      </section>

      {/* Comment ça marche : une vraie suite d'étapes */}
      <section>
        <h2 className="text-2xl font-bold sm:text-3xl">Comment ça marche</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          {etapes.map((etape, i) => (
            <li key={etape.titre}>
              <span className="bg-linear-to-br from-indigo-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent">
                {i + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold">{etape.titre}</h3>
              <p className="mt-2 max-w-xs text-indigo-950/75 dark:text-white/65">
                {etape.texte}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Les espaces */}
      <section>
        <h2 className="text-2xl font-bold sm:text-3xl">
          Dix espaces pour se reconnaître
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {espaces.map((nom) => (
            <li
              key={nom}
              className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium ring-1 ring-white/70 dark:bg-white/10 dark:ring-white/10"
            >
              {nom}
            </li>
          ))}
        </ul>
      </section>

      {/* Accès : inscription et connexion, chacun sur sa page */}
      <section className="rounded-3xl bg-linear-to-br from-white/55 to-white/25 p-8 text-center text-indigo-950 shadow-xl shadow-indigo-600/10 ring-1 ring-white/70 backdrop-blur-xl sm:p-14 dark:from-white/10 dark:to-white/5 dark:text-white dark:ring-white/15">
        <h2 className="text-2xl font-bold sm:text-4xl">
          Prêt à raconter la tienne ?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-indigo-950/75 dark:text-white/70">
          Crée ton compte en moins d'une minute, ou reprends là où tu t'étais
          arrêté.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/inscription"
            className="rounded-full bg-linear-to-r from-indigo-600/25 to-pink-600/25 px-7 py-3 font-semibold text-indigo-950 shadow-lg shadow-indigo-600/10 ring-1 ring-white/80 transition hover:from-indigo-600/35 hover:to-pink-600/35 active:scale-95 dark:from-indigo-400/30 dark:to-pink-500/30 dark:text-white dark:ring-white/25 dark:hover:from-indigo-400/40 dark:hover:to-pink-500/40"
          >
            Créer un compte
          </Link>
          <Link
            to="/connexion"
            className="rounded-full px-7 py-3 font-semibold text-indigo-950 ring-1 ring-indigo-950/25 transition hover:bg-white/40 active:scale-95 dark:text-white dark:ring-white/30 dark:hover:bg-white/10"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Histoires récentes (viennent de ton API) */}
      <section>
        <h2 className="text-2xl font-bold sm:text-3xl">Histoires récentes</h2>

        {erreur && (
          <p className="mt-6 text-indigo-950/70 dark:text-white/60">
            Les histoires ne se chargent pas pour le moment. Réessaie dans un
            instant.
          </p>
        )}
        {!erreur && histoires === null && (
          <p className="mt-6 text-indigo-950/60 dark:text-white/50">
            Chargement…
          </p>
        )}
        {histoires?.length === 0 && (
          <p className="mt-6 text-indigo-950/70 dark:text-white/60">
            Aucune histoire pour le moment. Crée un compte pour publier la
            première.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-8">
          {histoires?.map((h) => (
            <article key={h.id} className="border-l-4 border-pink-600/60 pl-5">
              <p className="text-sm text-indigo-950/60 dark:text-white/50">
                {h.espaceNom}
              </p>
              <h3 className="mt-1 text-xl font-bold">{h.titre}</h3>
              <p className="mt-2 max-w-prose font-recit leading-relaxed text-indigo-950/80 dark:text-white/75">
                {h.extrait}
              </p>
              <p className="mt-3 text-sm text-indigo-950/70 dark:text-white/60">
                🤝 {h.nbMoiAussi} Moi aussi
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
