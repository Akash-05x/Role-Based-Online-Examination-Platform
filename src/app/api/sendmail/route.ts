
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, text, html } = body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mail error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
