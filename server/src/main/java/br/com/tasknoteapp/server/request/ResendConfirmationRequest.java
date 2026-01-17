package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

/** This class represents a login request with user email and password. */
@NotNull
public class ResendConfirmationRequest {
  @Email @NotNull private String email;

  public ResendConfirmationRequest() {}

  public ResendConfirmationRequest(String email) {
    this.email = email;
  }

  public String email() {
    return email.trim().toLowerCase();
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ResendConfirmationRequest that = (ResendConfirmationRequest) o;
    return email().equals(that.email());
  }

  @Override
  public int hashCode() {
    return email().hashCode();
  }

  @Override
  public String toString() {
    return "ResendConfirmationRequest{" + "email='" + email + '\'' + '}';
  }
}
