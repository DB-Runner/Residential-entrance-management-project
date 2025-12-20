package com.smartentrance.backend.security;

import com.smartentrance.backend.model.Building;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.repository.BuildingRepository;
import com.smartentrance.backend.repository.NoticeRepository;
import com.smartentrance.backend.repository.UnitRepository;
import com.smartentrance.backend.repository.VotesPollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("buildingSecurity")
@RequiredArgsConstructor
public class BuildingSecurity {

    private final BuildingRepository buildingRepository;
    private final UnitRepository unitRepository;
    private final NoticeRepository noticeRepository;
    private final VotesPollRepository pollRepository;

    public boolean canManageUnit(Integer unitId, User user) {
        return unitRepository.findById(unitId)
                .map(unit -> unit.getBuilding().getManager().getId().equals(user.getId()))
                .orElse(false);
    }

    public boolean hasAccess(Integer buildingId, User user) {
        return buildingRepository.existsByIdAndManagerId(buildingId, user.getId())
                || unitRepository.existsByBuildingIdAndResponsibleUserId(buildingId, user.getId());
    }

    public boolean isManager(Integer buildingId, User user) {
        return buildingRepository.existsByIdAndManagerId(buildingId, user.getId());
    }

    public boolean canManageNotice(Integer noticeId, User user) {
        return noticeRepository.findById(noticeId)
                .map(notice -> {
                    Building building = notice.getBuilding();

                    return building.getManager().getId().equals(user.getId());
                })
                .orElse(false);
    }

    public boolean canVote(Integer pollId, Integer unitId, User user) {
        return pollRepository.findById(pollId)
                .map(poll -> unitRepository.findById(unitId)
                        .map(unit -> {
                            boolean isResponsible = unit.getResponsibleUser() != null
                                    && unit.getResponsibleUser().getId().equals(user.getId());

                            boolean sameBuilding = unit.getBuilding().getId().equals(poll.getBuilding().getId());

                            return isResponsible && sameBuilding;
                        })
                        .orElse(false))
                .orElse(false);
    }

    public boolean canManagePoll(Integer pollId, User user) {
        return pollRepository.findById(pollId)
                .map(poll -> poll.getBuilding().getManager().getId().equals(user.getId()))
                .orElse(false);
    }
}