package com.pulse.performance.dto.request;

import com.pulse.performance.entity.Employee;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Work email is required")
    @Email(message = "Invalid work email")
    private String workEmail;

    private String phone;
    private String employeeCode;
    private String designation;
    private Long departmentId;
    private Long managerId;
    private LocalDate joiningDate;
    private Double currentRating;
    private Employee.EmployeeStatus status;
}
