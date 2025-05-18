import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, childName, parentName } = await request.json();

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Panorama Hills Soccer Club" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Panorama Hills Soccer Club!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Panorama Hills Soccer Club!</h2>
          <p>Dear ${parentName},</p>
          <p>Thank you for registering ${childName} with Panorama Hills Soccer Club. We're excited to have you join our soccer community!</p>
          <p>Here's what happens next:</p>
          <ul>
            <li>You'll receive additional information about practice schedules and team assignments</li>
            <li>Our coaches will contact you with specific details about your child's team</li>
            <li>Please ensure all required equipment is ready for the first session</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Panorama Hills Soccer Club Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Registration confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send registration confirmation email' },
      { status: 500 }
    );
  }
} 