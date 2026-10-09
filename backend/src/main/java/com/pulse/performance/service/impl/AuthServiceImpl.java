package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.LoginRequest;
import com.pulse.performance.dto.request.RegisterRequest;
import com.pulse.performance.dto.response.AuthResponse;
import com.pulse.performance.entity.Department;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.User;
import com.pulse.performance.exception.BadRequestException;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.DepartmentRepository;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.UserRepository;
import com.pulse.performance.security.JwtTokenProvider;
import com.pulse.performance.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);

        return buildAuthResponse(jwt, user, employee);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole() != null ? registerRequest.getRole() : User.Role.EMPLOYEE)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        Employee savedEmployee = null;
        if (registerRequest.getFirstName() != null && !registerRequest.getFirstName().isBlank()) {
            Department department = null;
            if (registerRequest.getDepartmentId() != null) {
                department = departmentRepository.findById(registerRequest.getDepartmentId()).orElse(null);
            }

            Employee employee = Employee.builder()
                    .user(savedUser)
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName() != null ? registerRequest.getLastName() : "")
                    .workEmail(registerRequest.getEmail())
                    .employeeCode(registerRequest.getEmployeeCode() != null ? registerRequest.getEmployeeCode() : "EMP-" + System.currentTimeMillis() % 100000)
                    .designation(registerRequest.getDesignation() != null ? registerRequest.getDesignation() : "Specialist")
                    .department(department)
                    .joiningDate(LocalDate.now())
                    .status(Employee.EmployeeStatus.ACTIVE)
                    .currentRating(3.5)
                    .build();

            savedEmployee = employeeRepository.save(employee);
        }

        String jwt = tokenProvider.generateTokenFromUsername(savedUser.getUsername(), savedUser.getRole().name());
        return buildAuthResponse(jwt, savedUser, savedEmployee);
    }

    @Override
    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("No authenticated user in session");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);

        return buildAuthResponse(null, user, employee);
    }

    private AuthResponse buildAuthResponse(String jwt, User user, Employee employee) {
        String fullName = employee != null ? (employee.getFirstName() + " " + employee.getLastName()).trim() : user.getUsername();
        String designation = employee != null ? employee.getDesignation() : user.getRole().name();
        String deptName = (employee != null && employee.getDepartment() != null) ? employee.getDepartment().getName() : "General";

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .employeeId(employee != null ? employee.getId() : null)
                .fullName(fullName)
                .designation(designation)
                .departmentName(deptName)
                .build();
    }
}
