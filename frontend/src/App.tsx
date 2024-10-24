import SongForm from './components/SongForm';
import SongList from './components/SongList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Songalyze</h1>
      <SongForm />
      <SongList />
    </div>
  );
};

export default App;