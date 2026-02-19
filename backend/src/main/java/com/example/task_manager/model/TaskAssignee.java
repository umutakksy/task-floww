package com.example.task_manager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "task_assignees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(name = "task_user_idx", def = "{'taskId': 1, 'userId': 1}", unique = true)
public class TaskAssignee {
    @Id
    private String id;

    private String taskId;
    private String userId;
}
