package com.smartentrance.backend.controller;

import com.smartentrance.backend.dto.building.BuildingCreateRequest;
import com.smartentrance.backend.dto.building.BuildingResponse;
import com.smartentrance.backend.security.UserPrincipal;
import com.smartentrance.backend.service.BuildingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping
    public ResponseEntity<BuildingResponse> createBuilding(
            @Valid @RequestBody BuildingCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(buildingService.createBuildingWithSkeleton(request, userPrincipal.user()));
    }

    @GetMapping("/managed")
    public ResponseEntity<List<BuildingResponse>> getMyManagedBuildings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(buildingService.getManagedBuildings(userPrincipal.user()));
    }

}