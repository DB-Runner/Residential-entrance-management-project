package com.smartentrance.backend.repository;

import com.smartentrance.backend.model.VotesOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotesOptionRepository extends JpaRepository<VotesOption, Integer> {}
