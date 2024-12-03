package com.example.todomanagement.demo.service;

import com.example.todomanagement.demo.model.AuthenticationResponse;
import com.example.todomanagement.demo.model.LoginRequest;
import com.example.todomanagement.demo.model.SignupRequest;
import com.example.todomanagement.demo.model.User;
import com.example.todomanagement.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    // Assume you have a UserRepository to interact with the database
    @Autowired
    private UserRepository userRepository;

    public AuthenticationResponse login(LoginRequest loginRequest) {
        // Logic to authenticate user
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            // Generate a token (this is just a placeholder; implement token generation)
            return new AuthenticationResponse(user.getId(), user.getEmail(), user.getName());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public void signup(SignupRequest signupRequest) {
        // Logic to register a new user
        User newUser  = new User();
        newUser .setName(signupRequest.getName());
        newUser .setEmail(signupRequest.getEmail());
        newUser .setPassword(signupRequest.getPassword()); // You should hash this password
        newUser .setAge(signupRequest.getAge());
        userRepository.save(newUser );
    }

    private String generateToken(User user) {
        // Implement token generation logic (e.g., JWT)
        return "dummy-token"; // Replace with actual token generation
    }
}