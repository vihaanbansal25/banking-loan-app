import { useState } from 'react'

function App() {
  // register states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerMessage, setRegisterMessage] = useState('')

  // states for checking balance
  const [accountNumber, setAccountNumber] = useState('')
  const [balanceMessage, setBalanceMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionMessage, setTransactionMessage] = useState('')

  // NEW STATES FOR LOANS
  const [userId, setUserId] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [loanMessage, setLoanMessage] = useState('')
  const [myLoans, setMyLoans] = useState([])

  // NEW: MANAGER STATES
  const [pendingLoans, setPendingLoans] = useState([])
  const [managerMessage, setManagerMessage] = useState('')

  // Registration function
  const handleRegister = async(e) => {
    e.preventDefault();
    const userEnvelope = { fullName: name, email: email, password: password, role: "CUSTOMER" };
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userEnvelope)
      });
      setRegisterMessage(await response.text());
    } catch (error) { setRegisterMessage("Error connecting."); }
  }

  // --- CHECK BALANCE FUNCTION ---
  const handleCheckBalance = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/accounts/${accountNumber}/balance`);
      setBalanceMessage(await response.text());
    } catch (error) { setBalanceMessage("Error connecting."); }
  }

  // --- DEPOSIT / WITHDRAW FUNCTION ---
  const handleTransaction = async (e, type) => {
    e.preventDefault();
    const amountEnvelope = { amount: parseFloat(amount) };
    try {
      const response = await fetch(`http://localhost:8080/api/accounts/${accountNumber}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(amountEnvelope)
      });
      setTransactionMessage(await response.text());
      handleCheckBalance(e); 
    } catch (error) { setTransactionMessage("Error processing transaction."); }
  }

  // loan
  const handleApplyLoan = async (e) => {
    e.preventDefault();
    const loanEnvelope = { userId: parseInt(userId), amount: parseFloat(loanAmount) };
    try {
      const response = await fetch('http://localhost:8080/api/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanEnvelope)
      });
      setLoanMessage(await response.text());
      handleGetMyLoans(e); // Refresh the list automatically!
    } catch (error) { setLoanMessage("Error applying for loan."); }
  }

  const handleGetMyLoans = async (e) => {
    if(e) e.preventDefault(); // Sometimes we call this without a button click
    if(!userId) return; // Don't fetch if ID is blank

    try {
      const response = await fetch(`http://localhost:8080/api/loans/my-loans/${userId}`);
      const data = await response.json(); // Notice we use .json() here because Java is sending a List!
      setMyLoans(data);
    } catch (error) { console.log("Error fetching loans."); }
  }

  // --- 4. MANAGER ACTIONS (NEW!) ---
  const handleGetPendingLoans = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/manager/loans/pending');
      setPendingLoans(await response.json());
    } catch (error) { console.log("Error fetching pending loans."); }
  }

  const handleReviewLoan = async (loanId, decision) => {
    const reviewEnvelope = { loanId: loanId, status: decision };
    try {
      const response = await fetch('http://localhost:8080/api/manager/loans/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewEnvelope)
      });
      setManagerMessage(await response.text());
      handleGetPendingLoans(); // Automatically refresh the manager's list!
    } catch (error) { setManagerMessage("Error reviewing loan."); }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      
      {/* COLUMN 1: REGISTRATION */}
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>1. Create Account</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Register</button>
        </form>
        <p><b>{registerMessage}</b></p>
      </div>

      {/* COLUMN 2: DASHBOARD */}
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>2. Dashboard</h2>
        <form onSubmit={handleCheckBalance} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input type="text" placeholder="Account Number" onChange={(e) => setAccountNumber(e.target.value)} required style={{ width: '100%' }} />
          <button type="submit" style={{ backgroundColor: '#2196F3', color: 'white' }}>Load</button>
        </form>
        <h3 style={{ color: 'blue', margin: '10px 0' }}>{balanceMessage}</h3> 
        <hr style={{ margin: '15px 0' }} />
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="number" placeholder="Amount ($)" onChange={(e) => setAmount(e.target.value)} required />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={(e) => handleTransaction(e, 'deposit')} style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white' }}>Deposit</button>
            <button onClick={(e) => handleTransaction(e, 'withdraw')} style={{ flex: 1, backgroundColor: '#f44336', color: 'white' }}>Withdraw</button>
          </div>
        </form>
        <p><b>{transactionMessage}</b></p>
      </div>

      {/* COLUMN 3: LOAN CENTER */}
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
        <h2>3. Loan Center</h2>
        <form onSubmit={handleApplyLoan} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} required style={{ width: '70px' }} />
            <input type="number" placeholder="Amount ($)" onChange={(e) => setLoanAmount(e.target.value)} required style={{ flex: 1 }} />
          </div>
          <button type="submit" style={{ backgroundColor: '#ff9800', color: 'white' }}>Apply for Loan</button>
        </form>
        <p style={{ fontSize: '14px', color: '#555' }}><b>{loanMessage}</b></p>
        <hr style={{ margin: '15px 0', borderColor: '#bbdefb' }} />
        <button onClick={handleGetMyLoans} style={{ width: '100%', marginBottom: '10px' }}>Refresh My Loans</button>
        {myLoans.map((loan, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '10px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
            <div><b>ID:</b> {loan.id} | <b>${loan.amount}</b></div>
            <div>Status: <span style={{ color: loan.status === 'PENDING' ? 'orange' : loan.status === 'APPROVED' ? 'green' : 'red', fontWeight: 'bold' }}>{loan.status}</span></div>
          </div>
        ))}
      </div>

      {/* COLUMN 4: MANAGER SECURE TERMINAL (NEW!) */}
      <div style={{ width: '300px', padding: '20px', backgroundColor: '#333', color: 'white', borderRadius: '8px', border: '2px solid #000' }}>
        <h2 style={{ color: '#4caf50' }}>4. Manager Terminal</h2>
        <button onClick={handleGetPendingLoans} style={{ width: '100%', marginBottom: '15px', padding: '10px', fontWeight: 'bold' }}>SCAN FOR PENDING LOANS</button>
        
        <p style={{ color: 'yellow', fontSize: '14px' }}>{managerMessage}</p>

        {pendingLoans.map((loan, index) => (
          <div key={index} style={{ backgroundColor: '#444', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #666' }}>
            <div><b>User ID:</b> {loan.user.id}</div>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}><b>Requested:</b> ${loan.amount}</div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleReviewLoan(loan.id, 'APPROVED')} style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white' }}>APPROVE</button>
              <button onClick={() => handleReviewLoan(loan.id, 'REJECTED')} style={{ flex: 1, backgroundColor: '#f44336', color: 'white' }}>REJECT</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App