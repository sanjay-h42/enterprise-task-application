package com.pulse.performance.controller;

import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.dto.response.DashboardAnalyticsResponse;
import com.pulse.performance.dto.response.DepartmentAnalyticsResponse;
import com.pulse.performance.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Endpoints for company and department analytics, KPIs, and distribution")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level company performance dashboard metrics")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getDashboardAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDashboardAnalytics()));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get comparative analytics for all departments")
    public ResponseEntity<ApiResponse<List<DepartmentAnalyticsResponse>>> getDepartmentAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDepartmentAnalytics()));
    }

    @GetMapping("/departments/{departmentId}")
    @Operation(summary = "Get analytics for a specific department")
    public ResponseEntity<ApiResponse<DepartmentAnalyticsResponse>> getDepartmentAnalyticsById(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDepartmentAnalyticsById(departmentId)));
    }
}
