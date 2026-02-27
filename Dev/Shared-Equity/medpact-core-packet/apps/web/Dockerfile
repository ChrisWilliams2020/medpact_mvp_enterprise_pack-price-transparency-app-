FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY . .
# Prefer npm ci when lockfile present, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then npm ci || npm install --legacy-peer-deps; else npm install --legacy-peer-deps; fi && npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
