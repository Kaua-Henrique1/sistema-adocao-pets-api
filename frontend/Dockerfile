# Troque a versão 20 pela 22 (ou lts-alpine)
FROM node:22-alpine AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm ci

# Copia o código e gera a build
COPY . .
RUN npm run build -- --configuration production

# Estágio 2: Servir com Nginx
FROM nginx:alpine
COPY --from=build /app/dist/ong-pets-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
