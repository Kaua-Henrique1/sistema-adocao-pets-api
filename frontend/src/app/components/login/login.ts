import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;
  isLoading = false;
  mostrarSenha = false;

  loginForm: FormGroup = this.fb.group({
    login: ['', [Validators.required]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  alternarMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403 || err.status === 400) {
          this.errorMessage = 'Login ou senha incorretos.';
        } else {
          this.errorMessage = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
        }
      },
    });
  }
}
