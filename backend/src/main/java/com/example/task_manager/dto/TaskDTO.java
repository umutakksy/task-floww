package com.example.task_manager.dto;

import com.example.task_manager.model.Task;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskDTO {
    private String id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private String folderId;
    private String parentTaskId;
    private String creatorId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int progress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long version;
    private List<String> assigneeIds;
}
