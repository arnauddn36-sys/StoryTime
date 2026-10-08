import { z } from "zod"; // Zod vérifie que les données ont la bonne forme

// Description de toutes les variables d'environnement attendues
const schemaEnv = z.object({
  PORT: z.coerce.number().default(3000), // "3000" (texte) devient 3000 (nombre)
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_URL: z.string().url(), // doit être une vraie adresse web
  DATABASE_URL: z.string().min(1, "DATABASE_URL est obligatoire"), // lien Supabase
  JWT_SECRET: z.string().min(32, "JWT_SECRET doit faire 32 caractères minimum"), // clé solide
  JWT_EXPIRES_IN: z.coerce.number().default(604800), // durée du JWT en secondes
});

// On vérifie les variables réelles ; safeParse ne plante pas, il renvoie un résultat
const resultat = schemaEnv.safeParse(process.env);

// Si une variable manque ou est mauvaise, on arrête tout avec un message clair
if (!resultat.success) {
  console.error("❌ Variables d'environnement invalides :");
  console.error(resultat.error.flatten().fieldErrors); // affiche chaque erreur
  process.exit(1); // quitte le programme
}

// On exporte les variables validées et typées pour le reste de l'application
export const env = resultat.data;
