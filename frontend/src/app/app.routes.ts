import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Home } from './components/home/home';
import { Pets } from './components/pets/pets';
import { Pessoas } from './components/pessoas/pessoas';
import { Login } from './components/login/login'; // Importe seu componente de login
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth-guard'; // Seu guard

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'pets', component: Pets },
      { path: 'pessoas', component: Pessoas },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
