package br.com.tasknoteapp.server.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class TokenUtilTest {

  @Test
  void generateTokenTest() {
    String token = new TokenUtil().generateToken();

    Assertions.assertNotNull(token);
    Assertions.assertTrue(token.length() >= 32);
  }
}
