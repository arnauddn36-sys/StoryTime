import { drizzle } from "drizzle-orm/postgres-js"; // lie Drizzle à PostgreSQL
import postgres from "postgres"; // pilote qui parle à PostgreSQL
import { env } from "../config/env"; // variables validées
import * as schema from "./schema"; // toutes nos tables

// Connexion à Supabase (SSL obligatoire en ligne)
const connexion = postgres(env.DATABASE_URL, {
  ssl: "require", // chiffre la communication avec la base
  max: 10, // 10 connexions maximum en même temps
});

// "db" est l'objet qu'on utilisera partout pour lire/écrire dans la base
export const db = drizzle(connexion, { schema });

// On exporte aussi la connexion brute (utile pour la fermer proprement)
export { connexion };
