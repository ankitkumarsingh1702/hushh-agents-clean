import { Routes, Route } from "react-router-dom";
import LandingView from "./pages/landing/LandingView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
    </Routes>
  );
}
