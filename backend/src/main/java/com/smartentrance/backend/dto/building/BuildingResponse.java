package com.smartentrance.backend.dto.building;

import java.time.LocalDateTime;

public record BuildingResponse(
        Integer id,
        String name,
        String address,
        String googlePlaceId,
        String entrance,
        Integer managerId,
        String managerEmail,
        Integer totalUnits,
        LocalDateTime createdAt
) {}