import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { MusicToggle } from './components/MusicToggle';
import { Home } from './pages/Home';
import Archives from './pages/Archives';
import SisterVsSister from './pages/SisterVsSister';
import TreasureHunt from './pages/TreasureHunt';
import Letter from './pages/Letter';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <Navigation />
      <MusicToggle />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/sisters" element={<SisterVsSister />} />
          <Route path="/treasure" element={<TreasureHunt />} />
          <Route path="/letter" element={<Letter />} />
        </Routes>
      </AnimatePresence>
    </HashRouter>
  );
}
