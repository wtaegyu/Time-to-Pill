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

        return new AuthResponse(token, UserDto.from(saved), isProfileComplete(saved));
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

        return new AuthResponse(token, UserDto.from(user), isProfileComplete(user));
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

    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        User user;

        // 1. 먼저 googleId로 조회 (이미 연동된 계정)
        var byGoogleId = userRepository.findByGoogleId(request.googleId());
        if (byGoogleId.isPresent()) {
            user = byGoogleId.get();
        } else {
            // 2. googleId로 못 찾으면 email로 조회
            var byEmail = userRepository.findByUsername(request.email());
            if (byEmail.isPresent()) {
                user = byEmail.get();
                // 이미 다른 구글 계정이 연결되어 있으면 에러
                if (user.getGoogleId() != null && !user.getGoogleId().equals(request.googleId())) {
                    throw new IllegalArgumentException("This account is linked to another Google account");
                }
                // 로컬 계정이면 구글 연동 (자동 연동)
                if (user.getGoogleId() == null) {
                    user.setGoogleId(request.googleId());
                    user = userRepository.save(user);
                }
            } else {
                // 3. 둘 다 없으면 새 계정 생성
                user = new User();
                user.setUsername(request.email());
                user.setNickname(generateUniqueNickname(request.name(), request.email()));
                user.setProvider(AuthProvider.GOOGLE);
                user.setGoogleId(request.googleId());
                user = userRepository.save(user);
            }
        }

        // TODO: Implement JWT token generation
        String token = "google-token-" + user.getId();

        return new AuthResponse(token, UserDto.from(user), isProfileComplete(user));
    }

    // 프로필 완성 여부 확인 (나이와 성별이 있는지)
    private boolean isProfileComplete(User user) {
        return user.getAge() != null && user.getGender() != null;
    }

    // 구글 계정 연결 (일반 계정에 구글 계정 연동)
    @Transactional
    public UserDto linkGoogleAccount(Long userId, GoogleLinkRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 이미 구글 계정이 연결되어 있으면 에러
        if (user.getGoogleId() != null) {
            throw new IllegalArgumentException("Google account already linked");
        }

        // 해당 googleId가 다른 계정에 이미 연결되어 있으면 에러
        if (userRepository.existsByGoogleId(request.googleId())) {
            throw new IllegalArgumentException("This Google account is already linked to another user");
        }

        user.setGoogleId(request.googleId());
        User saved = userRepository.save(user);
        return UserDto.from(saved);
    }

    // 구글 계정 연결 해제
    @Transactional
    public UserDto unlinkGoogleAccount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 구글 전용 계정은 연결 해제 불가
        if (user.getProvider() == AuthProvider.GOOGLE && user.getPassword() == null) {
            throw new IllegalArgumentException("Cannot unlink Google from a Google-only account. Please set a password first.");
        }

        user.setGoogleId(null);
        User saved = userRepository.save(user);
        return UserDto.from(saved);
    }

    private String generateUniqueNickname(String name, String email) {
        String baseNickname = (name != null && !name.isEmpty())
                ? name
                : email.split("@")[0];

        String nickname = baseNickname;
        int suffix = 1;

        while (userRepository.findByNickname(nickname).isPresent()) {
            nickname = baseNickname + suffix;
            suffix++;
        }

        return nickname;
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 닉네임 변경 시 중복 체크
        if (request.nickname() != null && !request.nickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(request.nickname())) {
                throw new IllegalArgumentException("Nickname already exists");
            }
            user.setNickname(request.nickname());
        }

        if (request.age() != null) {
            user.setAge(request.age());
        }

        if (request.gender() != null) {
            user.setGender(User.Gender.valueOf(request.gender()));
        }

        User saved = userRepository.save(user);
        return UserDto.from(saved);
    }

    @Transactional
    public MessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // OAuth 사용자는 비밀번호 변경 불가
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new IllegalArgumentException("OAuth users cannot change password");
        }

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // 새 비밀번호 설정
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return new MessageResponse(true, "Password changed successfully");
    }
}
