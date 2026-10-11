import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  api,
  effacerToken,
  lireToken,
  stockerToken,
  type ReponseAuth,
  type Utilisateur,
} from "./api";

const CLE_UTILISATEUR = "utilisateur";

// Le token contient sa date d'expiration (en secondes) : on la lit pour savoir s'il est périmé
function tokenExpire(token: string): boolean {
  try {
    const milieu = token.split(".")[1];
    const json = atob(milieu.replaceAll("-", "+").replaceAll("_", "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" && exp * 1000 < Date.now();
  } catch {
    return true; // token illisible : on le considère comme périmé
  }
}

// Au démarrage du site : retrouve la personne connectée (si le token est encore valable)
function lireSession(): Utilisateur | null {
  const token = lireToken();
  const brut = localStorage.getItem(CLE_UTILISATEUR);

  if (!token || !brut || tokenExpire(token)) {
    effacerToken();
    localStorage.removeItem(CLE_UTILISATEUR);
    return null;
  }
  try {
    return JSON.parse(brut) as Utilisateur;
  } catch {
    return null;
  }
}

type ContexteAuth = {
  utilisateur: Utilisateur | null; // null = personne n'est connecté
  connexion: (pseudo: string, motDePasse: string) => Promise<void>;
  inscription: (pseudo: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
};

const Contexte = createContext<ContexteAuth | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(
    lireSession,
  );

  // On garde le token et l'utilisateur dans le navigateur, puis on met à jour le site
  const ouvrirSession = useCallback((reponse: ReponseAuth) => {
    stockerToken(reponse.token);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(reponse.utilisateur));
    setUtilisateur(reponse.utilisateur);
  }, []);

  const connexion = useCallback(
    async (pseudo: string, motDePasse: string) => {
      ouvrirSession(await api.connexion(pseudo, motDePasse));
    },
    [ouvrirSession],
  );

  const inscription = useCallback(
    async (pseudo: string, motDePasse: string) => {
      ouvrirSession(await api.inscription(pseudo, motDePasse));
    },
    [ouvrirSession],
  );

  const deconnexion = useCallback(() => {
    effacerToken();
    localStorage.removeItem(CLE_UTILISATEUR);
    setUtilisateur(null);
  }, []);

  // useMemo : la valeur ne change que quand l'utilisateur change (évite des affichages inutiles)
  const valeur = useMemo(
    () => ({ utilisateur, connexion, inscription, deconnexion }),
    [utilisateur, connexion, inscription, deconnexion],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

// Les pages utilisent ce crochet : const { utilisateur } = useAuth();
export function useAuth(): ContexteAuth {
  const contexte = useContext(Contexte);
  if (!contexte) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur de <AuthProvider>",
    );
  }
  return contexte;
}
