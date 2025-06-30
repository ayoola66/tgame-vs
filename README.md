# Question Management System

A comprehensive system for managing questions for straight and nested games, built with Next.js 13+, TypeScript, Prisma, and Tailwind CSS.

## Features

### Completed Features

#### Authentication

- [x] Admin authentication with NextAuth
- [x] Protected routes and API endpoints
- [x] Session management

#### Question Management

- [x] Support for two game types:
  - Straight Games: Single bucket of questions for cards 1-5 (card 6 is special)
  - Nested Games: 5 categories mapped to cards 1-5, each with its own question pool
- [x] CRUD operations for questions
- [x] Bulk upload via CSV (Straight games) and XLSX (Nested games)
- [x] Question search and filtering
- [x] Pagination support
- [x] Active/Inactive question status

#### Game Management

- [x] Game creation and configuration
- [x] Game type selection (Straight/Nested)
- [x] Game status management

#### Category Management (for Nested Games)

- [x] Category CRUD operations
- [x] Category-Card mapping
- [x] Category-specific question pools

#### UI/UX

- [x] Responsive grid layout (1-4 columns based on screen size)
- [x] Modern UI components using shadcn/ui
- [x] Toast notifications for user feedback
- [x] Loading states and error handling
- [x] Confirmation dialogs for destructive actions

### Planned Features

#### User Management

- [ ] Role-based access control
- [ ] User profile management
- [ ] Activity logging

#### Game Features

- [ ] Game session management
- [ ] Real-time game state updates
- [ ] Score tracking
- [ ] Game statistics and analytics

#### Content Management

- [ ] Rich text editor for questions
- [ ] Image support for questions
- [ ] Question versioning
- [ ] Question difficulty levels
- [ ] Question tags and categories

#### API and Integration

- [ ] Public API for game integration
- [ ] Webhook support for game events
- [ ] Third-party authentication providers
- [ ] Export functionality for game data

#### Advanced Features

- [ ] AI-powered question generation
- [ ] Question quality analysis
- [ ] Performance analytics
- [ ] Custom game rule configuration

## Technical Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **State Management**: React Context + Hooks
- **File Handling**: CSV and XLSX parsing

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/question-management-system.git
   cd question-management-system
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

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js 13+ app directory
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   └── ui/             # Reusable UI components
├── lib/                 # Utility functions and shared code
├── prisma/             # Database schema and migrations
└── public/             # Static assets
```

## API Routes

### Questions

- `GET /api/admin/questions` - List questions with pagination
- `POST /api/admin/questions` - Create a new question
- `PUT /api/admin/questions/:id` - Update a question
- `DELETE /api/admin/questions/:id` - Delete a question

### Games

- `GET /api/admin/games` - List all games
- `POST /api/admin/games` - Create a new game
- `PUT /api/admin/games/:id` - Update a game
- `DELETE /api/admin/games/:id` - Delete a game

### Categories

- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create a new category
- `PUT /api/admin/categories/:id` - Update a category
- `DELETE /api/admin/categories/:id` - Delete a category

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
