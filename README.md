# HypeShelf
> Collect and share the stuff you're hyped about.

## Live Demo
[hypeshelf-igor-bryan.vercel.app](https://hypeshelf-igorbryan-igorbryans-projects.vercel.app?_vercel_share=6k3889DfhEZElHzhIGG2tPxWEoxXbH2a)

## Stack
- **Next.js 15** (App Router)
- **Clerk** — authentication with Google
- **Convex** — reactive backend + real-time database
- **TypeScript** — strict end-to-end type safety
- **Tailwind CSS v4**

## Features
- Public page with the latest recommendations (no login required)
- Google and Apple login via Clerk
- Add recommendations with title, genre, link, and blurb
- Real-time genre filtering
- RBAC: admins can delete any rec and mark one as Staff Pick
- Users can create and delete only their own recs
- Confirmation modal before deleting
- Responsive dark mode layout

## Technical Decisions

### Role-Based Access Control (RBAC)
Roles `admin` and `user` are stored in the `users` table on Convex.
Validation happens **on the backend** (inside mutations), never
on the frontend alone — preventing bypassing permission rules.

### Security
- No mutation accepts requests without a verified identity
  using `ctx.auth.getUserIdentity()`
- The `admin` role can only be assigned manually in the database,
  with no endpoint exposed
- The public page is for read-only and exposes no sensitive data

### Real-time
Convex queries are all connected clients update automatically
without polling or manual refresh.

### Authentication
Clerk handles authentication and issues JWT tokens. Convex
validates those tokens server-side via the configured JWT issuer,
ensuring every authenticated request is traceable to a real user.

## Running Locally
1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your keys
3. `npm install`
4. `npx convex dev` (first terminal)
5. `npm run dev` (second terminal)
6. Open http://localhost:3000

## Environment Variables
| Variable | Description |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk JWT issuer domain |

## Known Issues
- A "middleware file convention deprecated" warning may appear
  in the console when running with Turbopack. This is a known
  false positive caused by a compatibility issue between
  Turbopack and `@clerk/nextjs`, with no impact on functionality.
  Ref: https://nextjs.org/docs/messages/middleware-to-proxy
