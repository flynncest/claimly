# Claimly — Find what you're owed

AI-powered government benefits eligibility finder for expats and HR departments in the Netherlands and Belgium.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **AI**: Anthropic Claude API (`claude-sonnet-4-0`)
- **Database/Auth**: Supabase (auth + session storage)
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd claimly
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase — get from https://supabase.com/dashboard/project/<your-project>/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic — get from https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-...

# App URL (for auth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Email Auth** and **Google OAuth** under Authentication > Providers
3. For Google OAuth, set the redirect URL to `https://your-project.supabase.co/auth/v1/callback`
4. Copy the project URL and anon key into your `.env.local`

Optional: create a `scan_results` table to persist results:

```sql
create table scan_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  scan_data jsonb not null,
  results jsonb not null,
  created_at timestamptz default now()
);

alter table scan_results enable row level security;
create policy "Users can view their own results"
  on scan_results for select using (auth.uid() = user_id);
create policy "Users can insert their own results"
  on scan_results for insert with check (auth.uid() = user_id);
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel
```

Set all environment variables in the Vercel dashboard under your project settings.

## Project Structure

```
claimly/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles, animations
│   ├── scan/
│   │   ├── page.tsx        # Multi-step onboarding form (8 steps)
│   │   ├── analyzing/      # Loading screen while AI processes
│   │   └── results/        # Benefits report
│   ├── hr/
│   │   ├── page.tsx        # HR teams landing page
│   │   └── dashboard/      # HR admin dashboard (auth required)
│   ├── login/              # Auth page (email, Google, magic link)
│   ├── pricing/            # Standalone pricing page
│   ├── about/              # About page
│   └── api/
│       └── analyze/        # POST /api/analyze — calls Claude API
├── components/
│   ├── Navbar.tsx          # Sticky nav with language toggle
│   └── Footer.tsx
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── supabase.ts         # Browser Supabase client
│   └── supabaseServer.ts   # Server Supabase client
└── middleware.ts            # Auth middleware (protects /hr/dashboard)
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL for OAuth redirects | Yes |

## AI Integration

The analysis endpoint at `/api/analyze` (POST):

1. Receives the user's 8-step intake data as JSON
2. Constructs a user prompt from the structured data
3. Sends to Claude with a detailed system prompt containing 2025/2026 eligibility rules for all 9 NL and BE benefit programs
4. Claude returns structured JSON with eligible/ineligible programs, estimated amounts, explanations, and application URLs
5. Results are stored in `localStorage` on the client

The system prompt includes conservative instructions — Claude only marks a program as `likely_eligible` when genuinely confident, using `possibly_eligible` for borderline cases.

## Key Pages

| URL | Description |
|---|---|
| `/` | Landing page with hero, benefits overview, testimonials, pricing |
| `/scan` | 8-step onboarding flow (localStorage persistence) |
| `/scan/analyzing` | Loading screen (min 3 seconds, calls `/api/analyze`) |
| `/scan/results` | Personal benefits report |
| `/hr` | HR teams landing page with demo request form |
| `/hr/dashboard` | HR admin dashboard (requires auth) |
| `/login` | Email/Google/magic-link auth |
| `/pricing` | Standalone pricing page |
| `/about` | About page |

## Design System

- **Primary**: Deep navy `#0F1B35`
- **Accent**: Emerald green `#1A8C5B`
- **Background**: Warm off-white `#F7F5F0`
- **Success states**: Light sage `#E8F4EE`
- **Headings**: DM Serif Display (Google Fonts)
- **Body**: DM Sans (Google Fonts)
