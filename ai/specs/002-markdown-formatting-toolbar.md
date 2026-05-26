# Spec 002: Markdown Formatting Toolbar for Notes

## Goal
Enhance the Note editing experience by adding a Markdown formatting toolbar to the note creation and editing interface. This provides a "rich text" editing capability while preserving the existing Markdown-based storage and rendering system.

## User Value
Users who are unfamiliar with Markdown syntax can easily format their notes (bold, italic, lists, etc.) using familiar UI controls. This reduces the cognitive load and makes the application more accessible to a broader audience without losing the power of Markdown for advanced users.

## Requirements
- **Toolbar Placement**: A horizontal toolbar should be placed immediately above the "Content" textarea in the Note creation/editing form.
- **Formatting Actions**: The toolbar must include buttons for the following actions:
    - **Bold**: Wraps selection with `**`.
    - **Italic**: Wraps selection with `_`.
    - **Heading**: Prepends `### ` to the current line or selection.
    - **Bullet List**: Prepends `- ` to the current line or selection.
    - **Link**: Inserts a Markdown link template `[text](url)`.
- **Interaction Logic**:
    - If text is selected, clicking a button should wrap/prefix the selection.
    - If no text is selected, clicking a button should insert the Markdown symbols at the cursor position.
    - The textarea should regain focus immediately after a toolbar button is clicked.
- **Styling**: The toolbar should use standard Bootstrap components (e.g., `ButtonGroup`) and icons (e.g., `react-bootstrap-icons`) to match the existing project aesthetic.

## Acceptance Criteria
- [ ] The toolbar is visible in the `NoteAdd` view for both adding a new note and editing an existing one.
- [ ] Clicking the **Bold** button wraps the selected text in the textarea with `**`.
- [ ] Clicking the **Italic** button wraps the selected text with `_`.
- [ ] Clicking the **Heading** button adds `### ` at the cursor or selection start.
- [ ] Clicking the **Bullet List** button adds `- ` at the start of the line.
- [ ] Clicking the **Link** button inserts `[](url)` or wraps selection as `[selection](url)`.
- [ ] The note can be saved successfully with the newly formatted content.
- [ ] The "Preview Markdown" modal correctly renders the formatted content.

## Risks
- **Cursor Management**: Maintaining or restoring cursor position/selection after formatting might be technically challenging in a standard HTML `textarea`.
- **Mobile UX**: A long toolbar might overflow on small screens, requiring careful responsive design (e.g., horizontal scrolling or wrapping).
- **Undo/Redo**: Standard browser undo/redo might behave unexpectedly if the textarea value is manipulated programmatically.
