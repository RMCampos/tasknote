package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.UserEntity;
import java.time.LocalDateTime;
import java.util.Optional;

/** This record represents a User Response object. */
public record UserResponseWithToken(
    Long userId,
    String name,
    String email,
    Boolean admin,
    LocalDateTime createdAt,
    LocalDateTime inactivatedAt,
    String gravatarImageUrl,
    String token,
    String lang) {

  /**
   * Create a {@link UserResponseWithToken} instance from a {@link UserEntity}.
   *
   * @param user The user entity instance with user info to be used as source.
   * @param token The token created upon registration or login.
   * @return UserResponse instance.
   */
  public static UserResponseWithToken fromEntity(
      UserEntity user, String token, Optional<String> gravatarUrl) {
    return new UserResponseWithToken(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getAdmin(),
        user.getCreatedAt(),
        user.getInactivatedAt(),
        gravatarUrl.orElse(null),
        token,
        user.getLang());
  }
}
