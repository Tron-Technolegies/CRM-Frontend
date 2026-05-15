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
      </Route>
    </Routes>
  );
}

export default App;
