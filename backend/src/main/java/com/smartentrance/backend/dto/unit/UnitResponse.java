package com.smartentrance.backend.dto.unit;

import java.math.BigDecimal;

public record UnitResponse(
        Integer id,
        Integer unitNumber,
        BigDecimal area,
        Integer residents,
        String buildingName,
        String buildingAddress,
        boolean isOccupied
) {}