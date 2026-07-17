package com.banking.loan_app.controllers;

import com.banking.loan_app.dtos.AmountRequest;
import com.banking.loan_app.dtos.TransferRequest;
import com.banking.loan_app.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/accounts")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping("/{accountNumber}/balance")
    public String getBalance(@PathVariable String accountNumber){
        // @PathVariable to get what is in the placeholder in url
        return accountService.checkBalance(accountNumber);
    }

    @PostMapping("/{accountNumber}/deposit")
    public String depositMoney(@PathVariable String accountNumber, @RequestBody AmountRequest request){
        return accountService.deposit(accountNumber, request.getAmount());
    }

    @PostMapping("/{accountNumber}/withdraw")
    public String withdrawMoney(@PathVariable String accountNumber, @RequestBody AmountRequest request){
        return accountService.withdraw(accountNumber, request.getAmount());
    }

    @GetMapping("/{accountNumber}/transactions")
    public Object getTransactionHistory(@PathVariable String accountNumber) {
        return accountService.getTransactionHistory(accountNumber);
    }

    @PostMapping("/transfer")
    public String transfer(@RequestBody TransferRequest request) {
        return accountService.transfer(request.getFromAccountNumber(), request.getToAccountNumber(), request.getAmount());
    }

    @GetMapping("/by-user/{userId}")
    public Object getAccountByUserId(@PathVariable Long userId) {
        return accountService.getAccountByUserId(userId);
    }
}
