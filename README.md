# Full stack Developer Assessment - BuildPass

## How to set up and run Site Diary

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 15.x or higher

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/site-diary.git
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Create a `.env` file from the `.env.example` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL connection details:

```bash
POSTGRES_HOST="your-postgres-host"
POSTGRES_USER="your-username"
POSTGRES_PASSWORD="your-password"
POSTGRES_DB="site-diary or whatever you want"

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}"
```

5. Run the database migration:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000` to see the app.

## Understanding and Approach

When I received this assessment, I started by analyzing what a construction site really needs in a diary system. While the basic requirements asked for date, weather, and image tracking, I researched common site documentation practices and realized that a more detailed record would be valuable. This led me to expand the data model to include visitor tracking, equipment logs, materials used, and delay reporting.

## Technical Decisions and Implementation

I chose tools that would support a complex data structure while allowing rapid development within the 1-2 day timeframe:

### Next.js 15:

Makes building both frontend and backend simple. It automatically handles a lot of performance optimizations and helps create fast-loading pages.

### TypeScript:

Catches errors before they happen and makes it easier to understand the code, especially when working with complex data like diary entries.

### TanStack Query:

Handles all the data fetching and updates automatically. It makes sure users see fresh data without manually refreshing the page.

### Prisma & PostgreSQL:

Makes working with the database straightforward. Prisma prevents common database errors, and PostgreSQL is reliable for storing our diary entries.

### shadcn/ui:

Provides ready-to-use components that look good and work well, saving time on building basic UI elements.

### uploadthing:

Makes handling image uploads simple and reliable.

## Going Beyond Requirements

I expanded the core functionality by adding:

- Advanced search across all entry fields
- Filtering by date, weather, and site location etc.
- Multiple visitor types tracking
- Equipment and material logging
- Delay or issue reporting
- Delete diary entry
- Update diary entry

## Future Improvements

While the foundation is solid, with more time I would add:

- Testing
  - I would start by setting up Jest and writing basic unit tests for the backend API routes to ensure they function correctly.
  - If I had more time, I would expand testing to cover different scenarios, including frontend components and user interactions, using React Testing Library.
- Better performance for lots of entries
  - I would first implement pagination to ensure the app can handle a large number of diary entries without slowing down. Instead of loading everything at once, entries would load in chunks as the user scrolls.
  - If I had more time, I would improve database efficiency by adding indexes to frequently searched fields like dates and titles, reducing query times.
- User accounts and login
  - I would begin by integrating NextAuth.js, BetterAuth or Supabase to allow users to log in with their credential. This would secure the app and ensure that each diary entry belongs to a specific user.
  - If I had more time, I would add custom email/password authentication with password hashing (using bcrypt) and implement session-based authentication.

## How AI helps with development

I primarily use AI for generating mock data, which helps speed up development and testing without manually creating sample entries. It's also incredibly useful for fast bug and error solving, allowing me to quickly identify issues and find solutions without spending too much time debugging. Additionally, I use AI for brainstorming ideas, whether it's optimizing database structures, improving performance, or refining UI/UX decisions. While I don’t rely on AI for writing full implementations, it serves as a great assistant for improving efficiency and validating my approach.
