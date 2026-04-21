import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import LibrarianDashboard from './pages/LibrarianDashboard';
import StudentDashboard from './pages/StudentDashboard';
import About from './pages/About';
import Research from './pages/Research';
import Login from './pages/Login';

// Wrapper that conditionally renders Navbar/Footer
function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/librarian" element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <LibrarianDashboard />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
