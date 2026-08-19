import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  private router = inject(Router);

  stats = {
    totalPets: 12,
    totalAdotantes: 8,
    adocoesMes: 3,
  };

  ngOnInit(): void {
    // Carregar estatísticas do backend se necessário
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }
}
