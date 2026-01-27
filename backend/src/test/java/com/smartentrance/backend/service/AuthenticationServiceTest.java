package com.smartentrance.backend.service;

import com.smartentrance.backend.dto.auth.LoginResponse;
import com.smartentrance.backend.dto.user.UserRegisterRequest;
import com.smartentrance.backend.dto.user.UserResponse;
import com.smartentrance.backend.mapper.UserMapper;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.security.JwtService;
import com.smartentrance.backend.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @Mock
    private InvitationService invitationService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private UserRegisterRequest registerRequest;
    private User user;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        registerRequest = new UserRegisterRequest();
        registerRequest.setEmail("invitee@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setInvitationCode("ABC123");
        registerRequest.setRememberMe(false);

        user = User.builder()
                .id(1L)
                .email("invitee@example.com")
                .build();

        userResponse = new UserResponse(
                1L,
                "invitee@example.com",
                null,
                null
        );
    }

    @Test
    void register_withValidInvitationCode_acceptsInvitationAndReturnsToken() {

        when(userMapper.toEntity(registerRequest)).thenReturn(user);
        when(passwordEncoder.encode(any())).thenReturn("hashed-password");
        when(userService.saveUser(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(UserPrincipal.class), anyBoolean()))
                .thenReturn("jwt-token");
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        LoginResponse response = authenticationService.register(registerRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(userResponse, response.getUser());

        verify(invitationService).acceptInvitation("ABC123", user);
        verify(jwtService).generateToken(any(UserPrincipal.class), eq(false));
    }

    @Test
    void register_withInvalidInvitationCode_stillCreatesUserButThrowsException() {

        when(userMapper.toEntity(registerRequest)).thenReturn(user);
        when(passwordEncoder.encode(any())).thenReturn("hashed-password");
        when(userService.saveUser(any(User.class))).thenReturn(user);
        doThrow(new RuntimeException("Invalid invitation"))
                .when(invitationService)
                .acceptInvitation(anyString(), any(User.class));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> authenticationService.register(registerRequest)
        );

        assertEquals("Invalid invitation", ex.getMessage());

        verify(userService).saveUser(any(User.class));
        verify(invitationService).acceptInvitation("ABC123", user);
        verify(jwtService, never()).generateToken(any(), anyBoolean());
    }

    @Test
    void register_withoutInvitationCode_doesNotProcessInvitation() {

        registerRequest.setInvitationCode(null);

        when(userMapper.toEntity(registerRequest)).thenReturn(user);
        when(passwordEncoder.encode(any())).thenReturn("hashed-password");
        when(userService.saveUser(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(UserPrincipal.class), anyBoolean()))
                .thenReturn("jwt-token");
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        LoginResponse response = authenticationService.register(registerRequest);

        assertNotNull(response);
        verify(invitationService, never()).acceptInvitation(any(), any());
        verify(jwtService).generateToken(any(UserPrincipal.class), anyBoolean());
    }
}
