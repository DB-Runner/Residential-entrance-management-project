package com.smartentrance.backend.security;

import com.smartentrance.backend.model.RevocationEntry;
import com.smartentrance.backend.repository.RevocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class TokenRevocationService {

    private final Map<Integer, Long> revocationMap = new ConcurrentHashMap<>();
    private final RevocationRepository revocationRepository;

    @Value("${application.security.jwt.remember-me.expiration}")
    private long rememberMeExpiration;

    public void revokeUser(Integer userId) {
        long now = System.currentTimeMillis();

        revocationMap.put(userId, now);

        RevocationEntry entry = new RevocationEntry(userId, now);
        revocationRepository.save(entry);

        long threshold = now - rememberMeExpiration;
        revocationRepository.deleteOlderThan(threshold);
    }

    public boolean isTokenRevoked(Integer userId, long tokenIssuedAt) {
        Long lastRevocation = revocationMap.get(userId);
        if (lastRevocation == null) return false;
        return (tokenIssuedAt * 1000) < lastRevocation;
    }

    public void loadRevocations(Map<Integer, Long> data) {
        revocationMap.putAll(data);
    }
}