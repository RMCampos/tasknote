package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.service.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class provides resources to handle home requests by the client. */
@RestController
@RequestMapping("/rest/home")
@Tag(name = "Home", description = "Home resources to handle home page.")
public class HomeController {

  private final HomeService homeService;

  public HomeController(HomeService homeService) {
    this.homeService = homeService;
  }

  /**
   * Get the top 5 tags.
   *
   * @returns List of String with the tags.
   */
  @GetMapping("/tasks/tags")
  @Operation(
      summary = "Get the top 5 tags",
      description = "Get the top 5 tags or the ones in use",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "List of tags or an empty list",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = String.class, type = "array"))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public List<String> getTasksTags() {
    return homeService.getTopTasksTag();
  }
}
