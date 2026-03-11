import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import Expenses from './pages/Expenses';
import Settlement from './pages/Settlement';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/settlement" element={<Settlement />} />
      </Routes>
    </Router>
  );
}

export default App;
