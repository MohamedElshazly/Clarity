# Clarity

A modern web application for cognitive behavioral therapy (CBT) thought journaling. Clarity helps users track their thoughts, identify cognitive distortions, and monitor emotional patterns over time.

## Features

- **Thought Records** - Capture and analyze situations, automatic thoughts, emotions, and cognitive distortions
- **Emotion Tracking** - Track emotional intensity before and after reflection
- **Pattern Recognition** - Identify recurring cognitive distortions and thinking patterns
- **Personal Dashboard** - View activity streaks, weekly progress, and recent reflections
- **CBT Library** - Reference guide for cognitive distortions with examples and reframes
- **Insights** - Analyze trends and patterns in your thought records
- **Daily Grounding** - Inspirational quotes to support mindfulness and reflection

## Tech Stack

- **Framework**: [Next.js 16.2.2](https://nextjs.org/) with React 19
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with shadcn/ui and Base UI
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- A Supabase account and project

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd clarity
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the SQL migrations in your Supabase SQL editor:

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Run the contents of `supabase/schema.sql`
4. Run the contents of `supabase/add_distortion_slugs.sql`

This will create the necessary tables, triggers, and seed data for cognitive distortions.

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
clarity/
├── app/                    # Next.js app directory
│   ├── (app)/             # Main application routes (protected)
│   │   ├── page.tsx       # Dashboard
│   │   ├── records/       # Thought records
│   │   ├── record/new/    # Create new record
│   │   ├── library/       # CBT distortions library
│   │   └── insights/      # Analytics and insights
│   ├── (auth)/            # Authentication routes
│   │   └── login/         # Login page
│   └── auth/callback/     # OAuth callback handler
├── components/            # Reusable React components
│   ├── ui/               # UI primitives
│   └── skeletons/        # Loading states
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   ├── use-user.ts       # User data hook
│   ├── use-records.ts    # Thought records hooks
│   └── use-dashboard.ts  # Dashboard stats hook
├── lib/                  # Utility functions and configurations
│   ├── data/            # Static data (distortions, quotes)
│   ├── supabase/        # Supabase client and API functions
│   └── utils.ts         # Helper functions
├── supabase/            # Database migrations and schema
└── public/              # Static assets
```

## Key Concepts

### Thought Records

The core feature of Clarity is the thought record, based on CBT principles:

1. **Situation** - What happened?
2. **Automatic Thoughts** - What went through your mind?
3. **Emotions** - How did you feel?
4. **Cognitive Distortions** - What thinking patterns were present?
5. **Alternative Thoughts** - What's a more balanced perspective?
6. **Outcome** - How do you feel now?

### Cognitive Distortions

Clarity includes a library of common cognitive distortions such as:

- All-or-Nothing Thinking
- Overgeneralization
- Mental Filter
- Catastrophizing
- Emotional Reasoning
- And more...

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Architecture Notes

This project uses a specific architecture pattern:

- **API Layer** (`lib/supabase/api/`) - Direct Supabase client calls
- **Hooks Layer** (`hooks/use-*.ts`) - React Query wrappers for API functions
- **Components** - Call hooks only, never API functions directly
- All pages and components that fetch data must use `"use client"`

See `AGENTS.md` and `CLAUDE.md` for detailed development guidelines.

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions, please [open an issue](https://github.com/yourusername/clarity/issues) on GitHub.
