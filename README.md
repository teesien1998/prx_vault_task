# PRX Vault Task

A Next.js application with password reset functionality built with Supabase integration. This project demonstrates authentication flows with Supabase Edge Functions for logging password reset events.

## Tech Stack

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI, Lucide React icons

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** or **pnpm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Docker Desktop** (required for local development) - [Download](https://www.docker.com/products/docker-desktop/)
- **Supabase CLI** (optional, for local development) - [Installation Guide](https://supabase.com/docs/guides/cli)
- **Deno extension** (optional, recommended for editing Edge Functions) - Install the Deno extension in your code editor (VS Code, etc.) for better development experience with Supabase Edge Functions

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/prx-vault-task.git
cd prx-vault-task
```

Replace `yourusername` with your actual GitHub username or the repository URL.

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

**Note**: You'll get these values after setting up Supabase (see step 4 below).

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup

**Note**: This project already includes the `supabase/` directory, so you don't need to run `supabase init`.

You have two options for Supabase setup:

#### Option A: Using Supabase Cloud (Recommended for Production)

1. **Create a Supabase Account**

   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in

2. **Create a New Project**

   - Click **"New Project"**
   - Fill in:
     - **Name**: `prx-vault-task` (or your choice)
     - **Database Password**: Choose a strong password (save it securely)
     - **Region**: Choose the closest region to you
   - Click **"Create new project"**
   - Wait for the project to be created (~2 minutes)

3. **Get Your Credentials**

   - Go to **Settings** → **API** in your Supabase dashboard
   - Copy the following values:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJ...`)

4. **Update `.env.local`**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
   ```

5. **Deploy the Edge Function**

   ```bash
   # Login to Supabase CLI
   npx supabase login

   # Link your project (get project-ref from Settings → General → Reference ID)
   npx supabase link --project-ref your-project-ref

   # Deploy the Edge Function
   npx supabase functions deploy log-password-reset
   ```

#### Option B: Using Local Supabase (For Development)

1. **Start Local Supabase**

   ```bash
   npx supabase start
   ```

2. **Get Local Credentials**
   After starting, you'll see output with your local credentials. Look for:

   ```
   API URL: http://localhost:54321
   anon key: eyJ...
   ```

3. **Update `.env.local`**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable...your_local_anon_key_here
   ```

4. **Deploy Edge Function Locally**

   ```bash
   npx supabase functions serve log-password-reset
   ```

   **Note**: Keep this terminal running while developing.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
prx-vault-task/
├── app/                      # Next.js App Router pages
│   ├── auth/
│   │   ├── login/           # Login page
│   │   └── reset-password/  # Password reset page
│   ├── page.tsx             # Home page
│   └── layout.tsx           # Root layout
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── utils.ts             # Utility functions
├── supabase/
    ├── functions/
    │   └── log-password-reset/  # Edge Function for logging password resets
    └── config.toml          # Supabase local configuration

```

## Testing Guide

### Manual Testing

1. **Home Page**

   - Navigate to `http://localhost:3000`
   - Verify the login form is displayed
   - Click "Forgot password?" link or navigate to `/auth/reset-password`

2. **Password Reset Page**

   - Navigate to `http://localhost:3000/auth/reset-password`
   - Test password validation:
     - **Too short**: Enter password less than 8 characters
     - **Missing uppercase**: Enter password without uppercase letters
     - **Missing number**: Enter password without numbers
     - **Missing special character**: Enter password without special characters
     - **Mismatched passwords**: Enter different values in password and confirm password fields
   - Test valid password:
     - Enter a password that meets all requirements (e.g., `Test1234!@`)
     - Enter the same password in confirm password field
     - Click "Reset Password"
     - Verify success message and confetti animation
     - Verify redirect to login page after 3 seconds

3. **Edge Function Testing**
   - After submitting the password reset form, check:
     - **Browser Console**: Look for `Edge Function response: { status: "logged" }`
     - **Supabase Dashboard** (Cloud): Go to **Edge Functions** → **Logs** to see the `console.log()` output with "Password reset logged:" message containing email, resetTime, and timestamp
     - **Local Supabase**: Check the terminal where you're running `supabase functions serve` to see the `console.log()` output with "Password reset logged:" message containing email, resetTime, and timestamp

### Testing Checklist

- [ ] Home page loads correctly
- [ ] Navigation to reset password page works
- [ ] Password validation errors display correctly
- [ ] Valid password submission works
- [ ] Success message and confetti animation appear
- [ ] Redirect to login page works after success
- [ ] Edge Function is called successfully (check console/logs)
- [ ] Form shows loading state during submission
- [ ] Error messages display if Edge Function fails
- [ ] Password visibility toggle works (eye icon)

### Expected Behavior

1. **Password Requirements**:

   - Minimum 8 characters
   - At least one uppercase letter
   - At least one number
   - At least one special character

2. **Form Submission**:

   - Shows loading state with spinner
   - Calls Supabase Edge Function with email and reset time
   - Displays success message with confetti
   - Redirects to `/auth/login` after 3 seconds

3. **Edge Function**:
   - Logs password reset event with email and timestamp
   - Returns `{ status: "logged" }` on success

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Troubleshooting

### Edge Function Not Working

- **Local**: Make sure you're running `npx supabase functions serve log-password-reset`
- **Cloud**: Verify you've deployed the function with `npx supabase functions deploy log-password-reset`
- Check that the function name matches exactly: `log-password-reset`

### Environment Variables Not Working

- Ensure `.env.local` file exists in the root directory
- Verify variable names start with `NEXT_PUBLIC_` for client-side access
- Restart the development server after adding/changing environment variables
- Never commit `.env.local` to git (it's already in `.gitignore`)

### CORS Errors

- Supabase handles CORS automatically for Edge Functions
- If issues persist, check Supabase Dashboard → Edge Functions settings

### Port Already in Use

- If port 3000 is in use, Next.js will automatically use the next available port
- Check the terminal output for the actual URL

## Security Notes

- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (it's a public key)
- ⚠️ Never commit `.env.local` or any files with sensitive credentials
- ⚠️ The anon key has limited permissions based on Row Level Security (RLS) policies

## Support

For issues or questions:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Check the [Next.js Documentation](https://nextjs.org/docs)

## License

This project is a task submission for PRX Vault.
