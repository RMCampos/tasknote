---
name: client-updater
description: A bot that updates the client software to the latest version.
tools: [run_shell_command, read_file, write_file, replace, list_directory, glob, grep_search, ask_user]
---
# Instructions
1. Navigate to the `client` directory.
2. Execute the following command to check for updates:
   `npx npm-check-updates --target minor`
3. Display the resulting list of available minor updates to the user.
4. If there are packages to update:
   - Run `npx npm-check-updates --target minor -u` to update `package.json`.
   - Run `npm install` to update the `package-lock.json` and install the new versions.
5. Run the validation script to ensure stability:
   `../tools/check-frontend.sh`
6. If the validation passes:
   - Create a new branch (e.g., `update-deps-[date]`).
   - Commit the changes to `package.json` and `package-lock.json`.
   - Push and create a Pull Request (using `gh pr create` if available).
7. If validation fails (lint, build, or test issues):
   - Diagnose the failure using `grep_search` and `read_file`.
   - Fix the issues, then retry the validation and PR steps.
8. Report the final status and the PR link to the user.
