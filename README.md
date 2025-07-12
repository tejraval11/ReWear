# ReWear - Community Clothing Exchange Platform

A sustainable fashion platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🌱 Mission

Promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## ✨ Features

### 🔐 Authentication
- Email/password signup and login
- Session management with NextAuth.js
- Role-based access (USER/ADMIN)
- Protected routes

### 🏠 Landing Page
- Platform introduction with hero section
- Featured items carousel
- Call-to-action buttons: "Start Browsing", "Create Listing", "Get Started"
- Statistics and community highlights

### 👤 User Dashboard
- Profile details and points balance
- Uploaded items overview with status indicators
- Ongoing and completed swaps list
- Quick action buttons for common tasks

### 🛍️ Browse & Search
- Comprehensive item browsing with search functionality
- Advanced filtering by category, condition
- Sorting options (newest, oldest, title)
- Grid and list view modes
- Pagination support

### 📦 Item Management
- **Item Detail Page**: Image gallery, full description, uploader info, swap/redeem options
- **Create Listing**: Image upload, form validation, category selection
- **Item Status**: PENDING, APPROVED, REJECTED

### 🔄 Swap System
- Request swaps between users
- Admin approval/rejection system
- Swap status tracking (PENDING, COMPLETED, CANCELLED)
- Points-based redemption system

### 👨‍💼 Admin Panel
- Dashboard with platform statistics
- Item moderation (approve/reject/delete)
- User management
- Swap management
- Lightweight oversight interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **File Upload**: UploadThing
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React

## 🎨 Design System

### Color Palette
- **Primary**: Forest Green (`#2D5016`)
- **Background**: Soft White (`#FEFEFE`)
- **Text**: Charcoal (`#2C2C2C`)
- **Accents**: Warm Sand (`#F5E6D3`), Sage Green (`#9CAF88`)
- **CTA**: Muted Teal (`#4A7C59`)
- **Alerts**: Soft Red (`#E53E3E`)

### Typography
- **Headings**: Poppins (Bold, Semi-bold)
- **Body**: Source Sans Pro (Regular, Medium)
- **UI**: Inter (Medium, Semi-bold)

## 📁 Project Structure

```
rewear/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── items/
│   │   │   │   ├── browse/route.ts
│   │   │   │   ├── featured/route.ts
│   │   │   │   ├── upload/route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── approve/route.ts
│   │   │   │   └── redeem/route.ts
│   │   │   ├── swap/
│   │   │   │   ├── request/route.ts
│   │   │   │   └── complete/route.ts
│   │   │   ├── user/
│   │   │   │   └── dashboard/route.ts
│   │   │   └── admin/
│   │   │       ├── stats/route.ts
│   │   │       ├── all-items/route.ts
│   │   │       ├── all-users/route.ts
│   │   │       └── swaps/route.ts
│   │   ├── admin/page.tsx
│   │   ├── browse/page.tsx
│   │   ├── create-listing/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── item/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Toaster.tsx
│   │   ├── Header.tsx
│   │   ├── FeaturedItems.tsx
│   │   └── providers/
│   │       └── AuthProvider.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── types/
│       └── next-auth.d.ts
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- UploadThing account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/rewear"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # UploadThing
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

### Items
- `GET /api/items/browse` - Browse all items with filtering
- `GET /api/items/featured` - Get featured items for carousel
- `POST /api/items/upload` - Upload new item
- `GET /api/items/[id]` - Get item details
- `PUT /api/items/approve` - Approve/reject item (admin)
- `POST /api/items/redeem` - Redeem item with points

### User
- `GET /api/user/dashboard` - Get user dashboard data

### Swaps
- `POST /api/swap/request` - Request a swap
- `POST /api/swap/complete` - Complete a swap

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/all-items` - Get all items with pagination
- `GET /api/admin/all-users` - Get all users with pagination
- `GET /api/admin/swaps` - Get all swaps with pagination

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  role          Role     @default(USER)
  points        Int      @default(0)
  items         Item[]
  swaps         Swap[]   @relation("Swaps")
  receivedSwaps Swap[]   @relation("ReceivedSwaps")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Item Model
```prisma
model Item {
  id          String   @id @default(uuid())
  title       String
  description String
  category    String
  size        String
  condition   String
  tags        String[]
  images      String[]
  status      Status   @default(PENDING)
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  swaps       Swap[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Swap Model
```prisma
model Swap {
  id         String     @id @default(uuid())
  fromUser   User       @relation("Swaps", fields: [fromUserId], references: [id])
  fromUserId String
  toUser     User       @relation("ReceivedSwaps", fields: [toUserId], references: [id])
  toUserId   String
  item       Item       @relation(fields: [itemId], references: [id])
  itemId     String
  status     SwapStatus @default(PENDING)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database

## 🌟 Key Features

### Sustainable Fashion Focus
- Encourages clothing reuse and reduces textile waste
- Community-driven marketplace
- Points system for contributions

### User Experience
- Intuitive navigation and modern UI
- Responsive design for all devices
- Real-time status updates
- Image upload with preview

### Admin Oversight
- Comprehensive moderation tools
- User and item management
- Swap approval system
- Platform statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- UploadThing for file upload services
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons

---

**ReWear** - Making fashion sustainable, one swap at a time! 🌱👕 