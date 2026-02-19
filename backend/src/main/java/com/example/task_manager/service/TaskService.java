package com.example.task_manager.service;

import com.example.task_manager.dto.TaskDTO;
import com.example.task_manager.mapper.TaskMapper;
import com.example.task_manager.model.Task;
import com.example.task_manager.model.TaskAssignee;
import com.example.task_manager.repository.TaskAssigneeRepository;
import com.example.task_manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskAssigneeRepository taskAssigneeRepository;
    private final TaskMapper taskMapper;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public TaskDTO createTask(TaskDTO taskDTO, String creatorId) {
        Task task = taskMapper.toEntity(taskDTO);
        task.setCreatorId(creatorId);
        task.setDeleted(false);
        if (task.getStatus() == null) {
            task.setStatus(Task.Status.TODO);
        }
        if (task.getProgress() < 0)
            task.setProgress(0);
        if (task.getProgress() > 100)
            task.setProgress(100);
        return taskMapper.toDTO(taskRepository.save(task));
    }

    public List<TaskDTO> getTasksInFolder(String folderId) {
        List<Task> tasks = taskRepository.findAllByFolderIdAndDeletedFalse(folderId);
        return tasks.stream().map(this::enrichTaskDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksForUser(String userId) {
        List<String> taskIds = taskAssigneeRepository.findAllByUserId(userId).stream()
                .map(TaskAssignee::getTaskId)
                .collect(Collectors.toList());

        return taskIds.stream()
                .map(id -> taskRepository.findById(id).orElse(null))
                .filter(t -> t != null && !t.isDeleted())
                .map(this::enrichTaskDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleAssignee(String taskId, String userId) {
        var existing = taskAssigneeRepository.findAllByTaskId(taskId).stream()
                .filter(a -> a.getUserId().equals(userId))
                .findFirst();
        if (existing.isPresent()) {
            taskAssigneeRepository.delete(existing.get());
        } else {
            taskAssigneeRepository.save(TaskAssignee.builder()
                    .taskId(taskId)
                    .userId(userId)
                    .build());
            eventPublisher.publishEvent(new com.example.task_manager.event.TaskAssignedEvent(this, taskId, userId));
        }
    }

    public TaskDTO updateTaskStatus(String taskId, Task.Status status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return enrichTaskDTO(taskRepository.save(task));
    }

    /**
     * Only the creator of the task can update the progress.
     */
    public TaskDTO updateProgress(String taskId, int progress, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getCreatorId().equals(userId)) {
            throw new RuntimeException("Only the task creator can update progress");
        }

        if (progress < 0)
            progress = 0;
        if (progress > 100)
            progress = 100;
        task.setProgress(progress);
        return enrichTaskDTO(taskRepository.save(task));
    }

    public TaskDTO updateTask(String taskId, TaskDTO updates) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (updates.getTitle() != null) {
            task.setTitle(updates.getTitle());
        }
        if (updates.getDescription() != null) {
            task.setDescription(updates.getDescription());
        }
        return enrichTaskDTO(taskRepository.save(task));
    }

    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setDeleted(true);
        taskRepository.save(task);
    }

    public TaskDTO updateTaskPriority(String taskId, Task.Priority priority) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setPriority(priority);
        return enrichTaskDTO(taskRepository.save(task));
    }

    private TaskDTO enrichTaskDTO(Task task) {
        TaskDTO dto = taskMapper.toDTO(task);
        List<String> assignees = taskAssigneeRepository.findAllByTaskId(task.getId()).stream()
                .map(TaskAssignee::getUserId)
                .collect(Collectors.toList());
        dto.setAssigneeIds(assignees);
        return dto;
    }
}
