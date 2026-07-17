import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { apiGet } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { IconClipboard } from '../../components/icons';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/manager/loans/pending').then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setPending(data);
      setLoading(false);
    });
  }, []);

  const totalRequested = pending.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Manager desk</div>
        <h1>Welcome back, {user?.fullName?.split(' ')[0]}</h1>
        <p className="page-sub">A quick look at what's waiting for review.</p>
      </div>

      <div className="stack">
        <div className="stat-row">
          <div className="stat">
            <div className="stat-label">Pending applications</div>
            <div className="stat-value">{loading ? '…' : pending.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Total requested</div>
            <div className="stat-value">${loading ? '…' : formatMoney(totalRequested)}</div>
          </div>
        </div>

        <div className="card">
          <h2>Loan review queue</h2>
          <p className="card-sub">
            {pending.length === 0
              ? 'Nothing waiting on you right now.'
              : `${pending.length} application${pending.length === 1 ? '' : 's'} need a decision.`}
          </p>
          <Link to="/manager/loans" className="btn btn-primary">
            <IconClipboard style={{ width: 16, height: 16 }} />
            Go to review queue
          </Link>
        </div>
      </div>
    </>
  );
}
