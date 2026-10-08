import { sign, verify } from "hono/jwt";
import { env } from "./config/env";

// --- Mots de passe (bcrypt) ---

export function hasherMotDePasse(motDePasse: string): Promise<string> {
  return Bun.password.hash(motDePasse, { algorithm: "bcrypt", cost: 10 });
}

export function verifierMotDePasse(
  motDePasse: string,
  hash: string,
): Promise<boolean> {
  return Bun.password.verify(motDePasse, hash);
}

// --- Token JWT --

// Transforme "7d", "12h", "30m" en secondes (7 jours par défaut si format inconnu)
function dureeEnSecondes(duree: string | number): number {
  if (typeof duree === "number") return duree;

  const m = /^(\d+)([smhd])$/.exec(duree);
  if (!m) return 7 * 24 * 3600;
  const unites: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return Number(m[1]) * unites[m[2]];
}

export async function creerToken(
  utilisateurId: string | number,
): Promise<string> {
  const exp =
    Math.floor(Date.now() / 1000) + dureeEnSecondes(env.JWT_EXPIRES_IN);
  return sign({ sub: String(utilisateurId), exp }, env.JWT_SECRET, "HS256");
}

export async function lireToken(
  token: string,
): Promise<{ sub: string } | null> {
  try {
    const payload = await verify(token, env.JWT_SECRET, "HS256");
    const sub =
      typeof payload?.sub === "string" || typeof payload?.sub === "number"
        ? String(payload.sub)
        : null;

    if (!sub) return null;

    return { sub };
  } catch {
    return null; // token invalide ou expiré
  }
}
