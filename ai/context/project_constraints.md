# Project constraints

## Backend

Always:

- Use the `SERIAL` type for `id` columns when creating migration SQL files;
- Define a table PRIMARY KEY in the end of the table columns using the table name plus `_pk` and the needed columns;
- Import needed packages one by one;
- Create JavaDoc for public classes and methods;
- Run `./mvnw -Ptests test` to check possible check style issues or failing tests;
- Fix existing test cases, if needed;
- Update docker-compose.yml and github workflow files if a new variable or application.yml has changed;

Never:
- Use `ON DELETE CASCADE` in SQL scripts or migration files;
- Use star to import packages;

## Frontend

Always:

- Type variables according with their data type;
- Create helper functions in the helper directory;
- Update Dockerfile, docker-compose.yml and github workflow files if a new environment variable was added;

Never:

- Use the `any` type;
- Add new dependencies for small helpers or util functions, prefer implementing them;

