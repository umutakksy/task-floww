package com.example.task_manager.repository;

import com.example.task_manager.model.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FolderRepository extends MongoRepository<Folder, String> {
    List<Folder> findAllByUserIdAndDeletedFalse(String userId);

    List<Folder> findAllByParentIdAndDeletedFalse(String parentId);

    List<Folder> findAllByUserIdAndParentIdAndDeletedFalse(String userId, String parentId);

    boolean existsByParentIdAndDeletedFalse(String parentId);
}
