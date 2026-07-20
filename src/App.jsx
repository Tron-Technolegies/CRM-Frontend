import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomeLayout from "./components/layout/HomeLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import LeadsManagement from "./pages/LeadsManagement";
import Accounts from "./pages/Accounts";
import Quotes from "./pages/Quotes";
import Deals from "./pages/Deals";
import Customers from "./pages/Customers";
import Meetings from "./pages/Meetings";
import Calls from "./pages/Calls";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

// Quotes

// Inventory
import Products from "./components/Inventory/Product";
import SalesOrders from "./components/Inventory/SalesOrders";
import PurchaseOrders from "./components/Inventory/PurchaseOrders";
import Invoices from "./components/Inventory/Invoices";

import Addproduct from "./components/Inventory/AddProduct/Addproduct";
import Addsales from "./components/Inventory/Addsales/Addsales";
import AddPurchase from "./components/Inventory/Addpurchase/AddPurchase";
import AddInvoice from "./components/Inventory/Addinvoice/AddInvoice";

// Settings
import Profile from "./components/settings/Profile/Profile";
import Notification from "./components/settings/Notification/Notification";
import Preferences from "./components/settings/Preferences";
import Security from "./components/settings/Security/Security";
import Billing from "./components/settings/Billing/Billing";
import BillingContact from "./components/settings/Billing/Billingcontact";
import BillingHistory from "./components/settings/Billing/BillingHistory";
import BillingPlanUsage from "./components/settings/Billing/BillingPlanUsage";
import BillingPaymentContact from "./components/settings/Billing/BillingPaymentContact";
import DataSecurity from "./components/settings/DataPrivacy/DataSecurity";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Signup from "./components/auth/Signup";
import AddQuotes from "./components/quotes/AddQuotes";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [

      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },

      {
        path: "leads",
        element: <LeadsManagement />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "quotes",
        element: <Quotes />,
      },
      {
        path: "/addquote",
        element: <AddQuotes />,
      },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "meetings",
        element: <Meetings />,
      },
      {
        path: "calls",
        element: <Calls />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "users",
        element: <Users />,
      },

      // Inventory
      {
        path: "inventory/products",
        element: <Products />,
      },
      {
        path: "inventory/products/addproduct",
        element: <Addproduct />,
      },
      {
        path: "inventory/sales",
        element: <SalesOrders />,
      },
      {
        path: "inventory/sales/addsales",
        element: <Addsales />,
      },
      {
        path: "inventory/purchase",
        element: <PurchaseOrders />,
      },
      {
        path: "inventory/purchase/addpurchase",
        element: <AddPurchase />,
      },
      {
        path: "inventory/invoices",
        element: <Invoices />,
      },
      {
        path: "inventory/invoices/addinvoice",
        element: <AddInvoice />,
      },

      // Settings
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "settings/profile",
        element: <Profile />,
      },
      {
        path: "settings/notifications",
        element: <Notification />,
      },
      {
        path: "settings/preferences",
        element: <Preferences />,
      },
      {
        path: "settings/security",
        element: <Security />,
      },
      {
        path: "settings/billing",
        element: <Billing />,
      },
      {
        path: "settings/billing/contact",
        element: <BillingContact />,
      },
      {
        path: "settings/billing/history",
        element: <BillingHistory />,
      },
      {
        path: "settings/billing/plan-usage",
        element: <BillingPlanUsage />,
      },
      {
        path: "settings/billing/payment-contact",
        element: <BillingPaymentContact />,
      },
      {
        path: "settings/data-privacy",
        element: <DataSecurity />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;