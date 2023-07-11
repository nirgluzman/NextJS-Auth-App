import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

import bcryptjs from 'bcryptjs';

import User from '@/models/userModel';

export enum EmailType {
  VERIFY = 'VERIFY',
  RESET = 'RESET',
}

interface sendEmailProps {
  emailType: EmailType;
  toEmail: string;
  userId: any;
}

export const sendEmail = async ({ emailType, toEmail, userId }: sendEmailProps) => {
  try {
    // create a hashed userId
    const hashedUserId = await bcryptjs.hash(userId.toString(), 10);

    // update the user document with the hashed userId
    if (emailType === EmailType.VERIFY) {
      await User.findByIdAndUpdate(userId, {
        verifyEmailToken: hashedUserId,
        verifyEmailTokenExpiry: Date.now() + 3600000, // the user has one hour to verify his email
      });
    } else if (emailType === EmailType.RESET) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedUserId,
        forgotPasswordTokemExpiry: Date.now() + 3600000,
      });
    }

    const msg = {
      to: toEmail, // recipients
      from: 'nir.gluzman@gmail.com', // verified sender
      subject: emailType === EmailType.VERIFY ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedUserId}">here</a> to ${
        emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${hashedUserId}
            </p>`,
    };

    const emailResponse = await sgMail.send(msg);
    return emailResponse;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
