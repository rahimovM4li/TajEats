package com.tajeats.tajeats_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.storage.base-path:uploads}")
    private String basePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static images from filesystem
        String absolutePath = Paths.get(basePath).toAbsolutePath().toUri().toString();
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations(absolutePath)
                .setCachePeriod(3600); // Cache for 1 hour
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/images/**")
                .allowedOrigins("*")
                .allowedMethods("GET");
    }
}
