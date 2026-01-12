import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { estimateId, toEmail, toName, pdfUrl } = body ?? {}

    if (typeof estimateId !== 'string' || typeof toEmail !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid estimateId/toEmail' },
        { status: 400 }
      )
    }

    // 1. Verify ownership of the estimate
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('id, status')
      .eq('id', estimateId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (estimateError || !estimate) {
      return NextResponse.json(
        { error: 'Estimate not found or access denied' },
        { status: 404 }
      )
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'estimates@myersdigital.com'
    const companyName = process.env.COMPANY_NAME || 'MyersDigital Services AI'

    // 2. Optional: basic idempotency/rate-limit per estimate/email
    const { data: alreadySent } = await supabase
      .from('sent_emails')
      .select('id')
      .eq('estimate_id', estimateId)
      .eq('to_email', toEmail)
      .maybeSingle()

    if (alreadySent) {
      return NextResponse.json(
        { error: 'This estimate was already emailed to this address recently.' },
        { status: 429 }
      )
    }

    // 3. Send email via Resend
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
              background: #2563eb;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .btn {
              background: #2563eb;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin: 15px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 24px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${companyName}</h2>
          </div>
          <div class="content">
            <p>Hello ${toName || 'there'},</p>
            <p>
              Here is the estimate you requested. We've prepared a detailed breakdown
              based on the latest market pricing.
            </p>

            ${
              pdfUrl
                ? `<div style="text-align: center;">
                     <a href="${pdfUrl}" class="btn">View Estimate PDF</a>
                   </div>`
                : ''
            }

            <p><strong>Estimate #:</strong> ${estimateId}</p>

            <p>If you have any questions, please reply to this email.</p>
            <p>Best,<br>${companyName}</p>
          </div>
          <div class="footer">
            <p>This estimate email was sent from ${companyName}.</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('[send-estimate.resend_error]', error)
      return NextResponse.json(
        { error: 'Failed to deliver email' },
        { status: 500 }
      )
    }

    // 4. Mark estimate as sent
    await supabase
      .from('estimates')
      .update({ status: 'sent', updated_at: new Date().toISOString() })
      .eq('id', estimateId)

    // 5. Record send op for idempotency/analytics
    await supabase.from('sent_emails').insert({
      estimate_id: estimateId,
      to_email: toEmail,
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('[send-estimate.api_error]', {
      error: error?.message || String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
