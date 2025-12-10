package com.smartentrance.backend.security;

import com.smartentrance.backend.exception.ResourceNotFoundException;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserPrincipalLoader implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return Objects.requireNonNull(userRepository.findByEmail(email))
                .map(UserPrincipal::new)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "email", email));
    }
}