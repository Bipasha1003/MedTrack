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

[Live Demo](#) · [Report Bug](mailto:meditrackerexpire@gmail.com) · [Request Feature](mailto:meditrackerexpire@gmail.com)

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | AI Chat |
|---|---|---|
| ![Landing](https://via.placeholder.com/280x160/070b12/4f8ef7?text=Landing+Page) | ![Dashboard](https://via.placeholder.com/280x160/070b12/2dd98f?text=Dashboard) | ![Chat](https://via.placeholder.com/280x160/070b12/f59e0b?text=AI+Chat) |

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
| DM Sans + Syne | Typography |

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
| Google Gemini 2.0 Flash | Medicine label OCR + AI chat |
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
GMAIL_USER="your-gmail@gmail.com"
GMAIL_PASS="your-16-char-app-password"
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
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | How to get |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Supabase Dashboard → Settings → Database |
| `JWT_SECRET` | Any random long string | Make one up |
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| `GMAIL_USER` | Gmail address to send alerts from | Your Gmail address |
| `GMAIL_PASS` | Gmail App Password (16 chars) | Google Account → Security → App Passwords |

---

## 📁 Project Structure

```
MedTrack/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js  # Login, register, profile
│   │   │   ├── medicineController.js
│   │   │   ├── scanController.js  # Gemini AI image scan
│   │   │   └── chatController.js  # Gemini AI chat
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── medicines.js
│   │   │   ├── scan.js
│   │   │   └── chat.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification
│   │   ├── lib/
│   │   │   ├── prisma.js          # Database connection
│   │   │   └── emailAlert.js      # Daily expiry email cron
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── icon.png               # App logo
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx        # Public landing page
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx      # Medicine cabinet
    │   │   ├── AddMedicine.jsx
    │   │   ├── Scan.jsx           # AI label scanner
    │   │   ├── Chat.jsx           # AI assistant
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
| PUT | `/api/auth/profile` | Update profile | Yes |
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
| POST | `/api/scan` | Scan medicine label image | Yes |
| POST | `/api/chat` | AI chat assistant | Yes |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👩‍💻 Author

**Bipasha Mondal**
- GitHub: [@Bipasha1003](https://github.com/Bipasha1003)
- LinkedIn: [Bipasha Mondal](https://linkedin.com/in/bipasha-mondal)
- Email: [meditrackerexpire@gmail.com](mailto:meditrackerexpire@gmail.com)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev) for vision and language capabilities
- [Supabase](https://supabase.com) for free PostgreSQL hosting
- [Prisma](https://prisma.io) for excellent ORM
- Built with ♥ in Kolkata, India

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ♥ by [Bipasha Mondal](https://github.com/Bipasha1003)

</div>