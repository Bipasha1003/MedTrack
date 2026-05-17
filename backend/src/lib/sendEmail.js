const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM = { name: 'MedTrack', email: 'meditrackerexpire@gmail.com' };
const APP_URL = 'https://medtrack-bm.netlify.app';

// ─── Core Brevo sender ────────────────────────────────────────
async function brevoSend(payload) {
  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo API error: ${err}`);
  }
}

// ─── Welcome Email ────────────────────────────────────────────
async function sendWelcomeEmail(userEmail, userName) {
  await brevoSend({
    sender: FROM,
    to: [{ email: userEmail, name: userName }],
    subject: 'Welcome to MedTrack! 💊',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #070b12; color: #eef2ff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f8ef7, #2dd98f); padding: 28px 32px;">
          <h1 style="margin: 0; font-size: 24px; color: white;">💊 Welcome to MedTrack!</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Your medicine cabinet is ready</p>
        </div>
        <div style="padding: 28px 32px;">
          <p style="font-size: 16px; color: #c8d6e8; margin: 0 0 16px;">
            Hello <strong style="color: #eef2ff;">${userName}</strong>! 👋
          </p>
          <p style="font-size: 15px; color: #7d8faa; line-height: 1.7; margin: 0 0 24px;">
            Your MedTrack account is all set. Start adding your medicines to track expiry dates, get daily alerts, and ask AI anything about your cabinet.
          </p>
          <div style="background: rgba(79,142,247,0.08); border: 1px solid rgba(79,142,247,0.2); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #eef2ff; font-weight: 600;">🚀 Get started in 3 steps:</p>
            <p style="margin: 0 0 6px; font-size: 14px; color: #7d8faa;">1. Add your medicines manually or scan labels</p>
            <p style="margin: 0 0 6px; font-size: 14px; color: #7d8faa;">2. Get daily expiry alerts in your inbox</p>
            <p style="margin: 0; font-size: 14px; color: #7d8faa;">3. Ask AI anything about your medicines</p>
          </div>
          <div style="text-align: center;">
            <a href="${APP_URL}/dashboard"
               style="display: inline-block; padding: 13px 32px; background: linear-gradient(135deg, #4f8ef7, #3b7de8); color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Open My Cabinet →
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.07); text-align: center;">
          <p style="color: #3d4f66; font-size: 12px; margin: 0;">
            MedTrack · Made with ♥ in India ·
            <a href="mailto:meditrackerexpire@gmail.com" style="color: #4f8ef7;">meditrackerexpire@gmail.com</a>
          </p>
        </div>
      </div>
    `,
  });
  console.log(`Welcome email sent to ${userEmail}`);
}

// ─── Login Notification Email ─────────────────────────────────
async function sendLoginEmail(userEmail, userName) {
  await brevoSend({
    sender: FROM,
    to: [{ email: userEmail, name: userName }],
    subject: '🔐 New Login to MedTrack',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #070b12; color: #eef2ff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f8ef7, #2dd98f); padding: 28px 32px;">
          <h1 style="margin: 0; font-size: 22px; color: white;">🔐 Login Detected</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${new Date().toDateString()} · ${new Date().toLocaleTimeString('en-IN')}</p>
        </div>
        <div style="padding: 28px 32px;">
          <p style="font-size: 15px; color: #c8d6e8; margin: 0 0 20px;">
            Hello <strong style="color: #eef2ff;">${userName}</strong>, a new login was detected on your MedTrack account.
          </p>
          <div style="background: rgba(79,142,247,0.08); border: 1px solid rgba(79,142,247,0.2); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #7d8faa;">🕐 Time: <strong style="color: #eef2ff;">${new Date().toLocaleString('en-IN')}</strong></p>
            <p style="margin: 0; font-size: 14px; color: #7d8faa;">If this wasn't you, please change your password immediately.</p>
          </div>
          <div style="text-align: center;">
            <a href="${APP_URL}/dashboard"
               style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #4f8ef7, #3b7de8); color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Open My Cabinet →
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.07); text-align: center;">
          <p style="color: #3d4f66; font-size: 12px; margin: 0;">
            MedTrack · Made with ♥ in India ·
            <a href="mailto:meditrackerexpire@gmail.com" style="color: #4f8ef7;">meditrackerexpire@gmail.com</a>
          </p>
        </div>
      </div>
    `,
  });
  console.log(`Login email sent to ${userEmail}`);
}

// ─── Medicine Added Email ─────────────────────────────────────
async function sendMedicineAddedEmail(userEmail, userName, medicine) {
  const expiryDate = new Date(medicine.expiryDate);
  const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;
  const statusColor = isExpired ? '#f56565' : daysLeft <= 30 ? '#f59e0b' : '#2dd98f';
  const statusText = isExpired ? 'Already Expired!' : `${daysLeft} days left`;

  await brevoSend({
    sender: FROM,
    to: [{ email: userEmail, name: userName }],
    subject: `Medicine Added — ${medicine.name} 💊`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #070b12; color: #eef2ff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f8ef7, #2dd98f); padding: 28px 32px;">
          <h1 style="margin: 0; font-size: 22px; color: white;">✅ Medicine Added</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${new Date().toDateString()}</p>
        </div>
        <div style="padding: 28px 32px;">
          <p style="font-size: 15px; color: #c8d6e8; margin: 0 0 20px;">
            Hello <strong style="color: #eef2ff;">${userName}</strong>, a new medicine has been added to your cabinet.
          </p>
          <div style="background: #0d1220; border: 1px solid rgba(255,255,255,0.07); border-left: 4px solid ${statusColor}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 12px; font-size: 18px; color: #eef2ff;">${medicine.name}</h2>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              ${medicine.dosage ? `<span style="font-size: 13px; color: #7d8faa;">💊 ${medicine.dosage}</span>` : ''}
              ${medicine.category ? `<span style="font-size: 13px; color: #7d8faa;">📋 ${medicine.category}</span>` : ''}
              <span style="font-size: 13px; color: #7d8faa;">📅 Expires: ${expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div style="margin-top: 12px;">
              <span style="font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 20px; color: ${statusColor}; background: ${statusColor}18; border: 1px solid ${statusColor}33;">
                ${statusText}
              </span>
            </div>
          </div>
          <div style="text-align: center;">
            <a href="${APP_URL}/dashboard"
               style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #4f8ef7, #3b7de8); color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
              View Cabinet →
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.07); text-align: center;">
          <p style="color: #3d4f66; font-size: 12px; margin: 0;">
            MedTrack · Made with ♥ in India ·
            <a href="mailto:meditrackerexpire@gmail.com" style="color: #4f8ef7;">meditrackerexpire@gmail.com</a>
          </p>
        </div>
      </div>
    `,
  });
  console.log(`Medicine added email sent to ${userEmail}`);
}

// ─── Password Reset Email ─────────────────────────────────────
async function sendPasswordResetEmail(userEmail, userName, resetUrl) {
  await brevoSend({
    sender: FROM,
    to: [{ email: userEmail, name: userName }],
    subject: '🔒 MedTrack — Reset Your Password',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #070b12; color: #eef2ff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f8ef7, #2dd98f); padding: 28px 32px;">
          <h1 style="margin: 0; font-size: 22px; color: white;">🔒 Password Reset</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">MedTrack account security</p>
        </div>
        <div style="padding: 28px 32px;">
          <p style="font-size: 15px; color: #c8d6e8; margin: 0 0 16px;">
            Hello <strong style="color: #eef2ff;">${userName}</strong>,
          </p>
          <p style="font-size: 15px; color: #7d8faa; line-height: 1.7; margin: 0 0 24px;">
            We received a request to reset your MedTrack password. Click the button below. This link expires in <strong style="color: #eef2ff;">1 hour</strong>.
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}"
               style="display: inline-block; padding: 13px 32px; background: linear-gradient(135deg, #4f8ef7, #3b7de8); color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Reset My Password →
            </a>
          </div>
          <div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); border-radius: 10px; padding: 14px 16px;">
            <p style="margin: 0; font-size: 13px; color: #f59e0b;">
              ⚠️ If you didn't request this, ignore this email. Your password will not change.
            </p>
          </div>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.07); text-align: center;">
          <p style="color: #3d4f66; font-size: 12px; margin: 0;">
            MedTrack · Made with ♥ in India ·
            <a href="mailto:meditrackerexpire@gmail.com" style="color: #4f8ef7;">meditrackerexpire@gmail.com</a>
          </p>
        </div>
      </div>
    `,
  });
  console.log(`Password reset email sent to ${userEmail}`);
}

// ─── Single exports — all 4 functions ────────────────────────
module.exports = {
  sendWelcomeEmail,
  sendLoginEmail,
  sendMedicineAddedEmail,
  sendPasswordResetEmail,
};