# ── Stage 1: Build ──
FROM node:20-alpine AS build
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/

# Install deps
RUN npm ci --workspace=apps/web --include-workspace-root 2>/dev/null || npm install --prefix apps/web

# Copy source
COPY apps/web/ apps/web/
COPY tsconfig.base.json ./

# Build
WORKDIR /app/apps/web
RUN npm run build

# ── Stage 2: Serve with nginx ──
FROM nginx:1.25-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
