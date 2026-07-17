import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { apiGet, apiPost, messageFrom } from '../../lib/api';
import { StatusBadge } from '../../components/BalanceCard';
import { formatMoney } from '../../lib/format';

export default function LoansPage() {
  const { user, refreshAccount } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLoans() {
    setLoading(true);
    const { ok, data } = await apiGet(`/loans/my-loans/${user.id}`);
    if (ok && Array.isArray(data)) setLoans(data);
    setLoading(false);
  }

  async function handleApply(e) {
    e.preventDefault();
    setMessage(null);

    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setMessage({ type: 'error', text: 'Enter an amount greater than zero.' });
      return;
    }

    setSubmitting(true);
    const { ok, data } = await apiPost('/loans/apply', { userId: user.id, amount: parsed });
    setSubmitting(false);

    const text = messageFrom(data);
    if (!ok || text.startsWith('Error')) {
      setMessage({ type: 'error', text });
      return;
    }

    setMessage({ type: 'success', text });
    setAmount('');
    loadLoans();
    refreshAccount(); // in case an older loan just got approved and the balance changed
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Loans</div>
        <h1>Loan center</h1>
        <p className="page-sub">Apply for a loan and track the status of your applications.</p>
      </div>

      <div className="stack">
        <div className="card">
          <h2>Apply for a loan</h2>
          <p className="card-sub">A manager will review your request. Approved loans deposit straight into your account.</p>

          {message && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleApply}>
            <div className="field">
              <label htmlFor="amount">Requested amount ($)</label>
              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>My loans</h2>
          <p className="card-sub">Every loan application you've submitted.</p>

          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : loans.length === 0 ? (
            <div className="empty-state">You haven't applied for a loan yet.</div>
          ) : (
            <div>
              {loans.map((loan) => (
                <div className="loan-card" key={loan.id}>
                  <div>
                    <div className="loan-amount">${formatMoney(loan.amount)}</div>
                    <div className="loan-meta">Application #{loan.id}</div>
                  </div>
                  <StatusBadge status={loan.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
