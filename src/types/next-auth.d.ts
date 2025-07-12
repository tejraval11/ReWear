import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      points?: number
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    points: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    points?: number
  }
} 