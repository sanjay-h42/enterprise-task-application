package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.ReviewCycleRequest;
import com.pulse.performance.entity.ReviewCycle;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.ReviewCycleRepository;
import com.pulse.performance.service.ReviewCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewCycleServiceImpl implements ReviewCycleService {

    private final ReviewCycleRepository reviewCycleRepository;

    @Override
    public List<ReviewCycle> getAllReviewCycles() {
        return reviewCycleRepository.findAll();
    }

    @Override
    public ReviewCycle getReviewCycleById(Long id) {
        return reviewCycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReviewCycle", "id", id));
    }

    @Override
    public ReviewCycle getActiveCycle() {
        return reviewCycleRepository.findFirstByStatusOrderByStartDateDesc(ReviewCycle.CycleStatus.ACTIVE)
                .orElse(null);
    }

    @Override
    @Transactional
    public ReviewCycle createReviewCycle(ReviewCycleRequest request) {
        ReviewCycle cycle = ReviewCycle.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus() != null ? request.getStatus() : ReviewCycle.CycleStatus.UPCOMING)
                .build();

        return reviewCycleRepository.save(cycle);
    }

    @Override
    @Transactional
    public ReviewCycle updateReviewCycle(Long id, ReviewCycleRequest request) {
        ReviewCycle cycle = getReviewCycleById(id);

        cycle.setName(request.getName());
        cycle.setDescription(request.getDescription());
        if (request.getStartDate() != null) cycle.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) cycle.setEndDate(request.getEndDate());
        if (request.getStatus() != null) cycle.setStatus(request.getStatus());

        return reviewCycleRepository.save(cycle);
    }

    @Override
    @Transactional
    public ReviewCycle changeCycleStatus(Long id, ReviewCycle.CycleStatus status) {
        ReviewCycle cycle = getReviewCycleById(id);
        cycle.setStatus(status);
        return reviewCycleRepository.save(cycle);
    }

    @Override
    @Transactional
    public void deleteReviewCycle(Long id) {
        ReviewCycle cycle = getReviewCycleById(id);
        reviewCycleRepository.delete(cycle);
    }
}
