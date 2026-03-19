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

---

## 5. Getting Started

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

### Execution
To launch the development environment (including the API server, frontend watcher, and Tailwind compiler):
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 6. Default Login Credentials

For testing and academic evaluation, the following accounts are pre-configured in the system:

| Role | Email | Password | Secondary Key | Status |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin@poultrydocs.com` | `admin123` | `secure456` | Active |
| **Manager** | `john@poultrydocs.com` | `password123` | N/A | Active |
| **Records** | `sarah@poultrydocs.com` | `password123` | N/A | Active |
| **Finance** | `michael@poultrydocs.com` | `password123` | N/A | Active |
| **User (Suspended)** | `david@poultrydocs.com` | `password123` | N/A | Suspended |

---

## 7. Project Scripts
- `npm run dev`: Starts the integrated development environment.
- `npm run build`: Compiles and optimizes assets for production deployment.
- `npm start`: Runs the production-ready server.
