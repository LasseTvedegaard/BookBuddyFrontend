# frontend/Dockerfile.dev
FROM node:20
WORKDIR /app

# Installer dependencies tidligt (hurtigere builds)
COPY package*.json ./
RUN npm install

# Kopiér resten (fallback hvis volume ikke mountes)
COPY . .

# Start React dev server
CMD ["npm", "start"]
