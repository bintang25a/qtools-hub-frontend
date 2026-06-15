import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import PlannerLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/planner";
import User from "./pages/planner/User";
import Asset from "./pages/planner/Asset";
import Transactions from "./pages/planner/Transaction";
import Repair from "./pages/planner/Repair";
import Report from "./pages/planner/Report";
import BasicView from "./pages/action/BasicView";
import UserLayout from "./layouts/UserLayout";
import AssetLoan from "./pages/user/AssetLoan";
import History from "./pages/user";
import AssetReport from "./pages/user/AssetReport";
import AssetReturn from "./pages/user/AssetReturn";
import ReportView from "./pages/action/ReportView";
import ToolboxInspection from "./pages/user/ToolboxInspection";
import Inspection from "./pages/planner/Inspection";
import ToolboxInspectionEdit from "./pages/action/ToolboxInspectionEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="/" element={<UserLayout />}>
          <Route index element={<History />} />
          <Route path="asset-loan" element={<AssetLoan />} />
          <Route path="asset-return" element={<AssetReturn />} />
          <Route path="asset-report" element={<AssetReport />} />
          <Route path="toolbox-inspection">
            <Route index element={<ToolboxInspection />} />
            <Route path="edit/:id" element={<ToolboxInspectionEdit />} />
          </Route>

          <Route path="view">
            <Route index element={<Navigate to={"/"} />} />
            <Route path="asset/:id" element={<BasicView />} />
            <Route path="report/:id" element={<ReportView />} />
          </Route>
        </Route>

        <Route path="admin" element={<PlannerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="assets" element={<Asset />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="notifications" element={<Transactions />} />
          <Route path="repairs" element={<Repair />} />
          <Route path="reports" element={<Report />} />
          <Route path="inspections" element={<Inspection />} />

          <Route path=":action/view" element={<BasicView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
