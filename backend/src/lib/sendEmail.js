const nodemailer = require('nodemailer');

// Brevo SMTP — works on Render free tier
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const FROM = '"MedTrack" <meditrackerexpire@gmail.com>';
const APP_URL = 'https://medtrack-bm.netlify.app';

// ─── Welcome Email ────────────────────────────────────────────
async function sendWelcomeEmail(userEmail, userName) {
  await transporter.sendMail({
    from: FROM,
    to: userEmail,
    subject: 'Welcome to MedTrack! 💊',
    html: `
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

// ─── Medicine Added Email ─────────────────────────────────────
async function sendMedicineAddedEmail(userEmail, userName, medicine) {
  const expiryDate = new Date(medicine.expiryDate);
  const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;
  const statusColor = isExpired ? '#f56565' : daysLeft <= 30 ? '#f59e0b' : '#2dd98f';
  const statusText = isExpired ? 'Already Expired!' : `${daysLeft} days left`;

  await transporter.sendMail({
    from: FROM,
    to: userEmail,
    subject: `Medicine Added — ${medicine.name} 💊`,
    html: `
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

module.exports = { sendWelcomeEmail, sendMedicineAddedEmail };
