import { Navigate, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import AddExpense from './pages/AddExpense';
import AddBudget from './pages/AddBudget';
import Budgets from './pages/Budgets';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppShell() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold text-indigo-700">
            AI Finance Manager
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
            <Link to="/expenses" className="text-gray-600 hover:text-indigo-600">Expenses</Link>
            <Link to="/budgets" className="text-gray-600 hover:text-indigo-600">Budgets</Link>
            <span className="hidden sm:inline text-sm text-gray-500">{currentUser?.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">
              Sign out
            </button>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/add-budget" element={<AddBudget />} />
          <Route path="/budgets" element={<Budgets />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/*" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
