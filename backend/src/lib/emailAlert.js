const cron = require('node-cron');
const nodemailer = require('nodemailer');
const prisma = require('./prisma');

// Gmail connection using env variables — NEVER hardcode these
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function checkAndSendAlerts() {
  console.log('Running daily expiry check...');

  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    // Find medicines expiring within 30 days
    const expiringMedicines = await prisma.medicine.findMany({
      where: {
        expiryDate: { gte: today, lte: thirtyDaysLater }
      },
      include: { user: true }
    });

    // Find already expired medicines
    const expiredMedicines = await prisma.medicine.findMany({
      where: {
        expiryDate: { lt: today }
      },
      include: { user: true }
    });

    const allAlerts = [...expiringMedicines, ...expiredMedicines];

    if (allAlerts.length === 0) {
      console.log('No expiring medicines found');
      return;
    }

    // Group by user — one email per user
    const byUser = {};
    allAlerts.forEach(med => {
      const email = med.user.email;
      if (!byUser[email]) {
        byUser[email] = { expiring: [], expired: [], userName: med.user.name };
      }
      const daysLeft = Math.ceil(
        (new Date(med.expiryDate) - today) / (1000 * 60 * 60 * 24)
      );
      if (daysLeft < 0) {
        byUser[email].expired.push(med);
      } else {
        byUser[email].expiring.push({ ...med, daysLeft });
      }
    });

    // Send one email per user
    for (const [userEmail, data] of Object.entries(byUser)) {
      await transporter.sendMail({
        from: `"MedTrack" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: '⚠️ MedTrack — Medicine Expiry Alert',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #070b12; color: #eef2ff; border-radius: 16px; overflow: hidden;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4f8ef7, #2dd98f); padding: 28px 32px;">
              <h1 style="margin: 0; font-size: 22px; color: white;">💊 MedTrack Alert</h1>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                Medicine cabinet update for ${new Date().toDateString()}
              </p>
            </div>

            <!-- Greeting -->
            <div style="padding: 20px 32px 0;">
              <p style="color: #c8d6e8; font-size: 15px; margin: 0;">
                Hello <strong style="color: #eef2ff;">${data.userName || 'there'}</strong>, here is your medicine cabinet status:
              </p>
            </div>

            <!-- Body -->
            <div style="padding: 16px 32px 28px;">

              ${data.expired.length > 0 ? `
                <div style="background: rgba(245,101,101,0.1); border: 1px solid rgba(245,101,101,0.3); border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                  <h2 style="color: #f56565; margin: 0 0 12px; font-size: 16px;">❌ Expired — Dispose Immediately</h2>
                  ${data.expired.map(m => `
                    <div style="padding: 8px 0; border-bottom: 1px solid rgba(245,101,101,0.15); font-size: 14px;">
                      <strong style="color: #eef2ff;">${m.name}</strong>
                      ${m.dosage ? `<span style="color: #7d8faa;"> · ${m.dosage}</span>` : ''}
                      <div style="color: #f56565; font-size: 12px; margin-top: 2px;">
                        Expired on ${new Date(m.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${data.expiring.length > 0 ? `
                <div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                  <h2 style="color: #f59e0b; margin: 0 0 12px; font-size: 16px;">⚠️ Expiring Soon</h2>
                  ${data.expiring.map(m => `
                    <div style="padding: 8px 0; border-bottom: 1px solid rgba(245,158,11,0.15); font-size: 14px;">
                      <strong style="color: #eef2ff;">${m.name}</strong>
                      ${m.dosage ? `<span style="color: #7d8faa;"> · ${m.dosage}</span>` : ''}
                      <div style="color: #f59e0b; font-size: 12px; margin-top: 2px;">
                        Expires in <strong>${m.daysLeft} days</strong> ·
                        ${new Date(m.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- CTA button — points to production URL -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://medtrack-bm.netlify.app/dashboard"
                   style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #4f8ef7, #3b7de8); color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Open Medicine Cabinet →
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.07); text-align: center;">
              <p style="color: #3d4f66; font-size: 12px; margin: 0;">
                MedTrack · Made with ♥ in India ·
                <a href="mailto:meditrackerexpire@gmail.com" style="color: #4f8ef7;">meditrackerexpire@gmail.com</a>
              </p>
            </div>
          </div>
        `,
      });

      console.log(`Email sent to ${userEmail}`);
    }

  } catch (error) {
    console.error('Email alert error:', error);
  }
}

// Runs every day at 9:00 AM UTC = 2:30 PM IST
function startCronJob() {
  cron.schedule('0 9 * * *', checkAndSendAlerts);
  console.log('Expiry alert cron job started');
}

module.exports = { startCronJob, checkAndSendAlerts };