package com.example.task_manager.mapper;

import com.example.task_manager.dto.TaskDTO;
import com.example.task_manager.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "assigneeIds", ignore = true)
    TaskDTO toDTO(Task task);

    Task toEntity(TaskDTO dto);

    List<TaskDTO> toDTOList(List<Task> tasks);
}
