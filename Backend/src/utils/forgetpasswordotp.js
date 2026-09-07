import { BrevoClient } from '@getbrevo/brevo';
import dotenv from "dotenv";
dotenv.config();

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const forgetpasswordotp = async (email, otp) => {
    try {

        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header Banner -->
                <div style="background: linear-gradient(to right, #9333ea, #db2777, #2563eb); padding: 30px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">SnapShare</h1>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #f3e8ff;">Password Recovery Service</p>
                </div>

                <!-- Body Content -->
                <div style="padding: 30px; color: #374151;">
                    <p style="font-size: 16px; margin-top: 0;">Hello,</p>
                    <p style="font-size: 15px; line-height: 1.5;">
                        We received a request to reset the password for your SnapShare account. Use the One-Time Password (OTP) below to proceed with resetting your password. This code is valid for <strong>10 minutes</strong>.
                    </p>

                    <!-- OTP Highlight Box -->
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #22c55e; color: #15803d; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; border-radius: 8px;">
                            ${otp}
                        </span>
                    </div>

                    <p style="font-size: 14px; color: #6b7280; line-height: 1.4;">
                        If you did not request a password reset, please ignore this email or contact support if you have concerns about your account's security. Your password will remain unchanged.
                    </p>

                    <p style="font-size: 15px; margin-bottom: 0; margin-top: 30px;">
                        Stay Secure!<br>
                        <strong>The SnapShare Team</strong>
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                    &copy; 2026 SnapShare. All rights reserved.
                </div>

            </div>
        </div>
        `;

        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: { 
                name: "SnapShare", 
                email: process.env.MAIL_USER 
            },
            to: [{ email: email }],
            subject: 'Password Reset OTP - SnapShare',
            htmlContent: htmlTemplate,
        });

        console.log('Password Reset OTP Sent Successfully via Brevo:', result);
        return true;

    } catch (error) {
        console.error('Error sending password reset OTP via Brevo:', error);
        throw error;
    }
};

export { forgetpasswordotp };