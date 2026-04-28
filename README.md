# Spendly — Expense Tracker

A full-stack expense tracking web application built with **React + Tailwind CSS v4** on the frontend and **ASP.NET Core 8 Web API** on the backend.

---

## Features

- **Dashboard** — summary cards, monthly bar chart, category donut chart, daily spending chart, and recent transactions
- **Categories** — create and manage income/expense categories with custom icons and colors
- **Budget** — set monthly spending limits per category, track spent vs remaining in real time
- **Income** — log income entries with category, payment method, source, and date
- **Expenses** — log expenses against budgeted categories with reason and payment method
- **Transactions** — unified view of all income and expenses with filters and pagination

---

## Tech Stack

### Frontend
- React 18
- Tailwind CSS v4
- Vite

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server
- Swagger / OpenAPI

---

## Project Structure

```
Expense-Tracker-A/
├── backend/
│   └── ExpenseTracker.API/
│       ├── Controllers/
│       │   ├── CategoryController.cs
│       │   ├── IncomeController.cs
│       │   ├── ExpenseController.cs
│       │   ├── BudgetController.cs
│       │   ├── TransactionController.cs
│       │   └── DashboardController.cs
│       ├── Models/
│       ├── DTOs/
│       ├── Data/
│       └── Enums/
└── src/
    ├── components/
    │   ├── Budget/
    │   ├── Category/
    │   ├── Dashboard/
    │   ├── Expense/
    │   ├── Income/
    │   ├── Transactions/
    │   └── shared/
    ├── pages/
    ├── services/
    └── utils/
```

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- SQL Server (local or Docker)

---

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend/ExpenseTracker.API
   ```

2. Update the connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=ExpenseTrackerDb;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```

3. Apply migrations and seed the database:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7204`. Swagger UI is at `https://localhost:7204/swagger`.

---

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd Expense-Tracker-A
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Category | GET | `/api/category` | Get all categories |
| Category | POST | `/api/category` | Create category |
| Category | PUT | `/api/category/{id}` | Update category |
| Category | DELETE | `/api/category/{id}` | Delete category |
| Income | GET | `/api/income` | Get all incomes |
| Income | POST | `/api/income` | Create income |
| Income | DELETE | `/api/income/{id}` | Delete income |
| Expense | GET | `/api/expense` | Get all expenses |
| Expense | POST | `/api/expense` | Create expense |
| Expense | PUT | `/api/expense/{id}` | Update expense |
| Expense | DELETE | `/api/expense/{id}` | Delete expense |
| Budget | GET | `/api/budget` | Get all budgets |
| Budget | GET | `/api/budget/summary/{month}` | Get budget summary with spent/remaining |
| Budget | POST | `/api/budget` | Create budget |
| Budget | PUT | `/api/budget/{id}` | Update budget |
| Budget | DELETE | `/api/budget/{id}` | Delete budget |
| Transaction | GET | `/api/transaction` | Get merged income + expense view |
| Dashboard | GET | `/api/dashboard/summary` | Get full dashboard data |

---

## Business Logic

- **Categories** must be created before adding any income or expense
- **Budgets** can only be assigned to `EXPENSE` type categories
- A **budget must exist** for a category and month before an expense can be logged against it
- **Income** only requires a valid `INCOME` type category — no budget needed
- **Spent** and **Remaining** on budgets are calculated in real time from actual expense records
- The **Transaction** view is built directly from Income and Expense records for accuracy

---

## Payment Methods Supported

- Cash
- eSewa
- Khalti
- Mobile Banking

---

Still needs a bit of refactoring

---

## License

MIT