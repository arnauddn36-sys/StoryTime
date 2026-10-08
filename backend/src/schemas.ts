import { z } from "zod";

// Règles communes
const pseudo = z
  .string({ required_error: "Le pseudo est obligatoire" })
  .trim()
  .min(3, "Le pseudo doit faire au moins 3 caractères")
  .max(30, "Le pseudo doit faire 30 caractères maximum")
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "Le pseudo ne peut contenir que des lettres, chiffres, _ . -"
  );

const motDePasse = z
  .string({ required_error: "Le mot de passe est obligatoire" })
  .min(8, "Le mot de passe doit faire au moins 8 caractères")
  .max(72, "Le mot de passe doit faire 72 caractères maximum"); // limite de bcrypt

// Inscription
export const inscriptionSchema = z.object({
  pseudo,
  motDePasse,
});

// Connexion
export const connexionSchema = z.object({
  pseudo: z.string().trim().min(1, "Le pseudo est obligatoire"),
  motDePasse: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type InscriptionInput = z.infer<typeof inscriptionSchema>;
export type ConnexionInput = z.infer<typeof connexionSchema>;