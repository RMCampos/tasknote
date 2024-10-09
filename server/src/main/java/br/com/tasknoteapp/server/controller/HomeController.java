package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;
import br.com.tasknoteapp.server.service.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
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
            responseCode = "403",
            description = "Forbidden. Access Denied",
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
            responseCode = "403",
            description = "Forbidden. Access Denied",
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
}
