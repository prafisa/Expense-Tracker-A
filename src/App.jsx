import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import ExpensePage from "./pages/ExpensePage"
import Dashboard from './pages/Dashboard'
import IncomePage from "./pages/Income"

import React from 'react'


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
        element: <div>Transactions</div>
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
        element: <div>Categories</div>
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