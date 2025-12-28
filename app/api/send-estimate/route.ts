// app/api/send-estimate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { estimateId, toEmail, toName, pdfUrl } = await req.json();

    if (!estimateId || !toEmail) {
      return NextResponse.json(
        { error: 'Missing estimateId or toEmail' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'estimates@myersdigital.com';
    const companyName = process.env.COMPANY_NAME || 'MyersDigital Services AI';

    const { data, error } = await resend.emails.send({
      from: `${companyName} <${fromEmail}>`,
      to: [toEmail],
      subject: `Your Project Estimate #${estimateId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${companyName}</h1>
            <p>Professional Construction Estimates</p>
          </div>
          
          <div class="content">
            <h2>Hello ${toName || 'there'}! 👋</h2>
            
            <p>Thank you for requesting an estimate. We've prepared a detailed cost breakdown for your construction project based on current market pricing.</p>
            
            <p><strong>Estimate #:</strong> ${estimateId}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            
            ${pdfUrl ? `
              <a href="${pdfUrl}" class="button">View Your Estimate</a>
            ` : ''}
            
            <h3>What's Included:</h3>
            <ul>
              <li>✅ Detailed material costs</li>
              <li>✅ Labor breakdown by trade</li>
              <li>✅ Real-time market pricing</li>
              <li>✅ Competitive rate comparison</li>
              <li>✅ Project timeline</li>
            </ul>
            
            <p>If you have any questions about this estimate or would like to discuss your project further, please don't hesitate to reach out.</p>
            
            <p>We look forward to working with you!</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${companyName}</p>
            <p>This estimate is valid for 30 days from the generated date.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Send estimate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
