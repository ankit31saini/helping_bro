# 🚀 AI Job Prep Assistant (Helping Bro)

A full-stack, AI-powered career assistant designed to bridge the gap between candidate resumes and specific job requirements. By leveraging **Google Gemini AI**, this application analyzes PDF resumes against job descriptions to dynamically score the match, extract critical skill gaps, and generate highly targeted interview prep questions.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), SCSS, lucide-react, html2pdf.js (for dynamic client-side PDF generation)
- **Backend:** Node.js, Express.js, Multer (PDF upload streaming), Google Gemini SDK
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** Supabase (Magic Link & OAuth)
- **Deployment:** Ready for Vercel (Frontend) & Render (Backend)

---

## 🔑 Features
*   **Intelligent Resume Parsing:** Secure, in-memory PDF extraction and processing.
*   **AI Match Scoring:** Get a deterministic percentage score evaluating how well your resume matches the target job.
*   **Gap Identification:** Instantly see keywords and technical tools missing from your resume.
*   **Custom Interview Guide:** Generates technical, behavioral, and general recommendations tailored to your profile.
*   **Zero-Dependency PDF Export:** Converts your detailed AI report into a clean desktop PDF using native browser rendering.

---

## ⚙️ Environment Variables Setup

Before running the application, you must set up your environment variables locally. Ensure that you never commit `.env` files to Git.

### 1. Backend (`/server/.env`)
Create a `.env` file in the `server` directory and add:
```env
PORT=5001
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGO_URI=your_mongodb_cluster_string

# Google Gemini API
GEMINI_API_KEY=your_google_ai_studio_key
```

### 2. Frontend (`/client/.env`)
Create a `.env` file in the `client` directory and add:
```env
VITE_API_URL=http://localhost:5001/api/v1
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Running the Project Locally

### Start the Backend
```bash
cd server
npm install
npm start
```
*The backend will boot up on `http://localhost:5001` and connect to your MongoDB cluster.*

### Start the Frontend
```bash
cd client
npm install
npm run dev
```
*The frontend will spawn using Vite on `http://localhost:5173`.*

---

## ☁️ Deployment Best Practices

*   **Vercel (Client):** Ensure `VITE_API_URL` points to your deployed backend remote link WITHOUT a trailing slash (e.g. `https://your-backend.onrender.com/api/v1`). Any change to `.env` variables requires an explicit **Redeploy** on Vercel.
*   **Render (Server):** Use the standard Web Service option to bypass Docker dependencies. The cross-origin resource sharing (CORS) array is hard-coded to dynamically accept localhost and standard Vercel environments automatically.
*   **Supabase (Auth):** If launching publicly, remember to update the **Site URL** config inside your Authentication dashboard so users aren't redirected to a dead localhost port upon email verification!

---

*Secured, modular, and built for production.*
