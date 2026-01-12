package com.timetopill.controller;

import com.timetopill.dto.AuthDto;
import com.timetopill.dto.AuthDto.*; // RegisterRequest, LoginRequest 등
import com.timetopill.entity.User;
import com.timetopill.repository.UserRepository;
import com.timetopill.service.AuthService;
import com.timetopill.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth") // 프론트엔드 api.ts 경로와 맞춤
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    /**
     * 회원가입 (수정됨: name, email 저장 로직 직접 구현)
     * AuthService를 거치지 않고 여기서 직접 저장하여 'email cannot be null' 에러 해결
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 1. 중복 체크
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(false, "이미 사용 중인 아이디입니다."));
        }
        if (userRepository.existsByNickname(request.nickname())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(false, "이미 사용 중인 닉네임입니다."));
        }

        // 2. 유저 생성 및 데이터 주입
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setNickname(request.nickname());

        // ✨ [핵심] DTO(Record)에서 이름과 이메일을 꺼내 저장
        user.setName(request.name());
        user.setEmail(request.email());

        user.setAge(request.age());

        // 성별 처리
        if (request.gender() != null) {
            try {
                user.setGender(User.Gender.valueOf(request.gender()));
            } catch (IllegalArgumentException e) {
                user.setGender(null);
            }
        }

        // 3. 저장
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse(true, "회원가입 성공"));
    }

    /**
     * 아이디 찾기
     */
    // ✨ [수정됨] 아이디 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");

        User user = userRepository.findByNameAndEmail(name, email)
                .orElseThrow(() -> new RuntimeException("일치하는 사용자를 찾을 수 없습니다."));

        emailService.sendSimpleMessage(email, "[Time-to-Pill] 아이디 찾기 결과",
                "회원님의 아이디는 " + user.getUsername() + " 입니다.");

        // 👇 여기가 핵심! 그냥 문자열 대신 MessageResponse(true, ...)로 보냅니다.
        // 수정 후: 앱이 좋아하는 카드에 담아서 줍니다.
        return ResponseEntity.ok(new MessageResponse(true, "이메일로 아이디를 전송했습니다."));
    }

    // ✨ [수정됨] 비밀번호 찾기
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");

        User user = userRepository.findByUsernameAndEmail(username, email)
                .orElseThrow(() -> new RuntimeException("일치하는 정보가 없습니다."));

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        emailService.sendSimpleMessage(email, "[Time-to-Pill] 임시 비밀번호",
                "임시 비밀번호: " + tempPassword + "\n로그인 후 비밀번호를 변경해주세요.");

        // 👇 여기도 마찬가지로 수정!
        return ResponseEntity.ok(new MessageResponse(true, "이메일로 임시 비밀번호를 전송했습니다."));
    }

    // --- 기존 AuthService 위임 메서드들 ---

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<NicknameCheckResponse> checkNickname(@RequestParam String nickname) {
        NicknameCheckResponse response = authService.checkNickname(nickname);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean isDuplicate = authService.isUsernameTaken(username);
        return ResponseEntity.ok(Map.of("isDuplicate", isDuplicate));
    }

    // --- 프로필 관련 메서드 ---

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileUpdateRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            UserDto updatedUser = authService.updateProfile(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody ChangePasswordRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            MessageResponse response = authService.changePassword(userId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            var user = authService.getUserById(userId);
            return ResponseEntity.ok(UserDto.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/link-google")
    public ResponseEntity<?> linkGoogleAccount(
            @RequestHeader("Authorization") String token,
            @RequestBody GoogleLinkRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            UserDto updatedUser = authService.linkGoogleAccount(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/unlink-google")
    public ResponseEntity<?> unlinkGoogleAccount(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            UserDto updatedUser = authService.unlinkGoogleAccount(userId);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // --- OAuth2 콜백 ---

    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "OAuth2 authentication failed"));
        }
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        return ResponseEntity.ok(Map.of("success", true, "message", "Login successful",
                "email", email != null ? email : "", "name", name != null ? name : ""));
    }

    @GetMapping("/oauth2/failure")
    public ResponseEntity<Map<String, Object>> oauth2Failure() {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "OAuth2 authentication failed"));
    }

    // --- 유틸리티 메서드 ---

    private Long extractUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token is required");
        }
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String[] parts = actualToken.split("-");
        if (parts.length >= 3) {
            try {
                return Long.parseLong(parts[parts.length - 1]);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid token format");
            }
        }
        throw new IllegalArgumentException("Invalid token format");
    }
}