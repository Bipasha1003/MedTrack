# 💊 MedTrack — AI-Powered Medicine Expiry Tracker

<div align="center">

![MedTrack Banner](https://img.shields.io/badge/MedTrack-Medicine%20Tracker-4f8ef7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xIDV2NGg0djJoLTR2NGgtMnYtNEg3di0yaDR2LTRINVY3eiIvPjwvc3ZnPg==)

[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

**Never use an expired medicine again.**

A full-stack web app that helps families track medicine expiry dates using AI label scanning, multilingual chat, and daily email alerts.

[Live Demo](https://medtrack-app.vercel.app) · [Report Bug](mailto:meditrackerexpire@gmail.com) · [Request Feature](mailto:meditrackerexpire@gmail.com)

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | AI Chat |
|---|---|---|
| ![Landing](medicine-tracker/frontend/public/Screenshots/Leading.png) | ![Dashboard](medicine-tracker/frontend/public/Screenshots/Dashboard.png) | ![Chat](medicine-tracker/frontend/public/Screenshots/AI-Chat.png) |


---

## ✨ Features

- 🔍 **AI Label Scanner** — Take a photo of any medicine box. Gemini AI reads name, dosage, and expiry date automatically
- 📊 **Expiry Dashboard** — Color-coded view of all medicines (expired / expiring soon / safe)
- 🤖 **Multilingual AI Chat** — Ask questions in any language. AI knows your exact medicine cabinet
- 📧 **Daily Email Alerts** — Automatic reminders before medicines expire via Gmail
- 👤 **Profile Management** — Update name, phone, and password from the account page
- 🔒 **Secure Auth** — JWT-based authentication with bcrypt password hashing
- 📱 **Fully Responsive** — Works perfectly on mobile, tablet, and desktop
- 🌍 **19 Languages** — Voice input and AI response in Hindi, Bengali, Tamil, and 16 more

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
| DM Sans + Syne + Outfit | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM v5 | Database queries |
| PostgreSQL (Supabase) | Database |
| JWT + bcryptjs | Authentication |
| Multer | Image upload handling |
| Nodemailer | Email alerts via Gmail |
| Node-cron | Daily expiry check scheduler |

### AI & External Services
| Service | Purpose |
|---|---|
| Google Gemini 2.5 Flash | Medicine label OCR + AI chat |
| Web Speech API | Voice input in 19 languages |
| Supabase | PostgreSQL database hosting |
| Gmail SMTP | Email alert delivery |

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
- Gmail account (for email alerts)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Bipasha1003/MedTrack.git
cd MedTrack/medicine-tracker
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in the `backend` folder:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
JWT_SECRET="your-random-secret-key-make-it-long"
GEMINI_API_KEY="your-gemini-api-key"
GMAIL_USER="your-gmail@gmail.com"
GMAIL_PASS="your-16-char-app-password"
PORT=5000
```

> ⚠️ Never commit your real `.env` file. Use `.env.example` as a reference template.

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
npm run dev
```

Open `http://localhost:5173` in your browser. ✅

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | How to get |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Supabase Dashboard → Settings → Database |
| `JWT_SECRET` | Any random long string | Make one up (e.g. use a UUID) |
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| `GMAIL_USER` | Gmail address to send alerts from | Your Gmail address |
| `GMAIL_PASS` | Gmail App Password (16 chars) | Google Account → Security → App Passwords |

---

## 📁 Project Structure

```
MedTrack/
└── medicine-tracker/
    ├── backend/
    │   ├── prisma/
    │   │   └── schema.prisma          # Database schema
    │   ├── src/
    │   │   ├── controllers/
    │   │   │   ├── authController.js  # Login, register, profile update
    │   │   │   ├── medicineController.js
    │   │   │   ├── scanController.js  # Gemini AI image scan
    │   │   │   └── chatController.js  # Gemini AI multilingual chat
    │   │   ├── routes/
    │   │   │   ├── auth.js
    │   │   │   ├── medicines.js
    │   │   │   ├── scan.js
    │   │   │   └── chat.js
    │   │   ├── middleware/
    │   │   │   └── auth.js            # JWT verification middleware
    │   │   ├── lib/
    │   │   │   ├── prisma.js          # Prisma client singleton
    │   │   │   └── emailAlert.js      # Daily expiry email cron job
    │   │   └── server.js
    │   ├── .env                       # ← never commit this
    │   ├── .env.example               # ← commit this instead
    │   └── package.json
    │
    └── frontend/
        ├── public/
        │   ├── icon.png               # App logo
        │   └── Screenshots/           # Screenshots for README
        ├── src/
        │   ├── pages/
        │   │   ├── Landing.jsx        # Public landing page
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── Dashboard.jsx      # Medicine cabinet
        │   │   ├── AddMedicine.jsx
        │   │   ├── Scan.jsx           # AI label scanner
        │   │   ├── Chat.jsx           # AI assistant (voice + text)
        │   │   └── Profile.jsx        # Account settings
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
Dashboard shows expiry status
         ↓
Daily cron at 9am checks expiry
         ↓
Gmail sends alert if expiring soon
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update name & phone | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Medicines
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/medicines` | Get all user medicines | Yes |
| POST | `/api/medicines` | Add new medicine | Yes |
| PUT | `/api/medicines/:id` | Update medicine | Yes |
| DELETE | `/api/medicines/:id` | Delete medicine | Yes |

### AI Features
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/scan` | Scan medicine label image via Gemini | Yes |
| POST | `/api/chat` | AI chat assistant (multilingual) | Yes |

---

## 🚢 Deployment

### Frontend → Vercel (recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Set **Root Directory** to `medicine-tracker/frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Click **Deploy** ✅

### Backend → Render (recommended)
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `medicine-tracker/backend`
4. **Build command:** `npm install && npx prisma generate`
5. **Start command:** `node src/server.js`
6. Add all your `.env` variables under **Environment**
7. Click **Deploy** ✅

### Update CORS after deployment
In `backend/src/server.js`, update the CORS origin from `localhost:5173` to your Vercel URL:
```js
app.use(cors({
  origin: 'https://your-app.vercel.app',  // ← update this
  credentials: true
}));
```

---

## 🗺️ Roadmap

- [x] AI medicine label scanner (Gemini Vision)
- [x] Expiry dashboard with color coding
- [x] Daily email alerts via Gmail
- [x] Multilingual AI chat assistant
- [x] Voice input in 19 languages
- [x] Profile management (name, phone, password)
- [x] Responsive design (mobile + desktop)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Barcode / QR code scanning
- [ ] Family cabinet sharing (multiple users)
- [ ] Medicine reorder reminders
- [ ] WhatsApp alert integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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
- Email: [meditrackerexpire@gmail.com](mailto:bipasham103@gmail.com)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev) for vision and language capabilities
- [Supabase](https://supabase.com) for free PostgreSQL hosting
- [Prisma](https://prisma.io) for excellent ORM
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting
- Built with ♥ in Kolkata, India

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ♥ by [Bipasha Mondal](https://github.com/Bipasha1003)

</div>