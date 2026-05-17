package br.com.tasknoteapp.server.templates;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/** This class represents a template for the email change workflow. */
public class MailgunTemplateEmailChanged implements MailgunTemplate {

  private final Map<String, Object> props;
  private String carbonCopy;

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
    return "email_changed";
  }

  @Override
  public Map<String, Object> getVariables() {
    return props;
  }

  @Override
  public Optional<String> getCarbonCopy() {
    return Optional.ofNullable(carbonCopy);
  }

  public void setCarbonCopy(String carbonCopy) {
    this.carbonCopy = carbonCopy;
  }
}
