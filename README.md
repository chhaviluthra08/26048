# Campus Notification Platform

A full-stack campus notification system that delivers real-time updates for Placements, Events, and Results. Built as part of a multi-stage assignment.

---

## Repository Structure

```
├── logging_middleware/         Reusable logging package
├── notification_app_be/        Stage 1 — Priority Inbox backend logic
│   └── priorityInbox.js
├── notification_app_fe/        Stage 2 — React/Next.js frontend
├── notification_system_design.md
└── .gitignore
```

---

## Stage 1 — Priority Inbox

Fetches notifications from the evaluation service API and returns the top N most important notifications ranked by type weight and recency.

**Priority order:** Placement > Result > Event  
**Tiebreaker:** More recent notifications rank higher within the same type

**Run:**
```bash
cd notification_app_be
node priorityInbox.js
```

---

## Stage 2 — Frontend

A responsive Next.js application with Material UI that displays all notifications and a priority inbox.

**Pages:**
- `/` — Login with Bearer token
- `/notifications` — All notifications with type filter and pagination
- `/priority` — Priority inbox with configurable top-N and type filter

New vs viewed notifications are distinguished via frontend state. Viewed state is cleared on page refresh.

**Run:**
```bash
cd notification_app_fe
npm install
npm run dev
```

Open `http://localhost:3000` and paste your Bearer token to access the dashboard.

---

## Authentication

Credentials are obtained via the evaluation service:

1. Register at `POST /evaluation-service/register`
2. Get a token at `POST /evaluation-service/auth`
3. Paste the Bearer token into the login screen

Tokens are stored in `sessionStorage` and cleared on tab close.

---

## Tech Stack

- **Backend:** Node.js (vanilla JS, no dependencies)
- **Frontend:** Next.js 16, React, Material UI v6
- **Auth:** Bearer token via evaluation service API
- **Logging:** Custom middleware integrated throughout
