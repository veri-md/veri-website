import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import Quickstart from "./pages/Quickstart";
import Blog from "./pages/Blog";

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quickstart" element={<Quickstart />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
