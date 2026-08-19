import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PetService } from '../../services/pet';
import { AdotanteService } from '../../services/adotante';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  private petService = inject(PetService);
  private adotanteService = inject(AdotanteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  stats = {
    totalPets: 0,
    totalAdotantes: 0,
    adocoesMes: 0,
  };

  carregando = false;

  ngOnInit(): void {
    this.carregarMetricas();
  }

  carregarMetricas(): void {
    this.carregando = true;

    forkJoin({
      pets: this.petService.listarDisponiveis(0, 1),
      adotantes: this.adotanteService.listarTodos(0, 1),
    }).subscribe({
      next: ({ pets, adotantes }: any) => {
        this.stats.totalPets = pets?.totalElements ?? 0;
        this.stats.totalAdotantes = adotantes?.totalElements ?? 0;
        this.stats.adocoesMes = 0;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar métricas da Dashboard:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }
}
