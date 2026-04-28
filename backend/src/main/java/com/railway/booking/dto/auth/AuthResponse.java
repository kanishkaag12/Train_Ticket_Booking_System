package com.railway.booking.dto.auth;

import com.railway.booking.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private String token;
    private String fullName;
    private String email;
    private Role role;
}
