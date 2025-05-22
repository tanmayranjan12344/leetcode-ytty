// Force Node.js runtime
export const runtime = "nodejs";

// Import dependencies
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Dynamically import oracledb to avoid readline issues
// This approach prevents the thin client from loading at module parse time
export async function POST(req: Request) {
  const { email, password, includePassword = false } = await req.json();
  let connection;
  let oracledb;

  try {
    // Dynamically import oracledb and configure it
    oracledb = await import('oracledb');
    
    // Force thick client mode to avoid readline dependency
    // This environment variable needs to be set before the thin client is imported
    process.env.NODE_ORACLEDB_DRIVER_MODE = 'thick';
    
    // Get connection
    connection = await oracledb.default.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });
    
    // Fetch user by email, return as object
    const result = await connection.execute(
      `SELECT id, name, email, country, phone, password FROM users WHERE email = :email`,
      { email },
      { outFormat: oracledb.default.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows && result.rows.length > 0) {
      const userData = result.rows[0] as {
        id: number;
        name: string;
        email: string;
        country: string;
        phone: string;
        password: string;
      };
      
      if (!userData.password) {
        return NextResponse.json({ error: "No password found for user" }, { status: 400 });
      }
      
      const match = await bcrypt.compare(password, userData.password);
      if (!match) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      
      // Create a new object instead of using delete
      let user;
      if (includePassword) {
        // Return full user data including password if explicitly requested
        user = { ...userData };
      } else {
        // Omit password from the response
        const { password: _, ...userWithoutPassword } = userData;
        user = userWithoutPassword;
      }
      
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 400 });
  } finally {
    if (connection) await connection.close();
  }
}