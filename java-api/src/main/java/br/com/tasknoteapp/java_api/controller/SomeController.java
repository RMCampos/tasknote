package br.com.tasknoteapp.java_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/some")
public class SomeController {
  
  @GetMapping
  public String some() {
    return "Some";
  }
}
