import { useEffect, useState } from 'react';
import { apiGet, apiPost, messageFrom } from '../../lib/api';
import { formatMoney } from '../../lib/format';

export default function ReviewLoansPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function loadPending() {
    setLoading(true);
    const { ok, data } = await apiGet('/manager/loans/pending');
    if (ok && Array.isArray(data)) setPending(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPending();
  }, []);

  async function handleReview(loanId, decision) {
    setMessage(null);
    setBusyId(loanId);

    const { ok, data } = await apiPost('/manager/loans/review', { loanId, status: decision });
    const text = messageFrom(data);

    setBusyId(null);

    if (!ok || text.startsWith('Error')) {
      setMessage({ type: 'error', text });
      return;
    }

    setMessage({ type: 'success', text });
    loadPending();
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Manager desk</div>
        <h1>Review loans</h1>
        <p className="page-sub">Approve or reject pending loan applications.</p>
      </div>

      <div className="card">
        <h2>Pending applications</h2>
        <p className="card-sub">Approving a loan deposits the funds into the customer's account right away.</p>

        {message && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : pending.length === 0 ? (
          <div className="empty-state">No pending applications. You're all caught up.</div>
        ) : (
          <div>
            {pending.map((loan) => (
              <div className="loan-card" key={loan.id}>
                <div>
                  <div className="loan-amount">${formatMoney(loan.amount)}</div>
                  <div className="loan-meta">
                    Application #{loan.id} · {loan.user?.fullName || `User #${loan.user?.id}`}
                  </div>
                </div>
                <div className="actions-row">
                  <button
                    className="btn btn-primary"
                    disabled={busyId === loan.id}
                    onClick={() => handleReview(loan.id, 'APPROVED')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    disabled={busyId === loan.id}
                    onClick={() => handleReview(loan.id, 'REJECTED')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
