# TaskFlow Manager — Setup Guide

## Project Structure
```
taskflow/
├── server.js              ← Entry point
├── package.json
├── .env                   ← Your secrets (never commit this)
├── models/
│   ├── User.js
│   ├── Task.js
│   ├── TaskRequest.js
│   └── Todo.js
├── routes/
│   ├── auth.js
│   ├── tasks.js
│   ├── requests.js
│   └── todos.js
├── middleware/
│   └── auth.js
└── frontend/
    └── index.html         ← Entire frontend (open in browser)
```

---

## Step 1 — Install dependencies

```bash
cd taskflow
npm install
```

---

## Step 2 — Configure environment

Your `.env` file is already set with your MongoDB URI:

```
MONGO_URI=mongodb+srv://atul21212131_db_user:Atul12345@cluster0.zmf0bgh.mongodb.net/taskflow?...
JWT_SECRET=taskflow_super_secret_key_change_in_production
PORT=5000
```

**Important:** Change `JWT_SECRET` to a long random string before deploying.

---

## Step 3 — Run backend locally

```bash
npm run dev       # development (auto-restart)
# or
npm start         # production
```

Server starts at: `http://localhost:5000`

---

## Step 4 — Register your first Manager account

Use a tool like Postman, Insomnia, or curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Atul Kumar","email":"atul@company.com","password":"Admin123","role":"manager"}'
```

Or use the frontend — but first register via API since the frontend login requires an existing account.

---

## Step 5 — Open the frontend

Open `frontend/index.html` directly in your browser.

**For production**, update the API URL in `index.html` (line ~200):
```js
const API = 'https://your-vercel-app.vercel.app/api';
```

---

## Deploying to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Set environment variables in Vercel Dashboard:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
4. Deploy — Vercel auto-detects Node.js.

Add a `vercel.json` in your root:
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

---

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Get profile |
| GET | /api/auth/employees | Manager | List employees |
| DELETE | /api/auth/employees/:id | Manager | Remove employee |
| GET | /api/tasks | Auth | Get tasks |
| POST | /api/tasks | Manager | Assign task |
| PATCH | /api/tasks/:id/complete | Employee | Complete task |
| PATCH | /api/tasks/:id/delete | Auth | Delete task |
| GET | /api/requests/received | Employee | Get received requests |
| GET | /api/requests/sent | Employee | Get sent requests |
| POST | /api/requests | Employee | Send request |
| PATCH | /api/requests/:id/accept | Employee | Accept request |
| PATCH | /api/requests/:id/reject | Employee | Reject request |
| GET | /api/todos | Employee | Get personal todos |
| POST | /api/todos | Employee | Add todo |
| PATCH | /api/todos/:id | Employee | Update todo |
| DELETE | /api/todos/:id | Employee | Delete todo |

---

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT (JSON Web Tokens) + bcrypt
- **Hosting:** Vercel (backend) + GitHub Pages (frontend)
