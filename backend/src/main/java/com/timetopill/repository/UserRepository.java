package com.timetopill.repository;

import com.timetopill.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByNickname(String nickname);

    boolean existsByUsername(String username);

    boolean existsByNickname(String nickname);

    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByNameAndEmail(String name, String email);

    Optional<User> findByUsernameAndEmail(String username, String email);

    boolean existsByGoogleId(String googleId);
}
