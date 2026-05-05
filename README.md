# C.A.N.D.Y - TypeScript Project

This is a [Next.js](https://nextjs.org) project with TypeScript, Prisma, and PostgreSQL, optimized for deployment on Vercel.

## Features

- **Authentication**: JWT-based authentication with login, register, and refresh token endpoints
- **Authorization**: Role-based access control (USER/ADMIN)
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API endpoints for users and documents
- **Middleware**: Request proxy with authentication and authorization
- **UI**: Modern UI with Tailwind CSS and Lucide React icons

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/cifuentesalfonso367-dotcom/prueba-de-ts-.git
cd prueba-de-ts-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secrets
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-jwt-secret-here"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-here"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Documents
- `GET /api/documents` - Get user's documents
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document by ID
- `PUT /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

## Deploy on Vercel

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: This project should be pushed to GitHub
3. **Database**: Set up a PostgreSQL database (recommended: Supabase, Neon, or Vercel Postgres)

### Deployment Steps

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   In your Vercel project settings, add these environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `JWT_REFRESH_SECRET`: A secure random string for refresh tokens

3. **Database Setup**:
   - Run Prisma migrations in production:
   ```bash
   npx prisma migrate deploy
   ```
   - Or set up the database schema manually using the Prisma schema

4. **Deploy**:
   - Vercel will automatically build and deploy your application
   - The build command is already configured: `prisma generate && next build`
   - The install command includes: `prisma generate`

### Vercel Configuration

The project includes optimized configuration for Vercel:

- **`vercel.json`**: Custom deployment configuration
- **`next.config.ts`**: Optimized Next.js configuration
- **`prisma.config.ts`**: Database configuration validation

### Post-Deployment

1. **Database Migration**: Run migrations on your production database
2. **Environment Variables**: Verify all environment variables are set
3. **Domain**: Configure custom domain if needed

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Login page
│   │   └── register/       # Register page
│   ├── components/         # React components
│   ├── context/            # React context
│   ├── lib/                # Utility libraries
│   ├── proxy.ts            # Next.js proxy middleware
│   └── types/              # TypeScript types
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── vercel.json             # Vercel deployment config
└── next.config.ts          # Next.js configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.
