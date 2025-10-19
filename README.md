# CommonCircle

A community platform. The application allows users to connect with communities, discover events, and build lasting connections.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud Console account (for OAuth)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env.local` file based on `.env.example` in the root directory:

3. **Set up Google OAuth**

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=[YOURPROJECT])
   - Create OAuth 2.0 Client ID for web application
   - Add authorized redirect URIs:
     - For local development: `http://localhost:3000/auth/v1/callback`
     - For production: `https://your-domain.com/auth/v1/callback`
   - Copy the Client ID and Client Secret to your environment variables

4. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Add Google as provider in Authorisation -> Sign In / Providers
   - Add your website URL to Authorisation -> URL Configuration
   - Set up scema according to [`.shema`](/.schema)

5. **Start the development server**

   ```bash
   npm run dev
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook development server
- `npm run test:ui` - Run Playwright tests

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Mantine UI
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth with Google OAuth
- **Development Tools**: Storybook
- **Testing Tools**: ESLint, Playwright

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**

2. **Set environment variables in Vercel dashboard:**

   - Same as in [`.env.example`](/.env.example)

3. **Update Supabase configuration:**

   - In your Supabase project settings, update the site URL to your Vercel domain
   - Add your Vercel domain to the redirect URLs in Supabase Auth settings

## 🔧 Configuration

### Supabase Setup

1. **Enable Google OAuth in Supabase:**

   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider
   - Add your Google OAuth Client ID and Secret

2. **Configure redirect URLs:**
   - Add your domain to the redirect URLs in Supabase Auth settings
   - For local development: `http://localhost:3000/auth/v1/callback`
   - For production: `https://your-domain.com/auth/v1/callback`

### Google OAuth Setup

1. **Create OAuth 2.0 credentials:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client ID for web application
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/v1/callback` (for local development)
     - `https://your-domain.com/auth/v1/callback` (for production)

2. **Configure OAuth consent screen:**
   - Set up the OAuth consent screen with your app information
   - Add your domain to authorized domains

## 🧪 Testing

The project includes Playwright tests:

```bash
# Run tests with UI
npm run test:ui
```

## 📚 Storybook

Component development is done through Storybook on branch design-mock:

```bash
# Start Storybook
npm run storybook
```

## Stripe

[Set up onboarding](https://docs.stripe.com/connect/onboarding/quickstart?lang=node#init-stripe)
