# ReWear - Community Clothing Exchange

A full-stack web application built with Next.js 14, TypeScript, and Prisma that enables users to swap or redeem unused clothing through a sustainable points system.

## 🚀 Features

### User Features
- **Authentication**: Secure signup/login with email/password
- **Item Management**: Upload items with images, descriptions, and metadata
- **Browse & Search**: Filter items by category, size, and search terms
- **Swap System**: Request swaps with other users or redeem items with points
- **Points System**: Earn points for approved items, spend points to redeem items
- **Dashboard**: View profile, points balance, uploaded items, and swap history

### Admin Features
- **Item Approval**: Review and approve/reject pending items
- **Points Management**: Automatic point distribution for approved items
- **User Management**: Monitor user activity and swap transactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with bcrypt password hashing
- **File Upload**: UploadThing (configured but using placeholders for demo)
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rewear
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rewear"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (optional for image uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── items/         # Item management endpoints
│   │   ├── swap/          # Swap system endpoints
│   │   ├── user/          # User data endpoints
│   │   └── admin/         # Admin panel endpoints
│   ├── browse/            # Browse items page
│   ├── dashboard/         # User dashboard
│   ├── item/[id]/         # Item detail page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── upload/            # Item upload page
│   └── admin/             # Admin panel
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Toaster, etc.)
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## 🔐 Authentication Flow

1. **Signup**: Users create accounts with email/password (passwords are hashed with bcrypt)
2. **Login**: NextAuth.js handles authentication with JWT sessions
3. **Role-based Access**: Users have `USER` or `ADMIN` roles
4. **Protected Routes**: Dashboard, upload, and admin pages require authentication

## 💰 Points System

- **Earning Points**: +10 points for each approved item
- **Spending Points**: -10 points to redeem an item
- **Point Balance**: Tracked in user profile and updated atomically during transactions

## 🔄 Swap System

1. **Request Swap**: User requests to swap with item owner
2. **Admin Approval**: Admin can approve/reject swap requests
3. **Completion**: Item ownership transfers and points are exchanged
4. **Status Tracking**: Pending, Completed, or Cancelled states

## 🎨 UI Components

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, accessible interface with proper contrast
- **Loading States**: Skeleton loaders and loading spinners
- **Toast Notifications**: Success/error feedback for user actions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Items
- `GET /api/items/featured` - Featured items for landing page
- `GET /api/items/browse` - Browse items with filters
- `GET /api/items/[id]` - Get specific item details
- `POST /api/items/upload` - Upload new item
- `POST /api/items/approve` - Admin item approval

### Swaps
- `POST /api/swap/request` - Request item swap
- `POST /api/swap/complete` - Complete swap transaction

### User
- `GET /api/user/dashboard` - User dashboard data

### Admin
- `GET /api/admin/pending-items` - Get pending items for review

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Sessions**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **Role-based Access**: Admin-only routes and actions
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- [ ] Real image upload with UploadThing/Cloudinary
- [ ] Email notifications for swaps and approvals
- [ ] Mobile app with React Native
- [ ] Advanced search and filtering
- [ ] Social features (following, favorites)
- [ ] Analytics dashboard
- [ ] Payment integration for premium features 