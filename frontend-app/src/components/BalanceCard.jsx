import { formatMoney } from '../lib/format';

export function BalanceCard({ accountNumber, balance }) {
  return (
    <div className="balance-card">
      <div className="balance-eyebrow">Available balance</div>
      <div className="balance-amount">${formatMoney(balance)}</div>
      <div className="balance-account">ACCOUNT {accountNumber || '--'}</div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const variants = {
    PENDING: 'badge-pending',
    APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected',
  };
  return <span className={`badge ${variants[status] || 'badge-pending'}`}>{status}</span>;
}

export function TransactionBadge({ type }) {
  const variants = {
    DEPOSIT: 'badge-in',
    TRANSFER_IN: 'badge-in',
    WITHDRAWAL: 'badge-out',
    TRANSFER_OUT: 'badge-out',
  };
  const labels = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRANSFER_IN: 'Transfer in',
    TRANSFER_OUT: 'Transfer out',
  };
  return <span className={`badge ${variants[type] || ''}`}>{labels[type] || type}</span>;
}
