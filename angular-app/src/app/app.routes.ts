import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'character',
        loadComponent: () => import('./components/character/character.component').then(m => m.CharacterComponent)
      },
      {
        path: 'missions',
        loadComponent: () => import('./components/missions/missions.component').then(m => m.MissionsComponent)
      },
      {
        path: 'games',
        loadComponent: () => import('./components/games/games.component').then(m => m.GamesComponent)
      },
      {
        path: 'rewards',
        loadComponent: () => import('./components/rewards/rewards.component').then(m => m.RewardsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];