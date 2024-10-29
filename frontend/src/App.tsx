import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchPage from "./components/SearchPage";
import FavoritesPage from "./components/FavoritesPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full bg-white shadow-md fixed top-0 left-0">
          <div className="container mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold">🎵 Songalyze</h1>
            <nav className="space-x-4">
              <Link to="/">
                <Button variant="outline">Search</Button>
              </Link>
              <Link to="/favorites">
                <Button variant="outline">Favorites</Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="container mx-auto px-8 py-12 max-w-7xl w-full">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-gray-800 text-white text-center py-4 fixed bottom-0 left-0">
          <p>&copy; {new Date().getFullYear()} Songalyze. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;