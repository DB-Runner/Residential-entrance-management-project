package com.smartentrance.backend.controller;

import com.smartentrance.backend.TestUtils;
import com.smartentrance.backend.model.Unit;
import com.smartentrance.backend.model.enums.UserRole;
import com.smartentrance.backend.model.enums.TransactionType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class FinanceFlowTest {

    @Autowired MockMvc mockMvc;
    @Autowired TestUtils helper;

    @Test
    void testGetBalance_CalculatesCorrectly() throws Exception {
        Unit unit = helper.createReadyUnit();

        helper.addTx(unit, 100.00, TransactionType.FEE);
        helper.addTx(unit, 40.00, TransactionType.PAYMENT);

        Long userId = unit.getResponsibleUser().getId();

        mockMvc.perform(get("/api/units/" + unit.getId() + "/balance")
                        .with(TestUtils.mockUser(userId, UserRole.USER)))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    Assertions.assertEquals(0, new BigDecimal("60").compareTo(new BigDecimal(content)));
                });
    }
}