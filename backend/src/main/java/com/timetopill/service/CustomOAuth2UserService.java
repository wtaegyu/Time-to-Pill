package com.timetopill.service;

import com.timetopill.entity.User;
import com.timetopill.entity.User.AuthProvider;
import com.timetopill.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Custom OAuth2 user service for handling Google OAuth login.
 * Creates or retrieves user based on OAuth2 profile information.
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if ("google".equals(registrationId)) {
            processGoogleUser(oauth2User);
        }

        return oauth2User;
    }

    /**
     * Process Google OAuth user - create new user if not exists.
     * Uses email as username for Google OAuth users.
     */
    private void processGoogleUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from Google OAuth2 provider");
        }

        Optional<User> existingUser = userRepository.findByUsername(email);

        if (existingUser.isEmpty()) {
            // Auto-register new Google user
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setNickname(generateUniqueNickname(name, email));
            newUser.setProvider(AuthProvider.GOOGLE);
            // Password is null for OAuth users
            userRepository.save(newUser);
        }
    }

    /**
     * Generate a unique nickname for new OAuth users.
     * Falls back to email prefix if name is not available.
     */
    private String generateUniqueNickname(String name, String email) {
        String baseNickname = (name != null && !name.isEmpty())
                ? name
                : email.split("@")[0];

        String nickname = baseNickname;
        int suffix = 1;

        // Ensure nickname is unique
        while (userRepository.findByNickname(nickname).isPresent()) {
            nickname = baseNickname + suffix;
            suffix++;
        }

        return nickname;
    }
}
