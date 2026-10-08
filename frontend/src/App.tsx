import { useEffect, useState } from "react"; // outils React pour l'état et les effets

export default function App() {
  // Thème : on lit le choix précédent, sinon la préférence du téléphone
  const [sombre, setSombre] = useState(
    () =>
      localStorage.getItem("theme") === "sombre" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
  // État de la connexion au serveur : null = en cours, true = ok, false = erreur
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  // À chaque changement de thème : on met la classe "dark" sur <html> et on mémorise
  useEffect(() => {
    document.documentElement.classList.toggle("dark", sombre); // ajoute ou retire "dark"
    localStorage.setItem("theme", sombre ? "sombre" : "clair"); // mémorise le choix
  }, [sombre]);

  // Au démarrage : on vérifie que le backend répond
  useEffect(() => {
    fetch("/api/health") // appel de la route de santé
      .then((r) => r.json()) // lit la réponse JSON
      .then((d) => setApiOk(Boolean(d.ok))) // ok ou pas
      .catch(() => setApiOk(false)); // serveur éteint : erreur
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Story<span className="text-amber-500">Time</span> 📖
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Raconte ce que tu as vécu. Quelqu'un se dira : « Moi aussi. »
        </p>

        {/* Bouton de bascule clair / sombre */}
        <button
          onClick={() => setSombre(!sombre)} // inverse le thème au clic
          className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-amber-600 active:scale-95"
        >
          {sombre ? "☀️ Mode clair" : "🌙 Mode sombre"}
        </button>

        {/* Indicateur de connexion au serveur */}
        <p className="text-sm">
          Serveur :{" "}
          {apiOk === null ? "⏳ vérification…" : apiOk ? "✅ connecté" : "❌ hors ligne"}
        </p>
      </div>
    </main>
  );
}
