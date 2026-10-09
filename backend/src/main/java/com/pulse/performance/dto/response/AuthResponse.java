package com.pulse.performance.dto.response;

import com.pulse.performance.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String username;
    private String email;
    private User.Role role;
    private Long employeeId;
    private String fullName;
    private String designation;
    private String departmentName;
}
