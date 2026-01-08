package com.smartentrance.backend.controller;

import com.smartentrance.backend.TestUtils;
import com.smartentrance.backend.model.enums.UserRole;
import com.smartentrance.backend.service.BuildingService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BuildingControllerTest {

    @Autowired MockMvc mockMvc;
    @MockitoBean BuildingService buildingService;

    @Test
    void testTransferManager_Success() throws Exception {
        Mockito.doNothing().when(buildingService).transferManagerRole(any(), any());

        mockMvc.perform(post("/api/buildings/1/transfer-manager/5")
                        .with(TestUtils.mockUser(10L, UserRole.USER)))
                .andExpect(status().isOk());
    }

    @Test
    void testTransferManager_ForbiddenForResident() throws Exception {
        Mockito.doThrow(new org.springframework.security.access.AccessDeniedException("No access"))
                .when(buildingService).transferManagerRole(any(), any());

        mockMvc.perform(post("/api/buildings/1/transfer-manager/5")
                        .with(TestUtils.mockUser(11L, UserRole.USER)))
                .andExpect(status().isForbidden());
    }
}
