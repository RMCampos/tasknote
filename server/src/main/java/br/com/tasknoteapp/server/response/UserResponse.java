package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.util.TimeAgoUtil;
import java.time.LocalDateTime;

/** This record represents a User Response object. */
public record UserResponse(
    Long userId,
    String name,
    String email,
    Boolean admin,
    LocalDateTime createdAt,
    LocalDateTime inactivatedAt,
    String lastLogin,
    String gravatarImageUrl) {

  /**
   * Create a {@link UserResponse} instance from a {@link UserEntity}.
   *
   * @param user The user entity instance with user info to be used as source.
   * @return UserResponse instance.
   */
  public static UserResponse fromEntity(UserEntity user, String gravatarUrl,
      String timezone) {
    return new UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getAdmin(),
        user.getCreatedAt(),
        user.getInactivatedAt(),
        TimeAgoUtil.formatLastSeen(user.getLastLogin(), timezone),
        gravatarUrl);
  }
}
