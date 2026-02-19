package com.example.task_manager.controller;

import com.example.task_manager.dto.FolderDTO;
import com.example.task_manager.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @PostMapping
    public ResponseEntity<FolderDTO> createFolder(@RequestBody FolderDTO folderDTO) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(folderService.createFolder(folderDTO, userId));
    }

    @GetMapping("/tree")
    public ResponseEntity<List<FolderDTO>> getFolderTree() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(folderService.getFolderTree(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable String id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }
}
