package com.railway.booking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info()
                .title("Railway Booking API")
                .description("IRCTC-inspired train booking system with JWT auth and waitlist reallocation")
                .version("1.0.0")
                .contact(new Contact().name("Assessment Project"))
                .license(new License().name("MIT")));
    }
}
