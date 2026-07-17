package com.banking.loan_app.dtos;

import com.banking.loan_app.models.Role;

import java.math.BigDecimal;

// What we send back to the frontend after a successful login.
// Deliberately leaves the password out - the frontend uses this to know
// who's logged in, which role's interface to show, and which account to act on.
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String accountNumber;
    private BigDecimal balance;

    public UserResponse(Long id, String fullName, String email, Role role, String accountNumber, BigDecimal balance) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
