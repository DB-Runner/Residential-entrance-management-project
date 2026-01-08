package com.smartentrance.backend;

import com.smartentrance.backend.dto.enums.PollStatus;
import com.smartentrance.backend.model.*;
import com.smartentrance.backend.model.enums.PaymentMethod;
import com.smartentrance.backend.model.enums.TransactionStatus;
import com.smartentrance.backend.model.enums.TransactionType;
import com.smartentrance.backend.model.enums.UserRole;
import com.smartentrance.backend.repository.*;
import com.smartentrance.backend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class TestUtils {

    @Autowired UserRepository userRepository;
    @Autowired BuildingRepository buildingRepository;
    @Autowired UnitRepository unitRepository;
    @Autowired TransactionRepository transactionRepository;
    @Autowired VotesPollRepository pollRepository;
    @Autowired UserVoteRepository voteRepository;

    public static RequestPostProcessor mockUser(Long id, UserRole role) {
        return SecurityMockMvcRequestPostProcessors.authentication(
                createAuth(id, role)
        );
    }

    private static UsernamePasswordAuthenticationToken createAuth(Long id, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(role);

        try { user.setHashedPassword("password"); } catch (Exception e) {}

        UserPrincipal principal = new UserPrincipal(user);

        return new UsernamePasswordAuthenticationToken(
                principal,
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
        );
    }

    public Unit createReadyUnit() {
        User user = new User();
        user.setEmail("test-" + System.nanoTime() + "@mail.com");
        user.setHashedPassword("pass");
        user.setFirstName("F");
        user.setLastName("L");
        user.setRole(UserRole.USER);
        userRepository.save(user);

        Building building = new Building();
        building.setAddress("Sofia");
        building.setName("Block 1");
        building.setTotalUnits(1);
        building.setEntrance("A");
        building.setManager(user);
        building.setGooglePlaceId("mock-place-id");
        buildingRepository.save(building);

        Unit unit = new Unit();
        unit.setBuilding(building);
        unit.setResponsibleUser(user);
        unit.setUnitNumber(1);
        unit.setResidentsCount(1);
        unit.setArea(new BigDecimal(50.0));
        unit.setAccessCode("CODE1234");
        unit.setVerified(true);
        return unitRepository.save(unit);
    }

    public void addTx(Unit unit, double amount, TransactionType type) {
        Transaction tx = new Transaction();
        tx.setUnit(unit);
        if (type == TransactionType.PAYMENT) {
            tx.setAmount(BigDecimal.valueOf(amount).negate());
        } else {
            tx.setAmount(BigDecimal.valueOf(amount));
        }
        tx.setType(type);
        tx.setStatus(TransactionStatus.CONFIRMED);
        tx.setPaymentMethod(PaymentMethod.SYSTEM);
        tx.setResponsibleUser(unit.getResponsibleUser());
        transactionRepository.save(tx);
    }

    public VotesPoll createPoll(Building building) {
        VotesPoll poll = new VotesPoll();
        poll.setTitle("Remont na pokriv");
        poll.setDescription("Da suberem li pari?");
        poll.setBuilding(building);
        poll.setStartAt(Instant.MIN);
        poll.setEndAt(Instant.MAX);
        poll.setCreatedBy(building.getManager());

        VotesOption optionYes = new VotesOption();
        optionYes.setPoll(poll);
        optionYes.setOptionText("yes");

        VotesOption optionNo = new VotesOption();
        optionNo.setPoll(poll);
        optionNo.setOptionText("no");

        List<VotesOption> options = new ArrayList<>();
        options.add(optionYes);
        options.add(optionNo);

        poll.setOptions(options);

        return pollRepository.save(poll);
    }

    public void vote(VotesPoll poll, Unit unit) {
        VotesOption yesOption = poll.getOptions().stream()
                .filter(o -> "yes".equals(o.getOptionText()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Option 'yes' not found!"));

        UserVote vote = new UserVote();
        vote.setPoll(poll);
        vote.setUnit(unit);
        vote.setUser(unit.getResponsibleUser());
        vote.setOption(yesOption);

        if (poll.getVotes() == null) {
            poll.setVotes(new ArrayList<>());
        }
        poll.getVotes().add(vote);

        voteRepository.save(vote);
    }
}