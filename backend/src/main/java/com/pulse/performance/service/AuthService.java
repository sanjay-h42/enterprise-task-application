package com.pulse.performance.service;

import com.pulse.performance.dto.request.LoginRequest;
import com.pulse.performance.dto.request.RegisterRequest;
import com.pulse.performance.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse getCurrentUser();
}
