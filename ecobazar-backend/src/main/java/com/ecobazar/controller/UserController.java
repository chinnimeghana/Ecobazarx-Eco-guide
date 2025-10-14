package com.ecobazar.controller;

import com.ecobazar.model.User;
import com.ecobazar.model.User.UserStatus;
import com.ecobazar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Register a new user
    @PostMapping
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        // Default status = PENDING (or ACTIVE if you want instant approval)
        if (user.getStatus() == null) {
            user.setStatus(UserStatus.PENDING);
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser); // return JSON
    }

    // ✅ Approve a user (Admin action)
    @PutMapping("/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
