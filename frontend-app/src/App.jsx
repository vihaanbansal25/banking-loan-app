import { useState } from 'react'

function App() {
  // react states - hold what users type in the boxes
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // this func runs when user clicks submit
  const handleRegister = async(e) => {
    e.preventDefault(); // stops page from refreshing

    // json envelope
    const userEnvelope = {
      fullName: name,
      email: email,
      password: password,
      role: "CUSTOMER"
    };

    // hand over the request to java server
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userEnvelope)
      });
      
      const responseText = await response.text();
      setMessage(responseText); // Display Java's reply on the screen!
      
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Create a Bank Account</h1>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Full Name" 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Register</button>
      </form>

      {/* Shows the success/error message in bold */}
      <p><b>{message}</b></p> 
    </div>
  )
}

export default App