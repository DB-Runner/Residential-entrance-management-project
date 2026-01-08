package com.smartentrance.backend.controller;

import com.smartentrance.backend.TestUtils;
import com.smartentrance.backend.model.*;
import com.smartentrance.backend.model.enums.*;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PollFlowTest {

    @Autowired MockMvc mockMvc;
    @Autowired TestUtils testUtils;
    @Autowired private EntityManager em;

    @Test
    void testVoting_Scenario() throws Exception {
        Unit unit = testUtils.createReadyUnit();
        Long userId = unit.getResponsibleUser().getId();

        VotesPoll poll = testUtils.createPoll(unit.getBuilding());
        testUtils.vote(poll, unit);

        em.flush();
        em.clear();

        mockMvc.perform(get("/api/polls/" + poll.getId())
                        .with(TestUtils.mockUser(userId, UserRole.USER)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userVotedOptionId").value(1))

                .andExpect(jsonPath("$.options[0].text").value("yes"))
                .andExpect(jsonPath("$.options[0].voteCount").value(1))

                .andExpect(jsonPath("$.options[1].text").value("no"))
                .andExpect(jsonPath("$.options[1].voteCount").value(0));
    }
}