package com.example.task_manager.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationListener {

    @EventListener
    public void handleTaskAssigned(TaskAssignedEvent event) {
        log.info("NOTIFICATION: Task {} has been assigned to user {}. Sending notification...",
                event.getTaskId(), event.getUserId());
        // Logic to send email, WebSocket message, or push notification goes here
    }
}
