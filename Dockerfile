# syntax=docker/dockerfile:1

# ---------- Stage 1: build bundle statis ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite menanamkan variabel VITE_* ke dalam bundle saat build, jadi nilainya
# harus sudah benar sebelum `vite build` dijalankan (tidak bisa diubah saat runtime).
ARG VITE_API_BASE_URL=/api
ARG VITE_ENABLE_STATIC_FALLBACK=true
ARG VITE_ORG_PROFILE_ID=
ARG VITE_SHOW_ADMIN_LOGIN=false
ARG VITE_SITE_URL=

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_ENABLE_STATIC_FALLBACK=${VITE_ENABLE_STATIC_FALLBACK} \
    VITE_ORG_PROFILE_ID=${VITE_ORG_PROFILE_ID} \
    VITE_SHOW_ADMIN_LOGIN=${VITE_SHOW_ADMIN_LOGIN} \
    VITE_SITE_URL=${VITE_SITE_URL}

RUN npm run build

# ---------- Stage 2: runtime ----------
FROM nginx:1.30-alpine AS runtime

# Dipakai oleh docker/nginx.conf.template. Batasi envsubst hanya ke variabel ini
# agar variabel bawaan nginx seperti $uri dan $scheme tidak ikut disubstitusi.
ENV API_PROXY_TARGET=https://kmh.leviathanbolu.my.id
ENV NGINX_ENVSUBST_FILTER="^API_PROXY_TARGET\$"

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
