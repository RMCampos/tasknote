import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  /*
   * Not signed routes
   */
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/landing/landing.component').then(c => c.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'email-confirmation',
    loadComponent: () => import('./components/email-confirmation/email-confirmation.component').then(c => c.EmailConfirmationComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/password-reset/password-reset.component').then(c => c.PasswordResetComponent)
  },
  {
    path: 'finish-password-reset',
    loadComponent: () => import('./components/finish-password-reset/finish-password-reset.component').then(c => c.FinishPasswordResetComponent)
  },

  /*
   * Signed routes
   */
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/tasks/tasks.component').then(c => c.TasksComponent),
    canActivate: [authGuard]
  },
  { path: 'tasks-management/new',
    loadComponent: () => import('./components/tasks-management/tasks-management.component').then(c => c.TasksManagementComponent),
    canActivate: [authGuard]
  },
  { path: 'tasks-management/edit/:id',
    loadComponent: () => import('./components/tasks-management/tasks-management.component').then(c => c.TasksManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notes',
    loadComponent: () => import('./components/notes/notes.component').then(c => c.NotesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notes-management/new',
    loadComponent: () => import('./components/notes-management/notes-management.component').then(c => c.NotesManagementComponent),
    canActivate: [authGuard]
  },
  { path: 'notes-management/edit/:id',
    loadComponent: () => import('./components/notes-management/notes-management.component').then(c => c.NotesManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./components/account/account.component').then(c => c.AccountComponent),
    canActivate: [authGuard]
  },
  
  { path: '**', redirectTo: 'login' }
];
