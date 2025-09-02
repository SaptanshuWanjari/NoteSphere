
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Ensure Mongoose connection
          if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI);
          }
          
          const user = await User.findOne({ email: credentials.email });
          
          // If user doesn't exist or doesn't have password, deny login
          if (!user || !user.password) return null;
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          
          return { id: user._id.toString(), name: user.username, email: user.email };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { 
    signIn: "/login",
    signOut: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      
      // Default redirect to user page after successful sign in
      return `${baseUrl}/user`;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user }) {
      // If user is available (during sign in), add the user ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user ID from the token to the session
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

