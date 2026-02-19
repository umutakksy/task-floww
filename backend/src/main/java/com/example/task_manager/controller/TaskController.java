package com.example.task_manager.controller;

import com.example.task_manager.dto.TaskDTO;
import com.example.task_manager.model.Task;
import com.example.task_manager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(taskService.createTask(taskDTO, userId));
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<TaskDTO>> getTasksInFolder(@PathVariable String folderId) {
        return ResponseEntity.ok(taskService.getTasksInFolder(folderId));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<TaskDTO>> getAssignedTasks() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(taskService.getTasksForUser(userId));
    }

    @PostMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Void> toggleAssignee(@PathVariable String taskId, @PathVariable String userId) {
        taskService.toggleAssignee(taskId, userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateStatus(@PathVariable String taskId, @RequestParam Task.Status status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @PatchMapping("/{taskId}/progress")
    public ResponseEntity<TaskDTO> updateProgress(@PathVariable String taskId, @RequestParam int progress) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(taskService.updateProgress(taskId, progress, userId));
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable String taskId, @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDTO));
    }

    @PatchMapping("/{taskId}/priority")
    public ResponseEntity<TaskDTO> updatePriority(@PathVariable String taskId, @RequestParam Task.Priority priority) {
        return ResponseEntity.ok(taskService.updateTaskPriority(taskId, priority));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok().build();
    }
}
