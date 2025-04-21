package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.TasksChartResponse;
import br.com.tasknoteapp.server.service.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** This class provides resources to handle home requests by the client. */
@RestController
@RequestMapping("/rest/home")
@AllArgsConstructor
@Tag(name = "Home", description = "Home resources to handle home page.")
public class HomeController {

  private final HomeService homeService;

  /**
   * Get summary for the home page.
   *
   * @return SummaryResponse containing count of done and undone tasks.
   */
  @GetMapping("/summary")
  @Operation(
      summary = "Get summary",
      description = "Get summary for the home page",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Summary successfully retrieved",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = SummaryResponse.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
      })
  public SummaryResponse getSummary() {
    return homeService.getSummary();
  }

  /**
   * Search for tasks and notes.
   *
   * @returns List of SearchResponse with found records.
   */
  @GetMapping("/search")
  @Operation(
      summary = "Search for tasks and notes",
      description = "Search for tasks and notes given a search term.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Summary successfully retrieved",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = SearchResponse.class, type = "array"))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public SearchResponse search(
      @Parameter(
              name = "term",
              in = ParameterIn.QUERY,
              description = "Search term",
              required = true,
              schema = @Schema(type = "string"))
          @RequestParam(value = "term", required = false)
          String term) {
    return homeService.search(term);
  }

  /**
   * Get the data for the completed tasks chart.
   *
   * @return List of TasksChartResponse with the data.
   */
  @GetMapping("/completed-tasks-chart")
  @Operation(
      summary = "Get completed tasks chart",
      description = "Get the data for the completed tasks chart.",
      responses = {
        @ApiResponse(responseCode = "200", description = "Data successfully retrieved"),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public List<TasksChartResponse> getTasksChart() {
    return homeService.getTasksChartData();
  }

  /**
   * Get the tasks given a filter.
   *
   * @returns List of TaskResponse with found tasks.
   */
  @GetMapping("/tasks/filter/{filter}")
  @Operation(
      summary = "Get the tasks given a filter",
      description = "Get the tasks given a filter which can be high | all | tag",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Found tasks or empty array",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = TaskResponse.class, type = "array"))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public List<TaskResponse> tasksByFilter(
      @Parameter(
              name = "filter",
              in = ParameterIn.PATH,
              description = "Task filter key. One of high, all, tag",
              required = true)
          @PathVariable
          String filter) {
    return homeService.getTasksByFilter(filter);
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
