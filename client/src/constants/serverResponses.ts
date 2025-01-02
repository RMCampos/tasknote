export const serverResponses: Record<string, string> = {
  'Bad password: Password must have at least at least 8 characters, 1 uppercase, 1 special character': 'BAD_PASSWORD_3',
  'Bad password: Password must have at least 1 uppercase, 1 special character': 'BAD_PASSWORD_2',
  'Bad password: Password must have at least 1 special character': 'BAD_PASSWORD_1',
  'Email already exists!': 'EMAIL_EXISTS',
  'Forbidden! Access denied!': 'FORBIDDEN',
  'Internal Server Error!': 'INTERNAL_ERROR',
  'Max login attempt limit reached. Please wait 30 minutes': 'MAX_LOGIN_ATTEMPT',
  'Please fill in all the fields': 'FILL_ALL_FIELDS',
  'Please fill in your username and password!': 'FILL_USER_AND_PASS',
  'Please type at least 3 characters': 'FILL_AT_LEAST_3',
  'The maximum text length is 2000': 'MAX_TEXT_LENGTH_2000',
  'Unknown error': 'UNKNOWN',
  'Wrong or missing information!': 'WRONG_OR_MISSING_INFO',
  'Invalid credentials': 'INVALID_CREDENTIALS'
};
