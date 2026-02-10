package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.service.HomeService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class provides resources to handle home requests by the client. */
@RestController
@RequestMapping("/rest/home")
public class HomeController {

  private final HomeService homeService;

  public HomeController(HomeService homeService) {
    this.homeService = homeService;
  }

  /**
   * Get all existing tags, ordered alphabetically.
   *
   * @return List of String with the tags.
   */
  @GetMapping("/tasks/tags")
  public List<String> getTasksTags() {
    return homeService.getTopTasksTag();
  }
}
