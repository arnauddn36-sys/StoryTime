import type { MiddlewareHandler } from "hono";
import { lireToken } from "../securite";

// Les variables que ce middleware met à disposition des routes
export type VariablesAuth = { utilisateurId: string };

// Bloque la requête si la personne n'est pas connectée
export const exigerConnexion: MiddlewareHandler<{ Variables: VariablesAuth }> =
  async (c, next) => {
    // Le frontend enverra : Authorization: Bearer <token>
    const entete = c.req.header("Authorization") ?? "";
    const [type, token] = entete.split(" ");
    if (type !== "Bearer" || !token) {
      return c.json({ erreur: "Connexion requise" }, 401);
    }

    const donnees = await lireToken(token);
    if (!donnees) {
      return c.json(
        { erreur: "Session invalide ou expirée, reconnecte-toi" },
        401,
      );
    }

    // On retient qui fait la requête pour la route qui suit
    c.set("utilisateurId", donnees.sub);
    await next();
  };