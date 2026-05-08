# PoultryDocs: Integrated Poultry Management System

## 1. Project Overview
PoultryDocs is a comprehensive digital management solution designed to streamline the operational workflows of small to medium-scale poultry farming. The system focuses on automating record-keeping, monitoring production metrics, and managing financial health to provide farmers with actionable insights for better decision-making.

---

## 2. System Architecture
The application is built on a modern **Single Page Application (SPA)** architecture, ensuring a seamless and responsive user experience.

- **Frontend**: Developed using **Vanilla JavaScript** with **Web Components (Lit)**. This provides a lightweight, modular structure without the overhead of heavy frameworks.
- **Backend**: A robust **RESTful API** built with **Node.js** and **Express**, ensuring efficient data handling and communication.
- **Database**: **SQLite3** (via `better-sqlite3`) is utilized for reliable, file-based relational data storage, ideal for local and small-scale deployments.
- **Styling**: Leverages **Tailwind CSS** for a highly customizable, utility-first design system that supports both Light and Dark modes.

---

## 3. Key Features

### 🐓 Asset & Flock Management
- Centralized tracking of poultry stock (Layers and Broilers).
- Real-time monitoring of flock status, mortality rates, and pen distribution.

### 🥚 Production Monitoring
- Automated daily production logs (egg counts, cracked counts).
- Feed consumption tracking vs. yield analysis.

### 💰 Financial Accounting
- Comprehensive ledger for sales and expenses.
- Categorized transaction history with net revenue visualization.

### 🛡️ Administrative Control
- **User Management**: Admin dashboard to oversee users, manage account statuses (Active/Suspended), and delete accounts.
- **Data Portability**: Full system data extraction in JSON format for debugging and reporting.
- **Security**: Role-based access control (Admin vs. User) and secure authentication.

---

## 4. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **User Interface** | Lit (Web Components), Tailwind CSS |
| **Logic & State** | Vanilla JS, Client-side Router |
| **Server** | Node.js, Express |
| **Database** | SQLite3 |
| **Icons & Visuals** | Material Symbols (Google) |
| **Security** | Helmet.js, Bcryptjs, Dotenv |

---

## 5. Cybersecurity
The system implements industry-standard security practices to ensure data integrity and protection against common web vulnerabilities.

- **Password Hashing (Bcryptjs)**: All user passwords and administrative secondary keys are hashed using **Bcrypt** with a salt factor of 10. This ensures that even in the event of a database compromise, raw passwords remain unreadable.
- **Helmet.js Integration**: The backend utilizes [Helmet.js](https://helmetjs.github.io/) to set secure HTTP headers automatically. This provides protection against:
    - **Cross-Site Scripting (XSS)**: Prevents malicious scripts from being injected into the application.
    - **Clickjacking**: Ensures the application cannot be embedded in unauthorized iframes (via `X-Frame-Options`).
    - **MIME Sniffing**: Prevents browsers from interpreting files as a different MIME type (via `X-Content-Type-Options`).
    - **Content Security Policy (CSP)**: Restricts the sources from which scripts, styles, and fonts can be loaded, mitigating data injection attacks.
- **Environment Configuration**: Sensitive settings (like database paths and salt rounds) are managed via a `.env` file, keeping configuration separate from code.
- **Role-Based Access Control (RBAC)**: Strict separation between administrative and standard user capabilities.

---

## 6. Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd poultry-management-system
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   A `.env` file is required in the root directory. You can use the following default values:
   ```env
   PORT=3000
   DB_PATH=poultry.db
   BCRYPT_SALT_ROUNDS=10
   ```

### Execution
To launch the development environment (including the API server and frontend):
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

> **Note on PWA Assets**: The Progressive Web App (PWA) features are currently in a test phase. Placeholder icons are required in the `/public` or `/src/assets` folder for the full offline experience to function without 404 errors.

---

## 7. Default Login Credentials

For testing and academic evaluation, the following accounts are pre-configured in the system:

| Name | Email | Password | Role | Secondary Key | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin@poultrydocs.com` | `admin123` | Admin | `secure456` | Active |
| **Kamau Waithaka** | `kamau@poultrydocs.com` | `password123` | User | N/A | Active |
| **Achieng Awuor** | `achieng@poultrydocs.com` | `password123` | User | N/A | Active |
| **Kibet Chepkwony** | `kibet@poultrydocs.com` | `password123` | User | N/A | Active |
| **Kwamboka Moraa** | `kwamboka@poultrydocs.com` | `password123` | User | N/A | Suspended |

---

## 8. Project Scripts
- `npm run dev`: Starts the integrated development environment.
- `npm run build`: Compiles and optimizes assets for production deployment.
- `npm start`: Runs the production-ready server.
