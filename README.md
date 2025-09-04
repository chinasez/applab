Simple CRM — Next.js + Supabase

A lightweight CRM system built with Next.js and Supabase, using client-side rendering (CSR). Focused on simplicity and fast integration. The project is in progress — core features are ready, remaining tasks include auth and a public landing page.

⚙️ Tech Stack
	•	Next.js (App Router, CSR only)
	•	React 18
	•	Supabase (Auth, DB, Realtime)
	•	PostgreSQL
	•	Tailwind CSS (optional)
	•	TypeScript

Project Structure

/src
 ├─ /app              → App Router structure
 │   ├─ /auth         → Authentication pages (WIP)
 │   ├─ /dashboard    → Main dashboard and routing
 │   └─ layout.tsx    → Root layout
 ├─ /components       → UI components
 ├─ /hooks            → Custom React hooks
 │   ├─ useCollection.tsx
 │   ├─ useDebounce.tsx
 │   └─ useProjects.tsx
 ├─ /services         → API/service layer (e.g. projectService.ts)
 └─ /types            → Type definitions

Current Features
	•	Dashboard structure
	•	Dynamic project pages (/dashboard/[projectId])
	•	Reusable project-related hooks
	•	Supabase Auth (Sign in / Sign up)
	•	Public landing page
	•	Route protection for private pages

---Dependencies---

# Core
next
react
typescript

# Supabase
@supabase/supabase-js

# UI
antd

# (Optional)
tailwindcss

---

Getting Started

git clone https://github.com/your-username/simple-crm.git
cd simple-crm

npm install

Create a .env.local file in the root:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

npm run dev

Go to http://localhost:3000

