package com.timetopill.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "api.service-key")
@Getter @Setter
public class ApiConfig {
    private String pillInfo; // api.service-key.pill-info 매핑
    private String pillDur;  // api.service-key.pill-dur 매핑
}