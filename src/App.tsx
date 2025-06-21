import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterpriseLayout from './components/EnterpriseLayout';
import Enterprise from './pages/Enterprise/index';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light">
        <Routes>
          {/* Auth routes without layout */}
          {/* Enterprise routes with dedicated enterprise layout */}
          <Route path="/*" element={<EnterpriseLayout><Enterprise /></EnterpriseLayout>} />
          
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;