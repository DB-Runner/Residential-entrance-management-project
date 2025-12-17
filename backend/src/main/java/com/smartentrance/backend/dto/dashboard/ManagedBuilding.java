package com.smartentrance.backend.dto.dashboard;

public record ManagedBuilding(
        Integer id,
        String name,
        String address,
        Integer totalUnits
) {}