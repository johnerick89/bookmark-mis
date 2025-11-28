# Docker Setup for Backend

This directory contains Docker configuration for running the backend application with PostgreSQL database.

## Files

- `Dockerfile` - Multi-stage build for the NestJS backend
- `docker-compose.yml` - Production setup with backend and PostgreSQL
- `docker-compose.dev.yml` - Development setup (database only)
- `.dockerignore` - Files to exclude from Docker build context

## Quick Start

### Production Setup (Backend + Database)

1. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your configuration:

   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   POSTGRES_DB=bookmark_mis
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3000
   ```

2. **Start services:**

   ```bash
   docker-compose up -d
   ```

   for windows/linux

   or

   ```
   docker compose up -d
   ```

   for mac setups

   This will:
   - Start PostgreSQL database
   - Build and start the backend
   - Run database migrations automatically
   - Expose backend on port 3000
   - Expose PostgreSQL on port 5432

3. **View logs:**

   ```bash
   docker-compose logs -f backend
   ```

4. **Stop services:**

   ```bash
   docker-compose down
   ```

### Development Setup (Database Only)

For local development where you run the backend outside Docker:

1. **Start only the database:**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Update your local `.env`:**

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookmark_mis?schema=public
   ```

3. **Run migrations and start backend locally:**

   ```bash
   pnpm migrate:dev
   pnpm dev
   ```

## Docker Commands

### Build

```bash
# Build the backend image
docker-compose build backend

# Build without cache
docker-compose build --no-cache backend
```

### Run

```bash
# Start all services
docker-compose up -d

# Start and view logs
docker-compose up

# Start specific service
docker-compose up -d postgres
```

### Stop

```bash
# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### Logs

```bash
# View all logs
docker-compose logs

# View backend logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f postgres
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d bookmark_mis

# Or from host
psql -h localhost -p 5432 -U postgres -d bookmark_mis
```

### Run Commands in Container

```bash
# Run migrations manually
docker-compose exec backend pnpm prisma:migrate

# Run seed
docker-compose exec backend pnpm seed

# Access shell
docker-compose exec backend sh
```

## Environment Variables

| Variable            | Description                     | Default          |
| ------------------- | ------------------------------- | ---------------- |
| `POSTGRES_USER`     | PostgreSQL username             | `postgres`       |
| `POSTGRES_PASSWORD` | PostgreSQL password             | `postgres`       |
| `POSTGRES_DB`       | Database name                   | `bookmark_mis`   |
| `POSTGRES_PORT`     | PostgreSQL port                 | `5432`           |
| `PORT`              | Backend port                    | `3000`           |
| `NODE_ENV`          | Node environment                | `production`     |
| `JWT_SECRET`        | JWT secret key                  | (required)       |
| `DATABASE_URL`      | Full database connection string | (auto-generated) |

## Volumes

- `postgres_data` - Persistent storage for PostgreSQL data
- Data persists across container restarts
- To reset: `docker-compose down -v`

## Networking

- Services communicate via `bookmark-network` bridge network
- Backend connects to database using service name `postgres`
- Ports exposed to host for external access

## Health Checks

- **PostgreSQL**: Checks if database is ready to accept connections
- **Backend**: HTTP health check on `/health` endpoint

## Troubleshooting

### Database Connection Issues

```bash
# Check if database is healthy
docker-compose ps

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Migration Issues

```bash
# Run migrations manually
docker-compose exec backend pnpm prisma:migrate

# Reset database (⚠️ deletes data)
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

```bash
# Change port in .env
POSTGRES_PORT=5433
PORT=3001
```

### Rebuild After Code Changes

```bash
# Rebuild and restart
docker-compose up -d --build backend
```

## Production Considerations

1. **Security:**
   - Change default passwords
   - Use strong JWT_SECRET
   - Don't expose database port publicly
   - Use secrets management

2. **Performance:**
   - Adjust PostgreSQL memory settings
   - Use connection pooling
   - Enable query logging for debugging

3. **Backup:**
   - Regular database backups
   - Volume snapshots
   - Migration versioning

4. **Monitoring:**
   - Health check endpoints
   - Log aggregation
   - Resource usage monitoring
