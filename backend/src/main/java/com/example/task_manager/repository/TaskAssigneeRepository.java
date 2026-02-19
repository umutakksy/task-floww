package com.example.task_manager.repository;

import com.example.task_manager.model.TaskAssignee;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskAssigneeRepository extends MongoRepository<TaskAssignee, String> {
    List<TaskAssignee> findAllByTaskId(String taskId);

    List<TaskAssignee> findAllByUserId(String userId);

    void deleteByTaskIdAndUserId(String taskId, String userId);
}
