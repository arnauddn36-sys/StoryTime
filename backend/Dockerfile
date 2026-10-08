# Image officielle de Bun
FROM oven/bun:1
# Dossier de travail dans le conteneur
WORKDIR /app
# On copie d'abord les fichiers de dépendances (accélère les rebuilds)
COPY package.json bun.lock* ./
# Installation des dépendances
RUN bun install
# Puis on copie le reste du code
COPY . .
# Le serveur écoute sur le port 3000
EXPOSE 3000
# Commande de démarrage
CMD ["bun", "src/index.ts"]
