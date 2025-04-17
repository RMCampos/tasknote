package br.com.tasknoteapp.server.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class TimeAgoUtilTest {

  @Test
  void formatTest() {
    Assertions.assertEquals("1 hour ago", TimeAgoUtil.format(LocalDateTime.now().minusHours(1L)));
    Assertions.assertEquals("2 hours ago", TimeAgoUtil.format(LocalDateTime.now().minusHours(2L)));
    Assertions.assertEquals("1 day ago", TimeAgoUtil.format(LocalDateTime.now().minusDays(1L)));
    Assertions.assertEquals("2 days ago", TimeAgoUtil.format(LocalDateTime.now().minusDays(2L)));
    Assertions.assertEquals("1 month ago", TimeAgoUtil.format(LocalDateTime.now().minusMonths(1L)));
    Assertions.assertEquals(
        "2 months ago", TimeAgoUtil.format(LocalDateTime.now().minusMonths(2L)));
  }

  @Test
  void formatDueDateTest() {
    Assertions.assertNull(TimeAgoUtil.formatDueDate(null));
    Assertions.assertEquals("1 day left", TimeAgoUtil.formatDueDate(LocalDate.now().plusDays(1L)));
    Assertions.assertEquals(
        "12 days left", TimeAgoUtil.formatDueDate(LocalDate.now().plusDays(12L)));
  }
}
