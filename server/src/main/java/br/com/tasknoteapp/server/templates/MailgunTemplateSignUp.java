package br.com.tasknoteapp.server.templates;

import java.util.HashMap;
import java.util.Map;

/** This class represents a template for the sign up workflow. */
public class MailgunTemplateSignUp implements MailgunTemplate {

  private String templateName = "sign up confirmation";
  private final Map<String, Object> props;

  public MailgunTemplateSignUp() {
    this.props = new HashMap<>();
  }

  public void setConfirmationLink(String confirmationLink) {
    props.put("CONFIRMATION_LINK", confirmationLink);
  }

  @Override
  public String getName() {
    return templateName;
  }

  @Override
  public Map<String, Object> getVariables() {
    return props;
  }
}
