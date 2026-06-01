package com.taskboard.service;

import com.taskboard.dto.TaskRequest;
import com.taskboard.model.Task;
import com.taskboard.model.TaskStage;
import com.taskboard.model.User;
import com.taskboard.repository.TaskRepository;
import com.taskboard.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getTasks(Long userId) {
        return taskRepository.findByUserIdOrderById(userId);
    }

    public Task createTask(Long userId, TaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        TaskStage stage = TaskStage.valueOf(request.getStage().toUpperCase());
        Task task = new Task(request.getTitle(), request.getDescription(), stage, user);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Long userId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStage(TaskStage.valueOf(request.getStage().toUpperCase()));
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        taskRepository.delete(task);
    }
}
