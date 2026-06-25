import { Routes, Route } from "react-router-dom";

import HomeLayout from "./components/layout/HomeLayout";

import Dashboard from "./pages/Dashboard";
import LeadsManagement from "./pages/LeadsManagement";
import Deals from "./pages/Deals";
import Customers from "./pages/Customers";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import Profile from "./components/settings/Profile";
import Notifications from "./components/settings/Notifications";
import Security from "./components/settings/Security";
import Preferences from "./components/settings/Preferences";
import Billing from "./components/settings/Billing";
import Data_Privacy from "./components/settings/Data_Privacy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="leads" element={<LeadsManagement />} />
        <Route path="deals" element={<Deals />} />
        <Route path="customers" element={<Customers />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />

        <Route path="settings" element={<Settings />} />
        <Route path="settings/profile" element={<Profile/>} />
        <Route path="settings/notifications" element={<Notifications/>} />
        <Route path="settings/security" element={<Security/>} />
        <Route path="settings/preferences" element={<Preferences/>} />
        <Route path="settings/billing" element={<Billing/>} />
        <Route path="settings/data-privacy" element={<Data_Privacy/>} />
      </Route>
    </Routes>
  );
}

export default App;
