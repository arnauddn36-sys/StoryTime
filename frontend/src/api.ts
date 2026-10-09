// ---------- Types : la forme des données renvoyées par l'API ----------
export type Utilisateur = {
  id: string;
  pseudo: string;
  role: "membre" | "moderateur";
};

export type ReponseAuth = { token: string; utilisateur: Utilisateur };

export type HistoireResume = {
  id: string;
  titre: string;
  extrait: string;
  avertissement: string | null;
  publieeLe: string | null;
  espaceSlug: string;
  espaceNom: string;
  nbMoiAussi: number;
};

export type Histoire = {
  id: string;
  titre: string;
  contenu: string;
  avertissement: string | null;
  publieeLe: string | null;
  espaceSlug: string;
  espaceNom: string;
  nbMoiAussi: number;
};

export type NouvelleHistoire = {
  espace: string; // le slug, ex. "football"
  titre: string;
  contenu: string;
  avertissement?: string;
};

// ---------- Le token de connexion, gardé dans le navigateur ----------
const CLE_TOKEN = "token";

export function lireToken(): string | null {
  return localStorage.getItem(CLE_TOKEN);
}
export function stockerToken(token: string): void {
  localStorage.setItem(CLE_TOKEN, token);
}
export function effacerToken(): void {
  localStorage.removeItem(CLE_TOKEN);
}

// ---------- Erreur renvoyée par l'API ----------
export class ErreurApi extends Error {
  statut: number; // code HTTP : 400, 401, 404, 429...

  constructor(message: string, statut: number) {
    super(message);
    this.statut = statut;
  }
}

// ---------- Fonction de base : tous les appels passent par ici ----------
async function appeler<T>(
  chemin: string,
  options: { methode?: string; corps?: unknown } = {},
): Promise<T> {
  const token = lireToken();

  const reponse = await fetch(chemin, {
    method: options.methode ?? "GET",
    headers: {
      ...(options.corps ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.corps ? JSON.stringify(options.corps) : undefined,
  });

  // Le serveur répond toujours en JSON ; si ce n'est pas le cas, on obtient null
  const donnees = await reponse.json().catch(() => null);

  if (!reponse.ok) {
    // Token expiré ou invalide : on l'efface
    if (reponse.status === 401 && token) effacerToken();
    throw new ErreurApi(
      donnees?.erreur ?? "Une erreur est survenue, réessaie.",
      reponse.status,
    );
  }
  return donnees as T;
}

// ---------- Les appels que les pages utiliseront ----------
export const api = {
  inscription: (pseudo: string, motDePasse: string) =>
    appeler<ReponseAuth>("/api/auth/inscription", {
      methode: "POST",
      corps: { pseudo, motDePasse },
    }),

  connexion: (pseudo: string, motDePasse: string) =>
    appeler<ReponseAuth>("/api/auth/connexion", {
      methode: "POST",
      corps: { pseudo, motDePasse },
    }),

  histoires: (espace?: string, page = 1) => {
    const params = new URLSearchParams({ page: String(page) });
    if (espace) params.set("espace", espace);
    return appeler<{ page: number; histoires: HistoireResume[] }>(
      `/api/histoires?${params}`,
    );
  },

  histoire: (id: string) => appeler<Histoire>(`/api/histoires/${id}`),

  publier: (donnees: NouvelleHistoire) =>
    appeler<{ id: string; titre: string }>("/api/histoires", {
      methode: "POST",
      corps: donnees,
    }),
};
