import { execute, oracledb, initialize } from '@/src/utils/orcaledb';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the database connection at module level
// This is safe to do in server components/API routes
initialize().catch(err => {
  console.error('Failed to initialize database:', err);
});

interface User {
  ID: number;
  EMAIL: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, country, phone, password } = await request.json();

    // Validate inputs
    if (!name || !email || !country || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUsers = await execute<User>(
      'SELECT id, email FROM users WHERE email = :email',
      { email: email.toLowerCase() }
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await execute<{ ID: number }>(
      `INSERT INTO users (
        name, 
        email, 
        country, 
        phone, 
        password, 
        created_at
      ) VALUES (
        :name, 
        :email, 
        :country, 
        :phone, 
        :password, 
        CURRENT_TIMESTAMP
      ) RETURNING id INTO :id`,
      { 
        name,
        email: email.toLowerCase(),
        country,
        phone,
        password: hashedPassword,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    return NextResponse.json(
      { 
        message: 'Registration successful',
        userId: result[0]?.ID
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}