# CourseShelf — Interview Assignment

## Overview

Build a simple full-stack web application called **CourseShelf**. The system allows instructors to manage courses and associated learning materials.

The focus is not on memorization or visual polish. The evaluation targets:
- Effective use of AI tools
- Ability to review and validate generated code
- Understanding of implementation decisions
- Testing discipline

---

## Core Features

### Course Management
- Create a course with:
  - `courseName` (required)
  - `department` (dropdown selection)
  - `term` (validated format)

### Material Management
- Each course contains multiple materials
- Each material includes:
  - `title`
  - `type` (one of):
    - Lecture Notes
    - Assignment
    - Syllabus
    - Other
  - `description`
  - `link` (URL only, no file uploads)

### Dashboard
- View all courses
- Navigate into a course
- Inside a course:
  - View materials
  - Add material
  - Delete material

---

## Validation Rules

- `courseName`: required
- `department`: must be selected from dropdown
- `term`: must match format:
  YYYY[W|S][1|2]

Examples:
- Valid: `2026W1`, `1999S2`
- Invalid: `2020Z1`

---

## Technical Requirements

### Architecture
- Must include:
  - Frontend
  - Backend

### Suggested Stack
- Framework: Next.js or React Router (full-stack)
- Backend options:
  - Next.js API routes
  - Node + Express
- ORM: Prisma (recommended)
- Styling: Tailwind CSS (optional)

### Non-Requirements
- No authentication
- No deployment required
- No advanced UI/UX needed

---

## Testing Requirements

### Unit / Integration Tests
- Minimum: 3 tests
- Framework: Vitest

### End-to-End Tests
- Minimum: 2 tests
- Framework options:
  - Playwright
  - Cypress

### Constraint
- All tests must pass

---

## AI Usage Policy

AI tools are explicitly allowed:
- ChatGPT
- Copilot
- Claude
- Others

Evaluation criteria:
- Ability to explain all code
- Detection of incorrect AI output
- Justification of design decisions
- Awareness of limitations and tradeoffs

Blind usage is penalized.

---

## Deliverables

### GitHub Repository

Must include:

#### 1. Working Application
- Clean folder structure
- Functional frontend and backend

#### 2. Test Suite
- Unit/integration tests
- E2E tests
- Brief description of what each test validates

#### 3. README.md

Must contain:
- Setup instructions
- Short description of approach
- Concise system architecture

---

## Time Constraint

- Expected effort: 4–6 hours
