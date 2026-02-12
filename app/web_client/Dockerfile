# Dockerfile pour le client web Next.js

# ===== Étape 1: Build =====
# Utilise une image Node pour construire l'application
FROM node:20-alpine AS builder

# Définit le répertoire de travail
WORKDIR /usr/src/app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
# NPM_CONFIG_LOGLEVEL=warn réduit la verbosité
RUN NPM_CONFIG_LOGLEVEL=warn npm install

# Copie le reste du code de l'application
COPY . .

# Construit l'application pour la production
# La variable d'environnement est injectée ici pour que le build la connaisse si nécessaire
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build


# ===== Étape 2: Production =====
# Utilise une image Node plus légère pour l'exécution
FROM node:20-alpine

WORKDIR /usr/src/app

# Copie les dépendances de production
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --production

# Copie les fichiers de build de Next.js
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.ts ./next.config.ts

# Expose le port sur lequel l'application tourne
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
