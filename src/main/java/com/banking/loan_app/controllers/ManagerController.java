package com.banking.loan_app.controllers;

import com.banking.loan_app.dtos.LoanReviewRequest;
import com.banking.loan_app.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/manager")
public class ManagerController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/loans/review")
    public String reviewLoan(@RequestBody LoanReviewRequest request) {
        return loanService.reviewLoan(request.getLoanId(), request.getStatus());
    }

    @GetMapping("/loans/pending")
    public Object getPendingLoans() {
        return loanService.getPendingLoans();
    }
}