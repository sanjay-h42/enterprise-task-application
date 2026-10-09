package com.pulse.performance.service;

import com.pulse.performance.dto.request.KpiRequest;
import com.pulse.performance.entity.Kpi;

import java.util.List;

public interface KpiService {
    List<Kpi> getAllKpis();
    Kpi getKpiById(Long id);
    List<Kpi> getKpisByGoalId(Long goalId);
    List<Kpi> getKpisByEmployeeId(Long employeeId);
    Kpi createKpi(KpiRequest request);
    Kpi updateKpi(Long id, KpiRequest request);
    Kpi updateKpiProgress(Long id, Double currentValue);
    void deleteKpi(Long id);
    Double calculateEmployeeKpiScore(Long employeeId);
}
