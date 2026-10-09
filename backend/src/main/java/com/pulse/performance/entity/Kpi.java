package com.pulse.performance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "kpis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Kpi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "goal_id", nullable = false)
    @JsonIgnoreProperties({"kpis"})
    private Goal goal;

    @Column(nullable = false)
    @Builder.Default
    private Double targetValue = 100.0;

    @Builder.Default
    private Double currentValue = 0.0;

    @Builder.Default
    private String unit = "%";

    @Column(nullable = false)
    @Builder.Default
    private Double weight = 1.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private KpiCategory category = KpiCategory.QUALITY;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum KpiCategory {
        PRODUCTIVITY,
        QUALITY,
        EFFICIENCY,
        ATTENDANCE,
        TASK_COMPLETION,
        GOAL_ACHIEVEMENT,
        CUSTOMER_SATISFACTION,
        TEAM_COLLABORATION
    }

    @Transient
    public double getAchievementPercentage() {
        if (targetValue == null || targetValue == 0) return 0;
        return Math.min(100.0, (currentValue / targetValue) * 100.0);
    }

    @Transient
    public double getWeightedScore() {
        return getAchievementPercentage() * (weight != null ? weight : 1.0);
    }
}
