package com.smartentrance.backend.service;

import com.smartentrance.backend.dto.dashboard.DashboardResponse;
import com.smartentrance.backend.dto.dashboard.ManagedBuilding;
import com.smartentrance.backend.dto.dashboard.ResidentUnit;
import com.smartentrance.backend.model.Building;
import com.smartentrance.backend.model.Unit;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.repository.BuildingRepository;
import com.smartentrance.backend.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BuildingRepository buildingRepository;
    private final UnitRepository unitRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getUserDashboard(User user) {

        List<ManagedBuilding> managedBuildings = buildingRepository.findAllByManagerId(user.getId())
                .stream()
                .map(this::mapToBuildingDto)
                .toList();

        List<ResidentUnit> myHomes = unitRepository.findAllByResponsibleUserId(user.getId())
                .stream()
                .map(this::mapToUnitDto)
                .toList();

        return new DashboardResponse(managedBuildings, myHomes);
    }

    private ManagedBuilding mapToBuildingDto(Building building) {
        return new ManagedBuilding(
                building.getId(),
                building.getName(),
                building.getAddress(),
                building.getTotalUnits()
        );
    }

    private ResidentUnit mapToUnitDto(Unit unit) {
        return new ResidentUnit(
                unit.getId(),
                unit.getUnitNumber(),
                unit.getAccessCode(),
                unit.getBuilding().getName(),
                unit.getBuilding().getAddress()
        );
    }
}