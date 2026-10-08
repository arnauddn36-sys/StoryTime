import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { utilisateurs } from "../db/schema";
import { inscriptionSchema, connexionSchema } from "../schemas";
import { hasherMotDePasse, verifierMotDePasse, creerToken } from "../securite";
import { limiter } from "../limite";

const auth = new Hono();
const limiteInscription = limiter(10, 60 * 60_000); // 10 inscriptions par heure
const limiteConnexion = limiter(5, 60_000); // 5 tentatives par minute

// POST /api/auth/inscription
auth.post("/inscription", limiteInscription, async (c) => {
  const corps = await c.req.json().catch(() => null);
  const resultat = inscriptionSchema.safeParse(corps);
  if (!resultat.success) {
    return c.json({ erreur: resultat.error.issues[0].message }, 400);
  }
  const { pseudo, motDePasse } = resultat.data;

  // Le pseudo est-il déjà pris ?
  const [existant] = await db
    .select({ id: utilisateurs.id })
    .from(utilisateurs)
    .where(eq(utilisateurs.pseudo, pseudo))
    .limit(1);
  if (existant) {
    return c.json({ erreur: "Ce pseudo est déjà utilisé" }, 409);
  }

  // On stocke le hash, jamais le mot de passe
  const motDePasseHash = await hasherMotDePasse(motDePasse);
  const [nouveau] = await db
    .insert(utilisateurs)
    .values({ pseudo, motDePasseHash })
    .returning({
      id: utilisateurs.id,
      pseudo: utilisateurs.pseudo,
      role: utilisateurs.role,
    });

  const token = await creerToken(nouveau.id);
  return c.json({ token, utilisateur: nouveau }, 201);
});

// POST /api/auth/connexion
auth.post("/connexion", limiteConnexion, async (c) => {
  const corps = await c.req.json().catch(() => null);
  const resultat = connexionSchema.safeParse(corps);
  if (!resultat.success) {
    return c.json({ erreur: resultat.error.issues[0].message }, 400);
  }
  const { pseudo, motDePasse } = resultat.data;

  const [utilisateur] = await db
    .select()
    .from(utilisateurs)
    .where(eq(utilisateurs.pseudo, pseudo))
    .limit(1);

  // Même message si le pseudo n'existe pas ou si le mot de passe est faux
  const valide =
    utilisateur &&
    (await verifierMotDePasse(motDePasse, utilisateur.motDePasseHash));
  if (!valide) {
    return c.json({ erreur: "Pseudo ou mot de passe incorrect" }, 401);
  }

  const token = await creerToken(utilisateur.id);
  return c.json({
    token,
    utilisateur: {
      id: utilisateur.id,
      pseudo: utilisateur.pseudo,
      role: utilisateur.role,
    },
  });
});

export default auth;
