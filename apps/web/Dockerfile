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

# Build — bake public client-side env vars into the Vite bundle
WORKDIR /app/apps/web
ARG VITE_SUPABASE_URL=https://gsqmwxqgqrgzhlhmbscg.supabase.co
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcW13eHFncXJnemhsaG1ic2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NTk5ODYsImV4cCI6MjA1NDMzNTk4Nn0.a30I6aLvNNIS6coxJbgTeGBUmKR0NvTkZUDG5uyloFY
ARG VITE_FIREBASE_API_KEY=AIzaSyBhVS4cg9lNPU6_9PaHM6pgAY-3LZAD9Us
ARG VITE_FIREBASE_AUTH_DOMAIN=hushone-app.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=hushone-app
ARG VITE_FIREBASE_STORAGE_BUCKET=hushone-app.appspot.com
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=53407187172
ARG VITE_FIREBASE_APP_ID=1:53407187172:web:a737f922b8f31bf9b32cf1
ARG VITE_FIREBASE_MEASUREMENT_ID=G-Z47KV1NP04

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

RUN npm run build

# ── Stage 2: Serve with nginx ──
FROM nginx:1.25-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
