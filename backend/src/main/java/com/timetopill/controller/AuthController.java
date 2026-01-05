package com.timetopill.controller;

import com.timetopill.dto.AuthDto.*;
import com.timetopill.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * OAuth2 login success callback
     */
    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "OAuth2 authentication failed"
            ));
        }

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Login successful",
            "email", email != null ? email : "",
            "name", name != null ? name : ""
        ));
    }

    /**
     * OAuth2 login failure callback
     */
    @GetMapping("/oauth2/failure")
    public ResponseEntity<Map<String, Object>> oauth2Failure() {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", "OAuth2 authentication failed"
        ));
    }

    /**
     * Check if username is available (for ID duplicate check)
     */
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean isDuplicate = authService.isUsernameTaken(username);
        return ResponseEntity.ok(Map.of("isDuplicate", isDuplicate));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

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

    /**
     * Update user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileUpdateRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            UserDto updatedUser = authService.updateProfile(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Change password
     */
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

    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            var user = authService.getUserById(userId);
            return ResponseEntity.ok(UserDto.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Link Google account to existing user
     */
    @PostMapping("/link-google")
    public ResponseEntity<?> linkGoogleAccount(
            @RequestHeader("Authorization") String token,
            @RequestBody GoogleLinkRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            UserDto updatedUser = authService.linkGoogleAccount(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Unlink Google account from user
     */
    @DeleteMapping("/unlink-google")
    public ResponseEntity<?> unlinkGoogleAccount(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            UserDto updatedUser = authService.unlinkGoogleAccount(userId);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // 임시 토큰에서 userId 추출 (temp-token-{userId} 또는 google-token-{userId} 형식)
    private Long extractUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token is required");
        }
        // Bearer 접두사 제거
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        // temp-token-{id} 또는 google-token-{id} 형식에서 id 추출
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
