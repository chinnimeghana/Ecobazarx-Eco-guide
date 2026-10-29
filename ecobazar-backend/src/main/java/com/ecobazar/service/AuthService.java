package com.ecobazar.service;

import com.ecobazar.model.User;
import com.ecobazar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String username, String email, String password, User.Role role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setStatus(User.UserStatus.PENDING);

        return userRepository.save(user);
    }
    
    public User createAdmin(String username, String email, String password) {
    if (userRepository.findByEmail(email).isPresent()) {
        throw new RuntimeException("Email already registered");
    }

    User admin = new User();
    admin.setUsername(username);
    admin.setEmail(email);
    admin.setPassword(passwordEncoder.encode(password));
    admin.setRole(User.Role.ADMIN);
    admin.setStatus(User.UserStatus.ACTIVE);

    return userRepository.save(admin);
}
    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}