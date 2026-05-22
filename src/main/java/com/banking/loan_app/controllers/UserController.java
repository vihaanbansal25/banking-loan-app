package com.banking.loan_app.controllers;

import com.banking.loan_app.models.User;
import com.banking.loan_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService; // controller needs to connect to the service

    // when incoming POST comes to http://localhost:8080/api/users/register
    @PostMapping("/register")
    public String register(@RequestBody User user){ // @RequestBody converts JSON to java object
        return userService.registerUser(user);
    }
}
