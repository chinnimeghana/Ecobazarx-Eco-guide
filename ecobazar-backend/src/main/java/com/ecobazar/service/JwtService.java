package com.ecobazar.service;

import com.ecobazar.jwt.JwtUtil;
import com.ecobazar.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Autowired
    private JwtUtil jwtUtil;

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getUsername());
    }
}