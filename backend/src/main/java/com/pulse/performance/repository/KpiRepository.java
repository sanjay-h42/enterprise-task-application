package com.pulse.performance.repository;

import com.pulse.performance.entity.Kpi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiRepository extends JpaRepository<Kpi, Long> {
    List<Kpi> findByGoalId(Long goalId);
    List<Kpi> findByGoalEmployeeId(Long employeeId);
    List<Kpi> findByCategory(Kpi.KpiCategory category);
}
