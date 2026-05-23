import { env } from '@starform/env';
import { Resend } from 'resend';
import { logger } from '@starform/logger';

const FROM_ADDRESS = 'StarForm <noreply@tabi.hogyoku.cloud>';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function isEnabled(): boolean {
  return resend !== null;
}

export async function sendRespondentConfirmation(
  to: string,
  formTitle: string,
  submissionId: string,
  responses: { label: string; value: string }[],
): Promise<void> {
  if (!isEnabled()) {
    logger.warn('Resend not configured, skipping respondent confirmation email');
    return;
  }

  const responseRows = responses
    .map(
      (r) =>
        `<tr>
          <td class="field-label" style="font-family:'Figtree',sans-serif;font-size:13px;font-weight:500;color:#4b5563;width:35%;vertical-align:top;padding:16px 20px;border-bottom:1px solid #f3f1eb;">${r.label}</td>
          <td class="field-value" style="font-family:'Lora',Georgia,serif;font-size:14px;color:#111827;padding:16px 20px;border-bottom:1px solid #f3f1eb;line-height:1.5;">${r.value}</td>
        </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Figtree:wght@300..900&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Figtree:wght@300..900&display=swap');
  </style>
</head>
<body style="font-family:'Lora',Georgia,serif;background-color:#fcfbf7;color:#1e1e2f;margin:0;padding:40px 20px;-webkit-font-smoothing:antialiased;">
  <div style="max-width:540px;margin:0 auto;background-color:#faf8f3;border:1px solid #e8e5dc;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(71, 144, 226, 0.05),0 16px 48px rgba(202, 178, 235, 0.08);background-image:radial-gradient(circle at top right,rgba(202,178,235,0.15) 0%,transparent 60%),radial-gradient(circle at bottom left,rgba(232,229,220,0.2) 0%,transparent 50%);">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-family:'Figtree',sans-serif;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:#2b76c6;margin-bottom:16px;">StarForm</div>
      <h1 style="font-family:'Lora',Georgia,serif;font-size:28px;font-weight:400;line-height:1.2;color:#1e1e2f;margin:0 0 12px 0;">Response Confirmed</h1>
      <p style="font-size:15px;color:#64748b;line-height:1.6;margin:0;">Thank you for submitting <strong>${formTitle}</strong>. Here is a copy of your responses for your records.</p>
    </div>
    
    <div style="height:1px;background:linear-gradient(to right,transparent,#e8e5dc,transparent);margin:32px 0;"></div>
    
    <div style="border:1px solid rgba(232, 229, 220, 0.8);border-radius:12px;overflow:hidden;background-color:#ffffff;box-shadow:0 2px 8px rgba(33, 33, 48, 0.02);">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th colspan="2" style="font-family:'Figtree',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;background-color:#f8f6f0;text-align:left;padding:12px 20px;border-bottom:1px solid #e8e5dc;">Submission Summary</th>
          </tr>
        </thead>
        <tbody>
          ${responseRows}
        </tbody>
      </table>
    </div>
    
    <div style="margin-top:32px;text-align:center;">
      <div style="display:inline-block;font-family:monospace;font-size:11px;background-color:#f3f1eb;color:#4b5563;padding:4px 10px;border-radius:999px;border:1px solid #e8e5dc;">ID: ${submissionId.slice(0, 8).toUpperCase()}</div>
      <div style="font-family:'Figtree',sans-serif;font-size:11px;color:#94a3b8;margin-top:24px;">Created beautifully with StarForm</div>
    </div>
  </div>
</body>
</html>`;

  try {
    await resend?.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Confirmation: ${formTitle}`,
      html,
    });
  } catch (err) {
    logger.error({ err, to, formTitle }, 'Failed to send respondent confirmation email');
  }
}

export async function sendCreatorNotification(
  to: string,
  formTitle: string,
  submissionCount: number,
  formSlug: string,
): Promise<void> {
  if (!isEnabled()) {
    logger.warn('Resend not configured, skipping creator notification email');
    return;
  }

  const baseUrl = env.BASE_URL || 'http://localhost:8000';
  const formUrl = `${baseUrl}/${formSlug}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Figtree:wght@300..900&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Figtree:wght@300..900&display=swap');
  </style>
</head>
<body style="font-family:'Lora',Georgia,serif;background-color:#fcfbf7;color:#1e1e2f;margin:0;padding:40px 20px;-webkit-font-smoothing:antialiased;">
  <div style="max-width:500px;margin:0 auto;background-color:#faf8f3;border:1px solid #e8e5dc;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(71, 144, 226, 0.05),0 16px 48px rgba(202, 178, 235, 0.08);background-image:radial-gradient(circle at top right,rgba(202,178,235,0.15) 0%,transparent 60%),radial-gradient(circle at bottom left,rgba(232,229,220,0.2) 0%,transparent 50%);text-align:center;">
    <div style="font-family:'Figtree',sans-serif;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:#2b76c6;margin-bottom:24px;">StarForm</div>
    
    <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:18px;background-color:rgba(43,118,198,0.08);margin-bottom:24px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2b76c6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    </div>
    
    <h1 style="font-family:'Lora',Georgia,serif;font-size:26px;font-weight:400;line-height:1.2;color:#1e1e2f;margin:0 0 12px 0;">New Response</h1>
    <p style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 32px 0;">A respondent has just submitted a new response to <strong>${formTitle}</strong>.</p>
    
    <div style="background-color:#ffffff;border:1px solid rgba(232, 229, 220, 0.8);border-radius:16px;padding:24px;margin-bottom:32px;box-shadow:0 2px 8px rgba(33, 33, 48, 0.02);">
      <div style="font-family:'Figtree',sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:8px;">Total Submissions</div>
      <div style="font-family:'Figtree',sans-serif;font-size:36px;font-weight:600;color:#2b76c6;line-height:1;">${submissionCount}</div>
    </div>
    
    <a href="${formUrl}" style="display:inline-block;font-family:'Lora',Georgia,serif;font-size:15px;font-weight:500;background-color:#2b76c6;color:#fcfbf7;text-decoration:none;padding:12px 32px;border-radius:12px;box-shadow:0 4px 15px rgba(43,118,198,0.3);">View Submissions</a>
    
    <div style="font-family:'Figtree',sans-serif;font-size:11px;color:#94a3b8;margin-top:40px;">StarForm SaaS Platform</div>
  </div>
</body>
</html>`;

  try {
    await resend?.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `New response: ${formTitle}`,
      html,
    });
  } catch (err) {
    logger.error({ err, to, formTitle }, 'Failed to send creator notification email');
  }
}
