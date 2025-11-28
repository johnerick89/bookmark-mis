# Multi-stage build for NestJS backend

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.24.0

# Copy root package files for workspace setup
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy backend package files
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma/

# Install dependencies (workspace-aware)
RUN pnpm install --frozen-lockfile --filter backend

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.24.0

# Copy root package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy backend source code
COPY apps/backend ./apps/backend

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN pnpm prisma:generate

# Build the application
RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.24.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy root package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy backend package files
COPY apps/backend/package.json ./apps/backend/

# Install only production dependencies
WORKDIR /app
RUN pnpm install --prod --frozen-lockfile --filter backend

# Copy built application from builder
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/generated ./apps/backend/generated

# Switch to backend directory
WORKDIR /app/apps/backend

# Switch to non-root user
USER nestjs
ENV NODE_ENV=production
# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]

