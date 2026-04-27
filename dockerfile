# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace configuration
COPY package*.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install all dependencies
RUN npm ci

# Copy source files
COPY apps/ ./apps/
COPY tsconfig.base.json ./

# Build both server and web app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy workspace configuration
COPY package*.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install production dependencies only
RUN npm ci --omit=dev --workspace=@forward/server

# Copy built artifacts
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/web/build ./apps/web/build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["npm", "start"]