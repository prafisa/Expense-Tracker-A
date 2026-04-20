import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'

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
        element: <div>Dashboard</div>
      },
      {
        path: 'transactions',
        element: <div>Transactions</div>
      },
      {
        path: 'income',
        element: <div>Income</div>
      },
      {
        path: 'expenses',
        element: <div>Expenses</div>
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