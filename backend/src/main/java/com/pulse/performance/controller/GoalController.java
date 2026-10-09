package com.pulse.performance.controller;

import com.pulse.performance.dto.request.GoalRequest;
import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.entity.Goal;
import com.pulse.performance.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@Tag(name = "Goals", description = "Endpoints for goal management and progress tracking")
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    @Operation(summary = "Get all goals")
    public ResponseEntity<ApiResponse<List<Goal>>> getAllGoals() {
        return ResponseEntity.ok(ApiResponse.success(goalService.getAllGoals()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get goal by ID")
    public ResponseEntity<ApiResponse<Goal>> getGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(goalService.getGoalById(id)));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get goals by Employee ID")
    public ResponseEntity<ApiResponse<List<Goal>>> getGoalsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(goalService.getGoalsByEmployeeId(employeeId)));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get goals by Department ID")
    public ResponseEntity<ApiResponse<List<Goal>>> getGoalsByDepartmentId(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(goalService.getGoalsByDepartmentId(departmentId)));
    }

    @PostMapping
    @Operation(summary = "Create a new goal")
    public ResponseEntity<ApiResponse<Goal>> createGoal(@Valid @RequestBody GoalRequest request) {
        Goal created = goalService.createGoal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Goal created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update goal details")
    public ResponseEntity<ApiResponse<Goal>> updateGoal(@PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        Goal updated = goalService.updateGoal(id, request);
        return ResponseEntity.ok(ApiResponse.success("Goal updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete goal")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok(ApiResponse.success("Goal deleted successfully", null));
    }
}
