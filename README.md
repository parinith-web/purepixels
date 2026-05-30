# PurePixels — AI Background Remover

<div align="center">

![PurePixels Hero](https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/hero.png)

**Remove image backgrounds in under 5 seconds — powered by high-accuracy AI segmentation.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-purepixels.app-blue?style=for-the-badge)](https://github.com/parinith-web/purepixels)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><b>Landing Page</b></td>
    <td align="center"><b>Pricing Plans</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/hero.png" width="100%"/></td>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/pricing.png" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Dashboard — Upload</b></td>
    <td align="center"><b>Before / After Result</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/dashboard.png" width="100%"/></td>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/result.png" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>My Processed Images</b></td>
    <td align="center"><b>Billing & Payments</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/myimages.png" width="100%"/></td>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/billing.png" width="100%"/></td>
  </tr>
</table>

---

## ✨ Features

- **AI-Powered Background Removal** — Integrates with the ClipDrop API for fast, accurate segmentation in under 5 seconds
- **Before / After Slider** — Interactive comparison view after processing
- **Image History** — View, download, and delete all previously processed images
- **User Authentication** — Full sign-up / sign-in flow with OTP email verification via Resend
- **Cloud Storage** — Processed images stored on Cloudinary
- **Subscription Billing** — Razorpay-powered payments with Free, Pro Monthly (₹299), and Pro Yearly (₹2,999) plans
- **Credit System** — Daily usage limits on the free tier; credit-based system for Pro users
- **Developer API** — REST API access available for Pro subscribers
- **Responsive UI** — Built with Tailwind CSS and shadcn/ui components

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| shadcn/ui + Radix UI | Component library |
| React Router v6 | Client-side routing |
| TanStack Query | Server state management |
| Framer Motion | Animations |
| Zod + React Hook Form | Form validation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Multer | File upload handling |
| Cloudinary SDK | Image cloud storage |
| Razorpay SDK | Payment processing |
| Resend | Transactional emails (OTP) |
| ClipDrop API | AI background removal |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Accounts for: [ClipDrop](https://clipdrop.co/apis), [Cloudinary](https://cloudinary.com), [Razorpay](https://razorpay.com), [Resend](https://resend.com)

### 1. Clone the repository

```bash
git clone https://github.com/parinith-web/purepixels.git
cd purepixels
```

### 2. Set up the Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5001
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
ALLOW_MOCK_PAYMENTS=true

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/purepixels

# Auth
JWT_SECRET=your-long-random-secret-here

# ClipDrop — AI background removal
CLIPDROP_API_KEY=your_clipdrop_api_key_here

# Cloudinary — image storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay — payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Resend — transactional emails
RESEND_API_KEY=
EMAIL_FROM=PurePixels <noreply@yourdomain.com>
```

Start the server:

```bash
npm run dev        # development (nodemon)
npm start          # production
```

The API runs on `http://localhost:5001`.

### 3. Set up the Frontend

```bash
cd ../client
npm install
npm run dev        # starts on http://localhost:5173
```

---

## 📁 Project Structure

```
purepixels/
├── client/                      # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Index.tsx        # Landing page
│       │   ├── Dashboard.tsx    # Main upload & result view
│       │   ├── History.tsx      # My processed images
│       │   ├── Pricing.tsx      # Plans & pricing
│       │   ├── Login.tsx        # Sign in
│       │   ├── Signup.tsx       # Register
│       │   ├── Profile.tsx      # User profile
│       │   └── ApiDocs.tsx      # API documentation
│       ├── components/
│       │   ├── landing/         # Hero, FAQ, How It Works, etc.
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   └── ui/              # shadcn/ui components
│       ├── context/
│       │   └── AuthContext.tsx  # Global auth state
│       └── App.tsx              # Route definitions
│
└── server/                      # Express backend
    ├── server.js                # Entry point
    ├── routes.js                # All API routes
    ├── models.js                # Mongoose schemas
    ├── auth.js                  # JWT middleware
    └── .env.example             # Environment template
```

---

## 🔌 API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Register + send OTP |
| `POST` | `/auth/verify-otp` | — | Verify email OTP |
| `POST` | `/auth/login` | — | Sign in, returns JWT |
| `GET` | `/user/profile` | ✅ | Get user profile & credits |
| `POST` | `/remove-background` | ✅ | Upload image, get transparent PNG |
| `GET` | `/images` | ✅ | List user's processed images |
| `DELETE` | `/images/:id` | ✅ | Delete a processed image |
| `POST` | `/payments/create-order` | ✅ | Create Razorpay order |
| `POST` | `/payments/verify` | ✅ | Verify payment & activate plan |

---

## 💳 Pricing Plans

| Plan | Price | Credits | Features |
|---|---|---|---|
| **Free** | ₹0 / forever | 5 images/day | 720p max, standard speed, basic formats |
| **Pro Monthly** | ₹299 / month | 100 credits | Full HD, no watermark, API access, priority processing |
| **Pro Yearly** | ₹2,999 / year | 1,200 credits | Everything in Pro Monthly + best value (save ₹589/yr) |

---

## 🔐 Auth Flow

<table>
  <tr>
    <td align="center"><b>Sign Up</b></td>
    <td align="center"><b>Email Verification</b></td>
    <td align="center"><b>Sign In</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/signup.png" width="100%"/></td>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/verify.png" width="100%"/></td>
    <td><img src="https://raw.githubusercontent.com/parinith-web/purepixels/main/screenshots/login.png" width="100%"/></td>
  </tr>
</table>

1. User submits name, email, and password
2. A 6-digit OTP is sent via Resend email
3. User verifies OTP to activate account
4. On sign-in, a JWT is issued and stored client-side

---

## 🛠️ Development Scripts

```bash
# Backend
npm run dev        # nodemon hot-reload
npm start          # production start

# Frontend
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run Vitest tests
npm run lint       # ESLint check
```

---

## 🌐 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5001) |
| `NODE_ENV` | Yes | `development` or `production` |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Long random secret for token signing |
| `CLIPDROP_API_KEY` | Yes | ClipDrop API key for background removal |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay key secret |
| `RESEND_API_KEY` | Yes | Resend API key for emails |
| `EMAIL_FROM` | Yes | Sender name/address for emails |
| `ALLOW_MOCK_PAYMENTS` | No | `true` to enable test payments in dev |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins |

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <b>Developed by <a href="https://github.com/parinith-web">Parinith Reddy</a></b><br/>
  © 2026 PurePixels. All rights reserved.
</div>
