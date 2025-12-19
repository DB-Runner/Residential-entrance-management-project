package com.smartentrance.backend.controller;

import com.smartentrance.backend.dto.unit.UnitJoinRequest;
import com.smartentrance.backend.dto.unit.UnitResponse;
import com.smartentrance.backend.dto.unit.UnitUpdateRequest;
import com.smartentrance.backend.security.UserPrincipal;
import com.smartentrance.backend.service.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping("/join")
    public ResponseEntity<UnitResponse> joinUnit(
            @Valid @RequestBody UnitJoinRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(unitService.joinUnit(request, userPrincipal.user()));
    }

    @PutMapping("/units/{unitId}")
    public ResponseEntity<UnitResponse> updateUnit(
            @PathVariable Integer unitId,
            @RequestBody @Valid UnitUpdateRequest request) {
        return ResponseEntity.ok(unitService.updateUnit(unitId, request));
    }

    @GetMapping("/buildings/{buildingId}/units")
    public ResponseEntity<List<UnitResponse>> getBuildingUnits(@PathVariable Integer buildingId) {
        return ResponseEntity.ok(unitService.getUnitsByBuilding(buildingId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<UnitResponse>> getMyUnits(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(unitService.getMyUnits(userPrincipal.user()));
    }
}