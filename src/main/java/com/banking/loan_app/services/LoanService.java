package com.banking.loan_app.services;

import com.banking.loan_app.models.Loan;
import com.banking.loan_app.models.LoanStatus;
import com.banking.loan_app.models.User;
import com.banking.loan_app.repositories.LoanRepository;
import com.banking.loan_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.banking.loan_app.repositories.AccountRepository accountRepository;

    @Autowired
    private com.banking.loan_app.services.AccountService accountService;


    public String applyForLoan(Long userId, BigDecimal amount){
        User user = userRepository.findById(userId).orElse(null); // prevents crash if doesnt exist

        if (user == null){
            return "Error! Could not find a user by this ID.";
        }

        Loan loan = new Loan();
        loan.setAmount(amount);
        loan.setStatus(LoanStatus.PENDING);
        loan.setUser(user);

        loanRepository.save(loan);

        return "Success! Your loan application for $" + amount + " has been submitted and is currently PENDING.";
    }

    public String reviewLoan(Long loanId, LoanStatus newStatus) {

        // 1. Find the loan application
        Loan loan = loanRepository.findById(loanId).orElse(null);
        if (loan == null) {
            return "Error: Loan application not found.";
        }

        // 2. Prevent a manager from double-approving a loan
        if (loan.getStatus() != LoanStatus.PENDING) {
            return "Error: This loan has already been " + loan.getStatus();
        }

        // 3. Update the status and save it to the vault
        loan.setStatus(newStatus);
        loanRepository.save(loan);

        // If approved, automatically deposit the money!
        if (newStatus == LoanStatus.APPROVED) {
            com.banking.loan_app.models.Account userAccount = accountRepository.findByUser(loan.getUser());

            if (userAccount != null) {
                accountService.deposit(userAccount.getAccountNumber(), loan.getAmount());
                return "Loan APPROVED! Funds have been deposited into account: " + userAccount.getAccountNumber();
            }
        }

        return "Loan application has been " + newStatus;
    }

    public Object getMyLoans(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return "Error: User not found.";
        }

        return loanRepository.findByUser(user);
    }

    public Object getPendingLoans() {
        return loanRepository.findByStatus(LoanStatus.PENDING);
    }
}
