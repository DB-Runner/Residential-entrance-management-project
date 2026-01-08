package com.smartentrance.backend.security;

import com.smartentrance.backend.model.User;
import com.smartentrance.backend.model.enums.UserRole;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

public class WithMockCustomUserSecurityContextFactory
        implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser customUser) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User user = new User();
        user.setId(customUser.id());
        user.setEmail(customUser.email());
        user.setHashedPassword("123");
        user.setRole(UserRole.USER);
        user.setFirstName("Test");
        user.setLastName("User");

        UserPrincipal principal = new UserPrincipal(user);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal, "123", principal.getAuthorities()
        );

        context.setAuthentication(auth);
        return context;
    }
}