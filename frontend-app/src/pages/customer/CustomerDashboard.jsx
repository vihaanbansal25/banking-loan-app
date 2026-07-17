import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { apiGet } from '../../lib/api';
import { BalanceCard, TransactionBadge } from '../../components/BalanceCard';
import { formatMoney } from '../../lib/format';
import { IconArrows, IconTransfer, IconLoan } from '../../components/icons';

export default function CustomerDashboard() {
  const { user, refreshAccount } = useAuth();
  const [recentTx, setRecentTx] = useState([]);
  const [loanCount, setLoanCount] = useState(null);

  useEffect(() => {
    refreshAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.accountNumber) return;

    apiGet(`/accounts/${user.accountNumber}/transactions`).then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setRecentTx(data.slice(0, 4));
    });

    apiGet(`/loans/my-loans/${user.id}`).then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setLoanCount(data.filter((l) => l.status === 'PENDING').length);
    });
  }, [user?.accountNumber, user?.id]);

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Overview</div>
        <h1>Welcome back, {user?.fullName?.split(' ')[0]}</h1>
        <p className="page-sub">Here's where things stand on your account today.</p>
      </div>

      <div className="stack">
        <BalanceCard accountNumber={user?.accountNumber} balance={user?.balance} />

        <div className="stat-row">
          <Link to="/customer/transactions" className="stat" style={{ textDecoration: 'none' }}>
            <div className="stat-label">
              <IconArrows style={{ width: 15, height: 15, marginRight: 6, verticalAlign: '-3px' }} />
              Deposit or withdraw
            </div>
            <div className="stat-value" style={{ fontSize: 15, fontFamily: 'var(--sans)', color: 'var(--muted)' }}>
              Move money in or out
            </div>
          </Link>

          <Link to="/customer/transfer" className="stat" style={{ textDecoration: 'none' }}>
            <div className="stat-label">
              <IconTransfer style={{ width: 15, height: 15, marginRight: 6, verticalAlign: '-3px' }} />
              Transfer
            </div>
            <div className="stat-value" style={{ fontSize: 15, fontFamily: 'var(--sans)', color: 'var(--muted)' }}>
              Send to another account
            </div>
          </Link>

          <Link to="/customer/loans" className="stat" style={{ textDecoration: 'none' }}>
            <div className="stat-label">
              <IconLoan style={{ width: 15, height: 15, marginRight: 6, verticalAlign: '-3px' }} />
              Loans
            </div>
            <div className="stat-value" style={{ fontSize: 15, fontFamily: 'var(--sans)', color: 'var(--muted)' }}>
              {loanCount === null ? 'View loans' : loanCount > 0 ? `${loanCount} pending` : 'None pending'}
            </div>
          </Link>
        </div>

        <div className="card">
          <h2>Recent activity</h2>
          <p className="card-sub">The last few things that happened on your account.</p>

          {recentTx.length === 0 ? (
            <div className="empty-state">No transactions yet - deposit some funds to get started.</div>
          ) : (
            <div className="tx-list">
              {recentTx.map((tx) => {
                const isCredit = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
                return (
                  <div className="tx-row" key={tx.id}>
                    <div>
                      <div className="tx-type">
                        <TransactionBadge type={tx.type} />
                      </div>
                      <div className="tx-meta">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    <div className={`tx-amount ${isCredit ? 'amount-positive' : 'amount-negative'}`}>
                      {isCredit ? '+' : '-'}${formatMoney(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <Link to="/customer/transactions" className="btn btn-ghost">
              View all transactions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
