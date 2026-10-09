package com.pulse.performance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"department", "manager", "user"})
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    @JsonIgnoreProperties({"department", "manager", "user"})
    private Employee reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "review_cycle_id", nullable = false)
    private ReviewCycle reviewCycle;

    // KPI Score (0 - 100)
    @Builder.Default
    private Double kpiScore = 0.0;

    // Feedback Score (1 - 5)
    @Builder.Default
    private Double feedbackScore = 0.0;

    // Manager Rating (1 - 5)
    @Builder.Default
    private Double managerRating = 3.0;

    // Self Rating (1 - 5)
    @Builder.Default
    private Double selfRating = 3.0;

    // Final Composite Score (1 - 5)
    @Builder.Default
    private Double finalScore = 3.0;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(columnDefinition = "TEXT")
    private String developmentPlan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReviewStatus status = ReviewStatus.DRAFT;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ReviewStatus {
        DRAFT, SUBMITTED, APPROVED, COMPLETED
    }

    public void calculateFinalScore() {
        // Normalize KPI score (0-100) to 1-5 scale
        double normalizedKpi = (kpiScore != null && kpiScore > 0) ? Math.min(5.0, Math.max(1.0, kpiScore / 20.0)) : 3.0;
        double fb = (feedbackScore != null && feedbackScore > 0) ? feedbackScore : 3.0;
        double mgr = (managerRating != null && managerRating > 0) ? managerRating : 3.0;
        double self = (selfRating != null && selfRating > 0) ? selfRating : 3.0;

        // Weights: 40% KPIs, 30% Manager, 20% 360 Feedback, 10% Self
        double composite = (normalizedKpi * 0.40) + (mgr * 0.30) + (fb * 0.20) + (self * 0.10);
        this.finalScore = Math.round(composite * 10.0) / 10.0;
    }
}
