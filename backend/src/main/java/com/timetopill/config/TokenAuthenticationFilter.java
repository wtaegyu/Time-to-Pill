package com.timetopill.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * 임시 토큰(temp-token-{userId}, google-token-{userId}) 처리 필터
 * JWT 구현 전까지 사용하는 임시 인증 방식
 */
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && !authHeader.isEmpty()) {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

            // temp-token-{userId} 또는 google-token-{userId} 형식 파싱
            Long userId = extractUserIdFromToken(token);

            if (userId != null) {
                // userId를 username으로 사용하는 UserDetails 생성
                UserDetails userDetails = User.builder()
                        .username(userId.toString())
                        .password("") // 비밀번호는 사용하지 않음
                        .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
                        .build();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private Long extractUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }

        // temp-token-{id} 또는 google-token-{id} 형식
        String[] parts = token.split("-");
        if (parts.length >= 3) {
            try {
                return Long.parseLong(parts[parts.length - 1]);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}
