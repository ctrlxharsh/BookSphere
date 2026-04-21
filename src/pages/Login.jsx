import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    
    setLoading(true);
    try {
      await login(role, id, password);
      navigate(`/${role}`);
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-ambient border border-outline-variant/20 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-3xl symbol-fill">account_circle</span>
          </div>
          <h1 className="font-headline text-3xl text-on-surface font-bold">Welcome Back</h1>
          <p className="font-body text-on-surface-variant text-sm mt-2">Sign in to access your portal</p>
        </div>

        <div className="flex gap-4 mb-8 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/15">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-lg font-label text-sm font-semibold transition-all ${
              role === 'student'
                ? 'bg-surface shadow-sm text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('librarian')}
            className={`flex-1 py-2 rounded-lg font-label text-sm font-semibold transition-all ${
              role === 'librarian'
                ? 'bg-surface shadow-sm text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Librarian
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">
              {role === 'student' ? 'Student ID' : 'Staff ID'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">badge</span>
              <input
                type="text"
                required
                defaultValue={role === 'student' ? '21HS402' : 'LIB-01'}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-10 pr-4 text-sm font-body text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
              <input
                type="password"
                required
                defaultValue="password123"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-10 pr-4 text-sm font-body text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-body font-semibold py-3 rounded-lg transition-colors mt-4 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="#" className="font-body text-xs text-tertiary hover:underline underline-offset-2">
            Forgot your credentials?
          </a>
        </div>
      </div>
    </div>
  );
}
