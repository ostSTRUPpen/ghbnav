FROM node:18-alpine AS builder
ARG SUPABASE_URL
ARG SUPABASE_KEY
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
ENV VITE_PUBLIC_SUPABASE_URL=$SUPABASE_URL
ENV VITE_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY
RUN npm run build
RUN npm prune --production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]