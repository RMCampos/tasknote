package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.MailServiceException;
import br.com.tasknoteapp.server.templates.MailgunTemplate;
import br.com.tasknoteapp.server.templates.MailgunTemplateEmailChanged;
import br.com.tasknoteapp.server.templates.MailgunTemplateResetPwd;
import br.com.tasknoteapp.server.templates.MailgunTemplateResetPwdConfirm;
import br.com.tasknoteapp.server.templates.MailgunTemplateSignUp;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/** This service handles email messages for Mailgun. */
@Service
public class MailgunEmailService {

  private static final Logger logger = Logger.getLogger(MailgunEmailService.class.getName());
  private final RestTemplate restTemplate;
  private final String targetEnv;
  private String domain;
  private String senderEmail;

  /**
   * Creates an instance of the Mail service class.
   *
   * @param apiKey The api key to send emails with.
   * @param domain The domain to send email from.
   * @param sender The from option.
   * @param targetEnv The environment.
   * @param templateBuilder The template builder.
   */
  public MailgunEmailService(
      @Value("${mailgun.api-key}") String apiKey,
      @Value("${mailgun.domain}") String domain,
      @Value("${mailgun.sender-email}") String sender,
      @Value("${br.com.tasknote.server.target-env}") String targetEnv,
      RestTemplateBuilder templateBuilder) {
    this.domain = domain;
    this.senderEmail = sender;
    this.targetEnv = targetEnv;
    this.restTemplate =
        templateBuilder.defaultHeader(HttpHeaders.AUTHORIZATION, basicAuth("api", apiKey)).build();
  }

  /**
   * Send new users a message confirming their account.
   *
   * @param user The user that should be addressed the message.
   */
  public void sendNewUser(UserEntity user) {
    logger.info("Sending message confirming user email address.");

    String to = user.getEmail();
    String subject = "TaskNote App confirmation email";
    String link = getBaseUrl() + "/email-confirmation?identification=%s";

    MailgunTemplateSignUp signUpTemplate = new MailgunTemplateSignUp();
    signUpTemplate.setConfirmationLink(String.format(link, user.getEmailUuid().toString()));

    sendEmail(to, subject, signUpTemplate);
  }

  /**
   * Send a password reset link.
   *
   * @param user The user that should be addressed the message.
   */
  public void sendResetPassword(UserEntity user) {
    logger.info("Sending message with password reset link");

    String to = user.getEmail();
    String subject = "TaskNote App password reset";
    String link = getBaseUrl() + "/finish-reset-password?token=%s";

    MailgunTemplateResetPwd resetTemplate = new MailgunTemplateResetPwd();
    resetTemplate.setResetLink(String.format(link, user.getResetToken()));

    sendEmail(to, subject, resetTemplate);
  }

  /**
   * Send a confirmation for the password change.
   *
   * @param user The user that should be addressed the message.
   */
  public void sendPasswordResetConfirmation(UserEntity user) {
    logger.info("Sending message with password reset confirmation");

    String to = user.getEmail();
    String subject = "TaskNote App password confirmation";

    MailgunTemplateResetPwdConfirm resetTemplate = new MailgunTemplateResetPwdConfirm();

    sendEmail(to, subject, resetTemplate);
  }

  /**
   * Send a notification about the changed email for both previous and new email.
   *
   * @param user The user that should be addressed the message.
   * @param oldEmail The user previous email
   */
  public void sendEmailChangedNotification(UserEntity user, String oldEmail) {
    logger.info("Sending message with changed email notification");

    MailgunTemplateEmailChanged emailChanged = new MailgunTemplateEmailChanged();
    emailChanged.setEmailFrom(oldEmail);
    emailChanged.setEmailTo(user.getEmail());
    emailChanged.setCarbonCopy(oldEmail);

    String subject = "TaskNote App email changed notification";

    sendEmail(user.getEmail(), subject, emailChanged);
  }

  /**
   * Send an email message.
   *
   * @param to The target email address.
   * @param subject The message subject.
   * @param textBody The message text body to be displayed.
   * @param htmlBody The message html body to be rendered.
   */
  private void sendEmail(String to, String subject, MailgunTemplate template) {
    String url = "https://api.mailgun.net/v3/" + domain + "/messages";
    String from = "TaskNote App <" + senderEmail + ">";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> mailData = new LinkedMultiValueMap<>();
    mailData.add("from", from);
    mailData.add("to", to);
    if (template.getCarbonCopy().isPresent()) {
      mailData.add("cc", template.getCarbonCopy().get());
    }
    mailData.add("subject", subject);
    mailData.add("template", template.getName());
    if (!template.getVariables().isEmpty()) {
      mailData.add("h:X-Mailgun-Variables", template.getVariableValuesJson());
      logger.info("JSON template variables: " + template.getVariableValuesJson());
    }

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(mailData, headers);

    try {
      ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

      if (!response.getStatusCode().is2xxSuccessful()) {
        throw new MailServiceException("Failed to send email: " + response.getStatusCode());
      }

      logger.info("Email message send successfully.");
    } catch (HttpClientErrorException ex) {
      logger.severe("Unable to send email: " + ex.getMessage() + " - " + ex.getCause());
    }
  }

  private String basicAuth(String username, String password) {
    String auth = username + ":" + password;
    return "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
  }

  private String getBaseUrl() {
    if ("development".equals(targetEnv) || Objects.isNull(targetEnv)) {
      return "http://localhost:5000";
    }
    String stage = targetEnv.equals("stage") ? "stage." : "";
    return String.format("https://%s%s", stage, domain);
  }
}
