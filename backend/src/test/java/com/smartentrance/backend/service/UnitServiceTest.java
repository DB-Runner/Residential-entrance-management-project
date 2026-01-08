package com.smartentrance.backend.service;

import com.smartentrance.backend.dto.unit.UnitJoinRequest;
import com.smartentrance.backend.dto.unit.UnitResponse;
import com.smartentrance.backend.mapper.UnitMapper;
import com.smartentrance.backend.model.Unit;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.repository.UnitRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnitServiceTest {

    @Mock UnitRepository unitRepository;
    @Mock UnitMapper unitMapper;
    @Mock FinanceService financeService;

    @InjectMocks UnitService unitService;

    private User user;
    private Unit unit;

    @BeforeEach
    void setUp() {
        user = new User(); user.setId(1L); user.setEmail("new@owner.com");
        unit = new Unit(); unit.setId(10L); unit.setAccessCode("123456");
    }

    @Test
    void testJoinUnit_Success() {
        UnitJoinRequest req = new UnitJoinRequest("123456", 2, new BigDecimal("60.0"));
        when(unitRepository.findByAccessCode("123456")).thenReturn(Optional.of(unit));
        when(unitRepository.save(any(Unit.class))).thenAnswer(i -> i.getArgument(0));
        when(financeService.getBalance(10L)).thenReturn(BigDecimal.ZERO);
        when(unitMapper.toResidentResponse(any(), any(), anyBoolean()))
                .thenReturn(new UnitResponse(10L, 1, new BigDecimal("60.0"), 2, "CODE", true, BigDecimal.ZERO, false, null, null));

        UnitResponse res = unitService.joinUnit(req, user);

        Assertions.assertEquals(user, unit.getResponsibleUser());
        Assertions.assertNotEquals("123456", unit.getAccessCode());
        verify(unitRepository).save(unit);
    }
}