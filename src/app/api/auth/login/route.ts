import { execute, oracledb, initialize } from '@/src/utils/orcaledb';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the database connection at module level
// This is safe to do in server components/API routes
initialize().catch(err => {
  console.error('Failed to initialize database:', err);
});

interface User {
  ID: number;
  EMAIL: string;
  PASSWORD: string;
  NAME: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user by email
    const users = await execute<User>(
      'SELECT id, email, password, name FROM users WHERE email = :email',
      { email: email.toLowerCase() }
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
    
    const token = await new SignJWT({
      userId: user.ID,
      email: user.EMAIL,
      name: user.NAME
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Update last login timestamp
    await execute(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = :id',
      { id: user.ID }
    );

    // Return response with auth cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.ID,
          email: user.EMAIL,
          name: user.NAME
        }
      },
      { status: 200 }
    );

    // Set the auth token as an HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}