package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.UserEntity;
import java.time.LocalDateTime;
import java.util.Optional;

/** This record represents a User Response object. */
public record UserResponse(
    Long userId,
    String name,
    String email,
    Boolean admin,
    LocalDateTime createdAt,
    LocalDateTime inactivatedAt,
    String gravatarImageUrl) {

  /**
   * Create a {@link UserResponse} instance from a {@link UserEntity}.
   *
   * @param user The user entity instance with user info to be used as source.
   * @return UserResponse instance.
   */
  public static UserResponse fromEntity(UserEntity user, Optional<String> gravatarUrl) {
    return new UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getAdmin(),
        user.getCreatedAt(),
        user.getInactivatedAt(),
        gravatarUrl.orElse(null));
  }
}
