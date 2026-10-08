import { db, connexion } from "./client"; // base de données
import { espaces } from "./schema"; // table des espaces

// Liste des 10 espaces de la première version
const listeEspaces = [
  { slug: "football", nom: "StoryTime Football", emoji: "⚽", couleur: "#16a34a", description: "Ce que le football t'a fait vivre : tribune, terrain, supporters.", ordre: 1 },
  { slug: "couple", nom: "StoryTime Couple", emoji: "💔", couleur: "#e11d48", description: "Amour, ruptures, trahisons, réconciliations vécues.", ordre: 2 },
  { slug: "argent", nom: "StoryTime Argent & Débrouille", emoji: "💸", couleur: "#ca8a04", description: "Galères, business, dettes, réussites : l'argent comme il se vit.", ordre: 3 },
  { slug: "famille", nom: "StoryTime Famille", emoji: "👨‍👩‍👧", couleur: "#9333ea", description: "Parents, frères, sœurs, héritage : la vie de famille sans filtre.", ordre: 4 },
  { slug: "ecole", nom: "StoryTime École & Études", emoji: "🎓", couleur: "#2563eb", description: "Examens, profs, campus : ton parcours scolaire.", ordre: 5 },
  { slug: "travail", nom: "StoryTime Travail", emoji: "💼", couleur: "#0d9488", description: "Patron, collègues, chômage, premier emploi.", ordre: 6 },
  { slug: "quartier", nom: "StoryTime Vie de quartier", emoji: "🏘️", couleur: "#ea580c", description: "Voisins, maquis, transport, la vie au quartier.", ordre: 7 },
  { slug: "foi", nom: "StoryTime Foi", emoji: "🙏", couleur: "#0891b2", description: "Doutes, miracles, épreuves : ton chemin spirituel.", ordre: 8 },
  { slug: "musique", nom: "StoryTime Musique & Coupé-décalé", emoji: "🎶", couleur: "#db2777", description: "Concerts, rêves d'artiste, ambiance et soirées.", ordre: 9 },
  { slug: "injustice", nom: "StoryTime Injustice", emoji: "⚖️", couleur: "#475569", description: "Ce que tu as subi et dont tu parles peu.", ordre: 10 },
];

// onConflictDoNothing : si on relance le seed, rien n'est dupliqué
await db.insert(espaces).values(listeEspaces).onConflictDoNothing();
console.log(`✅ ${listeEspaces.length} espaces insérés (ou déjà présents)`);

// On ferme la connexion pour que le script se termine
await connexion.end();
