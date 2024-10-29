import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import FavoritesPage from './components/FavoritesPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <h1>Songalyze</h1>
        <nav>
          <Link to="/">Search</Link> | <Link to="/favorites">Favorites</Link>
        </nav>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;