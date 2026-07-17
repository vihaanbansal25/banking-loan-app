package com.banking.loan_app.controllers;

import com.banking.loan_app.dtos.ErrorResponse;
import com.banking.loan_app.dtos.LoginRequest;
import com.banking.loan_app.dtos.UserResponse;
import com.banking.loan_app.models.User;
import com.banking.loan_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService; // controller needs to connect to the service

    // when incoming POST comes to http://localhost:8080/api/users/register
    @PostMapping("/register")
    public String register(@RequestBody User user){ // @RequestBody converts JSON to java object
        return userService.registerUser(user);
    }

    // POST http://localhost:8080/api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UserResponse user = userService.login(request.getEmail(), request.getPassword());

        if (user == null) {
            ErrorResponse error = new ErrorResponse("Unauthorized", "Invalid email or password.");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(user);
    }
}
