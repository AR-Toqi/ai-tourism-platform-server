export const sendEmail = async (payload: {
  to: string;
  subject: string;
  templateName: string;
  templateData: any;
}) => {
  // TODO: Implement actual email sending logic (e.g., using nodemailer, Resend, or Brevo)
  console.log(`Sending email to ${payload.to} with subject: ${payload.subject}`);
  console.log(`Template: ${payload.templateName}, Data:`, payload.templateData);
};
