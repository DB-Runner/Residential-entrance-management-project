package com.smartentrance.backend.security;

import com.smartentrance.backend.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("unitSecurity")
@RequiredArgsConstructor
public class UnitSecurity {

    private final UnitRepository unitRepository;

    public boolean isOwner(Integer unitId, Integer userId) {
        return unitRepository.existsByIdAndResponsibleUserId(unitId, userId);
    }
}