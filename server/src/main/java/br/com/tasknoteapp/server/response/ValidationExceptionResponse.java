package br.com.tasknoteapp.server.response;

import java.util.List;
import org.springframework.validation.FieldError;

/** This class represents a validation error exception to be returned in the JSON format. */
public class ValidationExceptionResponse {

  private static final String MESSAGE_TEMPLATE = "%d field(s) with validation problems!";

  private final String errorMessage;

  private final List<FieldIssueResponse> fields;

  /**
   * The sole constructor of this class.
   *
   * @param errors all the validation problems to be listed as a response
   */
  public ValidationExceptionResponse(List<FieldError> errors) {
    this.fields =
        errors.stream()
            .map(error -> new FieldIssueResponse(error.getField(), error.getDefaultMessage()))
            .toList();
    this.errorMessage = String.format(MESSAGE_TEMPLATE, fields.size());
  }

  public ValidationExceptionResponse(String field, String errorMessage) {
    this.fields = List.of(new FieldIssueResponse(field, errorMessage));
    this.errorMessage = String.format(MESSAGE_TEMPLATE, fields.size());
  }

  /**
   * Method used by Spring internals to build the final JSON response.
   *
   * @return String describing the error message
   */
  public String getErrorMessage() {
    return errorMessage;
  }

  /**
   * Method used by Spring internals to build the final JSON response with failed fields.
   *
   * @return List of FieldIssueResponse containing the field name and the error message related to
   *     it
   */
  public List<FieldIssueResponse> getFields() {
    return fields;
  }
}
