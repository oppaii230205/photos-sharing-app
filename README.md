# PhotoBoard

> A full-stack photo-sharing application — take-home assignment for Qode's Full Stack Engineer role.

Users can upload photos, browse the community gallery, and leave comments on any photo. Built with Next.js 15, Express, Prisma, and PostgreSQL, all containerised for a one-command local setup.

---

## Live Demo

**Note**: The application is deployed on Render's free tier. Since free services may go to sleep after about 15 minutes of inactivity, the first API request might take a bit longer while the server wakes up. Thank you for your understanding.

| Service     | URL                                           |
| ----------- | --------------------------------------------- |
| Frontend    | _https://photos-sharing-app-nine.vercel.app/_ |
| Backend API | _https://photos-sharing-app.onrender.com_     |

---

## Assignment Requirements — What Was Delivered

| #   | Requirement                           | Status | Notes                                                         |
| --- | ------------------------------------- | ------ | ------------------------------------------------------------- |
| 1   | Next.js frontend                      | ✅     | Next.js 15 App Router with TypeScript                         |
| 2   | Ant Design UI library                 | ✅     | Ant Design 5 with full React 19 compatibility patch           |
| 3   | Node.js backend                       | ✅     | Express 4 with TypeScript, ES2020 target                      |
| 4   | Prisma ORM                            | ✅     | Prisma 6 with typed `PrismaClient` singleton                  |
| 5   | PostgreSQL database                   | ✅     | Postgres 16 via Docker Compose, one-command startup           |
| 6   | Upload a photo                        | ✅     | Drag-and-drop or click, with optional caption                 |
| 7   | Add a comment to a photo              | ✅     | Optional author name, defaults to "Anonymous"                 |
| 8   | Display all photos and their comments | ✅     | Gallery grid on home page; full comment thread on detail page |

---

## Beyond Requirements — Technical Highlights

The following features were implemented beyond the stated scope to demonstrate production-quality thinking:

### Backend Engineering

- **Persistent cloud storage via Cloudinary** — Images are forwarded from memory (no disk writes) to a Cloudinary proxy service, so uploads survive server restarts and deploys. Multer is configured with `memoryStorage` to keep the pipeline stateless.
- **Structured error hierarchy** — A custom `AppError` base class with `isOperational` flag distinguishes user-facing errors (`NotFoundError` 404, `BadRequestError` 400, `ConflictError` 409) from unexpected programming errors (500). The global `errorHandler` middleware treats each class differently and hides stack traces in production.
- **Uniform API response envelope** — Every response (success and error) follows the same `{ success, message, httpCode, data }` shape via `ApiResponse`, making frontend error handling predictable.
- **`catchAsync` wrapper** — All async route handlers are wrapped so rejected promises are forwarded to Express's `next()` without try/catch boilerplate in every controller.
- **Cursor-safe pagination** — `parsePagination` reads `?page` and `?limit` from the query string with sensible defaults (page 1, limit 12, max 100) and bounds-clamping. Both `findAll` runs its `findMany` and `count` in a `Promise.all` parallel call.
- **Cascade deletes** — The Prisma schema sets `onDelete: Cascade` on the `Comment → Photo` relation plus an `@@index([photoId])` for query performance.
- **Graceful shutdown** — `SIGINT`/`SIGTERM` handlers close the HTTP server and disconnect Prisma before `process.exit(0)`.
- **Prisma singleton** — The `lib/prisma.ts` singleton uses `globalThis` to prevent multiple `PrismaClient` instances during hot-reloads in development.
- **HTTP logging** — Morgan uses `"combined"` format in production and `"dev"` in development.

### Frontend Engineering

- **React 19 + Ant Design 5** — Applied `@ant-design/v5-patch-for-react-19` and `AntdRegistry` for SSR-safe CSS-in-JS; uses `App.useApp()` for imperative `message` and `modal` APIs instead of deprecated static methods.
- **Photo detail side-by-side layout** — `/photos/:id` renders a two-panel Instagram-style layout: full-size photo on the left, scrollable comment thread + sticky composer on the right, with graceful stacking on mobile.
- **Drag-and-drop upload with preview** — The drop zone transitions to a preview/composer state on file selection. A `URL.createObjectURL` thumbnail is shown locally; `URL.revokeObjectURL` is called on reset to prevent memory leaks.
- **Double-layer file validation** — File MIME type and 5 MB size are validated client-side before the network request fires, and again server-side in the Multer `fileFilter`.
- **Skeleton loading states** — The gallery renders 6 animated skeleton cards while the first fetch is in flight, preventing layout shift.
- **DiceBear avatars** — `getAvatarUrl(author)` generates a unique SVG avatar from `https://api.dicebear.com/9.x/initials/svg?seed=...` for each comment author.
- **Relative timestamps** — `formatTimeAgo` computes human-readable relative times ("just now", "3m ago", "2d ago", "1mo ago") without any date library.
- **Keyboard shortcut** — Pressing `Enter` inside the comment input submits the form (Shift+Enter is excluded).
- **Lazy image loading** — All gallery images use `loading="lazy"` to defer off-screen fetches.
- **`refreshKey` pattern** — After a successful upload, the home page increments a `refreshKey` state which is spread as the `key` prop on `<PhotoGallery>`, forcing a clean remount and re-fetch without prop drilling.
- **Optimistic UI updates** — New comments are appended to local state immediately after a successful POST, without a round-trip refetch.

---

## Tech Stack

| Layer                | Technology              | Version     |
| -------------------- | ----------------------- | ----------- |
| Frontend framework   | Next.js (App Router)    | 15.x        |
| Frontend language    | TypeScript              | 5.7         |
| UI component library | Ant Design              | 5.x         |
| Styling              | Tailwind CSS            | 3.x         |
| HTTP client          | Axios                   | 1.7         |
| Backend framework    | Express                 | 4.x         |
| Backend language     | TypeScript (strict)     | 5.7         |
| ORM                  | Prisma                  | 6.x         |
| Database             | PostgreSQL              | 16 (Docker) |
| File upload          | Multer (memory storage) | 1.4.5       |
| Cloud storage        | Cloudinary (via proxy)  | —           |
| Dev server           | ts-node-dev             | 2.x         |
| Container            | Docker Compose          | v3.8        |

---

## Architecture

### 1. System Overview

```mermaid
graph TB
    subgraph Browser["Browser · localhost:3000"]
        UI["Next.js 15 App Router"]
    end

    subgraph FE["Frontend Layer"]
        Pages["Pages: / and /photos/[id]"]
        Components["PhotoGallery · PhotoCard · PhotoUpload · CommentSection"]
        Services["photoApi · commentApi"]
        HTTP["Axios · baseURL /api/v1"]
        Pages --> Components --> Services --> HTTP
    end

    subgraph BE["Backend · localhost:4000"]
        Router["/api/v1 Router"]
        MW["cors · morgan · multer"]
        Controllers["PhotoController · CommentController"]
        Svcs["PhotoService · CommentService · CloudinaryService"]
        ORM["Prisma Client (singleton)"]
        Router --> MW --> Controllers --> Svcs --> ORM
    end

    subgraph Infra["Infrastructure"]
        PG[("PostgreSQL · Docker :5432")]
        CDN["Cloudinary Proxy (External)"]
    end

    UI --> HTTP
    HTTP -- "REST / JSON" --> Router
    ORM --> PG
    Svcs -- "multipart upload" --> CDN
```

---

### 2. Backend Request Pipeline

```mermaid
graph LR
    REQ["Incoming Request"] --> C1["cors()"]
    C1 --> C2["morgan()"]
    C2 --> C3["express.json()"]
    C3 --> ROUTER["/api/v1"]

    ROUTER --> P["/photos"]
    ROUTER --> CM["/comments"]
    ROUTER --> H["/health"]

    P --> PC["PhotoController"]
    CM --> CC["CommentController"]

    PC --> PS["PhotoService"]
    CC --> CS["CommentService"]
    PS --> CLS["CloudinaryService"]

    PS --> DB[("Prisma → PostgreSQL")]
    CS --> DB
    CLS --> EXT["Cloudinary Proxy"]

    ROUTER --> NF["notFoundHandler"]
    NF --> EH["errorHandler"]

    style H fill:#d4edda,stroke:#28a745
    style EH fill:#f8d7da,stroke:#dc3545
    style DB fill:#cce5ff,stroke:#004085
    style EXT fill:#fff3cd,stroke:#856404
```

---

### 3. Database Schema

```mermaid
erDiagram
    Photo {
        string   id           PK "uuid, auto-generated"
        string   originalName    "original file name"
        string   url             "Cloudinary image URL"
        string   caption         "optional"
        datetime createdAt       "auto"
        datetime updatedAt       "auto"
    }

    Comment {
        string   id       PK "uuid, auto-generated"
        string   content
        string   author      "default: Anonymous"
        string   photoId  FK "indexed"
        datetime createdAt  "auto"
        datetime updatedAt  "auto"
    }

    Photo ||--o{ Comment : "has many (cascade delete)"
```

---

### 4. Photo Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js (Browser)
    participant API as Express API :4000
    participant MW as Multer Middleware
    participant SVC as PhotoService
    participant CLD as Cloudinary Proxy
    participant DB as PostgreSQL

    User->>UI: Drop or select image + optional caption
    UI->>UI: Validate MIME type and file size <= 5 MB (client-side)
    UI->>API: POST /api/v1/photos (multipart/form-data, field: "photo")

    API->>MW: upload.single("photo")
    MW->>MW: Validate MIME type and size <= 5 MB
    alt invalid file
        MW-->>API: BadRequestError 400
        API-->>UI: 400 error response
    end

    MW->>SVC: req.file buffer + caption

    SVC->>CLD: POST multipart { id: timestamp, image: buffer }
    CLD-->>SVC: { code: 1000, result: { image: "https://..." } }

    SVC->>DB: prisma.photo.create { url, originalName, caption }
    DB-->>SVC: Photo record
    SVC-->>API: Photo with comments: []
    API-->>UI: 201 Created { success: true, data: Photo }
    UI->>UI: Increment refreshKey to remount PhotoGallery
```

---

### 5. Browse & Comment Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js (Browser)
    participant API as Express API :4000
    participant DB as PostgreSQL

    User->>UI: Visit home page /
    UI->>API: GET /api/v1/photos?page=1&limit=12
    API->>DB: photo.findMany (with _count.comments) + photo.count in parallel
    DB-->>API: photos array + total count
    API-->>UI: 200 { items: [...], meta: { page, totalPages, ... } }
    UI->>UI: Render responsive 1-3 column gallery grid

    User->>UI: Click "Load more photos"
    UI->>API: GET /api/v1/photos?page=2&limit=12
    API-->>UI: 200 next page
    UI->>UI: Append cards to existing grid

    User->>UI: Click a photo card
    UI->>API: GET /api/v1/photos/:id
    API->>DB: photo.findUnique with comments ordered ASC
    DB-->>API: PhotoDetail + Comment[]
    API-->>UI: 200 { data: PhotoDetail }
    UI->>UI: Render side-by-side detail layout with CommentSection

    User->>UI: Type comment and click Post (or press Enter)
    UI->>API: POST /api/v1/comments { photoId, content, author }
    API->>DB: Validate photo exists, then comment.create
    DB-->>API: New Comment
    API-->>UI: 201 { data: Comment }
    UI->>UI: Append comment to list (optimistic update)

    User->>UI: Hover comment and click delete
    UI->>API: DELETE /api/v1/comments/:id
    API->>DB: comment.delete
    API-->>UI: 204 No Content
    UI->>UI: Remove comment from local state
```

---

### 6. Frontend Component Tree

```mermaid
graph TD
    Layout["RootLayout (layout.tsx)"]
    Layout --> Header["Header — sticky nav with logo"]
    Layout --> Main["main — max-w-6xl centered"]
    Layout --> Footer["Footer — branding and year"]

    Main --> Home["HomePage (page.tsx)"]
    Main --> Detail["PhotoDetailPage (/photos/[id]/page.tsx)"]

    Home --> Upload["PhotoUpload — drag-drop zone and preview composer"]
    Home --> Gallery["PhotoGallery — paginated grid with skeleton loading"]
    Gallery --> Card["PhotoCard — image, caption, time, comment count, delete"]

    Detail --> CommentSection["CommentSection — scrollable list, load more, sticky composer"]

    style Layout fill:#e8eaf6,stroke:#3f51b5
    style Header fill:#fce4ec,stroke:#e91e63
    style Footer fill:#fce4ec,stroke:#e91e63
    style Upload fill:#e8f5e9,stroke:#4caf50
    style Gallery fill:#e8f5e9,stroke:#4caf50
    style Card fill:#e8f5e9,stroke:#4caf50
    style CommentSection fill:#fff8e1,stroke:#ff9800
```

---

## Project Structure

```
QodeProject/
├── docker-compose.yml               # PostgreSQL 16 container
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # Photo + Comment models, cascade delete
│   │   └── migrations/              # Versioned SQL migrations
│   └── src/
│       ├── index.ts                 # Entry point, PORT 4000, graceful shutdown
│       ├── app.ts                   # Express app, middleware stack
│       ├── config/index.ts          # Typed env config (PORT, DATABASE_URL, CLOUDINARY_UPLOAD_URL)
│       ├── constants/httpStatus.ts  # HTTP status code constants with TypeScript const assertion
│       ├── routes/                  # photo.routes.ts · comment.routes.ts · index.ts (health)
│       ├── controllers/             # PhotoController · CommentController (catchAsync wrapped)
│       ├── services/                # PhotoService · CommentService · CloudinaryService
│       ├── middleware/              # upload.ts (multer) · errorHandler.ts · notFoundHandler.ts
│       ├── lib/                     # prisma.ts · apiResponse.ts · errors.ts · catchAsync.ts · pagination.ts
│       └── types/                   # Shared TypeScript interfaces
│
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.tsx               # AntdRegistry, ConfigProvider (indigo theme), Inter font
        │   ├── page.tsx                 # Home: PhotoUpload + PhotoGallery with refreshKey
        │   └── photos/[id]/page.tsx     # Detail: side-by-side photo + CommentSection
        ├── components/
        │   ├── Header.tsx               # Sticky frosted-glass nav bar
        │   ├── Footer.tsx               # Simple branding footer
        │   ├── PhotoUpload.tsx          # Two-state: drop zone / preview+caption composer
        │   ├── PhotoGallery.tsx         # Responsive grid, load-more pagination, skeleton states
        │   ├── PhotoCard.tsx            # Hover-reveal delete, lazy image, comment count badge
        │   └── CommentSection.tsx       # DiceBear avatars, load-more, sticky composer, Enter shortcut
        ├── services/
        │   ├── apiClient.ts             # Axios instance, baseURL from NEXT_PUBLIC_API_URL
        │   ├── photoApi.ts              # getAll · getById · upload · delete
        │   └── commentApi.ts            # getByPhotoId · create · delete
        ├── types/index.ts               # ApiResponse, PaginatedData, PhotoListItem, PhotoDetail, Comment
        └── lib/utils.ts                 # formatTimeAgo · getAvatarUrl (DiceBear)
```

---

## Running Locally

### Prerequisites

- **Node.js** 18 or higher
- **Docker** and **Docker Compose** (for PostgreSQL)
- **npm** (included with Node.js)

### Step 1 — Clone the repository

```bash
git clone https://github.com/oppaii230205/photos-sharing-app
cd photos-sharing-app
```

### Step 2 (Optional if using hosted PostgreSQL) — Start PostgreSQL

```bash
docker-compose up -d
```

This starts a Postgres 16 container on port `5432` with:

- User: `postgres`
- Password: `postgres`
- Database: `photos_app`
- Named volume `pgdata` for persistence between restarts

### Step 3 — Configure and start the backend

```bash
cd backend
```

Create a `.env` file (copy from the example or create it manually):

```bash
# backend/.env
PORT=4000

DATABASE_URL="postgresql://
postgres:postgres@localhost:5432/photos_app"
# Or use my hosted Postgres if you don't want to set up Docker:
#DATABASE_URL=postgresql://postgres.uidmvdvdvmsfrrdmxcpf:hXOH4sLjID3yLJgU@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres


NODE_ENV=development

# The Cloudinary proxy URL is already set to a public instance, but you can replace it with your own if desired.
CLOUDINARY_UPLOAD_URL=https://file-service-cdal.onrender.com/api/v1/file/uploads
```

Install dependencies, run migrations, and start the dev server:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

The API is now running at `http://localhost:4000`.
You can verify with: `curl http://localhost:4000/api/v1/health`

> **Other useful backend scripts**
> | Script | Command |
> |---|---|
> | Build production bundle | `npm run build` |
> | Start production server | `npm run start` |
> | Open Prisma Studio | `npm run prisma:studio` |

### Step 4 — Configure and start the frontend

Open a new terminal tab:

```bash
cd frontend
```

Create a `.env.local` file:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app is now running at `http://localhost:3000`.

> **Other useful frontend scripts**
> | Script | Command |
> |---|---|
> | Build for production | `npm run build` |
> | Start production server | `npm run start` |
> | Run ESLint | `npm run lint` |

### Step 5 — Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Photos

| Method   | Path          | Body / Query                                 | Response | Description                                       |
| -------- | ------------- | -------------------------------------------- | -------- | ------------------------------------------------- |
| `GET`    | `/photos`     | `?page=1&limit=12`                           | `200`    | Paginated photo list with comment counts          |
| `GET`    | `/photos/:id` | —                                            | `200`    | Single photo including full comments array        |
| `POST`   | `/photos`     | `multipart: photo (file), caption? (string)` | `201`    | Upload a photo to Cloudinary and persist metadata |
| `DELETE` | `/photos/:id` | —                                            | `204`    | Delete photo and all its comments (cascade)       |

### Comments

| Method   | Path                       | Body / Query                    | Response | Description                                          |
| -------- | -------------------------- | ------------------------------- | -------- | ---------------------------------------------------- |
| `GET`    | `/comments/photo/:photoId` | `?page=1&limit=20`              | `200`    | Paginated comments for a photo, ordered oldest-first |
| `POST`   | `/comments`                | `{ photoId, content, author? }` | `201`    | Add a comment; `author` defaults to "Anonymous"      |
| `DELETE` | `/comments/:id`            | —                               | `204`    | Delete a single comment                              |

### Health

| Method | Path      | Response               |
| ------ | --------- | ---------------------- |
| `GET`  | `/health` | `200 { status: "ok" }` |

### Response Envelope

Every endpoint (success and error) returns this shape:

```json
{
  "success": true,
  "message": "Photos retrieved successfully",
  "httpCode": 200,
  "data": { ... }
}
```

### Pagination

```json
{
  "items": [ ... ],
  "meta": {
    "page": 1,
    "limit": 12,
    "totalItems": 42,
    "totalPages": 4
  }
}
```

### Error responses

```json
{
  "success": false,
  "message": "Photo not found",
  "httpCode": 404,
  "data": null
}
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                | Default                                                      | Required | Description                              |
| ----------------------- | ------------------------------------------------------------ | -------- | ---------------------------------------- |
| `PORT`                  | `4000`                                                       | No       | Express server port                      |
| `DATABASE_URL`          | —                                                            | **Yes**  | Postgres connection string               |
| `NODE_ENV`              | `development`                                                | No       | Controls logging format and error detail |
| `CLOUDINARY_UPLOAD_URL` | `https://file-service-cdal.onrender.com/api/v1/file/uploads` | No       | Cloudinary proxy endpoint                |

### Frontend (`frontend/.env.local`)

| Variable              | Default                        | Required | Description          |
| --------------------- | ------------------------------ | -------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api/v1` | No       | Backend API base URL |
