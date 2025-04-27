package br.com.tasknoteapp.server.templates;

import java.util.Map;

/** This interface represents a mailgun template structure. */
public interface MailgunTemplate {

  static final String STRING_SCAPE = "\"";
  static final String COLON = ":";
  static final String COMMA = ",";

  String getName();

  Map<String, Object> getVariables();

  /**
   * Default method to get variables in JSON format.
   *
   * @return The JSON String representation.
   */
  default String getVariableValuesJson() {
    StringBuilder sb = new StringBuilder("{");
    for (Map.Entry<String, Object> entry : getVariables().entrySet()) {
      if (sb.toString().length() > 1) {
        sb.append(COMMA);
      }
      sb.append(STRING_SCAPE).append(entry.getKey()).append(STRING_SCAPE);
      sb.append(COLON);
      sb.append(STRING_SCAPE).append(entry.getValue().toString()).append(STRING_SCAPE);
    }
    sb.append("}");

    return sb.toString();
  }
}
