import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-filtros.html',
})
export class PetFiltros {
  @Input() exibindoAdotados = false;

  @Output() carregarDisponiveis = new EventEmitter<void>();
  @Output() carregarAdotados = new EventEmitter<void>();
  @Output() buscarCidade = new EventEmitter<string>();
  @Output() buscarId = new EventEmitter<number | null>();
  @Output() limparFiltros = new EventEmitter<void>();

  termoCidade = '';
  termoId: number | null = null;

  buscarPorCidade(): void {
    this.buscarCidade.emit(this.termoCidade);
  }

  buscarPorId(): void {
    this.buscarId.emit(this.termoId);
  }

  onLimpar(): void {
    this.termoCidade = '';
    this.termoId = null;
    this.limparFiltros.emit();
  }
}
