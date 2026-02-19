package com.example.task_manager.service;

import com.example.task_manager.dto.FolderDTO;
import com.example.task_manager.mapper.FolderMapper;
import com.example.task_manager.model.Folder;
import com.example.task_manager.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final FolderMapper folderMapper;

    public FolderDTO createFolder(FolderDTO folderDTO, String userId) {
        Folder folder = folderMapper.toEntity(folderDTO);
        folder.setUserId(userId);
        folder.setDeleted(false);
        return folderMapper.toDTO(folderRepository.save(folder));
    }

    /**
     * Alternative: Use MongoDB Aggregation with $graphLookup for recursive tree.
     * This in-memory approach is suitable for smaller tree structures.
     */
    public List<FolderDTO> getFolderTree(String userId) {
        List<Folder> allFolders = folderRepository.findAllByUserIdAndDeletedFalse(userId);
        List<FolderDTO> allDTOs = folderMapper.toDTOList(allFolders);

        Map<String, List<FolderDTO>> childrenMap = allDTOs.stream()
                .filter(f -> f.getParentId() != null)
                .collect(Collectors.groupingBy(FolderDTO::getParentId));

        List<FolderDTO> rootFolders = allDTOs.stream()
                .filter(f -> f.getParentId() == null)
                .collect(Collectors.toList());

        populateChildren(rootFolders, childrenMap);
        return rootFolders;
    }

    private void populateChildren(List<FolderDTO> parents, Map<String, List<FolderDTO>> childrenMap) {
        for (FolderDTO parent : parents) {
            List<FolderDTO> children = childrenMap.get(parent.getId());
            if (children != null) {
                parent.setChildren(children);
                populateChildren(children, childrenMap);
            }
        }
    }

    public void deleteFolder(String folderId) {
        if (folderRepository.existsByParentIdAndDeletedFalse(folderId)) {
            throw new RuntimeException("Cannot delete folder with subfolders. Please delete children first.");
        }
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.setDeleted(true);
        folderRepository.save(folder);
    }
}
