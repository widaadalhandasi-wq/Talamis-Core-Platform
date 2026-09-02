import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@app/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('@app/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
