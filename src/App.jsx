import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PlannerLayout from "./layouts/PlannerLayout";
import Dashboard from "./pages/planner";
import Users from "./pages/planner/Users";
import Asset from "./pages/planner/Asset";
import Transactions from "./pages/planner/Transactions";
import Repair from "./pages/planner/Repair";
import Report from "./pages/planner/Report";
import Add from "./pages/action/Add";
import Edit from "./pages/action/Edit";
import View from "./pages/action/View";

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
          <Route path="transactions" element={<Transactions />} />
          <Route path="repairs" element={<Repair />} />
          <Route path="reports" element={<Report />} />

          <Route path=":action/add" element={<Add />} />
          <Route path=":action/edit" element={<Edit />} />
          <Route path=":action/view" element={<View />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
