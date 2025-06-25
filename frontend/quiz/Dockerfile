# Usa immagine node ufficiale
FROM node:18

# Cartella lavoro dentro container
WORKDIR /app

# Copia package.json e package-lock.json (se esiste)
COPY package*.json ./

# Installa dipendenze
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Espone porta 5173 (default Vite dev server)
EXPOSE 5173

# Avvia il dev server Vite
CMD ["npm", "run", "dev"]