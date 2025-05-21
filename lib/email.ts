import { Resend } from "resend";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Lazreus Tech <noreply@lazreustech.com>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5; margin-bottom: 10px;">Lazreus Tech</h1>
            <p style="font-size: 18px; font-weight: bold;">Verify your email address</p>
          </div>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p>Hello,</p>
            <p>Thank you for registering with Lazreus Tech. Please use the verification code below to complete your registration:</p>

            <div style="background-color: #4F46E5; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0; letter-spacing: 5px;">
              ${otp}
            </div>

            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
          </div>

          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Lazreus Tech. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Lazreus Tech <noreply@lazreustech.com>",
      to: email,
      subject: "Welcome to Lazreus Tech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5; margin-bottom: 10px;">Lazreus Tech</h1>
            <p style="font-size: 18px; font-weight: bold;">Welcome to Lazreus Tech!</p>
          </div>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p>Hello ${name || "there"},</p>
            <p>Thank you for joining Lazreus Tech. Your account has been successfully verified and is now active.</p>
            <p>You can now log in to your account and explore our services.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/login" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Log In to Your Account
              </a>
            </div>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>

          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Lazreus Tech. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }

    return data;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}

export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  date: Date,
  message: string
) {
  try {
    const formattedDate = format(date, "EEEE, MMMM do, yyyy");
    const formattedTime = format(date, "h:mm a");

    const { data, error } = await resend.emails.send({
      from: "Lazreus Tech <noreply@lazreustech.com>",
      to: email,
      subject: "Your Appointment Booking Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5; margin-bottom: 10px;">Lazreus Tech</h1>
            <p style="font-size: 18px; font-weight: bold;">Appointment Booking Confirmation</p>
          </div>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p>Hello ${name || "there"},</p>
            <p>Thank you for booking an appointment with Lazreus Tech. Your appointment has been confirmed for:</p>

            <div style="background-color: #4F46E5; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${formattedDate}</p>
              <p style="font-size: 16px; margin: 5px 0 0 0;">${formattedTime}</p>
            </div>

            <p><strong>Your message:</strong></p>
            <p style="background-color: #f0f0f0; padding: 10px; border-radius: 4px; font-style: italic;">${message}</p>

            <p>Our team will contact you soon to discuss your appointment. If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/dashboard" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                View Your Dashboard
              </a>
            </div>
          </div>

          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Lazreus Tech. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending booking confirmation email:", error);
      throw new Error("Failed to send booking confirmation email");
    }

    return data;
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw new Error("Failed to send booking confirmation email");
  }
}
