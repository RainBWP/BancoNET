import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transfer from './components/Transfer';
import Login from './components/Login'; // Move your current App login logic here

function App() {
  return (
    <Router basename="/BancoNET">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/:accountId" element={<Dashboard />} />
        <Route path="/transfer/:accountId" element={<Transfer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;