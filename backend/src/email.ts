import sgMail from '@sendgrid/mail';
const emailConfig = require('../email.json');

console.log('EMAIL.TS IS LOADING!');
console.log('About to set API key...');
// insert API keys here: sgMail setApiKey('');

console.log('API key set successfully!');

export async function sendVerificationEmail(userEmail: string) {
  const htmlMessage = emailConfig.VERIFICATION_MESSAGE.replace('{email}', userEmail);
  
  const msg = {
    to: userEmail,
    from: emailConfig.FROM_EMAIL,
    subject: emailConfig.VERIFICATION_SUBJECT,
    html: htmlMessage
  };
  
  try {
    await sgMail.send(msg);
    console.log('Verification email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}