package br.com.tasknoteapp.server.templates;

import java.util.HashMap;
import java.util.Map;

/** This class represents a template for the password reset confirmation workflow. */
public class MailgunTemplateResetPwdConfirm implements MailgunTemplate {

  private String templateName = "password change confirmation";
  private final Map<String, Object> props;

  public MailgunTemplateResetPwdConfirm() {
    this.props = new HashMap<>();
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
