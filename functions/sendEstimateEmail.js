const functions = require('firebase-functions');
const MailerSend = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY
});

exports.sendEstimateEmail = functions.https.onCall(async (data) => {
  const { clientEmail, clientName, pdfBase64, estimateNumber, companyInfo } = data;

  try {
    await mailerSend.email.send({
      from: {
        email: companyInfo.fromEmail,
        name: companyInfo.name
      },
      to: [
        {
          email: clientEmail,
          name: clientName
        }
      ],
      subject: `Your Project Estimate #${estimateNumber}`,
      html: `
        <h2>Hello ${clientName},</h2>
        <p>Thank you for reaching out! I've prepared a detailed estimate for your project based on current market pricing.</p>
        
        <p><strong>Estimate #:</strong> ${estimateNumber}</p>
        <p><strong>Prepared:</strong> ${new Date().toLocaleDateString()}</p>
        
        <p>The attached PDF includes:</p>
        <ul>
          <li>Detailed cost breakdown</li>
          <li>Real-time market pricing data</li>
          <li>Timeline and payment terms</li>
          <li>Our company letterhead</li>
        </ul>
        
        <p>Please review and let me know if you have any questions!</p>
        
        <p>Best regards,<br>
        ${companyInfo.owner}<br>
        ${companyInfo.phone}</p>
      `,
      attachments: [
        {
          filename: `estimate_${estimateNumber}.pdf`,
          content: pdfBase64
        }
      ]
    });

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
});
