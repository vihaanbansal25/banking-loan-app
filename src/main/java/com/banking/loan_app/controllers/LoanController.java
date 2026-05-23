package com.banking.loan_app.controllers;

import com.banking.loan_app.dtos.LoanRequest;
import com.banking.loan_app.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/apply")
    public String applyForLoan(@RequestBody LoanRequest request) {
        return loanService.applyForLoan(request.getUserId(), request.getAmount());
    }
}