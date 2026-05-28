import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin";
import User from "./pages/admin/User";
import Symptom from "./pages/admin/Symptom";
import Damage from "./pages/admin/Damage";
import Rule from "./pages/admin/Rule";
import ServiceLayout from "./layouts/ServiceLayout";
import Service from "./pages/service";
import Add from "./pages/service/Add";
import Status from "./pages/service/Status";
import History from "./pages/service/History";
import Diagnosis from "./pages/service/Diagnosis";
import StaffLayout from "./layouts/StaffLayout";
import DashboardStaff from "./pages/Staff";
import Show from "./pages/Staff/Show";
import Complaint from "./pages/admin/Complaint";
import Profile from "./pages/auth/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:id" element={<Profile />} />

        <Route path="service" element={<ServiceLayout />}>
          <Route index element={<Service />} />
          <Route path="add" element={<Add />} />
          <Route path="status/:id" element={<Status />} />
          <Route path="status" element={<Status />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="history" element={<History />} />
        </Route>

        <Route path="staff" element={<StaffLayout />}>
          <Route index element={<DashboardStaff />} />
          <Route path=":id" element={<Show />} />
        </Route>

        <Route path="mechanic" element={<ServiceLayout />}>
          <Route index element={<Service />} />
          <Route path="status/:id" element={<Status />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="history" element={<History />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="complaints" element={<Complaint />} />
          <Route path="complaints/:id" element={<Status />} />
          <Route path="symptoms" element={<Symptom />} />
          <Route path="damages" element={<Damage />} />
          <Route path="rules" element={<Rule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
