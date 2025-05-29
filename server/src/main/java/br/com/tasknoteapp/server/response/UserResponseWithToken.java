package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Optional;

/** This record represents a User Response object. */
@Schema(description = "This record represents a User Response with token object.")
public record UserResponseWithToken(
    @Schema(description = "The id of the user", example = "1") Long userId,
    @Schema(description = "The name of the user", example = "John") String name,
    @Schema(description = "The email of the user", example = "user@domain.com") String email,
    @Schema(description = "The admin status of the user", example = "false") Boolean admin,
    @Schema(description = "The created date and time of the user", example = "2023-01-01T00:00:00")
        LocalDateTime createdAt,
    @Schema(
            description = "The inactivated date and time of the user",
            example = "2023-01-01T00:00:00")
        LocalDateTime inactivatedAt,
    @Schema(description = "The gravatar image URL, if any") String gravatarImageUrl,
    @Schema(description = "The token created upon login") String token,
    @Schema(description = "The language selected upon login") String lang) {

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
