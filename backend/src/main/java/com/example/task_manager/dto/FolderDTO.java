package com.example.task_manager.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FolderDTO {
    private String id;
    private String name;
    private String userId;
    private String parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<FolderDTO> children;
}
