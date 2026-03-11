# Photos Sharing App

A full-stack application for uploading photos and commenting on them.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Ant Design 5
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **File Upload:** Multer (local disk storage)

## Project Structure

```
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── layout.tsx   # Root layout with Ant Design provider
│   │   │   ├── page.tsx     # Home page - photo gallery + upload
│   │   │   └── photos/[id]/ # Photo detail page
│   │   ├── components/      # Reusable UI components
│   │   │   ├── PhotoUpload.tsx
│   │   │   ├── PhotoGallery.tsx
│   │   │   ├── PhotoCard.tsx
│   │   │   └── CommentSection.tsx
│   │   ├── services/        # API client layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   └── package.json
│
├── backend/                 # Express API server
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── app.ts           # Express app setup
│   │   ├── config/          # Environment configuration
│   │   ├── routes/          # Route definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/       # Error handling, file upload
│   │   ├── lib/             # Prisma client singleton
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── uploads/             # Uploaded photos (local dev)
│   └── package.json
│
├── docker-compose.yml       # PostgreSQL container
└── .env.example             # Environment variables template
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd photos-sharing-app
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Set up the Backend

```bash
cd backend
cp ../.env.example .env      # Adjust if needed
npm install
npx prisma migrate dev       # Create database tables
npm run dev                  # Starts on http://localhost:4000
```

### 4. Set up the Frontend

```bash
cd frontend
npm install
npm run dev                  # Starts on http://localhost:3000
```

### 5. Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | /api/photos       | Get all photos + comments |
| GET    | /api/photos/:id   | Get photo by ID           |
| POST   | /api/photos       | Upload a photo            |
| DELETE | /api/photos/:id   | Delete a photo            |
| POST   | /api/comments     | Add comment to a photo    |
| DELETE | /api/comments/:id | Delete a comment          |
| GET    | /api/health       | Health check              |

## Features

- **Photo Upload** — Drag-and-drop or click to upload images (JPEG, PNG, GIF, WebP)
- **Photo Gallery** — View all uploaded photos in a responsive grid
- **Comments** — Add comments to any photo with optional author name
- **Photo Detail** — View a single photo with all its comments
