package com.banking.loan_app.dtos;

import com.banking.loan_app.models.LoanStatus;

public class LoanReviewRequest {

    private Long loanId;
    private LoanStatus status; // approved or rejected

    public Long getLoanId() { return loanId; }
    public void setLoanId(Long loanId) { this.loanId = loanId; }

    public LoanStatus getStatus() { return status; }
    public void setStatus(LoanStatus status) { this.status = status; }

}
