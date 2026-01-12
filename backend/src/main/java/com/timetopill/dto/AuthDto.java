package com.timetopill.dto;

import com.timetopill.entity.User;

public class AuthDto {

    // 로그인 요청
    public record LoginRequest(
            String username,
            String password
    ) {}

    // ✨ [수정됨] 회원가입 요청 (이름, 이메일 추가)
    public record RegisterRequest(
            String username,
            String password,
            String nickname,
            String name,
            String email,
            Integer age,
            String gender
    ) {}

    // 인증 응답
    public record AuthResponse(
            String token,
            UserDto user,
            boolean isProfileComplete
    ) {}

    // 닉네임 중복 확인 응답
    public record NicknameCheckResponse(
            boolean available
    ) {}

    // Google 로그인 요청
    public record GoogleLoginRequest(
            String email,
            String name,
            String googleId
    ) {}

    // 사용자 정보 DTO
    public record UserDto(
            Long id,
            String username,
            String nickname,
            Integer age,
            String gender,
            String provider,
            boolean hasGoogleLinked
    ) {
        public static UserDto from(User user) {
            return new UserDto(
                    user.getId(),
                    user.getUsername(),
                    user.getNickname(),
                    user.getAge(),
                    user.getGender() != null ? user.getGender().name() : null,
                    user.getProvider() != null ? user.getProvider().name() : "LOCAL",
                    user.getGoogleId() != null
            );
        }
    }

    // 구글 계정 연결 요청
    public record GoogleLinkRequest(
            String googleId,
            String email
    ) {}

    // 프로필 수정 요청
    public record ProfileUpdateRequest(
            String nickname,
            Integer age,
            String gender
    ) {}

    // 비밀번호 변경 요청
    public record ChangePasswordRequest(
            String currentPassword,
            String newPassword
    ) {}

    // 일반 응답 메시지
    public record MessageResponse(
            boolean success,
            String message
    ) {}
}