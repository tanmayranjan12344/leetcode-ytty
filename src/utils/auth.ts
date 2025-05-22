import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { JWTPayload } from 'jose';

export interface UserJwtPayload extends JWTPayload {
  userId: number;
  email: string;
  name: string;
}

// Function to sign a new JWT token
export async function signJwtToken(payload: UserJwtPayload): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your_jwt_secret'
  );
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

// Function to verify a JWT token
export async function verifyJwtToken(token: string): Promise<UserJwtPayload> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your_jwt_secret'
  );
  
  const { payload } = await jwtVerify(token, secret);
  
  return payload as unknown as UserJwtPayload;
}

// Function to get the authenticated user from cookies
export async function getAuthUser(): Promise<UserJwtPayload | null> {
  try {
    // In Next.js 14, cookies() might return a promise
    const cookieStore = cookies();
    // If cookies() returns a promise, await it
    const cookieJar = cookieStore instanceof Promise ? await cookieStore : cookieStore;
    
    const token = cookieJar.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    return await verifyJwtToken(token);
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

// Middleware function to check if user is authenticated
export async function requireAuth() {
  const user = await getAuthUser();
  
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  return { props: { user } };
}