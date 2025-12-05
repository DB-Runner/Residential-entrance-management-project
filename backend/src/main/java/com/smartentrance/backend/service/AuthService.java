package com.smartentrance.backend.service;

import com.smartentrance.backend.dto.LoginRequest;
import com.smartentrance.backend.dto.LoginResponse;
import com.smartentrance.backend.dto.RegisterUserRequest;
import com.smartentrance.backend.mapper.UserMapper;
import com.smartentrance.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;

    public LoginResponse register(RegisterUserRequest request) {
        User userDraft = userMapper.toEntity(request);
        User savedUser = userService.createUser(userDraft);

        String token = "dummy-token-" + savedUser.getId(); // TODO: implement JWT

        return new LoginResponse(token, userMapper.toResponse(savedUser));
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = userService.findByEmail(request.getEmail());

        String token = "dummy-token-" + user.getId(); // TODO: implement JWT

        return new LoginResponse(token, userMapper.toResponse(user));
    }
}