# Elite Games Platform

@R3kunM3d!aLTD
A modern gaming platform built with Next.js, PostgreSQL, and Supabase.

## Features

- User authentication with NextAuth
- Premium user subscriptions
- Game management system
- Nested game categories
- Real-time scoring
- Admin dashboard
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- PostgreSQL (via Supabase)
- Prisma ORM
- NextAuth.js
- Radix UI
- TailwindCSS

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ayoola66/tgame-vs.git
   cd tgame-vs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following:

   ```
   DATABASE_URL="your-supabase-postgres-url"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Create a Supabase account
2. Create a new project
3. Get your PostgreSQL connection string
4. Update your `.env` file with the connection string

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
