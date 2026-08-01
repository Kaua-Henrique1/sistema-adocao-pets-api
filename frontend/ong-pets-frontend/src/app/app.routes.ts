import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Pets } from './components/pets/pets';
import { Pessoas } from './components/pessoas/pessoas';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'home', component: Home },
  { path: 'pets', component: Pets },
  { path: 'pessoas', component: Pessoas },
  { path: '**', redirectTo: 'Login' } 
];