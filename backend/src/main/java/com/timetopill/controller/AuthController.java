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
}
