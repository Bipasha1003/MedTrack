# 💊 MedTrack — AI-Powered Medicine Expiry Tracker

<div align="center">

![MedTrack Banner](https://img.shields.io/badge/MedTrack-Medicine%20Tracker-4f8ef7?style=for-the-badge)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Never use an expired medicine again.**

A full-stack web app that helps families track medicine expiry dates using AI label scanning, multilingual chat, and automated email alerts.

<<<<<<< HEAD
[🌐 Live Demo](https://medtrack-bm.netlify.app/) · [🐛 Report Bug](mailto:meditrackerexpire@gmail.com) · [💡 Request Feature](mailto:meditrackerexpire@gmail.com)
=======
[Live Demo](https://medtrack-bm.netlify.app/) · [Report Bug](mailto:meditrackerexpire@gmail.com) · [Request Feature](mailto:meditrackerexpire@gmail.com)
>>>>>>> 70aaefea7b74df621e2106d491f842c88338dbf3

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | AI Chat |
|---|---|---|
<<<<<<< HEAD
| ![Landing](https://raw.githubusercontent.com/Bipasha1003/MedTrack/main/frontend/public/Screenshots/Landing.png) | ![Dashboard](https://raw.githubusercontent.com/Bipasha1003/MedTrack/main/frontend/public/Screenshots/Dashboard.png) | ![Chat](https://raw.githubusercontent.com/Bipasha1003/MedTrack/main/frontend/public/Screenshots/AI-Chat.png) |
=======
| ![Landing](https://github.com/Bipasha1003/MedTrack/blob/main/frontend/public/Screenshots/Landing.png) | ![Dashboard](medicine-tracker/frontend/public/Screenshots/Dashboard.png) | ![Chat](medicine-tracker/frontend/public/Screenshots/AI-Chat.png) |

>>>>>>> 70aaefea7b74df621e2106d491f842c88338dbf3

---

## ✨ Features

- 🔍 **AI Label Scanner** — Take a photo of any medicine box. Gemini AI reads name, dosage, and expiry date automatically
- 📊 **Expiry Dashboard** — Color-coded view of all medicines (expired / expiring soon / safe)
- 🤖 **Multilingual AI Chat** — Ask questions in any of 19 languages. AI knows your exact medicine cabinet
- 📧 **Automated Email Alerts** — Welcome email on register, confirmation on medicine add, daily morning expiry alerts
- 👤 **Profile Management** — Update name, phone, and password from the account page
- 🔒 **Secure Auth** — JWT-based authentication with bcrypt password hashing
- 📱 **Fully Responsive** — Works perfectly on mobile, tablet, and desktop
- 🎙️ **Voice Input** — Hold to record in 19 languages with text-to-speech responses

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend |
| React Dropzone | Image upload for scanning |
| React Hot Toast | Notifications |
| Outfit + Plus Jakarta Sans | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM v5 | Database queries |
| PostgreSQL (Supabase) | Database |
| JWT + bcryptjs | Authentication |
| Multer | Image upload handling |
| Nodemailer + Brevo SMTP | Email delivery |
| Node-cron | Daily expiry check scheduler |

### AI & External Services
| Service | Purpose |
|---|---|
| Google Gemini 2.0 Flash Lite | Medicine label OCR + AI chat |
| Web Speech API | Voice input in 19 languages |
| Supabase | PostgreSQL database hosting |
| Brevo SMTP | Email delivery (works on Render free tier) |

---

## 🗄️ Database Schema

```
User                          Medicine
────────────────              ────────────────────────────
id (PK)                       id (PK)
email (unique)                userId (FK → User.id)
name                          name
phone                         dosage
password (hashed)             category
createdAt                     quantity
                              expiryDate
                              rawOcrText
                              imageUrl
                              aiParsed
                              createdAt
```

**Relationship:** One User → Many Medicines (one-to-many)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- Supabase account (free)
- Google AI Studio account (for Gemini API key)
- Brevo account (free, for email delivery)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Bipasha1003/MedTrack.git
cd MedTrack
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in the `backend` folder:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
JWT_SECRET="your-random-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
BREVO_USER="your-brevo-smtp-login"
BREVO_PASS="your-brevo-smtp-password"
ALERT_SECRET="your-manual-trigger-secret"
PORT=5000
```

Initialize database:
```bash
npx prisma db push
npx prisma generate
```

Start backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
```

Create `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser. ✅

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | How to get |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Supabase Dashboard → Settings → Database |
| `JWT_SECRET` | Any random long string | Make one up |
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| `BREVO_USER` | Brevo SMTP login | Brevo Dashboard → Transactional → SMTP |
| `BREVO_PASS` | Brevo SMTP password | Brevo Dashboard → Generate SMTP key |
| `ALERT_SECRET` | Secret key for manual email trigger | Make one up |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (use Render URL in production) |

---

## 📁 Project Structure

```
MedTrack/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── medicineController.js
│   │   │   ├── scanController.js
│   │   │   └── chatController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── medicines.js
│   │   │   ├── scan.js
│   │   │   └── chat.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── lib/
│   │   │   ├── prisma.js
│   │   │   ├── sendEmail.js
│   │   │   └── emailAlert.js
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── icon.png
    │   └── Screenshots/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AddMedicine.jsx
    │   │   ├── Scan.jsx
    │   │   ├── Chat.jsx
    │   │   └── Profile.jsx
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── lib/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

---

## 🌊 How It Works

```
User uploads medicine photo
         ↓
Multer receives image in backend
         ↓
Image converted to base64
         ↓
Sent to Gemini Vision API
         ↓
Gemini extracts: name, dosage, expiry date
         ↓
Returned as JSON to frontend
         ↓
User reviews and confirms
         ↓
Saved to PostgreSQL via Prisma
         ↓
Confirmation email sent via Brevo
         ↓
Dashboard shows expiry status
         ↓
Daily cron at 9am UTC checks expiry
         ↓
Brevo sends alert email if expiring soon
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account + sends welcome email | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update name & phone | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Medicines
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/medicines` | Get all user medicines | Yes |
| POST | `/api/medicines` | Add medicine + sends confirmation email | Yes |
| PUT | `/api/medicines/:id` | Update medicine | Yes |
| DELETE | `/api/medicines/:id` | Delete medicine | Yes |

### AI Features
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/scan` | Scan medicine label via Gemini AI | Yes |
| POST | `/api/chat` | Multilingual AI chat assistant | Yes |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/send-alerts?secret=YOUR_SECRET` | Manually trigger expiry alert emails |

---

## 🚢 Deployment

### Frontend → Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from GitHub
3. Set **Base directory** to `frontend`
4. Set **Build command** to `npm run build`
5. Set **Publish directory** to `frontend/dist`
6. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
7. Add `frontend/public/_redirects` file with: `/* /index.html 200`
8. Click **Deploy** ✅

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build command** to `npm install`
5. Set **Start command** to `node src/server.js`
6. Add all environment variables
7. Click **Deploy** ✅

---

## 🗺️ Roadmap

- [x] AI medicine label scanner (Gemini Vision)
- [x] Expiry dashboard with color coding
- [x] Daily email alerts via Brevo
- [x] Welcome email on registration
- [x] Medicine added confirmation email
- [x] Multilingual AI chat assistant (19 languages)
- [x] Voice input and text-to-speech
- [x] Profile management
- [x] Responsive design (mobile + desktop)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Barcode / QR code scanning
- [ ] Family cabinet sharing
- [ ] WhatsApp alert integration

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👩‍💻 Author

**Bipasha Mondal**
- GitHub: [@Bipasha1003](https://github.com/Bipasha1003)
- LinkedIn: [Bipasha Mondal](https://www.linkedin.com/in/bipasha-mondal-59aa60244/)
- Email: [bipasham103@gmail.com](mailto:bipasham103@gmail.com)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev) for vision and language capabilities
- [Supabase](https://supabase.com) for free PostgreSQL hosting
- [Prisma](https://prisma.io) for excellent ORM
- [Brevo](https://brevo.com) for reliable email delivery
- [Netlify](https://netlify.com) for frontend hosting
- [Render](https://render.com) for backend hosting
- Built with ♥ in Kolkata, India

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ♥ by [Bipasha Mondal](https://github.com/Bipasha1003)

</div>