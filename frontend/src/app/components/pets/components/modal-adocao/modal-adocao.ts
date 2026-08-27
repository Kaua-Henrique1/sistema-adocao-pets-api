import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PetResponse, AdotanteResponse } from '../../../../models/domain.model';
import { AdotanteService } from '../../../../services/adotante';

@Component({
  selector: 'app-modal-adocao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-adocao.html',
})
export class ModalAdocao implements OnInit {
  private adotanteService = inject(AdotanteService);
  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) pet!: PetResponse;
  @Output() confirmar = new EventEmitter<{ petId: number; adotanteId: number }>();
  @Output() fechar = new EventEmitter<void>();

  buscaId: number | string = '';
  adotantesEncontrados: AdotanteResponse[] = [];
  todosAdotantesCache: AdotanteResponse[] = []; // Guarda a lista completa se não houver paginação no backend
  isPaginacaoLocal = false; // Flag para saber se fatiamos no front ou back

  adotanteSelecionado: AdotanteResponse | null = null;
  carregandoAdotantes = false;
  mensagemErro = '';

  paginaAtual = 0;
  totalPaginas = 1;
  totalElementos = 0;
  readonly itensPorPagina = 10;

  ngOnInit(): void {
    this.listarTodos(0);
  }

  listarTodos(pagina: number = 0): void {
    this.buscaId = '';
    this.paginaAtual = pagina;
    this.mensagemErro = '';

    // Se já carregamos a lista completa (API não paginada), apenas muda a página localmente
    if (this.isPaginacaoLocal && this.todosAdotantesCache.length > 0) {
      this.aplicarPaginacaoLocal();
      return;
    }

    this.carregandoAdotantes = true;

    const chamadaServico =
      typeof (this.adotanteService as any).listarPaginado === 'function'
        ? (this.adotanteService as any).listarPaginado('', pagina, this.itensPorPagina)
        : typeof (this.adotanteService as any).listar === 'function'
          ? (this.adotanteService as any).listar('', pagina, this.itensPorPagina)
          : (this.adotanteService as any).obterTodos();

    chamadaServico
      .pipe(
        finalize(() => {
          this.carregandoAdotantes = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (resposta: any) => {
          if (Array.isArray(resposta)) {
            // Backend retornou array completo: ativa paginação no frontend
            this.isPaginacaoLocal = true;
            this.todosAdotantesCache = resposta;
            this.totalElementos = resposta.length;
            this.totalPaginas = Math.ceil(resposta.length / this.itensPorPagina) || 1;
            this.aplicarPaginacaoLocal();
          } else if (resposta?.content && Array.isArray(resposta.content)) {
            // Backend retornou objeto paginado: usa direto do servidor
            this.isPaginacaoLocal = false;
            this.adotantesEncontrados = resposta.content;
            this.totalPaginas = resposta.totalPages ?? 1;
            this.totalElementos = resposta.totalElements ?? resposta.content.length;
          } else {
            this.adotantesEncontrados = [];
            this.totalPaginas = 1;
            this.totalElementos = 0;
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.adotantesEncontrados = [];
          this.mensagemErro = 'Não foi possível carregar a lista de tutores.';
          this.cdr.markForCheck();
        },
      });
  }

  private aplicarPaginacaoLocal(): void {
    const inicio = this.paginaAtual * this.itensPorPagina;
    this.adotantesEncontrados = this.todosAdotantesCache.slice(
      inicio,
      inicio + this.itensPorPagina,
    );
    this.cdr.markForCheck();
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 0 && novaPagina < this.totalPaginas) {
      this.listarTodos(novaPagina);
    }
  }

  buscarPorId(valorDigitado?: string | number): void {
    const valorFinal =
      valorDigitado !== undefined && valorDigitado !== '' ? valorDigitado : this.buscaId;

    if (!valorFinal) {
      this.isPaginacaoLocal = false; // Reseta cache
      this.listarTodos(0);
      return;
    }

    const id = Number(valorFinal);
    if (isNaN(id) || id <= 0) {
      this.mensagemErro = 'Informe um ID válido para pesquisar.';
      return;
    }

    this.carregandoAdotantes = true;
    this.mensagemErro = '';

    const chamadaServico =
      typeof (this.adotanteService as any).buscarPorId === 'function'
        ? (this.adotanteService as any).buscarPorId(id)
        : typeof (this.adotanteService as any).obterPorId === 'function'
          ? (this.adotanteService as any).obterPorId(id)
          : (this.adotanteService as any).listar(id.toString());

    chamadaServico
      .pipe(
        finalize(() => {
          this.carregandoAdotantes = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (resposta: any) => {
          if (!resposta) {
            this.adotantesEncontrados = [];
            this.totalPaginas = 1;
          } else {
            const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : [resposta]);
            this.adotantesEncontrados = [...lista];
            this.totalPaginas = 1;
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.adotantesEncontrados = [];
          this.mensagemErro = `Nenhum tutor/adotante encontrado com o ID ${id}.`;
          this.cdr.markForCheck();
        },
      });
  }

  selecionarAdotante(adotante: AdotanteResponse): void {
    this.adotanteSelecionado = adotante;
    this.mensagemErro = '';
    this.cdr.markForCheck();
  }

  onConfirmar(): void {
    if (!this.adotanteSelecionado) {
      this.mensagemErro = 'Selecione um tutor na lista para continuar.';
      return;
    }
    this.confirmar.emit({ petId: this.pet.id, adotanteId: this.adotanteSelecionado.id });
  }

  onFechar(): void {
    this.fechar.emit();
  }
}
