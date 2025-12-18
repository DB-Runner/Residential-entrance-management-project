package com.smartentrance.backend.dto.dashboard;

import java.util.List;

public record DashboardResponse(
        List<ManagedBuilding> managedBuildings,
        List<ResidentUnit> myHomes
) {}