import { Routes, Route } from "react-router-dom";
import LandingView from "./pages/landing/LandingView";
import ComponentLibraryView from "./pages/component-library/ComponentLibraryView";
import LoginView from "./pages/login/LoginView";
import VerifyView from "./pages/verify/VerifyView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
      <Route path="/login/email" element={<LoginView />} />
      <Route path="/verify" element={<VerifyView />} />
      <Route path="/components" element={<ComponentLibraryView />} />
    </Routes>
  );
}
