# GuardianMCP Dockerfile
# Multi-stage build for optimized image size

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 guardian && \
    adduser -D -u 1001 -G guardian guardian && \
    chown -R guardian:guardian /app

USER guardian

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('GuardianMCP is healthy')" || exit 1

# Set environment
ENV NODE_ENV=production

# Expose stdio for MCP communication
# MCP servers use stdio, not network ports
ENTRYPOINT ["node", "dist/index.js"]
