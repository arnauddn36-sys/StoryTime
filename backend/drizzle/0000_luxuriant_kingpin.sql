CREATE TYPE "public"."role_utilisateur" AS ENUM('membre', 'moderateur');--> statement-breakpoint
CREATE TYPE "public"."statut_histoire" AS ENUM('brouillon', 'publiee');--> statement-breakpoint
CREATE TABLE "espaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(40) NOT NULL,
	"nom" varchar(60) NOT NULL,
	"emoji" varchar(16) NOT NULL,
	"couleur" varchar(9) NOT NULL,
	"description" text NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "espaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "histoires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auteur_id" uuid NOT NULL,
	"espace_id" uuid NOT NULL,
	"titre" varchar(150) NOT NULL,
	"contenu" text NOT NULL,
	"avertissement" varchar(200),
	"statut" "statut_histoire" DEFAULT 'brouillon' NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"publiee_le" timestamp
);
--> statement-breakpoint
CREATE TABLE "moi_aussi" (
	"histoire_id" uuid NOT NULL,
	"utilisateur_id" uuid NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "moi_aussi_histoire_id_utilisateur_id_pk" PRIMARY KEY("histoire_id","utilisateur_id")
);
--> statement-breakpoint
CREATE TABLE "utilisateurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pseudo" varchar(30) NOT NULL,
	"mot_de_passe_hash" text NOT NULL,
	"role" "role_utilisateur" DEFAULT 'membre' NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "utilisateurs_pseudo_unique" UNIQUE("pseudo")
);
--> statement-breakpoint
ALTER TABLE "histoires" ADD CONSTRAINT "histoires_auteur_id_utilisateurs_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "histoires" ADD CONSTRAINT "histoires_espace_id_espaces_id_fk" FOREIGN KEY ("espace_id") REFERENCES "public"."espaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moi_aussi" ADD CONSTRAINT "moi_aussi_histoire_id_histoires_id_fk" FOREIGN KEY ("histoire_id") REFERENCES "public"."histoires"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moi_aussi" ADD CONSTRAINT "moi_aussi_utilisateur_id_utilisateurs_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;