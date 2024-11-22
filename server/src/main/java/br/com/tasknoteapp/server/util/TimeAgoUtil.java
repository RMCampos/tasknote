package br.com.tasknoteapp.server.util;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Objects;

/** This class contains util methods to format local date time. */
public class TimeAgoUtil {

  /**
   * Format a time in the time ago format.
   *
   * @param pastTime The past time to be formatted.
   * @return String with formatted time.
   */
  public static String format(LocalDateTime pastTime) {
    if (Objects.isNull(pastTime)) {
      return "Some time ago";
    }
    LocalDateTime now = LocalDateTime.now();
    Period period = Period.between(pastTime.toLocalDate(), now.toLocalDate());
    Duration duration = Duration.between(pastTime, now);
    if (period.getYears() > 1) {
      return String.format("%d years ago", period.getYears());
    } else if (period.getYears() > 0) {
      return String.format("%d year ago", period.getYears());
    } else if (period.getMonths() > 1) {
      return String.format("%d months ago", period.getMonths());
    } else if (period.getMonths() > 0) {
      return String.format("%d month ago", period.getMonths());
    } else if (period.getDays() > 1) {
      return String.format("%d days ago", period.getDays());
    } else if (period.getDays() > 0) {
      return String.format("%d day ago", period.getDays());
    } else if (duration.toHours() > 1L) {
      return String.format("%d hours ago", duration.toHours());
    } else if (duration.toHours() > 0L) {
      return String.format("%d hour ago", duration.toHours());
    } else if (duration.toMinutes() > 1L) {
      return String.format("%d minutes ago", duration.toMinutes());
    } else if (duration.toMinutes() > 0L) {
      return String.format("%d minute ago", duration.toMinutes());
    } else if (duration.toSeconds() > 1L) {
      return String.format("%d seconds ago", duration.toSeconds());
    } else {
      return "Moments ago";
    }
  }

  /**
   * Format a given due date into left time format.
   *
   * @param dueDate Date to be formatted in the yyyy-MM-dd format.
   * @return The formatted date.
   */
  public static String formatDueDate(LocalDate futureDate) {
    if (Objects.isNull(futureDate)) {
      return null;
    }

    // Format should be: yyyy-MM-dd
    Period period = Period.between(LocalDate.now(), futureDate);
    if (period.getYears() > 1) {
      return String.format("%d years left", period.getYears());
    } else if (period.getYears() > 0) {
      return String.format("%d year left", period.getYears());
    } else if (period.getMonths() > 1) {
      return String.format("%d months left", period.getMonths());
    } else if (period.getMonths() > 0) {
      return String.format("%d month left", period.getMonths());
    } else if (period.getDays() > 1) {
      return String.format("%d days left", period.getDays());
    } else if (period.getDays() > 0) {
      return String.format("%d day left", period.getDays());
    } else if (period.getDays() == 0) {
      return String.format("0 days left", period.getDays());
    }
    return "Due date";
  }
}
