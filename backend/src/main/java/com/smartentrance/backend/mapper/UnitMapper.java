package com.smartentrance.backend.mapper;

import com.smartentrance.backend.dto.unit.UnitResponse;
import com.smartentrance.backend.model.Unit;
import org.springframework.stereotype.Component;

@Component
public class UnitMapper {

    public UnitResponse toResponse(Unit unit) {
        boolean isOccupied = unit.getResponsibleUser() != null;

        return new UnitResponse(
                unit.getId(),
                unit.getUnitNumber(),
                unit.getArea(),
                unit.getResidents(),
                unit.getBuilding() != null ? unit.getBuilding().getName() : null,
                unit.getBuilding() != null ? unit.getBuilding().getAddress() : null,
                isOccupied
        );
    }
}