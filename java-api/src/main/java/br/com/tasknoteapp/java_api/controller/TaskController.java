package br.com.tasknoteapp.java_api.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/tasks")
public class TaskController {
  
  @GetMapping
  public String tasks() {
    return "Tasks";
  }

  @PutMapping
  public String putTasks() {
    return "Put Tasks";
  }

  @PostMapping
  public String postTasks() {
    return "Post Tasks";
  }

  @DeleteMapping
  public String deleteTasks() {
    return "Delete Tasks";
  }
}
