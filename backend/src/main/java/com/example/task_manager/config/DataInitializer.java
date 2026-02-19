package com.example.task_manager.config;

import com.example.task_manager.model.User;
import com.example.task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Always update admin password to ensure it's current
            var existingAdmin = userRepository.findByUsername("admin");
            if (existingAdmin.isPresent()) {
                User admin = existingAdmin.get();
                admin.setPassword(passwordEncoder.encode("a12345"));
                userRepository.save(admin);
            } else {
                userRepository.save(User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("a12345"))
                        .role(User.Role.ADMIN)
                        .build());
            }

            if (userRepository.findByUsername("user").isEmpty()) {
                userRepository.save(User.builder()
                        .username("user")
                        .password(passwordEncoder.encode("user123"))
                        .role(User.Role.USER)
                        .build());
            }
        };
    }
}
