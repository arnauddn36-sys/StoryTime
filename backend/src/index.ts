
import { Hono } from "hono"; // framework web léger et rapide
import { cors } from "hono/cors"; // autorise le frontend à appeler l'API
import { logger } from "hono/logger"; // affiche chaque requête dans la console
import { secureHeaders } from "hono/secure-headers"; // équivalent de Helmet pour Hono
import { sql } from "drizzle-orm"; // pour écrire une petite requête SQL de test
import { env } from "./config/env"; // variables d'environnement validées
import { db } from "./db/client"; // connexion base de données
import auth from "./routes/auth";
import histoires from "./routes/histoires";
import espaces from "./routes/espaces";



// Création de l'application
const app = new Hono();

// Journal des requêtes
app.use("*", logger());

// En-têtes de sécurité HTTP (protège contre le clickjacking, le sniffing, etc.)
app.use("*", secureHeaders());

// CORS : seul notre frontend a le droit d'appeler l'API
app.use(
  "/api/*",
  cors({
    origin: env.FRONTEND_URL, // une seule origine autorisée
    credentials: true, // autorise l'envoi des cookies
  }),
);

// Route de santé : sert à vérifier que le serveur et la base répondent
app.get("/api/health", async (c) => {
  try {
    await db.execute(sql`select 1`); // petite requête pour tester la base
    return c.json({ ok: true, base: "connectée" }); // tout va bien
  } catch {
    return c.json({ ok: false, base: "injoignable" }, 503); // erreur 503 : service indisponible
  }
});

// Routes d'authentification (inscription, connexion)
app.route("/api/auth", auth);

// Routes pour les histoires (liste, lecture, création, etc.)
app.route("/api/histoires", histoires);

// Routes pour les espaces (liste, lecture, création, etc.)
app.route("/api/espaces", espaces);

// Route inconnue : réponse 404 propre en JSON
app.notFound((c) => c.json({ erreur: "Route introuvable" }, 404));

// Erreur imprévue : on log côté serveur, mais on ne révèle aucun détail au client
app.onError((err, c) => {
  console.error(err); // détail visible seulement dans nos logs
  return c.json({ erreur: "Erreur interne du serveur" }, 500);
});

console.log(`🚀 StoryTime API sur http://localhost:${env.PORT}`);

// Bun lit cet export pour démarrer le serveur
export default {
  port: env.PORT, // port d'écoute
  fetch: app.fetch, // fonction qui traite chaque requête
};
