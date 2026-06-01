package com.banking.loan_app.exceptions;

import com.banking.loan_app.dtos.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // exception handler
public class GlobalExceptionHandler {

    // 1. CATCHING BAD JSON (e.g., typing words instead of numbers)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleBadJson(HttpMessageNotReadableException ex) {

        // We pack our clean Error Envelope
        ErrorResponse response = new ErrorResponse("Bad Request", "Please check your data. Make sure numbers are formatted correctly!");

        // Return it with a 400 Bad Request status code
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 2. CATCHING EVERYTHING ELSE (The Ultimate Safety Net)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralExceptions(Exception ex) {

        ex.printStackTrace();

        ErrorResponse response = new ErrorResponse("Server Error", "Something went wrong on our end. Please try again later.");

        // Return it with a 500 Internal Server Error status code
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
