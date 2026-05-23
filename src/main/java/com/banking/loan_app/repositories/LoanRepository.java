package com.banking.loan_app.repositories;

import com.banking.loan_app.models.Loan;
import com.banking.loan_app.models.LoanStatus;
import com.banking.loan_app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    // find loans by user
    List<Loan> findByUser(User user);

    // find loans by status
    List<Loan> findByStatus(LoanStatus status);
}