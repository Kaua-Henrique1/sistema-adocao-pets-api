import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
})
export class Layout {
  private router = inject(Router);

  fazerLogout(): void {
    if (confirm('Deseja realmente sair do sistema?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}
