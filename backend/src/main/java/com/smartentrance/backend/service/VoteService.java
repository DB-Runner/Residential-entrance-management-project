package com.smartentrance.backend.service;

import com.smartentrance.backend.dto.enums.FilterType;
import com.smartentrance.backend.dto.poll.CastVoteRequest;
import com.smartentrance.backend.dto.poll.CastVoteResponse;
import com.smartentrance.backend.dto.poll.CreatePollRequest;
import com.smartentrance.backend.dto.poll.PollResponse;
import com.smartentrance.backend.mapper.PollMapper;
import com.smartentrance.backend.model.*;
import com.smartentrance.backend.repository.UserVoteRepository;
import com.smartentrance.backend.repository.VotesOptionRepository;
import com.smartentrance.backend.repository.VotesPollRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VotesPollRepository pollRepository;
    private final UserVoteRepository userVoteRepository;
    private final VotesOptionRepository optionRepository;
    private final BuildingService buildingService;
    private final UnitService unitService;
    private final PollMapper pollMapper;

    @Transactional
    @PreAuthorize("@buildingSecurity.isManager(#buildingId, principal.user.id)")
    public PollResponse createPoll(Integer buildingId, CreatePollRequest request, User currentUser) {
        if (request.endAt().isBefore(request.startAt())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        VotesPoll poll = new VotesPoll();
        poll.setTitle(request.title());
        poll.setDescription(request.description());
        poll.setStartAt(request.startAt());
        poll.setEndAt(request.endAt());
        poll.setBuilding(buildingService.getBuildingReference(buildingId));
        poll.setCreatedBy(currentUser);
        poll.setActive(true);

        for (String optionText : request.options()) {
            if (optionText != null && !optionText.isBlank()) {
                VotesOption optionEntity = new VotesOption();
                optionEntity.setOptionText(optionText);
                optionEntity.setPoll(poll);

                poll.getOptions().add(optionEntity);

            }
        }

        VotesPoll votesPoll = pollRepository.save(poll);
        return pollMapper.toResponse(votesPoll);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("@buildingSecurity.hasAccess(#buildingId, principal.user.id)")
    public List<PollResponse> getPolls(Integer buildingId, FilterType filter) {
        LocalDateTime now = LocalDateTime.now();
        List<VotesPoll> polls;

        switch (filter) {
            case FilterType.ACTIVE -> polls = pollRepository.findAllActive(buildingId, now);
            case FilterType.HISTORY -> polls = pollRepository.findAllHistory(buildingId, now);
            default -> polls = pollRepository.findAllByBuildingIdOrderByCreatedAtDesc(buildingId);
        }

        return polls.stream()
                .map(pollMapper::toResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("@buildingSecurity.hasAccess(#buildingId, principal.user.id)")
    public CastVoteResponse castVote(Integer buildingId, Integer pollId, CastVoteRequest request, User currentUser) {

        VotesPoll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new EntityNotFoundException("Poll not found"));


        Unit unit = unitService.findByIdAndResponsibleUser(request.unitId(), currentUser)
                .orElseThrow(() -> new AccessDeniedException("You are not the responsible user of this unit"));

        validateVotingRules(poll, unit, buildingId);

        VotesOption optionRef = optionRepository.getReferenceById(request.optionId());

        UserVote vote = userVoteRepository.findByPollIdAndUnitId(pollId, unit.getId())
                .map(existingVote -> {
                    existingVote.setOption(optionRef);
                    existingVote.setUser(currentUser);
                    return existingVote;
                })
                .orElseGet(() -> {
                    UserVote newVote = new UserVote();
                    newVote.setPoll(poll);
                    newVote.setUnit(unit);
                    newVote.setUser(currentUser);
                    newVote.setOption(optionRef);
                    return newVote;
                });

        UserVote savedVote = userVoteRepository.save(vote);

        return new CastVoteResponse(savedVote.getId(), unit.getUnitNumber(), savedVote.getVotedAt());
    }

    private void validateVotingRules(VotesPoll poll, Unit unit, Integer buildingId) {
        if (!poll.getBuilding().getId().equals(buildingId)) {
            throw new IllegalArgumentException("The poll does not belong to the current building!");
        }
        if (!unit.getBuilding().getId().equals(buildingId)) {
            throw new IllegalArgumentException("The unit does not belong to the current building!");
        }

        LocalDateTime now = LocalDateTime.now();
        if (!poll.isActive() || now.isBefore(poll.getStartAt()) || now.isAfter(poll.getEndAt())) {
            throw new IllegalArgumentException("The poll is not active!");
        }
    }
}