import { defineConfig } from "drizzle-kit"; // outil de migrations de Drizzle

export default defineConfig({
  schema: "./src/db/schema.ts", // où se trouve la description des tables
  out: "./drizzle", // dossier où les migrations SQL sont générées
  dialect: "postgresql", // type de base de données
  dbCredentials: {
    url: process.env.DATABASE_URL!, // lien Supabase lu depuis le .env
  },
});
