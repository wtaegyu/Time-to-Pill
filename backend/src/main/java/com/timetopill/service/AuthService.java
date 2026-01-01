package com.timetopill.service;

import com.timetopill.dto.AuthDto.*;
import com.timetopill.entity.User;
import com.timetopill.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicates
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByNickname(request.nickname())) {
            throw new IllegalArgumentException("Nickname already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(request.password()); // TODO: Add password encryption
        user.setNickname(request.nickname());
        user.setAge(request.age());
        if (request.gender() != null) {
            user.setGender(User.Gender.valueOf(request.gender()));
        }

        User saved = userRepository.save(user);

        // TODO: Implement JWT token generation
        String token = "temp-token-" + saved.getId();

        return new AuthResponse(token, UserDto.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // TODO: Add password verification with encryption
        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // TODO: Implement JWT token generation
        String token = "temp-token-" + user.getId();

        return new AuthResponse(token, UserDto.from(user));
    }

    public NicknameCheckResponse checkNickname(String nickname) {
        boolean available = !userRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(available);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
