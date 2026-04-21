import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import ExpensePage from "./pages/ExpensePage"
import Dashboard from './pages/Dashboard'
import IncomePage from "./pages/Income"
import Transaction from './pages/Transaction'
import BudgetPage from './pages/BudgetDashboard'
import React from 'react'
import CategoryPage from './pages/CategoryPage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard/>
      },
      {
        path: 'transactions',
        element: <Transaction/>
      },
      {
        path: 'income',
        element: <IncomePage />
      },
      {
        path: 'expenses',
        element: <ExpensePage />
      },
      {
        path: 'categories',
        element: <CategoryPage/>
      },
      {
        path:'budget',
        element: <BudgetPage/>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
