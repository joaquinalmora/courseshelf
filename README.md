# CourseShelf

CourseShelf is a full-stack web app for managing courses and their learning materials. Instructors can create courses, browse all courses on a dashboard, open a course, and add or delete linked materials.

## Stack

- Next.js App Router for the frontend and backend routes
- Prisma with SQLite for persistence
- Vitest for unit tests
- Playwright for end-to-end tests

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

3. Apply the database schema:

   ```bash
   npm run db:migrate
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Testing

- `npm run test:run` runs the Vitest suite.
- `npm run e2e` runs the Playwright suite.

### Test coverage summary

- `tests/unit/validation.test.ts` validates the required course and material rules.
- `tests/unit/constants.test.ts` validates the fixed dropdown values and term pattern used by the forms.
- `tests/unit/route-helpers.test.ts` validates route parameter parsing for numeric ids.
- `tests/e2e/dashboard/dashboard.spec.ts` validates the main instructor workflow from the browser.

## Architecture

- `app/` contains the Next.js pages and API route handlers.
- `lib/` contains validation, Prisma access, and shared constants.
- `prisma/` contains the database schema and migrations.
- `tests/` contains unit and end-to-end tests.

## Approach

I used a single Next.js application so the frontend and backend live in one repo and share validation rules. Prisma and SQLite keep the persistence layer simple enough for a take-home project while still giving a real relational model.
