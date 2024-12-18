# Etapa 1: Build
FROM node:18-alpine AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar o restante do código
COPY . .

# Executar o build do projeto
RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de build da etapa anterior
COPY --from=build /app/package.json /app/package-lock.json* ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

# Definir a porta exposta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start"]
