package com.smartentrance.backend.service;

import com.smartentrance.backend.model.User;
import com.smartentrance.backend.model.enums.UserRole;
import com.smartentrance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("User with this email already exists!");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setHashedPassword(hashedPassword);

        if (user.getRole() == null) {
            user.setRole(UserRole.RESIDENT);
        }

        return userRepository.save(user);
    }
}