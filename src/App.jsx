import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PlannerLayout from "./layouts/PlannerLayout";
import Dashboard from "./pages/planner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />}></Route>

        <Route path="planner" element={<PlannerLayout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path="users" element={<main>Users</main>}></Route>
          <Route path="assets" element={<main>Assets</main>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
