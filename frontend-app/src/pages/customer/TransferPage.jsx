import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { apiPost, messageFrom } from '../../lib/api';
import { BalanceCard } from '../../components/BalanceCard';

export default function TransferPage() {
  const { user, refreshAccount } = useAuth();
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    refreshAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setMessage({ type: 'error', text: 'Enter an amount greater than zero.' });
      return;
    }

    if (toAccount.trim() === user.accountNumber) {
      setMessage({ type: 'error', text: 'You can\'t transfer money to your own account.' });
      return;
    }

    setSubmitting(true);
    const { ok, data } = await apiPost('/accounts/transfer', {
      fromAccountNumber: user.accountNumber,
      toAccountNumber: toAccount.trim(),
      amount: parsed,
    });
    setSubmitting(false);

    const text = messageFrom(data);
    if (!ok || text.startsWith('Error')) {
      setMessage({ type: 'error', text });
      return;
    }

    setMessage({ type: 'success', text });
    setToAccount('');
    setAmount('');
    refreshAccount();
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Account</div>
        <h1>Transfer money</h1>
        <p className="page-sub">Send funds from your account to another Meridian account.</p>
      </div>

      <div className="stack">
        <BalanceCard accountNumber={user?.accountNumber} balance={user?.balance} />

        <div className="card">
          <h2>New transfer</h2>
          <p className="card-sub">Funds move immediately - double-check the account number before sending.</p>

          {message && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="from">From</label>
              <input id="from" type="text" value={user?.accountNumber || ''} readOnly />
            </div>

            <div className="field">
              <label htmlFor="to">To account number</label>
              <input
                id="to"
                type="text"
                placeholder="ACCT-xxxxxxxx"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              />
            </div>

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
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send transfer'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
