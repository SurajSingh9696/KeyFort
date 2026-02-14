# Password Vault - Modern Password Manager

A production-ready, secure Password Vault web application built with Next.js 14, TypeScript, and MongoDB. Features modern UI/UX, real authentication, database persistence, and advanced password management capabilities.

## 🚀 Features

### Core Functionality
- ✅ **Secure Authentication**
  - Email/Password authentication with bcrypt hashing
  - JWT-based session management
  - Protected routes with middleware

- ✅ **Password Vault**
  - Add, edit, delete passwords
  - Client-side encryption (AES-256)
  - Copy username/password with one click
  - Search and filter capabilities
  - Grid and list view modes

- ✅ **Password Generator**
  - Customizable length (8-64 characters)
  - Toggle uppercase, lowercase, numbers, symbols
  - Real-time password strength indicator
  - One-click copy to clipboard

- ✅ **Security Dashboard**
  - Overall security score calculation
  - Weak password detection
  - Old password warnings (90+ days)
  - Security recommendations

- ✅ **Categories & Organization**
  - Create custom categories with colors
  - Filter passwords by category
  - Default categories on signup

- ✅ **Favorites**
  - Star important passwords
  - Quick access to favorites
  - Drag and reorder (planned)

- ✅ **Activity Log**
  - Track all vault actions
  - Login/logout history
  - Password access events
  - Timestamps and IP addresses

- ✅ **Settings**
  - Theme switcher (Light/Dark/System)
  - Auto-lock timer configuration
  - Default view preference
  - 2FA ready (UI implemented)

### Design & UX
- 🎨 Modern, clean dark-first UI
- 🌓 Light/Dark theme support
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔔 Toast notifications for actions
- ⚡ Loading states and skeletons

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful SVG icons
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **NextAuth.js** - Authentication
- **Prisma ORM** - Database toolkit
- **MongoDB** - NoSQL database
- **bcryptjs** - Password hashing
- **crypto-js** - Client-side encryption

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd password-vault
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database (MongoDB)
DATABASE_URL="mongodb://localhost:27017/password_vault"
# For MongoDB Atlas (cloud):
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/password_vault?retryWrites=true&w=majority"

# NextAuth (REQUIRED)
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Encryption (REQUIRED - must be exactly 32 characters)
ENCRYPTION_KEY="your-32-character-encryption-key"

# App
NODE_ENV="development"
```

### 4. Database Setup

Generate Prisma client:
```bash
npm run db:generate
```

Push schema to database:
```bash
npm run db:push
```

Or run migrations:
```bash
npm run db:migrate
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses the following main models:

- **User** - User accounts with authentication
- **Account** - OAuth provider accounts
- **Session** - User sessions
- **VaultItem** - Encrypted password entries
- **Category** - Password organization
- **UserSettings** - User preferences
- **ActivityLog** - Audit trail

See `prisma/schema.prisma` for complete schema.

## 🔐 Security Features

### Encryption
- **Client-side encryption**: Passwords are encrypted before sending to the server
- **AES-256**: Industry-standard encryption algorithm
- **Master password**: Used to derive encryption keys (PBKDF2)
- **No plaintext storage**: Server never sees or stores plaintext passwords

### Authentication
- **bcrypt hashing**: Master password hashed with salt rounds
- **JWT sessions**: Secure, stateless authentication
- **HTTP-only cookies**: Protection against XSS
- **CSRF protection**: Built into NextAuth.js

### Best Practices
- **Strict TypeScript**: Type safety throughout the codebase
- **Input validation**: Zod schemas for all user inputs
- **SQL injection protection**: Parameterized queries via Prisma
- **Rate limiting**: Planned for authentication routes

## 📁 Project Structure

```
password-vault/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── vault/          # Vault CRUD operations
│   │   ├── categories/     # Category management
│   │   ├── activity/       # Activity logs
│   │   └── settings/       # User settings
│   ├── auth/               # Auth pages (login, register)
│   ├── dashboard/          # Dashboard pages
│   │   ├── vault/          # Password vault
│   │   ├── favorites/      # Favorite passwords
│   │   ├── categories/     # Category management
│   │   ├── generator/      # Password generator
│   │   ├── security/       # Security health
│   │   ├── activity/       # Activity log
│   │   └── settings/       # User settings
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (redirects)
│   └── globals.css         # Global styles
├── components/
│   ├── layouts/            # Layout components
│   ├── ui/                 # Reusable UI components
│   └── vault/              # Vault-specific components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── encryption.ts       # Encryption utilities
│   └── utils.ts            # Helper functions
├── prisma/
│   └── schema.prisma       # Database schema
├── types/                  # TypeScript type definitions
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### Database Configuration
The app supports PostgreSQL. Update your `DATABASE_URL` in `.env`:

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/password_vault"
```

**Cloud PostgreSQL (e.g., Supabase, Railway):**
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

## 📝 Usage

### First Time Setup
1. **Register an account** at `/auth/register`
2. **Login** with your credentials
3. **Create categories** to organize passwords
4. **Add passwords** to your vault
5. **Generate strong passwords** using the generator
6. **Monitor security** in the security dashboard

### Best Practices
- Use a strong master password
- Enable 2FA when available
- Regularly check security health
- Update old passwords (90+ days)
- Use unique passwords for each account
- Review activity log periodically

## 🚀 Deployment

### Vercel (Recommended)

#### 1. Prepare MongoDB Atlas
- Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- Create a cluster and get your connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/password_vault?retryWrites=true&w=majority`

#### 2. Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

#### 3. Add Environment Variables in Vercel
Go to **Settings → Environment Variables** and add:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/password_vault?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-generated-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key
NODE_ENV=production
```

**Important Notes:**
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32` (REQUIRED)
- `NEXTAUTH_URL`: Automatically set by Vercel, do NOT add manually
- `ENCRYPTION_KEY`: Must be exactly 32 characters (REQUIRED)
- `DATABASE_URL`: Must use MongoDB Atlas (REQUIRED)

#### 4. Deploy
- Click **Deploy** and wait for the build to complete
- Your app will be available at `https://your-app.vercel.app`

#### Troubleshooting Vercel Deployment
- **Can't access home page**: Clear browser cookies and try again
- **Login not working**: Verify `NEXTAUTH_SECRET` is set in environment variables
- **Database errors**: Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- **Redirect loops**: Ensure you're accessing via HTTPS on Vercel

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@example.com

---

**Built with ❤️ using Next.js and TypeScript**
# KeyFort
