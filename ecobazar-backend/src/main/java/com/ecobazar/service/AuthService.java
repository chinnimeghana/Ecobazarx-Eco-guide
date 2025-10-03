package com.ecobazar.service;

import com.ecobazar.model.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public User register(String username, String email, String password, User.Role role) {
        // Dummy implementation
        User user = new User();
        user.setId(1L); // mock ID
        user.setUsername(username);
        user.setEmail(email);
        user.setRole(role);
        return user;
    }

    public User authenticate(String email, String password) {
        // Dummy authentication
        User user = new User();
        user.setId(1L);
        user.setUsername("demo");
        user.setEmail(email);
        user.setRole(User.Role.BUYER); // or appropriate role
        return user;
    }
}
