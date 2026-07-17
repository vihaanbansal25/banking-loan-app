import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import { AuthContext } from './auth-context';

// Holds whoever is currently logged in: id, fullName, email, role,
// accountNumber, balance. Persisted to localStorage so a page refresh
// doesn't kick you back to the login screen.
//
// NOTE: there's no session token / JWT here yet - this is just "remember
// which user we logged in as" for the UI. Real authentication (hashed
// passwords, sessions, route-level auth on the backend) is the security
// pass we're doing separately.

const STORAGE_KEY = 'meridian_bank_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  // Re-pulls balance/accountNumber from the backend - call this after any
  // deposit/withdraw/transfer, or when a page first loads, so the sidebar
  // and dashboard never show a stale number.
  async function refreshAccount() {
    if (!user) return;
    const { ok, data } = await apiGet(`/accounts/by-user/${user.id}`);
    if (ok && typeof data === 'object') {
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
