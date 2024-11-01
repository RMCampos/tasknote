const server = import.meta.env.VITE_BACKEND_SERVER;

const ApiConfig = {

  signInUrl: `${server}/auth/sign-in`,

  registerUrl: `${server}/auth/sign-up`,

  refreshTokenUrl: `${server}/rest/user-sessions/refresh`,

  csrfTokenUrl: `${server}/rest/user-sessions/csrf`,

  tasksUrl: `${server}/rest/tasks`,

  homeUrl: `${server}/rest/home`,

  notesUrl: `${server}/rest/notes`

};

export default ApiConfig;
