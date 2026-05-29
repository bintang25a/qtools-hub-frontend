import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PlannerLayout from "./layouts/PlannerLayout";
import Dashboard from "./pages/planner";
import Users from "./pages/planner/Users";
import Asset from "./pages/planner/Asset";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />}></Route>

        <Route path="planner" element={<PlannerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="assets" element={<Asset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
