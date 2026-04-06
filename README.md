# 💸 Paytm Clone (Full-Stack Payment Application)

A full-stack digital wallet application built to simulate real-world peer-to-peer payment systems. This project focuses on secure authentication and **atomic transaction handling** to ensure safe and consistent money transfers between users.

---

## 🚀 Features

* 🔐 User Authentication (Signup / Signin using JWT)
* 💰 View Account Balance
* 🔄 Send Money Between Users
* 🔍 Search Users (Bulk fetch)
* ✏️ Update User Details
* ⚡ Atomic Transactions using MongoDB Sessions (Prevents inconsistent balances)

---

## 🧠 Engineering Highlights

* Implemented **MongoDB transactions** to ensure money transfers are atomic (all-or-nothing)
* Middleware-based authentication using JWT
* Clean separation of routes (`/user`, `/account`)
* Full-stack integration (React frontend + Express backend)

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Frontend

* React (Vite)
* Tailwind CSS

---

## 📁 Project Structure

```
/backend
  ├── routes
  │   ├── account.js
  │   ├── user.js
  │   ├── index.js
  ├── db.js
  ├── middleware.js
  ├── index.js
  ├── .env
  ├── .env.example

/frontend
  ├── src
  │   ├── components
  │   ├── pages
  │   │   ├── Dashboard.jsx
  │   │   ├── SendMoney.jsx
  │   │   ├── Signin.jsx
  │   │   ├── Signup.jsx
  │   │   ├── Thankyou.jsx
  │   ├── App.jsx
  │   ├── main.jsx
  ├── index.html
  ├── tailwind.config.js
```

---

## 🔌 API Endpoints

### Base URL

```
/api/v1/
```

### User Routes (`/user`)

* `POST /signup` → Register a new user
* `POST /signin` → Login user and receive JWT
* `PUT /edit` → Update user details (Protected)
* `GET /bulk` → Fetch users (search functionality)

### Account Routes (`/account`)

* `GET /balance` → Get current user balance (Protected)
* `POST /transfer` → Transfer money to another user (Protected, Atomic)

---

## 🔐 Environment Variables

Create a `.env` file in the backend folder and add:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Setup Backend

```
cd backend
npm install
npm start
```

### 3. Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🧪 How Transactions Work

Money transfers are handled using MongoDB sessions:

* Deduct amount from sender
* Add amount to receiver
* Commit only if both succeed
* Rollback if any step fails

This ensures **data consistency and prevents money loss**.

---

## 📌 Future Improvements

* Transaction history
* Better UI/UX
* Notifications / Email system
* Admin dashboard

---

## 📬 Notes

This project is built to simulate real-world financial systems and demonstrate backend engineering concepts like **transactions, authentication, and consistency handling**.

---

## 👨‍💻 Author

Nirav Dongre
