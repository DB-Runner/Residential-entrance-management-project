package com.smartentrance.backend.dto.unit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record JoinUnitRequest(
        @NotBlank(message = "Access code is required")
        String accessCode,

        @NotNull(message = "Residents count is required")
        Integer residentsCount,

        @NotNull(message = "Area is required")
        BigDecimal area
) {}