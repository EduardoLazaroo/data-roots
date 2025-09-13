FROM node:18-alpine

# Configura prefixo global do npm
RUN npm config set prefix /root/.npm-global
ENV PATH=/root/.npm-global/bin:$PATH

# Instala Angular CLI
RUN npm install -g @angular/cli@16

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência primeiro (cache build)
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta do Angular
EXPOSE 4200

# Comando padrão: rodar o Angular em modo dev
CMD ["ng", "serve", "--host", "0.0.0.0"]
