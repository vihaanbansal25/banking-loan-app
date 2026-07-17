import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { apiGet, apiPost, messageFrom } from '../../lib/api';
import { BalanceCard, TransactionBadge } from '../../components/BalanceCard';
import { formatMoney } from '../../lib/format';

export default function TransactionsPage() {
  const { user, refreshAccount } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text }
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    refreshAccount();
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadHistory() {
    if (!user?.accountNumber) return;
    setLoadingHistory(true);
    const { ok, data } = await apiGet(`/accounts/${user.accountNumber}/transactions`);
    if (ok && Array.isArray(data)) setHistory(data);
    setLoadingHistory(false);
  }

  async function handleTransaction(type) {
    setMessage(null);

    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setMessage({ type: 'error', text: 'Enter an amount greater than zero.' });
      return;
    }

    setSubmitting(true);
    const { ok, data } = await apiPost(`/accounts/${user.accountNumber}/${type}`, { amount: parsed });
    setSubmitting(false);

    const text = messageFrom(data);
    if (!ok || text.startsWith('Error')) {
      setMessage({ type: 'error', text });
      return;
    }

    setMessage({ type: 'success', text });
    setAmount('');
    refreshAccount();
    loadHistory();
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Account</div>
        <h1>Deposit &amp; withdraw</h1>
        <p className="page-sub">Move money in or out of account {user?.accountNumber}.</p>
      </div>

      <div className="stack">
        <BalanceCard accountNumber={user?.accountNumber} balance={user?.balance} />

        <div className="card">
          <h2>Move money</h2>
          <p className="card-sub">Enter an amount, then deposit or withdraw.</p>

          {message && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {message.text}
            </div>
          )}

          <div className="field">
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="actions-row">
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting}
              onClick={() => handleTransaction('deposit')}
            >
              Deposit
            </button>
            <button
              className="btn btn-outline-danger"
              style={{ flex: 1 }}
              disabled={submitting}
              onClick={() => handleTransaction('withdraw')}
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Transaction history</h2>
          <p className="card-sub">Every deposit, withdrawal, and transfer on this account.</p>

          {loadingHistory ? (
            <div className="empty-state">Loading…</div>
          ) : history.length === 0 ? (
            <div className="empty-state">No transactions yet.</div>
          ) : (
            <div className="tx-list">
              {history.map((tx) => {
                const isCredit = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
                return (
                  <div className="tx-row" key={tx.id}>
                    <div>
                      <div className="tx-type">
                        <TransactionBadge type={tx.type} />
                      </div>
                      <div className="tx-meta">
                        {new Date(tx.timestamp).toLocaleString()}
                        {tx.relatedAccountNumber
                          ? ` · ${tx.type === 'TRANSFER_IN' ? 'from' : 'to'} ${tx.relatedAccountNumber}`
                          : ''}
                      </div>
                    </div>
                    <div className={`tx-amount ${isCredit ? 'amount-positive' : 'amount-negative'}`}>
                      {isCredit ? '+' : '-'}${formatMoney(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
