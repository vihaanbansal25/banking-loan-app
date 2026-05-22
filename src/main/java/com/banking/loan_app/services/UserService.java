package com.banking.loan_app.services;

import com.banking.loan_app.models.Account;
import com.banking.loan_app.models.User;
import com.banking.loan_app.repositories.AccountRepository;
import com.banking.loan_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class UserService {

    // Assigning a repository to our service
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;

    public String registerUser(User newUser){
        // checking if user already exists
        if (userRepository.existsByEmail((newUser.getEmail()))){
            return "Error: The email already exists in the Database!";
        }

        // saving the user to the database
        User savedUser = userRepository.save(newUser);

        // opening a new account for the user
        Account newAccount = new Account();

        // set parameters for the new account
        newAccount.setAccountNumber("ACCT-" + UUID.randomUUID().toString().substring(0, 8));
        newAccount.setBalance(BigDecimal.ZERO);
        newAccount.setUser(savedUser);

        accountRepository.save(newAccount);

        return "Success! User is now registered with an Account.";
    }
}
