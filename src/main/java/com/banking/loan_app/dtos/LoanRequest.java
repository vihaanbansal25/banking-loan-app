package com.banking.loan_app.dtos;

import java.math.BigDecimal;

public class LoanRequest {

    private Long userId; // who is applying
    private BigDecimal amount; // how much

    // getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
