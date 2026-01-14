package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/** This class represents a User in the database. */
@Entity
@Table(name = "users")
public class UserEntity implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private Boolean admin;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "inactivated_at", nullable = true)
  private LocalDateTime inactivatedAt;

  @Column(name = "name", length = 20)
  private String name;

  @OneToMany(mappedBy = "user")
  private List<TaskEntity> tasks;

  @Column(name = "email_confirmed_at", nullable = true)
  private LocalDateTime emailConfirmedAt;

  @Column(name = "email_uuid", columnDefinition = "uuid", nullable = true, unique = true)
  private UUID emailUuid;

  @Column(name = "reset_password_expiration", nullable = true)
  private LocalDateTime resetPasswordExpiration;

  @Column(name = "reset_token", nullable = true, length = 35)
  private String resetToken;

  @Column(name = "lang", nullable = true, length = 6)
  private String lang;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  @Override
  public String getUsername() {
    // email in our case
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  // TODO: generate all Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Boolean getAdmin() {
    return admin;
  }

  public void setAdmin(Boolean admin) {
    this.admin = admin;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getInactivatedAt() {
    return inactivatedAt;
  }

  public void setInactivatedAt(LocalDateTime inactivatedAt) {
    this.inactivatedAt = inactivatedAt;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<TaskEntity> getTasks() {
    return tasks;
  }

  public void setTasks(List<TaskEntity> tasks) {
    this.tasks = tasks;
  }

  public LocalDateTime getEmailConfirmedAt() {
    return emailConfirmedAt;
  }

  public void setEmailConfirmedAt(LocalDateTime emailConfirmedAt) {
    this.emailConfirmedAt = emailConfirmedAt;
  }

  public UUID getEmailUuid() {
    return emailUuid;
  }

  public void setEmailUuid(UUID emailUuid) {
    this.emailUuid = emailUuid;
  }

  public LocalDateTime getResetPasswordExpiration() {
    return resetPasswordExpiration;
  }

  public void setResetPasswordExpiration(LocalDateTime resetPasswordExpiration) {
    this.resetPasswordExpiration = resetPasswordExpiration;
  }

  public String getResetToken() {
    return resetToken;
  }

  public void setResetToken(String resetToken) {
    this.resetToken = resetToken;
  }

  public String getLang() {
    return lang;
  }

  public void setLang(String lang) {
    this.lang = lang;
  }
}
