import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
