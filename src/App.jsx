import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PlannerLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/planner";
import User from "./pages/planner/User";
import Asset from "./pages/planner/Asset";
import Transactions from "./pages/planner/Transactions";
import Repair from "./pages/planner/Repair";
import Report from "./pages/planner/Report";
import Add from "./pages/action/Add";
import Edit from "./pages/action/Edit";
import View from "./pages/action/View";
import UserLayout from "./layouts/UserLayout";
import AssetLoan from "./pages/user/AssetLoan";
import Profile from "./pages/user";
import AssetReport from "./pages/user/AssetReport";
import AssetReturn from "./pages/user/AssetReturn";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="/" element={<UserLayout />}>
          <Route index element={<Profile />} />
          <Route path="asset-loan" element={<AssetLoan />} />
          <Route path="asset-return" element={<AssetReturn />} />
          <Route path="asset-report" element={<AssetReport />} />
          <Route path="history" element={<main>History</main>} />
        </Route>

        <Route path="admin" element={<PlannerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="assets" element={<Asset />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="repairs" element={<Repair />} />
          <Route path="reports" element={<Report />} />
          <Route path="inspections" element={<main>Coming Soon</main>} />

          <Route path=":action/add" element={<Add />} />
          <Route path=":action/edit" element={<Edit />} />
          <Route path=":action/view" element={<View />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
