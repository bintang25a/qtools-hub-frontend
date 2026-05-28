import { BrowserRouter, Routes, Route } from "react-router-dom";
import InteractiveBackground from "./components/background/interactiveBackground";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<InteractiveBackground />} />
      </Routes>
    </BrowserRouter>
  );
}
