FROM node:18-alpine AS builder
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG HOST_ORIGIN
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
# FIXME
# If set (or changed) in docker run -> 404 on any +page content (+layout works fine...)
# If not set -> login and logout fails
# If set before the image creation and matches the real url -> everything works
ENV ORIGIN=http://localhost:3000 
ENV NODE_ENV=production
CMD [ "node", "build" ]