CREATE TYPE "public"."statut_signalement" AS ENUM('en_attente', 'traite');--> statement-breakpoint
CREATE TABLE "signalements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"histoire_id" uuid NOT NULL,
	"signaleur_id" uuid NOT NULL,
	"raison" varchar(300) NOT NULL,
	"statut" "statut_signalement" DEFAULT 'en_attente' NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "signalements_histoire_id_signaleur_id_unique" UNIQUE("histoire_id","signaleur_id")
);
--> statement-breakpoint
ALTER TABLE "signalements" ADD CONSTRAINT "signalements_histoire_id_histoires_id_fk" FOREIGN KEY ("histoire_id") REFERENCES "public"."histoires"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signalements" ADD CONSTRAINT "signalements_signaleur_id_utilisateurs_id_fk" FOREIGN KEY ("signaleur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;