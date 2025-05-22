import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Handle the case where cookies() might return a promise
    const cookieStore = cookies();
    // If cookies() returns a promise, await it
    const cookieJar = cookieStore instanceof Promise ? await cookieStore : cookieStore;
    
    // Clear the auth token cookie directly via response headers
    // This is more reliable than trying to use cookieJar.delete()
    return NextResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`
        }
      }
    );
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'An error occurred while logging out' },
      { status: 500 }
    );
  }
}