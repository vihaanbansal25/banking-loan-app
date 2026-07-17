import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost, messageFrom } from '../lib/api';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const { ok, data } = await apiPost('/users/register', { fullName, email, password, role });

    setSubmitting(false);

    if (!ok || (typeof data === 'string' && data.startsWith('Error'))) {
      setError(messageFrom(data));
      return;
    }

    setSuccess('Account created. Redirecting to login…');
    setTimeout(() => navigate('/login', { replace: true }), 1200);
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-mark">
          <div className="mark">M</div>
          <div className="brand">Meridian</div>
        </div>

        <h1>Create an account</h1>
        <p className="auth-sub">Opens a checking account with a $0 starting balance.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="role">Account type</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CUSTOMER">Customer</option>
              <option value="MANAGER">Manager</option>
            </select>
            <span className="hint">
              Anyone can pick "Manager" for now - real access control comes with the security pass.
            </span>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
