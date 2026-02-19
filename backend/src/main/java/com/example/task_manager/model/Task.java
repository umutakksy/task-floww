package com.example.task_manager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    private String id;

    private String title;

    private String description;

    @Indexed
    private Status status;

    @Indexed
    private String folderId;

    @Indexed
    private String parentTaskId;

    @Indexed
    private String creatorId;

    private LocalDate startDate;

    private LocalDate endDate;

    @Builder.Default
    private int progress = 0; // 0-100

    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @Builder.Default
    private boolean deleted = false;

    public enum Status {
        TODO, IN_PROGRESS, DONE, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}
