package com.smartentrance.backend.repository;

import com.smartentrance.backend.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Integer> {
    boolean existsByGooglePlaceIdAndEntrance(String googlePlaceId, String entrance);
}
