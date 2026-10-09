import { Link } from "react-router";

export default function Introuvable() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-3xl font-bold">Page introuvable</h1>
      <p className="text-stone-600 dark:text-stone-400">
        Cette adresse n'existe pas.
      </p>
      <Link
        to="/"
        className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}