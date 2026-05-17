package br.com.tasknoteapp.server.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class SecurityUtilTest {

  @Test
  void redactEmailWithNullTest() {
    String result = SecurityUtil.redactEmail(null);

    Assertions.assertNull(result);
  }

  @Test
  void redactEmailWithBlankTest() {
    String result = SecurityUtil.redactEmail("");

    Assertions.assertEquals("", result);
  }

  @Test
  void redactEmailWithWhitespaceTest() {
    String result = SecurityUtil.redactEmail("   ");

    Assertions.assertEquals("   ", result);
  }

  @Test
  void redactEmailWithStandardEmailTest() {
    String result = SecurityUtil.redactEmail("john.doe@example.com");

    Assertions.assertEquals("john...@example.com", result);
  }

  @Test
  void redactEmailWithShortEmailTest() {
    String result = SecurityUtil.redactEmail("ab@cd.com");

    Assertions.assertEquals("a...@cd.com", result);
  }

  @Test
  void redactEmailWithSingleCharacterBeforeAtTest() {
    String result = SecurityUtil.redactEmail("a@example.com");

    Assertions.assertEquals("...@example.com", result);
  }

  @Test
  void redactEmailWithLongLocalPartTest() {
    String result = SecurityUtil.redactEmail("verylongemailaddress@example.com");

    Assertions.assertEquals("verylongem...@example.com", result);
  }

  @Test
  void redactEmailWithNumbersAndSymbolsTest() {
    String result = SecurityUtil.redactEmail("user.name+tag123@example.co.uk");

    Assertions.assertEquals("user.nam...@example.co.uk", result);
  }

  @Test
  void redactEmailWithMultipleDotsTest() {
    String result = SecurityUtil.redactEmail("first.middle.last@example.com");

    Assertions.assertEquals("first.mi...@example.com", result);
  }

  @Test
  void redactEmailWithUppercaseTest() {
    String result = SecurityUtil.redactEmail("John.Doe@Example.COM");

    Assertions.assertEquals("John...@Example.COM", result);
  }
}

