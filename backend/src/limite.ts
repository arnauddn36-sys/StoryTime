import type { Context, MiddlewareHandler } from "hono";

type Compteur = { nombre: number; finLe: number };
type ServeurBun = { requestIP?: (req: Request) => { address: string } | null };



// Trouve l'adresse IP de la personne qui appelle l'API
function trouverIp(c: Context): string {
  // En production, l'API est derrière le proxy de l'hébergeur : il ajoute la
  // vraie IP à la FIN de x-forwarded-for (le début peut être falsifié).
  if (process.env.NODE_ENV === "production") {
    const liste = c.req.header("x-forwarded-for")?.split(",");
    const derniere = liste?.at(-1)?.trim();
    if (derniere) return derniere;
  }

  
  // Sinon : IP de la connexion directe, fournie par le serveur Bun
  const serveur = c.env as ServeurBun | undefined;
  return serveur?.requestIP?.(c.req.raw)?.address ?? "inconnue";
}

// max requêtes autorisées par fenêtre de temps (en millisecondes), par adresse IP
export function limiter(max: number, fenetreMs: number): MiddlewareHandler {
  const compteurs = new Map<string, Compteur>();

  // Toutes les minutes, on supprime les compteurs périmés
  setInterval(() => {
    const maintenant = Date.now();
    for (const [cle, compteur] of compteurs) {
      if (compteur.finLe <= maintenant) compteurs.delete(cle);
    }
  }, 60_000);

  return async (c, next) => {
    const ip = trouverIp(c);

    const maintenant = Date.now();
    let compteur = compteurs.get(ip);
    if (!compteur || compteur.finLe <= maintenant) {
      compteur = { nombre: 0, finLe: maintenant + fenetreMs };
      compteurs.set(ip, compteur);
    }

    compteur.nombre++;
    if (compteur.nombre > max) {
      const attente = Math.ceil((compteur.finLe - maintenant) / 1000);
      c.header("Retry-After", String(attente));
      return c.json(
        { erreur: "Trop de tentatives, réessaie dans quelques instants" },
        429,
      );
    }

    await next();
  };
}
