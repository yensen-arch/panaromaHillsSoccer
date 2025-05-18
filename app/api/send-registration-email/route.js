import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, childName, parentName, seasonName } = await request.json();

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
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Panorama Hills Soccer Club!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Welcome to Panorama Hills Soccer Club!</h1>
          
          <p>Dear ${parentName},</p>
          
          <p>Thank you for registering ${childName} for the <strong>${seasonName}</strong> season at Panorama Hills Soccer Club!</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">Next Steps:</h2>
            <ol>
              <li>Complete your payment (if not already done)</li>
              <li>Attend the orientation session (details will be sent separately)</li>
              <li>Get your uniform and equipment ready</li>
            </ol>
          </div>
          
          <p>We're excited to have ${childName} join our soccer community and look forward to seeing them on the field!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              If you have any questions, please don't hesitate to contact us:<br>
              Email: info@panoramahillssoccer.com<br>
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
} 