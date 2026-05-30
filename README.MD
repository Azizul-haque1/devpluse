# DevPulse API 🚀

A collaborative backend platform for software teams to report bugs, suggest features, and manage issue workflows.

---

## 🌐 Live URL

```bash
https://devpulse-six-beta.vercel.app
```

---

## 📂 GitHub Repository

```bash
https://github.com/Azizul-haque1/devpluse
```

---

# ✨ Features

- User Registration & Login
- JWT Authentication & Authorization
- Role-Based Access Control
- Create Issues
- Get All Issues
- Get Single Issue
- Update Issues
- Delete Issues
- Sorting Support
- Secure Password Hashing
- PostgreSQL Database
- Modular Architecture

---

# 🛠️ Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Raw SQL
- bcrypt
- jsonwebtoken

---

# 📁 Project Structure

```bash
src
│
├── app
├── config
├── db
├── middleware
├── modules
│   ├── auth
│   └── issues
├── routes
├── types
├── utils
└── server.ts
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Azizul-haque1/devpulse.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env` file:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key

SALT_ROUND=10

SECURE=false

SAME_SITE=lax
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 🗄️ Database Schema

# 🔐 API Endpoints

## Authentication

### Register User

```http
POST /api/auth/signup
```

### Login User

```http
POST /api/auth/login
```

---

## Issues

### Create Issue

```http
POST /api/issues
```

### Get All Issues

```http
GET /api/issues
```

### Get Single Issue

```http
GET /api/issues/:id
```

### Update Issue

```http
PATCH /api/issues/:id
```

### Delete Issue

```http
DELETE /api/issues/:id
```

---

# 🔍 Query Parameters

## Sorting

```http
GET /api/issues?sort=newest
GET /api/issues?sort=oldest
```

---

# 👥 Roles

## contributor

- Create issue
- View issues
- Update own open issues

---

## maintainer

- Full access
- Update any issue
- Delete any issue

---

# 🔒 Authentication

JWT-based authentication system is implemented.

Protected routes require:

```http
Authorization: <token>
```

---

# 🚀 Deployment

- Backend: Vercel
- Database: NeonDB

---

# 👨‍💻 Author

Azizul Haque
