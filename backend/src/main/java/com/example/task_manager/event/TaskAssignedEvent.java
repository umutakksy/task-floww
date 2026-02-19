package com.example.task_manager.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskAssignedEvent extends ApplicationEvent {
    private final String taskId;
    private final String userId;

    public TaskAssignedEvent(Object source, String taskId, String userId) {
        super(source);
        this.taskId = taskId;
        this.userId = userId;
    }
}
