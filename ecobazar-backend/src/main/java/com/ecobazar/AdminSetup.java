package com.ecobazar;

import com.ecobazar.model.User;
import com.ecobazar.repository.UserRepository;
import com.ecobazar.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminSetup {

    @Bean
    CommandLineRunner createInitialAdmin(
            AuthService authService,
            UserRepository userRepository) {

        return args -> {
            String email = System.getenv("ADMIN_EMAIL");
            String password = System.getenv("ADMIN_PASSWORD");

            if (email == null || password == null) {
                System.out.println("Admin setup skipped: credentials not configured.");
                return;
            }

            if (userRepository.findByEmail(email).isEmpty()) {
                authService.createAdmin(
                    "Admin",
                    email,
                    password
                );
                System.out.println("Initial admin account created.");
            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}