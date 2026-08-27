import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetResponse } from '../../../../models/domain.model';

@Component({
  selector: 'app-pet-tabela',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-tabela.html',
})
export class PetTabela {
  @Input() pets: PetResponse[] = [];
  @Input() carregando = false;
  @Input() exibindoAdotados = false;
  @Input() paginaAtual = 0;
  @Input() totalPaginas = 0;

  @Output() verDetalhes = new EventEmitter<PetResponse>();
  @Output() adotar = new EventEmitter<PetResponse>();
  @Output() editar = new EventEmitter<PetResponse>();
  @Output() remover = new EventEmitter<PetResponse>();
  @Output() mudarPagina = new EventEmitter<number>();
}
