package com.pulse.performance.controller;

import com.pulse.performance.dto.request.KpiRequest;
import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.entity.Kpi;
import com.pulse.performance.service.KpiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kpis")
@RequiredArgsConstructor
@Tag(name = "KPIs", description = "Endpoints for KPI tracking, progress updates, and scores")
public class KpiController {

    private final KpiService kpiService;

    @GetMapping
    @Operation(summary = "Get all KPIs")
    public ResponseEntity<ApiResponse<List<Kpi>>> getAllKpis() {
        return ResponseEntity.ok(ApiResponse.success(kpiService.getAllKpis()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get KPI by ID")
    public ResponseEntity<ApiResponse<Kpi>> getKpiById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(kpiService.getKpiById(id)));
    }

    @GetMapping("/goal/{goalId}")
    @Operation(summary = "Get KPIs by Goal ID")
    public ResponseEntity<ApiResponse<List<Kpi>>> getKpisByGoalId(@PathVariable Long goalId) {
        return ResponseEntity.ok(ApiResponse.success(kpiService.getKpisByGoalId(goalId)));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get all KPIs for an Employee")
    public ResponseEntity<ApiResponse<List<Kpi>>> getKpisByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(kpiService.getKpisByEmployeeId(employeeId)));
    }

    @GetMapping("/employee/{employeeId}/score")
    @Operation(summary = "Calculate weighted KPI score for an employee")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getEmployeeKpiScore(@PathVariable Long employeeId) {
        Double score = kpiService.calculateEmployeeKpiScore(employeeId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("kpiScore", Math.round(score * 10.0) / 10.0)));
    }

    @PostMapping
    @Operation(summary = "Create a new KPI")
    public ResponseEntity<ApiResponse<Kpi>> createKpi(@Valid @RequestBody KpiRequest request) {
        Kpi created = kpiService.createKpi(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("KPI created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update KPI details")
    public ResponseEntity<ApiResponse<Kpi>> updateKpi(@PathVariable Long id, @Valid @RequestBody KpiRequest request) {
        Kpi updated = kpiService.updateKpi(id, request);
        return ResponseEntity.ok(ApiResponse.success("KPI updated successfully", updated));
    }

    @PatchMapping("/{id}/progress")
    @Operation(summary = "Update KPI current numeric value / progress")
    public ResponseEntity<ApiResponse<Kpi>> updateKpiProgress(@PathVariable Long id, @RequestParam Double currentValue) {
        Kpi updated = kpiService.updateKpiProgress(id, currentValue);
        return ResponseEntity.ok(ApiResponse.success("KPI progress updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete KPI")
    public ResponseEntity<ApiResponse<Void>> deleteKpi(@PathVariable Long id) {
        kpiService.deleteKpi(id);
        return ResponseEntity.ok(ApiResponse.success("KPI deleted successfully", null));
    }
}
