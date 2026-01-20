# Antigravity Project Rules – Employee Management System (MERN)

This project follows a strict MERN monorepo structure.
All AI-generated code MUST adhere to the rules below.

---

## 🔒 Repository Structure (DO NOT VIOLATE)

Root folders:
- /client → React frontend ONLY
- /server → Node.js / Express backend ONLY

Never mix frontend and backend code.

---

## 🖥️ CLIENT RULES (/client)

Tech stack:
- React
- Axios for API calls
- React Router
- Component-based structure

Rules:
- DO NOT create backend logic in /client
- DO NOT define database models in /client
- DO NOT call MongoDB directly
- API calls must go through services or API helper files
- Components must remain presentational unless explicitly stated

Preferred structure:
client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/ (API calls)
│ ├── hooks/
│ ├── utils/
│ └── App.js

---

## 🛠️ SERVER RULES (/server)

Tech stack:
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication

Rules:
- ALL business logic lives in /server
- Database access only via Mongoose models
- Controllers must not contain raw DB queries
- Routes → Controllers → Services → Models pattern preferred
- Authentication must use JWT middleware

Preferred structure:
server/
├── controllers/
├── routes/
├── models/
├── middleware/
├── services/
├── utils/
├── config/
└── index.js

---

## 🔐 AUTH & ROLES

Roles:
- Admin
- HR
- Employee

Rules:
- Role checks must be enforced in middleware
- Client must NOT hardcode permissions
- Server is the source of truth for authorization

---

## 🧩 FEATURE MODULE RULES

Each HRIS feature must be modular:
- Employee Management
- Leaves
- Payroll
- Recruitment

For every new feature:
- Add route
- Add controller
- Add model
- Add service (if logic is complex)
- Add matching client service + UI

---

## 🚫 FORBIDDEN ACTIONS

- Do NOT create files outside /client or /server
- Do NOT invent new architectures
- Do NOT refactor unless explicitly requested
- Do NOT introduce PHP, Python, or other runtimes
- Do NOT bypass existing authentication logic

---

## ✅ OUTPUT EXPECTATIONS

When generating code:
- Respect existing naming conventions
- Match folder structure
- Explain where files should be added
- Do NOT assume missing dependencies
