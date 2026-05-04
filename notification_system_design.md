# Notification System Design

## Stage 1

### Overview

The Stage 1 implementation provides a Priority Inbox that fetches campus notifications from the evaluation service API and returns the top N most important unread notifications based on a combination of type weight and recency.

### Priority Logic

Notifications are ranked using a two-factor composite score:

1. **Type Weight (primary sort)**
   - `Placement` → 300
   - `Result` → 200
   - `Event` → 100

   Placement notifications always surface above Results, which always surface above Events, regardless of timestamp.

2. **Recency (tiebreaker)**
   When two notifications share the same type, the more recent one (higher Unix timestamp) ranks higher.

This means a recent Placement will always outrank an older Placement, but any Placement will always outrank any Result or Event.

### Approach

- Fetch all notifications from the API with a valid Bearer token.
- Map each notification to include its computed `_typeScore` and `_timestamp`.
- Sort descending by `_typeScore`, then descending by `_timestamp`.
- Slice the top N results and strip internal scoring fields before returning.

### Handling New Incoming Notifications Efficiently

**Current approach (suitable for low-to-medium volume):**
Re-fetch and re-sort on each call. Since the API is the source of truth and there is no local DB, this is simple and always accurate. Cost: O(M log M) where M is total notifications.

**Efficient approach for high-frequency ingestion (scaling strategy):**

Use a **Min-Heap of size N**:
- Maintain a min-heap keyed on composite score (type weight + recency).
- On each new notification arrival, compute its score.
- If the heap has fewer than N items, push it in.
- If the new notification's score exceeds the heap's minimum (root), pop the root and push the new one.
- The heap always holds the current top N in O(log N) time per insertion.

This avoids re-sorting the entire dataset on every new notification and is ideal when notifications stream in continuously (e.g., via WebSocket or polling).

**For the current stage**, since there is no persistent store and the API returns a full snapshot, the re-fetch + sort approach is used. The min-heap strategy would be integrated in a backend service that maintains state across notification streams.

### Authentication Flow

1. `POST /evaluation-service/register` — one-time registration, returns `clientID` and `clientSecret`.
2. `POST /evaluation-service/auth` — exchange credentials for a Bearer `access_token`.
3. `GET /evaluation-service/notifications` — fetch notifications using `Authorization: Bearer <token>`.

### Logging Middleware

A reusable `Log(stack, level, package, message)` function is integrated throughout the codebase. It POSTs structured log entries to the evaluation service logging endpoint at each significant lifecycle event: registration, authentication, notification fetch, priority computation, and error states. Logging failures are silently caught so they never interrupt the main application flow.
