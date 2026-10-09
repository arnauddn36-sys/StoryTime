import { useEffect, useState } from "react";
import { api, ErreurApi, type HistoireResume } from "../api";

export default function Accueil() {
  // null = chargement en cours
  const [histoires, setHistoires] = useState<HistoireResume[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  // Au démarrage de la page : on demande les histoires au serveur
  useEffect(() => {
    api
      .histoires()
      .then((reponse) => setHistoires(reponse.histoires))
      .catch((e) =>
        setErreur(
          e instanceof ErreurApi ? e.message : "Impossible de joindre le serveur.",
        ),
      );
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Raconte ce que tu as vécu
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Quelqu'un se dira : « Moi aussi. »
        </p>
      </section>

      {erreur && <p className="text-center text-red-600">{erreur}</p>}
      {!erreur && histoires === null && (
        <p className="text-center text-stone-500">Chargement…</p>
      )}
      {histoires?.length === 0 && (
        <p className="text-center text-stone-500">
          Aucune histoire pour le moment.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {histoires?.map((h) => (
          <li
            key={h.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {h.espaceNom}
            </p>
            <h2 className="mt-1 text-xl font-bold">{h.titre}</h2>
            <p className="mt-2 text-stone-600 dark:text-stone-400">{h.extrait}</p>
            <p className="mt-3 text-sm text-stone-500">
              🤝 {h.nbMoiAussi} Moi aussi
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}