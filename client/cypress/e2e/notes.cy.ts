/**
 * E2E tests for Notes Management: Create, Update, Delete, and Share notes.
 */

const mockUser = {
  userId: 1,
  name: 'Test User',
  email: 'test@example.com',
  admin: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  gravatarImageUrl: '',
  lang: 'en'
};

const mockNote = {
  id: 1,
  title: 'Meeting notes',
  description: 'Discuss quarterly goals',
  url: null,
  tag: 'work',
  lastUpdate: '2026-05-01',
  shared: false,
  shareToken: null
};

describe('Notes Management', () => {
  /**
   * Sets up authentication intercepts and visits the given path.
   *
   * @param {string} path - The path to visit.
   */
  const visitWithAuth = (path: string): void => {
    cy.intercept('GET', /\/rest\/user-sessions\/refresh/, {
      statusCode: 200,
      body: { token: 'fake-jwt-token', ...mockUser }
    }).as('refreshToken');

    cy.intercept('GET', /\/rest\/home\/tasks\/tags/, {
      statusCode: 200,
      body: ['work', 'personal']
    }).as('getTags');

    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem('TASKNOTE-TOKEN', 'fake-jwt-token');
        win.localStorage.setItem('TASKNOTE-USER', JSON.stringify(mockUser));
      }
    });
  };

  /**
   * Create note
   */
  describe('Create', () => {
    beforeEach(() => {
      visitWithAuth('/notes/new');
    });

    it('displays the add note form', () => {
      cy.contains('Add Note').should('be.visible');
      cy.get('input[name="note_title"]').should('be.visible');
      cy.get('textarea[name="note_description"]').should('be.visible');
      cy.contains('button', 'Save note').should('be.visible');
    });

    it('shows a validation error when submitted without a title', () => {
      cy.contains('button', 'Save note').click();

      cy.get('.alert-danger').should('be.visible');
    });

    it('shows a validation error when submitted without content', () => {
      cy.get('input[name="note_title"]').type('A note title');
      cy.contains('button', 'Save note').click();

      cy.get('.alert-danger').should('be.visible');
    });

    it('creates a note and navigates to home on success', () => {
      cy.intercept('POST', /\/rest\/notes/, {
        statusCode: 201,
        body: {
          id: 10,
          title: 'New note',
          description: 'Some content',
          url: null,
          tag: '',
          lastUpdate: '',
          shared: false,
          shareToken: null
        }
      }).as('createNote');

      cy.intercept('GET', /\/rest\/tasks$/, { statusCode: 200, body: [] }).as('getTasks');
      cy.intercept('GET', /\/rest\/notes$/, { statusCode: 200, body: [] }).as('getNotes');

      cy.get('input[name="note_title"]').type('New note');
      cy.get('textarea[name="note_description"]').type('Some content');
      cy.contains('button', 'Save note').click();

      cy.wait('@createNote');
      cy.url().should('include', '/home');
    });

    it('shows an error alert when the API returns an error on create', () => {
      cy.intercept('POST', /\/rest\/notes/, {
        statusCode: 500,
        body: { message: 'Internal Server Error' }
      }).as('createNoteFail');

      cy.get('input[name="note_title"]').type('Failing note');
      cy.get('textarea[name="note_description"]').type('Some content');
      cy.contains('button', 'Save note').click();

      cy.wait('@createNoteFail');
      cy.get('.alert-danger').should('be.visible');
    });

    it('navigates back to home when Cancel is clicked', () => {
      cy.intercept('GET', /\/rest\/tasks$/, { statusCode: 200, body: [] }).as('getTasks');
      cy.intercept('GET', /\/rest\/notes$/, { statusCode: 200, body: [] }).as('getNotes');

      cy.contains('button', 'Cancel').click();

      cy.url().should('include', '/home');
    });
  });

  /**
   * Update note
   */
  describe('Update', () => {
    beforeEach(() => {
      cy.intercept('GET', /\/rest\/notes\/\d+/, {
        statusCode: 200,
        body: mockNote
      }).as('getNote');

      visitWithAuth('/notes/edit/1');
      cy.wait('@getNote');
    });

    it('pre-fills the form with the existing note data', () => {
      cy.get('input[name="note_title"]').should('have.value', 'Meeting notes');
      cy.get('textarea[name="note_description"]').should('have.value', 'Discuss quarterly goals');
    });

    it('updates the note and navigates to home on success', () => {
      cy.intercept('PATCH', /\/rest\/notes\/\d+/, {
        statusCode: 200,
        body: { ...mockNote, title: 'Updated meeting notes' }
      }).as('updateNote');

      cy.intercept('GET', /\/rest\/tasks$/, { statusCode: 200, body: [] }).as('getTasks');
      cy.intercept('GET', /\/rest\/notes$/, { statusCode: 200, body: [] }).as('getNotes');

      cy.get('input[name="note_title"]').clear().type('Updated meeting notes');
      cy.contains('button', 'Save note').click();

      cy.wait('@updateNote');
      cy.url().should('include', '/home');
    });

    it('shows an error alert when the update API call fails', () => {
      cy.intercept('PATCH', /\/rest\/notes\/\d+/, {
        statusCode: 500,
        body: { message: 'Internal Server Error' }
      }).as('updateNoteFail');

      cy.get('input[name="note_title"]').clear().type('Updated note');
      cy.contains('button', 'Save note').click();

      cy.wait('@updateNoteFail');
      cy.get('.alert-danger').should('be.visible');
    });
  });

  /**
   * Delete note
   */
  describe('Delete', () => {
    beforeEach(() => {
      cy.intercept('GET', /\/rest\/tasks$/, {
        statusCode: 200,
        body: []
      }).as('getTasks');

      cy.intercept('GET', /\/rest\/notes$/, {
        statusCode: 200,
        body: [mockNote]
      }).as('getNotes');

      visitWithAuth('/home');
      cy.wait('@getNotes');
    });

    it('deletes a note via the note dropdown menu', () => {
      cy.intercept('DELETE', /\/rest\/notes\/\d+/, {
        statusCode: 204
      }).as('deleteNote');

      cy.get('[data-testid="note-dropdown-menu-1"]').click();
      cy.get('[data-testid="note-dropdown-delete-item-1"]').click();

      cy.wait('@deleteNote');
    });
  });

  /**
   * Share note
   */
  describe('Share', () => {
    beforeEach(() => {
      cy.intercept('GET', /\/rest\/tasks$/, {
        statusCode: 200,
        body: []
      }).as('getTasks');

      cy.intercept('GET', /\/rest\/notes$/, {
        statusCode: 200,
        body: [mockNote]
      }).as('getNotes');

      visitWithAuth('/home');
      cy.wait('@getNotes');
    });

    it('shares a note via the note dropdown menu', () => {
      cy.intercept('PUT', /\/rest\/notes\/\d+\/share/, {
        statusCode: 200,
        body: { ...mockNote, shared: true, shareToken: 'abc123' }
      }).as('shareNote');

      cy.get('[data-testid="note-dropdown-menu-1"]').click();
      cy.get('[data-testid="note-dropdown-share-item-1"]').click();

      cy.wait('@shareNote');
    });

    it('unshares a shared note via the note dropdown menu', () => {
      const sharedNote = { ...mockNote, shared: true, shareToken: 'abc123' };

      cy.intercept('GET', /\/rest\/notes$/, {
        statusCode: 200,
        body: [sharedNote]
      }).as('getSharedNotes');

      cy.intercept('PUT', /\/rest\/notes\/\d+\/unshare/, {
        statusCode: 200,
        body: { ...sharedNote, shared: false, shareToken: null }
      }).as('unshareNote');

      cy.visit('/home', {
        onBeforeLoad(win) {
          win.localStorage.setItem('TASKNOTE-TOKEN', 'fake-jwt-token');
          win.localStorage.setItem('TASKNOTE-USER', JSON.stringify(mockUser));
        }
      });

      cy.wait('@getSharedNotes');

      cy.get('[data-testid="note-dropdown-menu-1"]').click();
      cy.get('[data-testid="note-dropdown-share-item-1"]').click();

      cy.wait('@unshareNote');
    });
  });
});
