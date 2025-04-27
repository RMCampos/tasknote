package br.com.tasknoteapp.server.templates;

import java.util.HashMap;
import java.util.Map;

/** This class represents a template for the password reset workflow. */
public class MailgunTemplateResetPwd implements MailgunTemplate {

  private String templateName = "password reset";
  private final Map<String, Object> props;

  public MailgunTemplateResetPwd() {
    this.props = new HashMap<>();
  }

  public void setResetLink(String resetLink) {
    props.put("RESET_LINK", resetLink);
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
