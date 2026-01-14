package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

/** This class represents a login request with user email and password. */
@Schema(description = "Login request with user email and password.")
@NotNull
public class LoginRequest {
  @Schema(description = "User email.")
  @Email
  @NotNull
  private String email;

  @Schema(description = "User password.")
  @NotNull
  private String password;

  @Schema(description = "User password again.")
  private String passwordAgain;

  @Schema(description = "User language. (Optional, default English)")
  private String lang;

  public LoginRequest() {}

  /**
   * Constructs a LoginRequest with the specified email and password.
   *
   * @param email the user email
   * @param password the user password
   * @param passwordAgain the user password again
   * @param lang the user language
   */
  public LoginRequest(String email, String password, String passwordAgain, String lang) {
    this.email = email;
    this.password = password;
    this.passwordAgain = passwordAgain;
    this.lang = lang;
  }

  public String email() {
    return email.trim().toLowerCase();
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String password() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String passwordAgain() {
    return passwordAgain;
  }

  public void setPasswordAgain(String passwordAgain) {
    this.passwordAgain = passwordAgain;
  }

  public String lang() {
    return lang;
  }

  public void setLang(String lang) {
    this.lang = lang;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    LoginRequest that = (LoginRequest) o;
    return email().equals(that.email()) && password().equals(that.password());
  }

  @Override
  public int hashCode() {
    int result = email().hashCode();
    result = 31 * result + password().hashCode();
    return result;
  }

  @Override
  public String toString() {
    return "LoginRequest{"
        + "email='"
        + email
        + '\''
        + ", password='"
        + password
        + '\''
        + ", passwordAgain='"
        + passwordAgain
        + '\''
        + ", lang='"
        + lang
        + '\''
        + '}';
  }
}
