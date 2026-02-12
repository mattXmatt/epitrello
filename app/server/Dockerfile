FROM node:20-alpine

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application (assure-toi d'avoir un script "build" dans package.json)
RUN npm run build

# Exposition du port (par défaut Fastify utilise souvent 3000)
EXPOSE 3000

CMD ["npm", "run", "start"]