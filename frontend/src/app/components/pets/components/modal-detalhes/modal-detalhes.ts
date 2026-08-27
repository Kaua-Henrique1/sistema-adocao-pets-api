import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetResponse, AdotanteResponse } from '../../../../models/domain.model';

@Component({
  selector: 'app-modal-detalhes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalhes.html',
})
export class ModalDetalhes {
  @Input() pet: PetResponse | null = null;
  @Input() tutor: AdotanteResponse | null = null;
  @Input() exibindoAdotados: boolean = false;
  @Input() erroTutor: boolean = false;

  @Output() fechar = new EventEmitter<void>();

  onFechar(): void {
    this.fechar.emit();
  }
}
