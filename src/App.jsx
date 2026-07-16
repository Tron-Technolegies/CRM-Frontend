import { Routes, Route } from "react-router-dom";

import HomeLayout from "./components/layout/HomeLayout";

import Dashboard from "./pages/Dashboard";
import LeadsManagement from "./pages/LeadsManagement";
import Accounts from "./pages/Accounts";
import Quotes from "./pages/Quotes";
import Deals from "./pages/Deals";
import Customers from "./pages/Customers";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import Notifications from "./components/settings/Notifications";
import Security from "./components/settings/Security";
import Preferences from "./components/settings/Preferences";
import Data_Privacy from "./components/settings/Data_Privacy";
import AddQuotes from "./components/quotes/AddQuotes";
import Meetings from "./pages/Meetings";
import Calls from "./pages/Calls";
// import Products from "./components/Inventory/Product";
import SalesOrders from "./components/Inventory/SalesOrders";
import PurchaseOrders from "./components/Inventory/PurchaseOrders";
import Invoices from "./components/Inventory/Invoices";
import Products from "./components/Inventory/Product";
import Addproduct from "./components/Inventory/AddProduct/Addproduct";
import AddInvoice from "./components/Inventory/Addinvoice/AddInvoice";
import AddPurchase from "./components/Inventory/Addpurchase/AddPurchase";
import Addsales from "./components/Inventory/Addsales/Addsales";
import Profile from "./components/settings/Profile/Profile";
import Billing from "./components/settings/Billing/Billing";
import BillingContact from "./components/settings/Billing/Billingcontact";
// import Products from "./pages/Products";
// import Products from "./pages/Products";
// import AddProducts from "./components/Inventory/AddProducts";
// import SalesOrders from "./components/Inventory/SalesOrders";
// import PurchaseOrders from "./components/Inventory/PurchaseOrders"
// import Invoices from "./components/Inventory/Invoices";

function App() {
  return (
    <Routes>

      <Route path="/" element={<HomeLayout />}>

        <Route index element={<Dashboard />} />

        <Route path="leads" element={<LeadsManagement />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="addquote" element={<AddQuotes />} />

        <Route path="meetings" element={<Meetings />} />
        <Route path="deals" element={<Deals />} />
        <Route path="customers" element={<Customers />} />
        <Route path="calls" element={<Calls />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />



        {/* <Route path="/inventory/products" element={<Products />} /> */}
        <Route path="/inventory/products" element={<Products />} />
        <Route path="/inventory/sales" element={<SalesOrders />} />
        <Route path="/inventory/purchase" element={<PurchaseOrders />} />
        <Route path="/inventory/invoices" element={<Invoices />} />
        <Route path="/inventory/products/addproduct" element={<Addproduct />} />
        <Route path="/inventory/sales/addsales" element={<Addsales />} />
        <Route path="/inventory/purchase/addpurchase" element={<AddPurchase />} />
        <Route path="/inventory/invoices/addinvoice" element={<AddInvoice />} />



        <Route path="settings" element={<Settings />} />
        <Route path="settings/profile" element={<Profile />} />
        <Route path="settings/notifications" element={<Notifications />} />
        <Route path="settings/security" element={<Security />} />
        <Route path="settings/preferences" element={<Preferences />} />
        <Route path="settings/billing" element={<Billing />} />
        <Route path="/settings/billing-contact" element={<BillingContact />} />
        <Route path="settings/data-privacy" element={<Data_Privacy />} />

      </Route>

    </Routes>
  );
}

export default App;