import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get cookies from request headers
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse cookies manually
    const cookies = parseCookies(cookieHeader);
    const token = cookies['auth_token'];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Verify JWT token
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_jwt_secret'
      );
      
      const { payload } = await jwtVerify(token, secret);
      
      return new Response(
        JSON.stringify({ user: payload }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (jwtError) {
      console.error('Invalid token:', jwtError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching user profile' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  
  return cookies;
}