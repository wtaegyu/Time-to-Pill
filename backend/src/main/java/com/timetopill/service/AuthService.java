package com.timetopill.service;

import com.timetopill.dto.AuthDto.*;
import com.timetopill.entity.User;
import com.timetopill.entity.User.AuthProvider;
import com.timetopill.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setNickname(request.nickname());
        user.setAge(request.age());
        user.setProvider(AuthProvider.LOCAL);
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

        // Block OAuth users from password login
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new IllegalArgumentException("Please use " + user.getProvider() + " login");
        }

        // Verify password with BCrypt
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
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

    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
