import { Hono } from "hono";
import { asc } from "drizzle-orm";
import { db } from "../db/client";
import { espaces } from "../db/schema";

const espacesRoutes = new Hono();

// GET /api/espaces : la liste des espaces, dans l'ordre d'affichage
espacesRoutes.get("/", async (c) => {
  const liste = await db
    .select({
      slug: espaces.slug,
      nom: espaces.nom,
      emoji: espaces.emoji,
      couleur: espaces.couleur,
      description: espaces.description,
    })
    .from(espaces)
    .orderBy(asc(espaces.ordre));

  return c.json({ espaces: liste });
});

export default espacesRoutes;