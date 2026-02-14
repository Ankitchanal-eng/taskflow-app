# 🚀 TaskFlow – MERN Task Management App

TaskFlow is a full‑stack task management application built with the **MERN stack** (MongoDB, Express, React, Node.js).  
It provides secure authentication, user‑scoped tasks, and a clean dashboard UI for managing everyday work.

## 🌐 Live Demo

- **Frontend (Vercel)**: https://task-flow-app-roan.vercel.app  
- **Backend API (Render)**: https://taskflow-m3nm.onrender.com  

> Register a new account or log in and start creating tasks

## ✨ Features

- 🔐 **JWT Authentication** – Register, login, and stay authenticated with stateless JWT tokens.  
- 🧑‍💻 **User‑Scoped Tasks** – Each user can only access, update, and delete their own tasks.  
- ✅ **Full Task CRUD** – Create, read, update, and delete tasks.  
- 🔍 **Status Filtering** – Filter by `All`, `Pending`, `In Progress`, and `Completed`.  
- 📱 **Responsive UI** – Dashboard layout adapts to mobile, tablet, and desktop.

## 🧱 Tech Stack


| Layer     | Technologies                          |
|-|-|
| Frontend | React, Vite, React Router, Axios      |
| Backend  | Node.js, Express.js                   |
| Database | MongoDB Atlas, Mongoose               |
| Auth     | JWT, bcryptjs                         |
| Deploy   | Vercel (frontend), Render (backend)   |

## 📂 Project Structure

Taskflow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── user.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json

## ⚙️ Getting Started (Local)

### 1️⃣ Prerequisites
- Node.js (v18+ recommended)  
- npm or yarn  
- MongoDB Atlas (or local MongoDB)

### 2️⃣ Clone the Repo
git clone https://github.com/Ankitchanal-eng/Taskflow.git
cd Taskflow

### 3️⃣ Backend Setup
cd backend
npm install

Create a `.env` file in `backend/`:

MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
PORT=3001

Run the backend:
npm start
# or
node server.js
Backend runs on: `http://localhost:3001`

### 4️⃣ Frontend Setup
cd ../frontend
npm install

Create a `.env` (optional but recommended):

VITE_API_URL=http://localhost:3001

Run the dev server:

npm run dev
Frontend runs on: `http://localhost:5173`

## 🔌 API Overview
Base URL (local):
http://localhost:3001/api
Base URL (production):
https://taskflow-m3nm.onrender.com/api

### Auth
- `POST /auth/register` – Register new user 
- `POST /auth/login` – Login and receive JWT  
Both return:
{ "token": "your_jwt_token" }
Use token in headers:
Authorization: Bearer <token>

### Tasks (Protected)
- `GET /tasks` – Get all tasks for logged‑in user  
- `POST /tasks` – Create task `{ "title": "...", "status": "pending" }`  
- `PUT /tasks/:id` – Update task title/status  
- `DELETE /tasks/:id` – Delete task  

## 🚀 Deployment Notes

- **Frontend** deployed on **Vercel** from `frontend/` directory (Vite build).  
- **Backend** deployed on **Render**, connected to MongoDB Atlas.  
- CORS configured to allow both:
  - `https://task-flow-app-roan.vercel.app`
  - `http://localhost:5173`

## 📌 Roadmap / Future Work
- Task descriptions, due dates, and priority levels  
- Profile page (update email, change password)  
- Dark mode  
- Unit and integration tests (Jest, React Testing Library, Supertest)

## 👤 Author

**Ankit Chanal** – Full‑stack developer & aspiring entrepreneur building production‑style MERN apps and experimenting with SaaS ideas.
