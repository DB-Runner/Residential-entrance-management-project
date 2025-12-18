package com.smartentrance.backend.controller;

import com.smartentrance.backend.dto.enums.FilterType;
import com.smartentrance.backend.dto.poll.CastVoteRequest;
import com.smartentrance.backend.dto.poll.CastVoteResponse;
import com.smartentrance.backend.dto.poll.CreatePollRequest;
import com.smartentrance.backend.dto.poll.PollResponse;
import com.smartentrance.backend.security.UserPrincipal;
import com.smartentrance.backend.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @GetMapping("/{buildingId}/polls")
    public ResponseEntity<List<PollResponse>> getPolls(
            @PathVariable Integer buildingId,
            @RequestParam Optional<FilterType> type
    ) {
        return ResponseEntity.ok(voteService.getPolls(buildingId, type.orElse(FilterType.ALL)));
    }

    @PostMapping("/{buildingId}/polls")
    public ResponseEntity<PollResponse> createPoll(
            @PathVariable Integer buildingId,
            @Valid @RequestBody CreatePollRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        PollResponse pollResponse = voteService.createPoll(buildingId, request, userPrincipal.user());
        return ResponseEntity.ok(pollResponse);
    }

    @PostMapping("/{buildingId}/polls/{pollId}/vote")
    public ResponseEntity<CastVoteResponse> castVote(
            @PathVariable Integer buildingId,
            @PathVariable Integer pollId,
            @Valid @RequestBody CastVoteRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(
                voteService.castVote(buildingId, pollId, request, userPrincipal.user())
        );
    }
}