package br.com.tasknoteapp.server.templates;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/** This class represents a template for the email change workflow. */
public class MailgunTemplateEmailChanged implements MailgunTemplate {

  private String templateName = "email changed";
  private String carbonCopy;
  private final Map<String, Object> props;

  public MailgunTemplateEmailChanged() {
    this.props = new HashMap<>();
  }

  public void setEmailFrom(String emailFrom) {
    props.put("EMAIL_FROM", emailFrom);
  }

  public void setEmailTo(String emailTo) {
    props.put("EMAIL_TO", emailTo);
  }

  @Override
  public String getName() {
    return templateName;
  }

  @Override
  public Map<String, Object> getVariables() {
    return props;
  }

  public void setCarbonCopy(String carbonCopy) {
    this.carbonCopy = carbonCopy;
  }

  @Override
  public Optional<String> getCarbonCopy() {
    return Optional.ofNullable(carbonCopy);
  }
}
