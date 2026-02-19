package com.example.task_manager.repository;

import com.example.task_manager.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findAllByFolderIdAndDeletedFalse(String folderId);

    List<Task> findAllByParentTaskIdAndDeletedFalse(String parentTaskId);

    List<Task> findAllByCreatorIdAndDeletedFalse(String creatorId);
}
