import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Pets } from './components/pets/pets';
import { Pessoas } from './components/pessoas/pessoas';
import { authGuard } from './guards/auth-guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'pets', component: Pets, canActivate: [authGuard] },
  { path: 'pessoas', component: Pessoas, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];
