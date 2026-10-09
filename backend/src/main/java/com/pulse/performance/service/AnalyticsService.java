package com.pulse.performance.service;

import com.pulse.performance.dto.response.DashboardAnalyticsResponse;
import com.pulse.performance.dto.response.DepartmentAnalyticsResponse;

import java.util.List;

public interface AnalyticsService {
    DashboardAnalyticsResponse getDashboardAnalytics();
    List<DepartmentAnalyticsResponse> getDepartmentAnalytics();
    DepartmentAnalyticsResponse getDepartmentAnalyticsById(Long departmentId);
}
