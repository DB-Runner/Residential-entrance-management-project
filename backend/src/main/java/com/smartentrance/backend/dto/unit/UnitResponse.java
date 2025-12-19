package com.smartentrance.backend.dto.unit;

import java.math.BigDecimal;

public record UnitResponse(
        Integer id,
        Integer unitNumber,
        BigDecimal area,
        Integer residents,
        String accessCode,
        boolean isVerified,
        BuildingInfo buildingInfo,
        OwnerInfo ownerInfo
) {
    public record BuildingInfo(Integer id, String name, String address) {}
    public record OwnerInfo (Integer id, String firstName, String lastName, String email) {}
}