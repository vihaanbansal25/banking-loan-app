import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import TransactionsPage from './pages/customer/TransactionsPage';
import TransferPage from './pages/customer/TransferPage';
import LoansPage from './pages/customer/LoansPage';

import ManagerDashboard from './pages/manager/ManagerDashboard';
import ReviewLoansPage from './pages/manager/ReviewLoansPage';

// "/" just figures out where a visitor belongs: straight to their
// dashboard if they're already logged in, otherwise to the login page.
function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'MANAGER' ? '/manager' : '/customer'} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/customer"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="loans" element={<LoansPage />} />
      </Route>

      <Route
        path="/manager"
        element={
          <ProtectedRoute role="MANAGER">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="loans" element={<ReviewLoansPage />} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
