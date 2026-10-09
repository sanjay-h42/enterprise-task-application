package com.pulse.performance.config;

import com.pulse.performance.entity.*;
import com.pulse.performance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final GoalRepository goalRepository;
    private final KpiRepository kpiRepository;
    private final ReviewCycleRepository reviewCycleRepository;
    private final FeedbackRepository feedbackRepository;
    private final PerformanceReviewRepository performanceReviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initialization.");
            return;
        }

        log.info("Seeding initial enterprise performance data...");

        // 1. Create Departments
        Department engineering = departmentRepository.save(Department.builder()
                .name("Engineering")
                .code("ENG")
                .description("Software engineering, architecture, DevOps, and quality assurance")
                .build());

        Department product = departmentRepository.save(Department.builder()
                .name("Product & Design")
                .code("PROD")
                .description("Product management, UX/UI design, and market research")
                .build());

        Department marketing = departmentRepository.save(Department.builder()
                .name("Marketing & Growth")
                .code("MKT")
                .description("Brand marketing, digital acquisition, and communications")
                .build());

        Department sales = departmentRepository.save(Department.builder()
                .name("Enterprise Sales")
                .code("SALES")
                .description("Global sales, enterprise accounts, and customer success")
                .build());

        Department hr = departmentRepository.save(Department.builder()
                .name("Human Resources")
                .code("HR")
                .description("Talent acquisition, employee experience, and people operations")
                .build());

        // 2. Create Users
        User adminUser = userRepository.save(User.builder()
                .username("admin")
                .email("admin@pulse-performance.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .isActive(true)
                .build());

        User managerUser = userRepository.save(User.builder()
                .username("sarah.manager")
                .email("sarah.chen@pulse-performance.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.MANAGER)
                .isActive(true)
                .build());

        User devUser1 = userRepository.save(User.builder()
                .username("alex.dev")
                .email("alex.morgan@pulse-performance.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.EMPLOYEE)
                .isActive(true)
                .build());

        User devUser2 = userRepository.save(User.builder()
                .username("marcus.lead")
                .email("marcus.vance@pulse-performance.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.EMPLOYEE)
                .isActive(true)
                .build());

        User designerUser = userRepository.save(User.builder()
                .username("elena.design")
                .email("elena.rostova@pulse-performance.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.EMPLOYEE)
                .isActive(true)
                .build());

        // 3. Create Employees
        Employee adminEmployee = employeeRepository.save(Employee.builder()
                .user(adminUser)
                .firstName("System")
                .lastName("Administrator")
                .workEmail("admin@pulse-performance.com")
                .employeeCode("EMP-001")
                .designation("Chief Operations Officer")
                .department(hr)
                .joiningDate(LocalDate.of(2022, 1, 10))
                .status(Employee.EmployeeStatus.ACTIVE)
                .currentRating(4.9)
                .build());

        Employee managerEmployee = employeeRepository.save(Employee.builder()
                .user(managerUser)
                .firstName("Sarah")
                .lastName("Chen")
                .workEmail("sarah.chen@pulse-performance.com")
                .employeeCode("EMP-101")
                .designation("VP of Engineering")
                .department(engineering)
                .manager(adminEmployee)
                .joiningDate(LocalDate.of(2022, 3, 15))
                .status(Employee.EmployeeStatus.ACTIVE)
                .currentRating(4.8)
                .build());

        Employee devEmployee1 = employeeRepository.save(Employee.builder()
                .user(devUser1)
                .firstName("Alex")
                .lastName("Morgan")
                .workEmail("alex.morgan@pulse-performance.com")
                .employeeCode("EMP-102")
                .designation("Senior Backend Engineer")
                .department(engineering)
                .manager(managerEmployee)
                .joiningDate(LocalDate.of(2023, 2, 1))
                .status(Employee.EmployeeStatus.ACTIVE)
                .currentRating(4.5)
                .build());

        Employee devEmployee2 = employeeRepository.save(Employee.builder()
                .user(devUser2)
                .firstName("Marcus")
                .lastName("Vance")
                .workEmail("marcus.vance@pulse-performance.com")
                .employeeCode("EMP-103")
                .designation("Lead Platform Architect")
                .department(engineering)
                .manager(managerEmployee)
                .joiningDate(LocalDate.of(2022, 6, 1))
                .status(Employee.EmployeeStatus.ACTIVE)
                .currentRating(4.7)
                .build());

        Employee designerEmployee = employeeRepository.save(Employee.builder()
                .user(designerUser)
                .firstName("Elena")
                .lastName("Rostova")
                .workEmail("elena.rostova@pulse-performance.com")
                .employeeCode("EMP-201")
                .designation("Principal Product Designer")
                .department(product)
                .manager(adminEmployee)
                .joiningDate(LocalDate.of(2023, 5, 20))
                .status(Employee.EmployeeStatus.ACTIVE)
                .currentRating(4.6)
                .build());

        // 4. Create Review Cycles
        ReviewCycle q3Cycle = reviewCycleRepository.save(ReviewCycle.builder()
                .name("Q3 2026 Performance Appraisal")
                .description("Quarterly comprehensive employee appraisal and KPI evaluation")
                .startDate(LocalDate.of(2026, 7, 1))
                .endDate(LocalDate.of(2026, 9, 30))
                .status(ReviewCycle.CycleStatus.ACTIVE)
                .build());

        ReviewCycle q2Cycle = reviewCycleRepository.save(ReviewCycle.builder()
                .name("Q2 2026 Performance Review")
                .description("Mid-year performance and goal retrospectives")
                .startDate(LocalDate.of(2026, 4, 1))
                .endDate(LocalDate.of(2026, 6, 30))
                .status(ReviewCycle.CycleStatus.COMPLETED)
                .build());

        // 5. Create Goals & KPIs for Alex Morgan
        Goal goal1 = goalRepository.save(Goal.builder()
                .title("Architect Microservice Authentication & RBAC")
                .description("Design high-throughput JWT & OAuth2 distributed authentication gateway")
                .employee(devEmployee1)
                .startDate(LocalDate.of(2026, 7, 1))
                .dueDate(LocalDate.of(2026, 9, 15))
                .status(Goal.GoalStatus.IN_PROGRESS)
                .priority(Goal.GoalPriority.HIGH)
                .progressPercentage(85.0)
                .weightage(1.5)
                .build());

        kpiRepository.save(Kpi.builder()
                .name("API Latency (p99)")
                .description("Keep 99th percentile response time below 45ms")
                .goal(goal1)
                .targetValue(45.0)
                .currentValue(42.0)
                .unit("ms")
                .weight(1.0)
                .category(Kpi.KpiCategory.EFFICIENCY)
                .build());

        kpiRepository.save(Kpi.builder()
                .name("Unit Test Code Coverage")
                .description("Achieve 90%+ code coverage on core security filter chains")
                .goal(goal1)
                .targetValue(90.0)
                .currentValue(92.0)
                .unit("%")
                .weight(1.0)
                .category(Kpi.KpiCategory.QUALITY)
                .build());

        Goal goal2 = goalRepository.save(Goal.builder()
                .title("Reduce Database Query Overhead")
                .description("Optimize N+1 queries across core reporting JPA entities")
                .employee(devEmployee1)
                .startDate(LocalDate.of(2026, 7, 10))
                .dueDate(LocalDate.of(2026, 9, 25))
                .status(Goal.GoalStatus.IN_PROGRESS)
                .priority(Goal.GoalPriority.CRITICAL)
                .progressPercentage(70.0)
                .weightage(1.2)
                .build());

        kpiRepository.save(Kpi.builder()
                .name("Query Execution Speedup")
                .description("Percentage decrease in slow queries above 100ms")
                .goal(goal2)
                .targetValue(50.0)
                .currentValue(40.0)
                .unit("%")
                .weight(1.0)
                .category(Kpi.KpiCategory.EFFICIENCY)
                .build());

        // 6. Create Goals & KPIs for Elena Rostova
        Goal goal3 = goalRepository.save(Goal.builder()
                .title("Design System Modernization & Dark Mode")
                .description("Create modular Figma tokens and implement high-contrast dark aesthetic")
                .employee(designerEmployee)
                .startDate(LocalDate.of(2026, 7, 5))
                .dueDate(LocalDate.of(2026, 9, 20))
                .status(Goal.GoalStatus.IN_PROGRESS)
                .priority(Goal.GoalPriority.HIGH)
                .progressPercentage(90.0)
                .weightage(1.0)
                .build());

        kpiRepository.save(Kpi.builder()
                .name("Component Coverage in Design System")
                .description("Migrate 30 UI components to new design system token standard")
                .goal(goal3)
                .targetValue(30.0)
                .currentValue(28.0)
                .unit("components")
                .weight(1.0)
                .category(Kpi.KpiCategory.PRODUCTIVITY)
                .build());

        // 7. Create Feedbacks
        feedbackRepository.save(Feedback.builder()
                .employee(devEmployee1)
                .reviewer(managerEmployee)
                .reviewCycle(q3Cycle)
                .feedbackType(Feedback.FeedbackType.MANAGER)
                .rating(5)
                .comments("Alex is doing tremendous work revamping our backend security architecture. Consistently reliable.")
                .strengths("Deep technical competence, clean code architecture, great mentorship of junior teammates.")
                .areasOfImprovement("Could delegate smaller tasks more actively.")
                .isAnonymous(false)
                .build());

        feedbackRepository.save(Feedback.builder()
                .employee(devEmployee1)
                .reviewer(designerEmployee)
                .reviewCycle(q3Cycle)
                .feedbackType(Feedback.FeedbackType.PEER)
                .rating(4)
                .comments("Very collaborative engineer! Integrates UI specs quickly and provides great API contracts.")
                .strengths("Fast turnaround time, clear communication.")
                .areasOfImprovement("More swagger documentation for frontend developers.")
                .isAnonymous(false)
                .build());

        // 8. Create Performance Review
        PerformanceReview review1 = PerformanceReview.builder()
                .employee(devEmployee1)
                .reviewer(managerEmployee)
                .reviewCycle(q3Cycle)
                .kpiScore(94.5)
                .feedbackScore(4.5)
                .managerRating(4.5)
                .selfRating(4.4)
                .comments("Exceeds expectations across all technical initiatives in Q3.")
                .developmentPlan("Prepare for Principal Engineer leadership track.")
                .status(PerformanceReview.ReviewStatus.APPROVED)
                .build();
        review1.calculateFinalScore();
        performanceReviewRepository.save(review1);

        log.info("Database seeding completed successfully! Test users: admin/admin123, sarah.manager/password123, alex.dev/password123");
    }
}
