import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    login: '',
    senha: ''
  };

  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Usuário ou senha inválidos!';
      }
    });
  }
}