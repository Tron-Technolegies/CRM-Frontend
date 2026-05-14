import React from "react";
import { Routes, Route } from "react-router-dom";

import HomeLayout from "./components/layout/HomeLayout";

import Dashboard from "./pages/Dashboard";
import LeadsManagement from "./pages/LeadsManagement";
// import Pipeline from "./pages/Pipeline";
// import Activities from "./pages/Activities";
// import Customers from "./pages/Customers";
// import SupportTickets from "./pages/SupportTickets";
// import Reports from "./pages/Reports";
// import Automations from "./pages/Automations";
// import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="leads" element={<LeadsManagement />} />
        {/*<Route path="pipeline" element={<Pipeline />} />
        <Route path="activities" element={<Activities />} />
        <Route path="customers" element={<Customers />} />
        <Route path="support-tickets" element={<SupportTickets />} />
        <Route path="reports" element={<Reports />} />
        <Route path="automations" element={<Automations />} />
        <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
