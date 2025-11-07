import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import EmployeePage from "./components/EmployeePage";
import HrLogin from "./components/HrLogin";
import HrDashboard from "./components/HrDashboard";

export default function App() {
  return (
    <>
      <TopNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/employee" replace />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/hr" element={<HrLogin />} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
      </Routes>
    </>
  );
}
