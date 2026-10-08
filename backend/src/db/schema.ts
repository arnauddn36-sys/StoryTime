import {
  pgTable, // pour déclarer une table
  uuid, // identifiant unique long (impossible à deviner)
  text, // texte de longueur libre
  varchar, // texte de longueur limitée
  integer, // nombre entier
  timestamp, // date et heure
  primaryKey, // clé primaire composée de plusieurs colonnes
  pgEnum, // liste de valeurs autorisées
  unique, // interdit les doublons sur un groupe de colonnes
} from "drizzle-orm/pg-core";

// Statut d'une histoire : privée (brouillon) ou visible par tous (publiée)
export const statutHistoire = pgEnum("statut_histoire", [
  "brouillon",
  "publiee",
]);

// Rôle d'un compte : lecteur/auteur normal, ou modérateur
export const roleUtilisateur = pgEnum("role_utilisateur", [
  "membre",
  "moderateur",
]);

// Statut d'un signalement : à traiter ou déjà traité par un modérateur
export const statutSignalement = pgEnum("statut_signalement", [
  "en_attente",
  "traite",
]);

// ---------- Table des utilisateurs ----------
export const utilisateurs = pgTable("utilisateurs", {
  id: uuid("id").primaryKey().defaultRandom(), // identifiant généré automatiquement
  pseudo: varchar("pseudo", { length: 30 }).notNull().unique(), // pseudo choisi, unique
  motDePasseHash: text("mot_de_passe_hash").notNull(), // JAMAIS le mot de passe en clair
  role: roleUtilisateur("role").notNull().default("membre"), // membre par défaut
  creeLe: timestamp("cree_le").notNull().defaultNow(), // date d'inscription
});

// ---------- Table des espaces (Football, Couple, etc.) ----------
export const espaces = pgTable("espaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 40 }).notNull().unique(), // nom pour l'adresse web : "football"
  nom: varchar("nom", { length: 60 }).notNull(), // nom affiché : "StoryTime Football"
  emoji: varchar("emoji", { length: 16 }).notNull(), // icône de l'espace
  couleur: varchar("couleur", { length: 9 }).notNull(), // couleur d'accent, ex "#16a34a"
  description: text("description").notNull(), // phrase d'explication
  ordre: integer("ordre").notNull().default(0), // position dans la sidebar
});

// ---------- Table des histoires ----------
export const histoires = pgTable("histoires", {
  id: uuid("id").primaryKey().defaultRandom(),
  auteurId: uuid("auteur_id") // qui a écrit l'histoire
    .notNull()
    .references(() => utilisateurs.id, { onDelete: "cascade" }), // supprime ses histoires si le compte est supprimé
  espaceId: uuid("espace_id") // dans quel espace elle est publiée
    .notNull()
    .references(() => espaces.id),
  titre: varchar("titre", { length: 150 }).notNull(), // titre de l'histoire
  contenu: text("contenu").notNull(), // le récit complet
  avertissement: varchar("avertissement", { length: 200 }), // alerte de contenu choisie par l'auteur (optionnelle)
  statut: statutHistoire("statut").notNull().default("brouillon"), // brouillon tant que non publiée
  creeLe: timestamp("cree_le").notNull().defaultNow(), // date de création
  publieeLe: timestamp("publiee_le"), // date de publication (vide si brouillon)
});

// ---------- Table du bouton « Moi aussi » ----------
export const moiAussi = pgTable(
  "moi_aussi",
  {
    histoireId: uuid("histoire_id")
      .notNull()
      .references(() => histoires.id, { onDelete: "cascade" }), // l'histoire touchée
    utilisateurId: uuid("utilisateur_id")
      .notNull()
      .references(() => utilisateurs.id, { onDelete: "cascade" }), // la personne touchée
    creeLe: timestamp("cree_le").notNull().defaultNow(),
  },
  // Clé composée : une personne ne peut cliquer qu'une seule fois par histoire
  (table) => [primaryKey({ columns: [table.histoireId, table.utilisateurId] })],
);

// ---------- Table des signalements ----------
export const signalements = pgTable(
  "signalements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    histoireId: uuid("histoire_id")
      .notNull()
      .references(() => histoires.id, { onDelete: "cascade" }), // l'histoire signalée
    signaleurId: uuid("signaleur_id")
      .notNull()
      .references(() => utilisateurs.id, { onDelete: "cascade" }), // qui a signalé
    raison: varchar("raison", { length: 300 }).notNull(), // pourquoi
    statut: statutSignalement("statut").notNull().default("en_attente"), // à traiter par défaut
    creeLe: timestamp("cree_le").notNull().defaultNow(),
  },
  // Une personne ne peut signaler la même histoire qu'une seule fois
  (table) => [unique().on(table.histoireId, table.signaleurId)],
);

