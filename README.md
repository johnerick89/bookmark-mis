# Bookmark Management System

A full-stack bookmark management application built with NestJS (backend) and Next.js (dashboard), using Turborepo for monorepo management.

## 📁 Project Structure

```
bookmark-mis/
├── apps/
│   ├── backend/          # NestJS API server
│   └── dashboard/        # Next.js frontend application
├── package.json          # Root package.json with Turborepo scripts
└── turbo.json           # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites

**For Local Development (without Docker):**

- Node.js 18+
- pnpm 10+
- PostgreSQL database (local or remote)

**For Docker Setup:**

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development of dashboard)

### Installation

Install all dependencies for all apps:

```bash
pnpm install:all
```

Or simply:

```bash
pnpm install
```

## 🐳 Setup Options

You can choose to run the application with or without Docker:

- **[Docker Setup](#-docker-setup-recommended)** - Recommended for production and easy development setup
- **[Local Setup](#-local-setup)** - For development without Docker

---

## 🐳 Docker Setup (Recommended)

Docker provides an isolated environment with PostgreSQL database included. Perfect for quick setup and production deployment.

### Quick Start with Docker

1. **Navigate to backend directory:**

   ```bash
   cd apps/backend
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   POSTGRES_DB=bookmark_mis
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3000
   ```

3. **Start services (Backend + Database):**

   ```bash
   docker compose up -d
   ```

   or

   ```bash
   docker compose up -d
   ```

   for mac

   This will:

   - Start PostgreSQL database
   - Build and start the backend
   - Run database migrations automatically
   - Expose backend on port 3000
   - Expose PostgreSQL on port 5432

4. **View logs:**

   ```bash
   docker compose logs -f backend
   ```

   or

   ```bash
   docker compose logs -f backend

   ```

   for mac

   ```

   ```

5. **Seed database (optional):**

   ```bash
   docker compose exec backend pnpm seed
   ```

### Docker Development Setup (Database Only)

For local development where you run the backend outside Docker:

1. **Start only the database:**

   ```bash
   cd apps/backend
   docker compose -f docker compose.dev.yml up -d
   ```

2. **Update your local `.env` in `apps/backend/`:**

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookmark_mis?schema=public
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```

3. **Run migrations and start backend locally:**

   ```bash
   # From project root
   pnpm migrate:dev
   pnpm seed
   pnpm dev:backend
   ```

### Docker Commands

**Start services:**

```bash
docker compose up -d              # Start in background
docker compose up                  # Start with logs
docker compose up --build          # Rebuild and start
```

**Stop services:**

```bash
docker compose down                # Stop services
docker compose down -v             # Stop and remove volumes (⚠️ deletes data)
```

**View logs:**

```bash
docker compose logs -f backend     # Backend logs
docker compose logs -f postgres   # Database logs
docker compose logs               # All logs
```

**Run commands in container:**

```bash
docker compose exec backend pnpm prisma:migrate    # Run migrations
docker compose exec backend pnpm seed              # Seed database
docker compose exec backend sh                    # Access shell
```

**Database access:**

```bash
docker compose exec postgres psql -U postgres -d bookmark_mis
```

### Docker Environment Variables

| Variable            | Description         | Default        |
| ------------------- | ------------------- | -------------- |
| `POSTGRES_USER`     | PostgreSQL username | `postgres`     |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres`     |
| `POSTGRES_DB`       | Database name       | `bookmark_mis` |
| `POSTGRES_PORT`     | PostgreSQL port     | `5432`         |
| `PORT`              | Backend port        | `3000`         |
| `NODE_ENV`          | Node environment    | `production`   |
| `JWT_SECRET`        | JWT secret key      | (required)     |

### Docker Troubleshooting

**Database connection issues:**

```bash
# Check if services are running
docker compose ps

# Check database health
docker compose logs postgres

# Restart services
docker compose restart
```

**Rebuild after code changes:**

```bash
docker compose up -d --build backend
```

**Reset everything:**

```bash
docker compose down -v
docker compose up -d
```

For more Docker details, see [`apps/backend/DOCKER.md`](apps/backend/DOCKER.md)

---

## 💻 Local Setup

For local development without Docker, you'll need a PostgreSQL database running locally or remotely.

### 1. Environment Variables

Create a `.env` file in `apps/backend/` with the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bookmark_mis?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=3000
```

**Note:** If you're using Docker for the database only, use:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookmark_mis?schema=public"
```

### 2. Run Migrations

Apply database migrations:

```bash
pnpm migrate:dev
```

This will:

- Create the database schema
- Run all pending migrations
- Generate Prisma Client

**Production migrations:**

```bash
pnpm migrate
```

**Reset database (⚠️ WARNING: This will delete all data):**

```bash
pnpm migrate:reset
```

### 3. Seed Database

Populate the database with initial tags:

```bash
pnpm seed
```

## 🏗️ Build & Start

### Build All Apps

Build both backend and dashboard:

```bash
pnpm build
```

### Build Individual Apps

**Backend only:**

```bash
pnpm build:backend
```

**Dashboard only:**

```bash
pnpm build:dashboard
```

### Start Applications

**Start all apps in production mode:**

```bash
pnpm start
```

**Start backend only:**

```bash
pnpm start:backend
```

**Start dashboard only:**

```bash
pnpm start:dashboard
```

## 💻 Development

### Run All Apps in Development Mode

```bash
pnpm dev
```

This will start both backend and dashboard with hot-reload enabled.

### Run Individual Apps in Development

**Backend only (port 3000):**

```bash
pnpm dev:backend
```

**Dashboard only (port 3001):**

```bash
pnpm dev:dashboard
```

## 📝 Available Scripts

### Root Level Scripts

| Script                 | Description                           |
| ---------------------- | ------------------------------------- |
| `pnpm install:all`     | Install all dependencies for all apps |
| `pnpm build`           | Build all apps                        |
| `pnpm build:backend`   | Build backend only                    |
| `pnpm build:dashboard` | Build dashboard only                  |
| `pnpm dev`             | Run all apps in development mode      |
| `pnpm dev:backend`     | Run backend in development mode       |
| `pnpm dev:dashboard`   | Run dashboard in development mode     |
| `pnpm start`           | Start all apps in production mode     |
| `pnpm start:backend`   | Start backend in production mode      |
| `pnpm start:dashboard` | Start dashboard in production mode    |
| `pnpm migrate`         | Run database migrations (production)  |
| `pnpm migrate:dev`     | Run database migrations (development) |
| `pnpm migrate:reset`   | Reset database (⚠️ deletes all data)  |
| `pnpm seed`            | Seed database with initial data       |
| `pnpm lint`            | Lint all apps                         |
| `pnpm type-check`      | Type check all apps                   |
| `pnpm test`            | Run tests for all apps                |

### Backend Scripts (apps/backend)

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `pnpm dev`        | Start NestJS in watch mode      |
| `pnpm build`      | Build NestJS application        |
| `pnpm start`      | Start NestJS application        |
| `pnpm start:prod` | Start NestJS in production mode |
| `pnpm seed`       | Run database seed script        |
| `pnpm test`       | Run unit tests                  |
| `pnpm test:e2e`   | Run end-to-end tests            |

### Dashboard Scripts (apps/dashboard)

| Script       | Description                       |
| ------------ | --------------------------------- |
| `pnpm dev`   | Start Next.js in development mode |
| `pnpm build` | Build Next.js application         |
| `pnpm start` | Start Next.js in production mode  |
| `pnpm test`  | Run tests                         |

## 🔧 Configuration

### Backend Configuration

- **Port**: Default `3000` (set via `PORT` env variable)
- **Database**: PostgreSQL (configured via `DATABASE_URL`)
- **JWT Secret**: Required via `JWT_SECRET` env variable

### Dashboard Configuration

- **Port**: Default `3001` (Next.js auto-assigns)
- **API URL**: Set via `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000/api/v1`)

Create `.env.local` in `apps/dashboard/`:

```env
# For local backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# For Docker backend (if running on different port)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📚 API Documentation

Once the backend is running, access Swagger documentation at:

```
http://localhost:3000/api
```

## 🧪 Testing

Run all tests:

```bash
pnpm test
```

Run tests for a specific app:

```bash
cd apps/backend && pnpm test
cd apps/dashboard && pnpm test
```

## 🏃‍♂️ Typical Workflow

### Option A: Docker Workflow

1. **Initial Setup:**

   ```bash
   pnpm install:all
   cd apps/backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start with Docker:**

   ```bash
   docker compose up -d or docker compose up -d
   docker compose exec backend pnpm seed or docker compose exec  backend pnpm seed
   ```

3. **Development (Dashboard locally):**

   ```bash
   # Terminal 1: Dashboard (from project root)
   pnpm dev:dashboard
   ```

4. **View logs:**
   ```bash
   docker compose logs -f backend
   ```

### Option B: Local Workflow

1. **Initial Setup:**

   ```bash
   pnpm install:all
   ```

2. **Database Setup:**

   ```bash
   # Option 1: Use Docker for database only
   cd apps/backend
   docker compose -f docker compose.dev.yml up -d
   cd ../..

   # Option 2: Use local PostgreSQL
   # Ensure PostgreSQL is running locally

   # Then run migrations
   pnpm migrate:dev
   pnpm seed
   ```

3. **Development:**

   ```bash
   # Terminal 1: Backend
   pnpm dev:backend

   # Terminal 2: Dashboard
   pnpm dev:dashboard
   ```

4. **Production Build:**
   ```bash
   pnpm build
   pnpm start
   ```

## 📦 Tech Stack

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack Table
- Axios

### Monorepo

- Turborepo
- pnpm Workspaces

## 🔐 Authentication

The application uses JWT-based authentication:

1. Register a new user at `/auth/register`
2. Login at `/auth/login` to get an access token
3. Use the token in the `Authorization: Bearer <token>` header for protected routes

## 📖 API Endpoints

### Auth

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get current user profile
- `PATCH /api/v1/auth/me` - Update profile
- `POST /api/v1/auth/change-password` - Change password

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user
- `PUT /api/v1/users/:id/activate` - Activate user
- `PUT /api/v1/users/:id/deactivate` - Deactivate user
- `PUT /api/v1/users/:id/block` - Block user
- `PUT /api/v1/users/:id/unblock` - Unblock user
- `DELETE /api/v1/users/:id` - Delete user

### Bookmarks

- `GET /api/v1/bookmarks` - Get all bookmarks
- `GET /api/v1/bookmarks/:id` - Get bookmark by ID
- `POST /api/v1/bookmarks` - Create bookmark
- `PATCH /api/v1/bookmarks/:id` - Update bookmark
- `DELETE /api/v1/bookmarks/:id` - Delete bookmark

### Tags

- `GET /api/v1/tags` - Get all tags
- `GET /api/v1/tags/:id` - Get tag by ID
- `POST /api/v1/tags` - Create tag
- `PATCH /api/v1/tags/:id` - Update tag
- `DELETE /api/v1/tags/:id` - Delete tag

## 🐛 Troubleshooting

### Database Connection Issues

**Docker:**

- Check if database container is running: `docker compose ps`
- View database logs: `docker compose logs postgres`
- Verify `DATABASE_URL` uses service name `postgres` (not `localhost`) in Docker

**Local:**

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running: `pg_isready` or `systemctl status postgresql`
- Check database exists: `psql -U postgres -l`
- Verify connection: `psql $DATABASE_URL`

### Port Already in Use

**Docker:**

- Change port in `.env`: `POSTGRES_PORT=5433` or `PORT=3001`
- Stop conflicting containers: `docker ps` then `docker stop <container-id>`

**Local:**

- Change `PORT` in backend `.env`
- Or kill the process using the port:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

### Migration Issues

**Docker:**

```bash
# Run migrations manually
docker compose exec backend pnpm prisma:migrate

# Reset database (⚠️ deletes data)
docker compose down -v
docker compose up -d
```

**Local:**

```bash
# Reset and re-run migrations
pnpm migrate:reset
pnpm migrate:dev
```

### Docker Build Issues

- Clear Docker cache: `docker compose build --no-cache`
- Rebuild specific service: `docker compose up -d --build backend`
- Check Docker logs: `docker compose logs backend`

### Prisma Client Issues

- Regenerate Prisma Client:

  ```bash
  # Docker
  docker compose exec backend pnpm prisma:generate

  # Local
  pnpm prisma:generate
  ```

## 🏗️ Architectural Decisions

### Folder Structure

The project follows a **monorepo architecture** using Turborepo and pnpm workspaces, which provides several advantages:

**Monorepo Benefits:**

- **Code Sharing**: Shared types, utilities, and configurations across frontend and backend
- **Atomic Changes**: Update both frontend and backend in a single commit
- **Consistent Tooling**: Unified linting, formatting, and build processes
- **Dependency Management**: Single source of truth for package versions
- **Faster Development**: Turborepo caching speeds up builds and tests

**Structure Rationale:**

```
bookmark-mis/
├── apps/
│   ├── backend/          # NestJS API - Domain-driven structure
│   │   ├── src/
│   │   │   ├── auth/      # Authentication module
│   │   │   ├── users/    # User management module
│   │   │   ├── bookmarks/# Bookmark CRUD + ML tagging
│   │   │   └── tags/     # Tag management module
│   │   └── prisma/       # Database schema & migrations
│   └── dashboard/        # Next.js frontend - Feature-based structure
│       └── app/
│           ├── components/# Reusable UI components
│           ├── lib/      # API clients & utilities
│           ├── types/    # Shared TypeScript types
│           └── dashboard/# Feature pages
```

**Backend Structure (NestJS):**

- **Modular Architecture**: Each feature (auth, users, bookmarks, tags) is a self-contained module
- **Separation of Concerns**: Controllers handle HTTP, Services contain business logic, DTOs validate data
- **Dependency Injection**: NestJS DI container for testability and maintainability
- **Prisma Integration**: Database access abstracted through PrismaService

**Frontend Structure (Next.js App Router):**

- **Feature-based Organization**: Pages grouped by feature (dashboard, bookmarks, tags, users)
- **Component Library**: Reusable components in `/components`
- **Type Safety**: Centralized types in `/types` directory
- **API Abstraction**: Service layer in `/lib` for API calls

### Database Choice: PostgreSQL

**Why PostgreSQL?**

1. **Relational Data Model**:

   - Natural fit for user-bookmark-tag relationships
   - Many-to-many relationships between bookmarks and tags
   - Foreign key constraints ensure data integrity

2. **Prisma ORM Integration**:

   - Type-safe database access
   - Automatic migrations
   - Excellent developer experience
   - Strong TypeScript support

3. **Production Ready**:

   - ACID compliance for data consistency
   - Robust indexing for performance
   - Full-text search capabilities (future enhancement)
   - Vector support (via pgvector) for ML embeddings (future enhancement)

4. **Scalability**:
   - Handles concurrent connections well
   - Supports connection pooling
   - Can scale horizontally with read replicas

**Schema Design Decisions:**

- **User Status Enum**: Explicit status management (ACTIVE, INACTIVE, PENDING, BLOCKED)
- **Unique URL Constraint**: Prevents duplicate bookmarks per user
- **Many-to-Many Tags**: Flexible tagging system where bookmarks can have multiple tags
- **Indexes**: Strategic indexes on frequently queried fields (email, user_id, url, status)
- **Embedding Field**: JSON field reserved for future ML vector embeddings

## 🤖 ML Integration Approach

### Current Implementation

The application uses **node-nlp's NlpManager** for automatic tag generation from bookmark content.

**How It Works:**

1. **Content Extraction** (`TaggingService`):

   ```typescript
   - Fetches webpage HTML via axios
   - Uses Mozilla Readability to extract clean, readable text
   - Cleans and normalizes text content
   ```

2. **Tag Generation**:

   ```typescript
   - Uses NlpManager with Named Entity Recognition (NER)
   - Processes text to extract entities
   - Converts entities to tag suggestions
   - Limits to top N tags (default: 5)
   ```

3. **Integration Point**:
   - Automatically called when creating a bookmark
   - ML-generated tags are merged with user-provided tags
   - Tags are normalized (lowercase) and deduplicated

**Current Limitations:**

1. **Untrained Model**:

   - `node-nlp` requires training for accurate tag extraction
   - Currently using zero-shot classification which has limited accuracy
   - Tag quality depends on NER entity recognition, not semantic understanding

2. **Performance**:

   - Synchronous processing can slow down bookmark creation
   - No caching of tag suggestions for similar content
   - No batch processing for multiple bookmarks

3. **Accuracy**:
   - May miss relevant tags or suggest irrelevant ones
   - No context understanding (e.g., "React" vs "react" library)
   - Limited to English language

### Future ML Improvements

**Option 1: Train node-nlp Model**

- **Pros**: Free, runs locally, no API costs
- **Cons**: Requires training data, maintenance overhead
- **Implementation**: Create training dataset from existing bookmarks, train model periodically

**Option 2: OpenAI/Anthropic API**

- **Pros**: High accuracy, semantic understanding, multi-language
- **Cons**: API costs, rate limits, external dependency
- **Implementation**:
  ```typescript
  // Pseudo-code
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Extract 5 relevant tags from this content...",
      },
    ],
  });
  ```

**Option 3: Hybrid Approach**

- Use trained node-nlp for common cases
- Fallback to OpenAI for complex content
- Cache results to reduce API calls

**Option 4: Vector Embeddings**

- Store bookmark content as embeddings (using pgvector)
- Semantic search for similar bookmarks
- Auto-suggest tags from similar bookmarks
- Use models like `@xenova/transformers` for local embeddings

## 🚀 Production Roadmap

### High Priority

#### 1. Enhanced ML Tagging

- [ ] **Train node-nlp model** with bookmark dataset
- [ ] **Implement caching** for tag suggestions
- [ ] **Add fallback mechanism** (ML → manual → default tags)
- [ ] **Consider OpenAI integration** for premium users
- [ ] **Batch processing** for bulk bookmark imports

#### 2. Tag-Bookmark Relationships UI

- [ ] **Tag detail pages** showing all bookmarks with that tag
- [ ] **Tag filtering** on bookmarks page
- [ ] **Tag cloud visualization** with bookmark counts
- [ ] **Related tags** suggestions based on co-occurrence
- [ ] **Tag management** (merge, rename, delete with bookmark updates)

#### 3. User-Specific Bookmarks

- [ ] **User dashboard** showing personal bookmark statistics
- [ ] **Bookmark collections/folders** for organization
- [ ] **Private vs public bookmarks** visibility settings
- [ ] **Bookmark sharing** between users
- [ ] **Export bookmarks** (JSON, CSV, Markdown)

#### 4. Role-Based Access Control (RBAC)

- [ ] **User roles**: Admin, Moderator, User
- [ ] **Permission system**:
  - Admins: Full access (users, bookmarks, tags)
  - Moderators: Manage bookmarks and tags, view users
  - Users: Manage own bookmarks, view public content
- [ ] **Protected routes** with role guards
- [ ] **API endpoint authorization** based on roles
- [ ] **Admin panel** for user management

### Medium Priority

#### 5. Authentication Enhancements

- [ ] **Email verification** on registration
- [ ] **Password reset** functionality
- [ ] **OAuth integration** (Google, GitHub, etc.)
- [ ] **Two-factor authentication (2FA)**
- [ ] **Session management** (active sessions, logout all)

#### 6. Search & Discovery

- [ ] **Full-text search** across bookmarks (PostgreSQL)
- [ ] **Semantic search** using vector embeddings
- [ ] **Advanced filters** (date range, tags, user, status)
- [ ] **Search history** and saved searches
- [ ] **Bookmark recommendations** based on user activity

#### 7. Performance & Scalability

- [ ] **Database query optimization** (indexes, query analysis)
- [ ] **Redis caching** for frequently accessed data
- [ ] **CDN integration** for static assets
- [ ] **API rate limiting** and throttling
- [ ] **Background job processing** (Bull/BullMQ) for ML tasks

#### 8. Analytics & Insights

- [ ] **User activity tracking** (bookmarks created, tags used)
- [ ] **Popular tags** and trending bookmarks
- [ ] **Personal statistics** dashboard
- [ ] **Tag usage analytics** per user
- [ ] **Export analytics** data

### Low Priority / Future Enhancements

#### 9. Advanced Features

- [ ] **Bookmark previews** (screenshots, metadata)
- [ ] **Browser extension** for quick bookmarking
- [ ] **Mobile app** (React Native)
- [ ] **Webhook integrations** (Zapier, IFTTT)
- [ ] **API for third-party integrations**

#### 10. Infrastructure

- [ ] **CI/CD pipeline** (GitHub Actions)
- [ ] **Automated testing** (E2E, integration tests)
- [ ] **Monitoring & logging** (Sentry, DataDog)
- [ ] **Health checks** and uptime monitoring
- [ ] **Database backups** automation

#### 11. Documentation

- [ ] **API documentation** improvements
- [ ] **Developer guide** for contributors
- [ ] **Deployment guides** (Vercel, AWS, etc.)
- [ ] **Architecture diagrams**
- [ ] **Video tutorials**

### Technical Debt

- [ ] **Refactor ML service** for better error handling
- [ ] **Add comprehensive tests** for ML tagging
- [ ] **Improve type safety** in ML service
- [ ] **Optimize database queries** (N+1 problems)
- [ ] **Add request validation** middleware
- [ ] **Implement proper error boundaries** in frontend

## Honesty Declaration

I confirm that this submission is my own work. I have:

- [ ] Not copied code from existing solutions or other candidates
- [ ] Used AI assistants only for syntax help and debugging specific errors
- [ ] Not received human help during the assignment period
- [ ] Built the core logic and architecture myself
- [ ] Cited any references used for specific solutions

## 📄 License

ISC
