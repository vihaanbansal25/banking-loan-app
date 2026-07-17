package com.banking.loan_app.dtos;

import java.math.BigDecimal;

// Lightweight view of an account - used when the frontend just needs to
// refresh the balance for the logged-in user, without pulling back the
// linked User (and its password field) the way the Account entity would.
public class AccountResponse {

    private String accountNumber;
    private BigDecimal balance;

    public AccountResponse(String accountNumber, BigDecimal balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
