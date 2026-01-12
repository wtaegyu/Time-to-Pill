package com.timetopill.entity;

import com.timetopill.config.TableNames;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = TableNames.USERS)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 로그인 아이디

    @Column // nullable for OAuth users
    private String password;

    @Column(nullable = false, unique = true, length = 50)
    private String nickname; // 앱에서 보여질 별명

    // ✨ [추가됨] 실명 (아이디 찾기 등에 사용)
    @Column(nullable = false, length = 50)
    private String name;

    // ✨ [추가됨] 이메일 (비밀번호 찾기, 알림 등에 사용)
    @Column(nullable = false, length = 100)
    private String email;

    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "google_id", unique = true)
    private String googleId;

    public enum AuthProvider {
        LOCAL, GOOGLE
    }

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserPill> userPills = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules = new ArrayList<>();

    public enum Gender {
        M, F
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    // ✨ [추가됨] name Getter/Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // ✨ [추가됨] email Getter/Setter
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public AuthProvider getProvider() { return provider; }
    public void setProvider(AuthProvider provider) { this.provider = provider; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<UserPill> getUserPills() { return userPills; }
    public List<Schedule> getSchedules() { return schedules; }
}