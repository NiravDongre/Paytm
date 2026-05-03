# FlowPay

A production-grade peer-to-peer digital wallet backend built with Node.js, Express, and MongoDB. FlowPay handles real-world concerns like atomic money transfers, idempotent transactions, JWT refresh token rotation, and structured logging.

**Live API:** https://flowpay-9051.onrender.com
---
**Postman Collection:** https://documenter.getpostman.com/view/50691700/2sBXqKozdv <-- **Click here**
---

## Features

- **JWT authentication** with short-lived access tokens (15m) and rotating refresh tokens (15d)
- **Atomic transfers** using MongoDB multi-document sessions — either both accounts update or neither does
- **Idempotency** on transfers — duplicate requests with the same key return the original result instead of double-spending
- **Transaction history** with server-side pagination
- **User search** with case-insensitive regex filtering
- **Structured logging** via a logger middleware on every route

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Validation | Zod |
| Password hashing | bcrypt |
| Logging | Winston (structured JSON logs) |
| Deployment | Render |

---

## Project Structure

```
backend/
├── index.js              # App entry, mounts /api/v1/
├── routes/
│   ├── index.js          # Router — /user, /account, /transactions
│   ├── user.js           # Auth + profile routes
│   ├── account.js        # Balance + transfer routes
│   └── transaction.js    # History route
├── controllers/
│   ├── user.js           # signup, signin, loggout, refresh, edit, bulk
│   ├── account.js        # balance, transfer
│   └── transaction.js    # history
├── models/
│   ├── user.js           # DBUser schema
│   ├── account.js        # DBAccount schema
│   └── transaction.js    # TransactionModel schema
├── middleware/
│   └── userMiddleware.js # JWT verification, attaches req.userId
└── utils/
    ├── asyncHandler.js
    └── CustomError.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/NiravDongre/FlowPay.git
cd FlowPay/backend
npm install
```

### Environment variables

Create a `.env` file in `/backend`:

```env
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/flowpay
ACCESS_JWT_SECRET=your_access_secret_here
REFRESH_JWT_SECRET=your_refresh_secret_here
PORT=3000
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

---

## Authentication Flow

Tokens are returned in the JSON response body — not stored in cookies. Store them client-side and attach manually.

```
POST /api/v1/user/signup  or  POST /api/v1/user/signin
        │
        └──▶ { accessToken, refreshToken }
                    │
        Store both tokens client-side
                    │
        Protected requests:
        Authorization: Bearer <accessToken>
                    │
        When accessToken expires (15m):
        POST /api/v1/user/refresh
        Authorization: Bearer <refreshToken>
                    │
        New { accessToken, refreshToken } returned
```

---

## API Reference

Full base URL: `https://flowpay-9051.onrender.com/api/v1`

### User routes — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/user/signup` | No | Register new user |
| POST | `/user/signin` | No | Sign in, get tokens |
| POST | `/user/loggout` | Yes | Invalidate refresh token |
| POST | `/user/refresh` | Yes (refresh token) | Rotate tokens |
| PUT | `/user/edit` | Yes | Update password |
| GET | `/user/bulk` | Yes | Search users by username |

### Account routes — `/account`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/account/balance` | Yes | Get current balance |
| POST | `/account/transfer` | Yes | Transfer to another user |

**Transfer requires an `Idempotency-Key` header.** Generate a unique value per transfer attempt (e.g. `uuid`). Retrying with the same key is safe — you'll get the original result back.

### Transaction routes — `/transactions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/transactions/history` | Yes | Paginated transfer history |

Query params: `?page=1&limit=10`

---

## How Transfers Work

Transfers use MongoDB sessions with multi-document ACID transactions:

1. Validate amount (must be positive, sender must have sufficient balance)
2. Verify `Idempotency-Key` header is present
3. Create a `TransactionModel` record with `Status: "PENDING"` (unique index on `idempotencykey` prevents duplicates at the DB level)
4. Deduct from sender's account
5. Add to receiver's account
6. Mark transaction `Status: "COMPLETED"` and commit

If any step fails, the session is aborted — no partial state is ever written. If the idempotency key already exists:

- `COMPLETED` → return the original success response
- `PENDING` + stuck > 10s → suggest retrying with a new key
- `FAILED` → indicate the previous attempt failed

---

## Request & Response Examples

**POST /user/signup**
```json
// Request
{ "UserName": "nirav", "Email": "nirav@example.com", "Password": "secret123" }

// Response 201
{
  "status": "success",
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "userId": "664abc...",
  "message": "SignedUp"
}
```

**POST /account/transfer**
```
Header: Authorization: Bearer <accessToken>
Header: Idempotency-Key: idm-1714900000000-a3f9x
```
```json
// Request
{ "to": "664xyz...", "amount": 500 }

// Response 200
{ "message": "Transaction successful" }
```

**GET /transactions/history?page=1&limit=5**
```json
// Response 200
{
  "results": 5,
  "total": 23,
  "data": [ ... ]
}
```

---

## Error Responses

All errors follow a consistent shape:

```json
{ "status": "error", "message": "Description of what went wrong" }
```

Common status codes:

| Code | Meaning |
|---|---|
| 400 | Validation error or insufficient balance |
| 401 | Invalid or expired token |
| 404 | User or account not found |
| 409 | Idempotency key conflict |
| 500 | Server error |

---

## Author

**Nirav Dongre**
GitHub: [NiravDongre](https://github.com/NiravDongre)
