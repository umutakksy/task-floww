package com.example.task_manager.mapper;

import com.example.task_manager.dto.FolderDTO;
import com.example.task_manager.model.Folder;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FolderMapper {
    FolderDTO toDTO(Folder folder);

    Folder toEntity(FolderDTO dto);

    List<FolderDTO> toDTOList(List<Folder> folders);
}
