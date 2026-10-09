import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

export default function MiseEnPage() {
  // Thème : choix précédent, sinon préférence du téléphone
  const [sombre, setSombre] = useState(
    () =>
      localStorage.getItem("theme") === "sombre" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", sombre);
    localStorage.setItem("theme", sombre ? "sombre" : "clair");
  }, [sombre]);

  return (
    <div className="relative min-h-screen text-indigo-950 dark:text-white/90">
      {/* Décor fixe : dégradé crépuscule + deux halos qui dérivent lentement */}
      <div
        aria-hidden="true"
        className="fond-crepuscule fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 -top-24 size-96 animate-derive rounded-full bg-pink-600/20 blur-3xl dark:bg-pink-600/25" />
        <div className="absolute -bottom-32 -right-16 size-[28rem] animate-derive-decale rounded-full bg-indigo-600/20 blur-3xl dark:bg-indigo-600/30" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/40 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-indigo-950/70">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            StoryTime <span className="hidden sm:inline">📖</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/connexion"
              className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/60 dark:hover:bg-white/10"
            >
              Se connecter
            </Link>
            <Link
              to="/inscription"
              className="hidden rounded-full bg-linear-to-r from-indigo-600/25 to-pink-600/25 px-4 py-2 text-sm font-semibold text-indigo-950 shadow-md shadow-indigo-600/10 ring-1 ring-indigo-600/30 transition hover:from-indigo-600/35 hover:to-pink-600/35 sm:inline-flex dark:from-indigo-400/30 dark:to-pink-500/30 dark:text-white dark:ring-white/25 dark:hover:from-indigo-400/40 dark:hover:to-pink-500/40"
            >
              Créer un compte
            </Link>
            <button
              onClick={() => setSombre(!sombre)}
              aria-label={
                sombre ? "Passer en mode clair" : "Passer en mode sombre"
              }
              className="grid size-10 place-items-center rounded-full bg-white/60 text-lg transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
            >
              {sombre ? "🌞" : "🌚"}
            </button>
          </div>
        </nav>
      </header>

      {/* Ici s'affiche la page choisie par l'adresse */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-indigo-950/60 sm:px-6 dark:text-white/50">
        StoryTime : des histoires vécues, racontées sans te montrer.
      </footer>
    </div>
  );
}
