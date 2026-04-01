<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Hooks Layer (/hooks/use-*.ts):

Custom React Query hooks wrapping API functions
Use useUser() to get current user ID when needed
Example:
Components (must be "use client"):

Call hooks, never API functions directly
Handle loading states with isLoading
Example:
Key Rules:
❌ Never await createClient() in components/pages
❌ Never make pages server components for data fetching
✅ All data fetching goes through API → Hook → Component
✅ All pages/components that fetch data must be "use client"
✅ Use refetchOnWindowFocus: false in hooks (already set globally)
