import { connectDB } from "../../../lib/connectDB";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    console.log('=== Registration attempt started ===');
    
    // Ensure Mongoose connection
    if (!mongoose.connection.readyState) {
      console.log('Mongoose not connected, connecting...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Mongoose connected with readyState:', mongoose.connection.readyState);
    } else {
      console.log('Mongoose already connected with readyState:', mongoose.connection.readyState);
    }

    const { username, fullname, email, password } = await req.json();
    console.log('Registration data received:', { username, fullname, email, passwordLength: password?.length });
    
    // Check if user already exists by email
    console.log('Checking for existing user with email:', email);
    const existingUserByEmail = await User.findOne({ email });
    console.log('Existing user by email query result:', existingUserByEmail);
    
    if (existingUserByEmail) {
      console.log('User already exists with email:', email);
      return new Response(JSON.stringify({ error: "User already exists with this email" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Check if user already exists by username
    console.log('Checking for existing user with username:', username);
    const existingUserByUsername = await User.findOne({ username });
    console.log('Existing user by username query result:', existingUserByUsername);
    
    if (existingUserByUsername) {
      console.log('User already exists with username:', username);
      return new Response(JSON.stringify({ error: "User already exists with this username" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Hash password and create user
    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, fullname, email, password: hashedPassword });
    
    console.log('Saving user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', { id: savedUser._id, username: savedUser.username, email: savedUser.email });
    
    return new Response(JSON.stringify({ message: "User registered successfully" }), { 
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
