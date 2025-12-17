package com.smartentrance.backend.repository;

import com.smartentrance.backend.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Integer> {

    boolean existsByGooglePlaceIdAndEntrance(String googlePlaceId, String entrance);

    List<Building> findAllByManagerId(Integer managerId);

}
