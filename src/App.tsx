import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavSidebar } from "./components/NavSidebar";
import { Portfolio } from "./pages/Portfolio";
import { BrandDetail } from "./pages/BrandDetail";
import { BrandConfig } from "./pages/BrandConfig";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen w-full bg-gray-50">
        <NavSidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/brand/:id" element={<BrandDetail />} />
            <Route path="/brand/:id/config" element={<BrandConfig />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
