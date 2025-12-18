package com.smartentrance.backend.dto.poll;

import java.time.LocalDateTime;

public record CastVoteResponse(
        Integer id,
        Integer unitNumber,
        LocalDateTime votedAt
){}
