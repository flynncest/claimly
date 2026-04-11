import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { AnalysisResult } from '@/lib/types'

function buildEmailHtml(result: AnalysisResult, reportUrl: string): string {
  const topPrograms = result.eligible_programs.slice(0, 3)

  const programRows = topPrograms
    .map(
      (p) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8DFD0;">
          <p style="margin: 0 0 2px; font-size: 15px; font-weight: 600; color: #0D1B2A;">${p.program_name}</p>
          <p style="margin: 0; font-size: 13px; color: #6B7280;">${p.explanation.split('.')[0]}.</p>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8DFD0; text-align: right; white-space: nowrap;">
          <span style="font-size: 16px; font-weight: 700; color: #E8440A;">€${p.estimated_monthly_min}–€${p.estimated_monthly_max}</span>
          <span style="font-size: 12px; color: #9CA3AF;">/mo</span>
        </td>
      </tr>`
    )
    .join('')

  const remaining = result.eligible_programs.length - topPrograms.length

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #E8DFD0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #E8DFD0; padding: 32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">

        <!-- Logo -->
        <tr><td style="padding-bottom: 24px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color: #E8440A; border-radius: 8px; width: 32px; height: 32px; text-align: center; vertical-align: middle;">
                <span style="color: white; font-weight: bold; font-size: 11px;">DC</span>
              </td>
              <td style="padding-left: 10px; font-size: 20px; font-weight: 600; color: #0D1B2A;">DutchClaim</td>
            </tr>
          </table>
        </td></tr>

        <!-- Main card -->
        <tr><td style="background-color: #FFFFFF; border-radius: 16px; padding: 36px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

          <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #E8440A;">Your Benefits Report</p>
          <h1 style="margin: 0 0 24px; font-size: 26px; font-weight: 700; color: #0D1B2A; line-height: 1.2;">
            You may be missing up to <span style="color: #E8440A;">€${result.total_monthly_max}/month</span>
          </h1>

          <p style="margin: 0 0 24px; font-size: 15px; color: #4B5563; line-height: 1.6;">
            ${result.summary}
          </p>

          <!-- Programs table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
            ${programRows}
          </table>

          ${remaining > 0 ? `<p style="margin: 8px 0 24px; font-size: 13px; color: #9CA3AF;">+ ${remaining} more program${remaining > 1 ? 's' : ''} in your full report</p>` : '<div style="margin-bottom: 24px;"></div>'}

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${reportUrl}"
                style="display: inline-block; background-color: #E8440A; color: white; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.01em;">
                View Your Full Report →
              </a>
            </td></tr>
          </table>

          <p style="margin: 20px 0 0; font-size: 12px; color: #9CA3AF; text-align: center; line-height: 1.5;">
            Your report is saved and accessible via this link.<br>
            Create a free account to track changes and see alerts.
          </p>
        </td></tr>

        <!-- Disclaimer -->
        <tr><td style="padding: 20px 4px 0;">
          <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.6;">
            These results are estimates based on your answers and 2025/2026 eligibility rules.
            Always verify your eligibility with official government sources before applying.
            DutchClaim is not affiliated with any government body.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { email, reportId, result }: {
      email: string
      reportId: string
      result: AnalysisResult
    } = await req.json()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 503 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dutchclaim.app'
    const reportUrl = `${appUrl}/report/${reportId}`

    const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

    const { error } = await resend.emails.send({
      from: `DutchClaim <${from}>`,
      to: email,
      subject: `Your benefits report — up to €${result.total_monthly_max}/month`,
      html: buildEmailHtml(result, reportUrl),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-email error:', err)
    const message = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
