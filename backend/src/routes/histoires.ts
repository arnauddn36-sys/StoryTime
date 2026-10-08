import { Hono } from "hono";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { espaces, histoires, moiAussi } from "../db/schema";
import { histoireSchema } from "../schemas";
import { limiter } from "../limite";
import {
  exigerConnexion,
  type VariablesAuth,
} from "../middleware/exigerConnexion";

const histoiresRoutes = new Hono<{ Variables: VariablesAuth }>();
const limiteEcriture = limiter(20, 60 * 60_000); // 20 histoires par heure

// Nombre de « Moi aussi » d'une histoire (calculé directement en SQL)
const nombreMoiAussi = sql<number>`(
  select count(*)::int from ${moiAussi}
  where ${moiAussi.histoireId} = ${histoires.id}
)`;

// GET /api/histoires?espace=football&page=1 : liste des histoires publiées
histoiresRoutes.get("/", async (c) => {
  const slug = c.req.query("espace");
  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const parPage = 10;

  const conditions = [eq(histoires.statut, "publiee")];
  if (slug) conditions.push(eq(espaces.slug, slug));

  const liste = await db
    .select({
      id: histoires.id,
      titre: histoires.titre,
      extrait: sql<string>`left(${histoires.contenu}, 200)`,
      avertissement: histoires.avertissement,
      publieeLe: histoires.publieeLe,
      espaceSlug: espaces.slug,
      espaceNom: espaces.nom,
      nbMoiAussi: nombreMoiAussi,
    })
    .from(histoires)
    .innerJoin(espaces, eq(histoires.espaceId, espaces.id))
    .where(and(...conditions))
    .orderBy(desc(histoires.publieeLe))
    .limit(parPage)
    .offset((page - 1) * parPage);

  return c.json({ page, histoires: liste });
});

// GET /api/histoires/:id : une histoire complète
histoiresRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const formatUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!formatUuid.test(id)) {
    return c.json({ erreur: "Histoire introuvable" }, 404);
  }

  const [histoire] = await db
    .select({
      id: histoires.id,
      titre: histoires.titre,
      contenu: histoires.contenu,
      avertissement: histoires.avertissement,
      publieeLe: histoires.publieeLe,
      espaceSlug: espaces.slug,
      espaceNom: espaces.nom,
      nbMoiAussi: nombreMoiAussi,
    })
    .from(histoires)
    .innerJoin(espaces, eq(histoires.espaceId, espaces.id))
    .where(and(eq(histoires.id, id), eq(histoires.statut, "publiee")))
    .limit(1);

  if (!histoire) {
    return c.json({ erreur: "Histoire introuvable" }, 404);
  }
  return c.json(histoire);
});

// POST /api/histoires : publier une histoire (connexion obligatoire)
histoiresRoutes.post("/", limiteEcriture, exigerConnexion, async (c) => {
  const corps = await c.req.json().catch(() => null);
  const resultat = histoireSchema.safeParse(corps);
  if (!resultat.success) {
    return c.json({ erreur: resultat.error.issues[0].message }, 400);
  }
  const { espace, titre, contenu, avertissement } = resultat.data;

  // L'espace demandé existe-t-il ?
  const [espaceTrouve] = await db
    .select({ id: espaces.id })
    .from(espaces)
    .where(eq(espaces.slug, espace))
    .limit(1);
  if (!espaceTrouve) {
    return c.json({ erreur: "Cet espace n'existe pas" }, 400);
  }

  const [nouvelle] = await db
    .insert(histoires)
    .values({
      auteurId: c.get("utilisateurId"), // vient du token
      espaceId: espaceTrouve.id,
      titre,
      contenu,
      avertissement: avertissement || null,
      statut: "publiee",
      publieeLe: new Date(),
    })
    .returning({ id: histoires.id, titre: histoires.titre });

  return c.json(nouvelle, 201);
});

export default histoiresRoutes;