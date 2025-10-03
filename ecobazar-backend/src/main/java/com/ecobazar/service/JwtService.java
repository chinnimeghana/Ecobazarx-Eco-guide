package com.ecobazar.service;

import com.ecobazar.model.User;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public String generateToken(User user) {
        // Dummy token
        return "dummy-jwt-token-for-user-" + user.getId();
    }
}
