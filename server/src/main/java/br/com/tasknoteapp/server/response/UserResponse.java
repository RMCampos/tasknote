package br.com.tasknoteapp.server.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

import br.com.tasknoteapp.server.entity.UserEntity;

/** This record represents a User Response object. */
@Schema(description = "This record represents a User Response object.")
public record UserResponse(
    @Schema(description = "The id of the user", example = "1") Long userId,
    @Schema(description = "The email of the user", example = "user@domain.com") String email,
    @Schema(description = "The admin status of the user", example = "false") Boolean admin,
    @Schema(description = "The created date and time of the user", example = "2023-01-01T00:00:00")
        LocalDateTime createdAt,
    @Schema(
            description = "The inactivated date and time of the user",
            example = "2023-01-01T00:00:00")
        LocalDateTime inactivatedAt) {


  /**
   * Create a {@link UserResponse} instance from a {@link UserEntity}.
   *
   * @param user The user entity instance with user info to be used as source.
   * @return UserResponse instance.
   */
  public static UserResponse fromEntity(UserEntity user) {
    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getAdmin(),
        user.getCreatedAt(),
        user.getInactivatedAt());
  }
}
