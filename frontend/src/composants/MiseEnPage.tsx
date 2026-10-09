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
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <header className="border-b border-stone-200 dark:border-stone-800">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            Story<span className="text-amber-500">Time</span> 📖
          </Link>
          <button
            onClick={() => setSombre(!sombre)}
            aria-label="Changer de thème"
            className="rounded-full bg-amber-500 px-4 py-2 text-white shadow transition hover:bg-amber-600 active:scale-95"
          >
            {sombre ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      {/* Ici s'affiche la page choisie par l'adresse */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}