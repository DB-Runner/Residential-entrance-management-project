package com.smartentrance.backend.security;

import com.smartentrance.backend.TestUtils;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.model.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityAccessTest {

    @Autowired MockMvc mockMvc;

    @MockitoBean(name = "buildingSecurity")
    BuildingSecurity buildingSecurity;

    @Test
    void testAccessDenied() throws Exception {
        Mockito.when(buildingSecurity.isManager(any(), any())).thenReturn(false);

        mockMvc.perform(get("/api/buildings/1/finance/summary")
                        .with(TestUtils.mockUser(99L, UserRole.USER)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAccessGranted() throws Exception {
        Mockito.when(buildingSecurity.isManager(any(), any())).thenReturn(true);
        Mockito.when(buildingSecurity.hasAccess(any(), any())).thenReturn(true);

        // ЕТО ГО - 1 ред, който казва "Аз съм Шеф 1"
        mockMvc.perform(get("/api/buildings/1/finance/summary")
                        .with(TestUtils.mockUser(1L, UserRole.USER)))
                .andExpect(status().isOk());
    }
}