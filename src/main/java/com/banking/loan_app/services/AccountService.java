package com.banking.loan_app.services;

import com.banking.loan_app.models.Account;
import com.banking.loan_app.models.Transaction;
import com.banking.loan_app.models.TransactionType;
import com.banking.loan_app.repositories.AccountRepository;
import com.banking.loan_app.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public String checkBalance(String accountNumber){
        // get account
        Account account = accountRepository.findByAccountNumber(accountNumber);

        if (account == null){
            return "Error: Could not find Account with that number";
        }

        return "Your current balance is: $" + account.getBalance();
    }

    public String deposit(String accountNumber, BigDecimal amount){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null){
            return "Error: Could not find Account with that number";
        }

        account.setBalance(account.getBalance().add(amount));

        accountRepository.save(account);

        // Updating Transaction History
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setTimestamp(java.time.LocalDateTime.now()); // Stamps the exact current time
        transaction.setAccount(account);

        transactionRepository.save(transaction);

        return "Successfully deposited $" + amount + ". New balance: $" + account.getBalance();
    }

    public String withdraw(String accountNumber, BigDecimal amount){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null){
            return "Error: Could not find Account with that number";
        }

        if (account.getBalance().compareTo(amount) < 0){
            return "Error: Insufficient funds! You only have $" + account.getBalance();
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        // Updating Transaction History
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setTimestamp(java.time.LocalDateTime.now());
        transaction.setAccount(account);

        transactionRepository.save(transaction);

        return "Successfully withdrew $" + amount + ". New balance: $" + account.getBalance();
    }

    public Object getTransactionHistory(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null){
            return "Error: Could not find Account with that number";
        }

        return transactionRepository.findByAccountOrderByTimestampDesc(account);
    }


}
