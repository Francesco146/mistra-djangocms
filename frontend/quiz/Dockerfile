# Usa immagine node ufficiale
FROM node:18

# Cartella lavoro dentro container
WORKDIR /app

# Copia package.json e installa dipendenze
COPY package*.json ./
RUN npm install

# Copia tutto il resto
COPY . .

# Espone porta 3000 (default React dev server)
EXPOSE 3000

# Avvia il dev server React esponendolo su tutti gli host
CMD ["npm", "run", "dev", "--", "--host"]
