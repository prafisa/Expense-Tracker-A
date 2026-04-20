# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


{
  "summary": [
    { "label": "Total balance", "value": "$12,340", "change": "+2.4% this month", "positive": true },
    { "label": "Total income", "value": "$5,200", "change": "+$300 vs last month", "positive": true },
    { "label": "Total expenses", "value": "$3,460", "change": "+$120 vs last month", "positive": false },
    { "label": "Net savings", "value": "$1,740", "change": "33% savings rate", "positive": true }
  ],

  
  "categories": [
  [
  {  "id": 1, "name": "Food & Dining", "type": "EXPENSE", "value": 0, "color": "#FF8042" },
  {  "id": 2, "name": "Transport", "type": "EXPENSE", "value": 0, "color": "#0088FE" },
  {  "id": 3, "name": "Health", "type": "EXPENSE", "value": 0, "color": "#00C49F" },
  {  "id": 4, "name": "Utilities", "type": "EXPENSE", "value": 0, "color": "#FFBB28" },
  {  "id": 5, "name": "Shopping", "type": "EXPENSE", "value": 0, "color": "#FF6B6B" },
  {  "id": 6, "name": "Entertainment", "type": "EXPENSE", "value": 0, "color": "#845EC2" }
]
  ],

  "transactions": [
    {
      "id": 1,
      "name": "Monthly salary",
      "type": "INCOME",
      "categoryId": 1,
      "date": "2026-04-15",
      "amount": 3200
    },
    {
      "id": 2,
      "name": "Freelance project",
      "type": "INCOME",
      "categoryId": 2,
      "date": "2026-04-09",
      "amount": 2000
    },
    {
      "id": 3,
      "name": "Groceries",
      "type": "EXPENSE",
      "categoryId": 3,
      "date": "2026-04-18",
      "amount": 64
    },
    {
      "id": 4,
      "name": "Fuel",
      "type": "EXPENSE",
      "categoryId": 4,
      "date": "2026-04-14",
      "amount": 48
    },
    {
      "id": 5,
      "name": "Doctor visit",
      "type": "EXPENSE",
      "categoryId": 5,
      "date": "2026-04-12",
      "amount": 120
    },
    {
      "id": 6,
      "name": "Electricity bill",
      "type": "EXPENSE",
      "categoryId": 6,
      "date": "2026-04-10",
      "amount": 85
    },
    {
      "id": 7,
      "name": "Headphones",
      "type": "EXPENSE",
      "categoryId": 7,
      "date": "2026-04-08",
      "amount": 150
    },
    {
      "id": 8,
      "name": "Cinema ticket",
      "type": "EXPENSE",
      "categoryId": 8,
      "date": "2026-04-06",
      "amount": 35
    }
  ]
}
 