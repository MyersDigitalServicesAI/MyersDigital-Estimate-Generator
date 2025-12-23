const puppeteer = require('puppeteer');
const functions = require('firebase-functions');

exports.generateEstimatePDF = functions.https.onCall(async (estimateData) => {
  const { clientName, projectDetails, pricing, companyInfo } = estimateData;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          border-bottom: 3px solid #2563eb;
          margin-bottom: 30px;
          padding-bottom: 20px;
        }
        .company-logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .company-details {
          font-size: 12px;
          color: #666;
          line-height: 1.6;
        }
        .estimate-title {
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .estimate-number {
          text-align: right;
          margin-bottom: 20px;
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .section-title {
          background: #f3f4f6;
          font-weight: bold;
          padding: 10px;
          border-left: 4px solid #2563eb;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .amount {
          text-align: right;
          width: 100px;
        }
        .total-row {
          background: #f3f4f6;
          font-weight: bold;
          font-size: 14px;
        }
        .grand-total {
          background: #2563eb;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          margin-top: 40px;
          font-size: 11px;
          color: #999;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <!-- HEADER WITH COMPANY LETTERHEAD -->
      <div class="header">
        <div class="company-logo">${companyInfo.name}</div>
        <div class="company-details">
          ${companyInfo.address}<br>
          Phone: ${companyInfo.phone}<br>
          Email: ${companyInfo.email}<br>
          License: ${companyInfo.license}
        </div>
      </div>

      <div class="estimate-number">
        Estimate #: ${estimateData.estimateNumber}<br>
        Date: ${new Date().toLocaleDateString()}<br>
        Valid until: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
      </div>

      <div class="estimate-title">PROJECT ESTIMATE</div>

      <!-- CLIENT DETAILS -->
      <table>
        <tr>
          <td><strong>Client Name:</strong> ${clientName}</td>
          <td><strong>Project Location:</strong> ${projectDetails.location}</td>
        </tr>
        <tr>
          <td colspan="2"><strong>Project Description:</strong> ${projectDetails.description}</td>
        </tr>
      </table>

      <!-- COST BREAKDOWN -->
      <table>
        <tr class="section-title">
          <td>Item Description</td>
          <td class="amount">Qty</td>
          <td class="amount">Unit</td>
          <td class="amount">Amount</td>
        </tr>
        ${pricing.items.map(item => `
          <tr>
            <td>${item.description}</td>
            <td class="amount">${item.quantity}</td>
            <td class="amount">$${item.unitPrice.toFixed(2)}</td>
            <td class="amount">$${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
        
        <tr class="total-row">
          <td colspan="3">Subtotal</td>
          <td class="amount">$${pricing.subtotal.toFixed(2)}</td>
        </tr>
        
        <tr class="total-row">
          <td colspan="3">Tax (${pricing.taxRate}%)</td>
          <td class="amount">$${pricing.tax.toFixed(2)}</td>
        </tr>
        
        <tr class="grand-total">
          <td colspan="3">TOTAL ESTIMATE</td>
          <td class="amount">$${pricing.total.toFixed(2)}</td>
        </tr>
      </table>

      <!-- TERMS -->
      <div style="margin-top: 30px; font-size: 12px;">
        <strong>Payment Terms:</strong> 50% deposit to schedule, balance due upon completion<br>
        <strong>Timeline:</strong> ${projectDetails.timeline}<br>
        <strong>Notes:</strong> This estimate is valid for 30 days. Prices subject to change based on material availability.
      </div>

      <div class="footer">
        <p>Thank you for choosing ${companyInfo.name}. We look forward to working with you!</p>
        <p>This estimate is confidential and prepared for the named recipient only.</p>
      </div>
    </body>
    </html>
  `;

  // Use Puppeteer to convert HTML to PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  });
  
  await browser.close();
  
  return {
    pdf: pdfBuffer.toString('base64'),
    filename: `estimate_${estimateData.estimateNumber}.pdf`,
    success: true
  };
});
