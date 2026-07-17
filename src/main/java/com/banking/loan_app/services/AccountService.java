package com.banking.loan_app.services;

import com.banking.loan_app.dtos.AccountResponse;
import com.banking.loan_app.models.Account;
import com.banking.loan_app.models.Transaction;
import com.banking.loan_app.models.TransactionType;
import com.banking.loan_app.models.User;
import com.banking.loan_app.repositories.AccountRepository;
import com.banking.loan_app.repositories.TransactionRepository;
import com.banking.loan_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

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

    // Moves money from one account to another. Records a TRANSFER_OUT on the
    // sender's history and a TRANSFER_IN on the receiver's history, so both
    // sides can see the transfer when they look at their own transactions.
    public String transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return "Error: Transfer amount must be greater than zero";
        }

        if (fromAccountNumber != null && fromAccountNumber.equals(toAccountNumber)) {
            return "Error: Cannot transfer money to the same account";
        }

        Account fromAccount = accountRepository.findByAccountNumber(fromAccountNumber);
        if (fromAccount == null) {
            return "Error: Could not find your account";
        }

        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber);
        if (toAccount == null) {
            return "Error: Could not find an account with number " + toAccountNumber;
        }

        if (fromAccount.getBalance().compareTo(amount) < 0) {
            return "Error: Insufficient funds! You only have $" + fromAccount.getBalance();
        }

        // move the money
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        Transaction outgoing = new Transaction();
        outgoing.setType(TransactionType.TRANSFER_OUT);
        outgoing.setAmount(amount);
        outgoing.setTimestamp(now);
        outgoing.setAccount(fromAccount);
        outgoing.setRelatedAccountNumber(toAccount.getAccountNumber());
        transactionRepository.save(outgoing);

        Transaction incoming = new Transaction();
        incoming.setType(TransactionType.TRANSFER_IN);
        incoming.setAmount(amount);
        incoming.setTimestamp(now);
        incoming.setAccount(toAccount);
        incoming.setRelatedAccountNumber(fromAccount.getAccountNumber());
        transactionRepository.save(incoming);

        return "Successfully transferred $" + amount + " to " + toAccount.getAccountNumber()
                + ". New balance: $" + fromAccount.getBalance();
    }

    // Lets the frontend refresh the logged-in user's account number/balance
    // (e.g. after landing on the dashboard, or after a deposit/withdraw/transfer)
    // without exposing the linked User entity.
    public Object getAccountByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return "Error: Could not find a user with that ID";
        }

        Account account = accountRepository.findByUser(user);
        if (account == null) {
            return "Error: No account found for this user";
        }

        return new AccountResponse(account.getAccountNumber(), account.getBalance());
    }

}
