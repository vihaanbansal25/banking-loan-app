package com.banking.loan_app.repositories;

import com.banking.loan_app.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
    boolean existsByAccountNumber(String accountNumber);
}
