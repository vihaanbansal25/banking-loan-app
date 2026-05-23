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
}
