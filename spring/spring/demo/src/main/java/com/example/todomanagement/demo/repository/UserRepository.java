package com.example.todomanagement.demo.repository;

import com.example.todomanagement.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email); // Custom query method to find a user by email
}