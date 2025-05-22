import { NextResponse } from "next/server";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, country, phone, password } = await req.json();
  let connection;
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });

    // Insert the new user
    await connection.execute(
      `INSERT INTO users (name, email, country, phone, password) VALUES (:name, :email, :country, :phone, :password)`,
      { name, email, country, phone, password: hashedPassword },
      { autoCommit: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "User creation failed" }, { status: 400 });
  } finally {
    if (connection) await connection.close();
  }
}