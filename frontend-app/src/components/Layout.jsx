import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { IconHome, IconArrows, IconTransfer, IconLoan, IconClipboard, IconLogout } from './icons';

const customerLinks = [
  { to: '/customer', label: 'Overview', icon: IconHome, end: true },
  { to: '/customer/transactions', label: 'Deposit & withdraw', icon: IconArrows },
  { to: '/customer/transfer', label: 'Transfer', icon: IconTransfer },
  { to: '/customer/loans', label: 'Loans', icon: IconLoan },
];

const managerLinks = [
  { to: '/manager', label: 'Overview', icon: IconHome, end: true },
  { to: '/manager/loans', label: 'Review loans', icon: IconClipboard },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'MANAGER' ? managerLinks : customerLinks;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="mark">M</div>
          <div>
            <div className="brand">Meridian</div>
            <div className="sidebar-role">{user?.role === 'MANAGER' ? 'Manager desk' : 'Customer'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="name">{user?.fullName}</div>
            <div className="email">{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <IconLogout />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
