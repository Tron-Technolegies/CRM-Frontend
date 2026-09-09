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
import NotificationFullView from "./components/layout/NotificationFullView";

// Inventory
import Product from "./components/Inventory/Product";
import SalesOrders from "./components/Inventory/SalesOrders";
import PurchaseOrders from "./components/Inventory/PurchaseOrders";
import Invoice from "./components/Inventory/Invoice";
import Vendor from "./components/Inventory/Vendor";
import Service from "./components/Inventory/Service";

// Settings
import Profile from "./components/settings/Profile/Profile";
import Notification from "./components/settings/Notification/Notification";
import EmailIntegration from "./components/settings/EmailIntegration";
import TwilioSettings from "./components/settings/Twilio/TwilioSettings";
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
import AccessDenied from "./pages/AccessDenied";
import QuoteFormPage from "./components/quotes/QuoteFormPage";
import SalesOrderFormPage from "./components/Inventory/SalesOrder_main/SalesOrderFormPage";
import PurchaseOrderFormPage from "./components/Inventory/purchaseOrder_main/PurchaseOrderFormPage";
import MeetingRoom from "./pages/MeetingRoom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/403",
    element: <AccessDenied />,
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
        element: (
          <ProtectedRoute permission="lead.view">
            <LeadsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "accounts",
        element: (
          <ProtectedRoute permission="account.view">
            <Accounts />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotes",
        element: (
          <ProtectedRoute permission="quote.view">
            <Quotes />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotes/add",
        element: (
          <ProtectedRoute permission="quote.create">
            <QuoteFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "quotes/edit/:id",
        element: (
          <ProtectedRoute permission="quote.edit">
            <QuoteFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "deals",
        element: (
          <ProtectedRoute permission="deal.view">
            <Deals />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute permission="customer.view">
            <Customers />
          </ProtectedRoute>
        ),
      },
      {
        path: "meetings",
        element: (
          <ProtectedRoute permission="meeting.view">
            <Meetings />
          </ProtectedRoute>
        ),
      },
      {
        path: "meetings/:id/room",
        element: <MeetingRoom/>,
      },
            {
        path: "calls",
        element: (
          <ProtectedRoute permission="call.view">
            <Calls />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks",
        element: (
          <ProtectedRoute permission="task.view">
            <Tasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute permission="report.view">
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute permission="staff.view">
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: <NotificationFullView />,
      },

      // Inventory
      {
        path: "inventory/products",
        element: (
          <ProtectedRoute permission="product.view">
            <Product />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/salesOrder",
        element: (
          <ProtectedRoute permission="salesorder.view">
            <SalesOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/salesOrder/add",
        element: (
          <ProtectedRoute permission="salesorder.create">
            <SalesOrderFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/salesOrder/edit/:id",
        element: (
          <ProtectedRoute permission="salesorder.edit">
            <SalesOrderFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/purchase",
        element: (
          <ProtectedRoute permission="purchaseorder.view">
            <PurchaseOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/purchase/add",
        element: (
          <ProtectedRoute permission="purchaseorder.create">
            <PurchaseOrderFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/purchase/edit/:id",
        element: (
          <ProtectedRoute permission="purchaseorder.edit">
            <PurchaseOrderFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/invoices",
        element: (
          <ProtectedRoute permission="invoice.view">
            <Invoice />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/vendor",
        element: (
          <ProtectedRoute permission="vendor.view">
            <Vendor />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/service",
        element: (
          <ProtectedRoute permission="service.view">
            <Service />
          </ProtectedRoute>
        ),
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
        path: "settings/email",
        element: (
          <ProtectedRoute permission="integration.view">
            <EmailIntegration />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings/twilio",
        element: (
          <ProtectedRoute permission="twilio.view">
            <TwilioSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings/preferences",
        element: (
          <ProtectedRoute permission="picklist.view">
            <Preferences />
          </ProtectedRoute>
        ),
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