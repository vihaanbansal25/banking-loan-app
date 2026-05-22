package com.banking.loan_app.models;

import jakarta.persistence.*;

@Entity // tells hibernate to create a table of this class
@Table(name = "users")
public class User {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // autocount (0, 1, 2 ...)
    private Long id;

    @Column(nullable = false, unique = true) // cannot be blank, no two users share same email
    private String email;

    @Column(nullable = false) // password
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING) // shows string value of enum in table instead of showing numeric digits
    @Column(nullable = false)
    private Role role;

    // getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }


}
