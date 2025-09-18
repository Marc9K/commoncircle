# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CommonCircle is a Next.js 15 community platform built with React 19, TypeScript, Mantine UI, and Supabase. The application allows users to connect with communities, discover events, and build lasting connections.

## Development Commands

### Core Development
- `npm run dev` - Start development server (Next.js dev mode)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint on the codebase

### Storybook
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build static Storybook for deployment

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Libraries**: 
  - Mantine UI (primary component library)
  - Shadcn/ui components (limited usage in `/components/ui/`)
  - TailwindCSS for styling utilities
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth with middleware-based session management
- **Development Tools**: Storybook for component development, ESLint for code quality

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages and OAuth routes
│   ├── communities/       # Community-related pages with dynamic routing
│   ├── protected/         # Protected routes requiring authentication
│   └── layout.tsx         # Root layout with Mantine provider
├── components/
│   ├── header/            # Header components with navigation
│   ├── ui/               # Shadcn/ui components (button, card, avatar)
│   └── [others]          # Feature-specific components
├── hooks/                # Custom React hooks for common functionality
├── lib/
│   ├── supabase/         # Supabase client configurations
│   └── utils.ts          # Utility functions (cn helper)
└── theme.ts             # Mantine theme configuration
```

### Authentication Architecture
- **Middleware**: `src/middleware.ts` handles session updates on all requests
- **Client-side**: `src/lib/supabase/client.ts` for browser interactions
- **Server-side**: `src/lib/supabase/server.ts` for server components and API routes
- **Session Management**: Automatic session refresh via middleware, with user redirects currently commented out

### UI Component Patterns

#### Responsive Design Helpers
- `Variable` component: Conditionally renders different content at specified breakpoints
- `Visible` component: Shows/hides content based on screen size
- Both components leverage Mantine's breakpoint system

#### Component Development
- All components have corresponding `.stories.tsx` files for Storybook
- Mantine UI is the primary component library
- CSS Modules used for component-specific styling (see `Header.module.css`)

### Database Integration
- Supabase project configured with read-only MCP server
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- Server components use async Supabase client, browser components use sync client

### Development Workflow
1. Component development primarily done through Storybook
2. Authentication flows tested through protected routes
3. Responsive design verified using Mantine's breakpoint system
4. ESLint enforces Next.js and TypeScript best practices

### Key Configuration Files
- `components.json`: Shadcn/ui configuration with path aliases
- `theme.ts`: Mantine theme customization (currently using serif font)
- `middleware.ts`: Handles Supabase session management across all routes

### Important Implementation Notes
- Authentication middleware is set up but user redirects are commented out
- PWA support included via `next-pwa` package
- TypeScript strict mode enabled with Next.js optimizations
- Storybook configured for Next.js with static directory pointing to `/public`

### General rules/info
- The project is at the design mockup stage
- Create Stories for each element/page you create
- Make stories for desktop and mobile
- Keep all sample data in stories files
- Only use code styling, no pure CSS
- Don't try to implement navigation etc yet, nor do you have to state where it should go. Just focus on simple design
- Stories require decorators from .storybook/previews file