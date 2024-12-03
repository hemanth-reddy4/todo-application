package com.example.todomanagement.demo.controller;

import com.example.todomanagement.demo.model.AuthenticationResponse;
import com.example.todomanagement.demo.model.LoginRequest;
import com.example.todomanagement.demo.model.SignupRequest;
import com.example.todomanagement.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private Long userId;
    private String email;
    private String name;

    // Getters and setters
    public Long getUserId() {
        return userId;
    }
    @Autowired
    private AuthService authService; // Your AuthService that handles the logic

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Call the AuthService to handle the login logic
        AuthenticationResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        // Call the AuthService to handle the signup logic
        authService.signup(signupRequest);
        return ResponseEntity.ok("Signup successful! You can now log in.");
    }
}
