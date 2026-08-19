import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet';
import { PetResponse } from '../../models/domain.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pets.html',
  styleUrls: ['./pets.css'],
})
export class Pets implements OnInit {
  private petService = inject(PetService);
  private cdr = inject(ChangeDetectorRef);

  pets: PetResponse[] = [];
  carregando = false;
  mensagemErro = '';

  termoCidade = '';
  termoId: number | null = null;

  // Paginação
  paginaAtual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  ngOnInit(): void {
    this.carregarDisponiveis();
  }

  carregarDisponiveis(pagina: number = 0): void {
    this.paginaAtual = pagina;
    this.carregando = true;
    this.mensagemErro = '';

    this.petService.listarDisponiveis(this.paginaAtual, 10).subscribe({
      next: (resposta: any) => {
        // Extrai a array do atributo 'content' da paginação
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];

        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar disponíveis:', err);
        this.mensagemErro = 'Erro ao carregar pets disponíveis.';
        this.pets = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscarPorCidade(pagina: number = 0): void {
    if (!this.termoCidade.trim()) {
      this.carregarDisponiveis();
      return;
    }

    this.paginaAtual = pagina;
    this.carregando = true;
    this.mensagemErro = '';

    this.petService.listarPorCidade(this.termoCidade, this.paginaAtual, 10).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];

        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar por cidade:', err);
        this.mensagemErro = `Erro ao buscar pets na cidade: ${this.termoCidade}.`;
        this.pets = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscarPorId(): void {
    if (!this.termoId) {
      this.carregarDisponiveis();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.petService.buscarPorId(this.termoId).subscribe({
      next: (dado) => {
        this.pets = dado ? [dado] : [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Pet não encontrado:', err);
        this.mensagemErro = `Pet com ID #${this.termoId} não encontrado.`;
        this.pets = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
