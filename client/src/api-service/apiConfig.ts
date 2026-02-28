import { env } from '../env';

const server = env.VITE_BACKEND_SERVER;

const ApiConfig = {

  signInUrl: `${server}/auth/sign-in`,

  registerUrl: `${server}/auth/sign-up`,

  confirmUrl: `${server}/auth/email-confirmation`,

  resetPwdUrl: `${server}/auth/password-reset`,

  completeResetPwdUrl: `${server}/auth/complete-password-reset`,

  resendConfirmUrl: `${server}/auth/resend-email-confirmation`,

  refreshTokenUrl: `${server}/rest/user-sessions/refresh`,

  deleteAccountUrl: `${server}/rest/user-sessions/delete-account`,

  tasksUrl: `${server}/rest/tasks`,

  homeUrl: `${server}/rest/home`,

  notesUrl: `${server}/rest/notes`,

  publicNotesUrl: `${server}/public/notes`,

  userUrl: `${server}/rest/users`
};

export default ApiConfig;
