import { Routes, Route } from "react-router-dom";
import LandingView from "./pages/landing/LandingView";
import ComponentLibraryView from "./pages/component-library/ComponentLibraryView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
      <Route path="/components" element={<ComponentLibraryView />} />
    </Routes>
  );
}
