# Image officielle de Bun
FROM oven/bun:1
# Dossier de travail
WORKDIR /app
# Dépendances d'abord (cache Docker)
COPY package.json bun.lock* ./
RUN bun install
# Puis le code
COPY . .
EXPOSE 5173
# Serveur de développement Vite
CMD ["bun", "run", "dev"]
