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

  public String getErrorMessage() {
    return errorMessage;
  }

  public List<FieldIssueResponse> getFields() {
    return fields;
  }
}
