package com.smartentrance.backend.mapper;

import com.smartentrance.backend.dto.unit.UnitResponse;
import com.smartentrance.backend.model.Unit;
import org.springframework.stereotype.Component;

@Component
public class UnitMapper {

    public UnitResponse toManagementResponse(Unit unit) {
        return new UnitResponse(
                unit.getId(),
                unit.getUnitNumber(),
                unit.getArea(),
                unit.getResidentsCount(),
                unit.getAccessCode(),
                unit.isVerified(),
                null,
                mapToOwnerInfo(unit)
        );
    }

    public UnitResponse toResidentResponse(Unit unit) {
        return new UnitResponse(
                unit.getId(),
                unit.getUnitNumber(),
                unit.getArea(),
                unit.getResidentsCount(),
                null,
                unit.isVerified(),
                mapToBuildingInfo(unit),
                mapToOwnerInfo(unit)
        );
    }

    private UnitResponse.OwnerInfo mapToOwnerInfo(Unit unit) {
        if (unit.getResponsibleUser() == null) {
            return null;
        }

        return new UnitResponse.OwnerInfo(
                unit.getResponsibleUser().getId(),
                unit.getResponsibleUser().getFirstName(),
                unit.getResponsibleUser().getLastName(),
                unit.getResponsibleUser().getEmail()
        );
    }

    private UnitResponse.BuildingInfo mapToBuildingInfo(Unit unit) {
        return new UnitResponse.BuildingInfo(
                unit.getBuilding().getId(),
                unit.getBuilding().getName(),
                unit.getBuilding().getAddress()
        );
    }
}