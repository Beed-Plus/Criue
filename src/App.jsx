// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import { Header } from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main className="bg-[#F5F5F7]">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/product/:name" element={<></>} /> */}
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
