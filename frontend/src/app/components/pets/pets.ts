import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet';
import { AdotanteService } from '../../services/adotante';
import { PetResponse, PetRequest, AdotanteResponse } from '../../models/domain.model';

import { PetFiltros } from './components/pet-filtros/pet-filtros';
import { PetTabela } from './components/pet-tabela/pet-tabela';
import { ModalDetalhes } from './components/modal-detalhes/modal-detalhes';
import { ModalEdicaoCadastro } from './components/modal-edicao-cadastro/modal-edicao-cadastro';

import { ModalAdocao } from './components/modal-adocao/modal-adocao';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PetFiltros,
    PetTabela,
    ModalDetalhes,
    ModalEdicaoCadastro,
    ModalAdocao,
  ],
  templateUrl: './pets.html',
  styleUrls: ['./pets.css'],
})
export class Pets implements OnInit {
  private petService = inject(PetService);
  private adotanteService = inject(AdotanteService);
  private cdr = inject(ChangeDetectorRef);

  // --- ESTADO GLOBAL DA PÁGINA ---
  pets: PetResponse[] = [];
  carregando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  // --- FILTROS E PAGINAÇÃO ---
  termoCidade = '';
  termoId: number | null = null;
  exibindoAdotados = false;
  paginaAtual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  // --- VISIBILIDADE DOS MODAIS ---
  exibirModalEdicaoCadastro = false;
  exibirModalAdocao = false;
  exibirModalDetalhes = false;

  // --- ENTIDADES SELECIONADAS ---
  petSelecionadoEdicao: PetResponse | null = null;
  petSelecionadoAdocao: PetResponse | null = null;
  petSelecionadoDetalhes: PetResponse | null = null;
  tutorDetalhes: AdotanteResponse | null = null;

  ngOnInit(): void {
    this.carregarDisponiveis();
  }

  // --- MÉTODOS DE REFRESH / ATUALIZAÇÃO DA LISTA ---
  atualizarLista(): void {
    if (this.termoId) {
      this.buscarPorId(this.termoId);
    } else if (this.termoCidade) {
      this.buscarPorCidade(this.termoCidade, this.paginaAtual);
    } else if (this.exibindoAdotados) {
      this.carregarAdotados(this.paginaAtual);
    } else {
      this.carregarDisponiveis(this.paginaAtual);
    }
  }

  // --- CONSULTAS E API ---
  carregarDisponiveis(pagina: number = 0): void {
    this.termoCidade = '';
    this.termoId = null;
    this.paginaAtual = pagina;
    this.exibindoAdotados = false;
    this.executarConsulta(() => this.petService.listarDisponiveis(this.paginaAtual, 10));
  }

  carregarAdotados(pagina: number = 0): void {
    this.termoCidade = '';
    this.termoId = null;
    this.paginaAtual = pagina;
    this.exibindoAdotados = true;
    this.executarConsulta(() => this.petService.listarAdotados(this.paginaAtual, 10));
  }

  buscarPorCidade(cidade: string, pagina: number = 0): void {
    this.termoCidade = cidade.trim();
    this.termoId = null;

    if (!this.termoCidade) {
      this.exibindoAdotados ? this.carregarAdotados() : this.carregarDisponiveis();
      return;
    }

    this.paginaAtual = pagina;
    this.executarConsulta(() =>
      this.petService.listarPorCidade(encodeURIComponent(this.termoCidade), this.paginaAtual, 10),
    );
  }

  buscarPorId(id: number | null): void {
    this.termoId = id;
    this.termoCidade = '';

    if (!id) {
      this.exibindoAdotados ? this.carregarAdotados() : this.carregarDisponiveis();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.cdr.markForCheck();

    this.petService
      .buscarPorId(id)
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (dado) => (this.pets = dado ? [dado] : []),
        error: () => {
          this.mensagemErro = `Pet com ID #${id} não encontrado.`;
          this.pets = [];
        },
      });
  }

  private executarConsulta(requestFn: () => any): void {
    this.carregando = true;
    this.mensagemErro = '';
    this.cdr.markForCheck();

    requestFn()
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (resposta: any) => {
          const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
          this.pets = [...lista];
          this.totalPaginas = resposta?.totalPages ?? 0;
          this.totalElementos = resposta?.totalElements ?? 0;
        },
        error: () => {
          this.mensagemErro = 'Erro ao carregar lista de pets.';
          this.pets = [];
        },
      });
  }

  // --- AÇÕES DE MODAIS E CRUD ---
  abrirModalNovoPet(): void {
    this.petSelecionadoEdicao = null;
    this.exibirModalEdicaoCadastro = true;
  }

  abrirModalEditarPet(pet: PetResponse): void {
    this.petSelecionadoEdicao = pet;
    this.exibirModalEdicaoCadastro = true;
  }

  fecharModalEdicaoCadastro(): void {
    this.exibirModalEdicaoCadastro = false;
    this.petSelecionadoEdicao = null;
  }

  salvarPet(payload: PetRequest): void {
    this.mensagemErro = '';
    this.cdr.detectChanges();

    const acao$ = this.petSelecionadoEdicao
      ? this.petService.atualizar(this.petSelecionadoEdicao.id, payload)
      : this.petService.cadastrar(payload);

    acao$.subscribe({
      next: () => {
        this.fecharModalEdicaoCadastro();
        this.carregarDisponiveis();
      },
      error: (err) => {
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.mensagemErro = err.error.errors
            .map((e: any) => e.defaultMessage || e.message)
            .join(' | ');
        }
        else if (err.error?.message) {
          this.mensagemErro = err.error.message;
        }
        else {
          this.mensagemErro = 'Ocorreu um erro ao salvar as informações.';
        }
      },
    });
  }

  abrirModalDetalhes(pet: PetResponse): void {
    this.petSelecionadoDetalhes = pet;
    this.tutorDetalhes = null;
    this.exibirModalDetalhes = true;

    if (pet.tutorId) {
      this.adotanteService.buscarPorId(pet.tutorId).subscribe({
        next: (adotante) => {
          this.tutorDetalhes = adotante;
          this.cdr.markForCheck();
        },
      });
    }
  }

  adotarPet(event: { petId: number; adotanteId: number }): void {
    this.petService.adotar(event.petId, event.adotanteId).subscribe({
      next: () => {
        this.exibirSucesso('Adoção realizada com sucesso!');
        this.exibirModalAdocao = false;
        this.petSelecionadoAdocao = null;
        this.atualizarLista();
      },
      error: (err) => this.tratarErro(err, 'Erro ao processar adoção.'),
    });
  }

  deletarPet(pet: PetResponse): void {
    if (confirm(`Deseja realmente remover o pet "${pet.nome}" (#${pet.id})?`)) {
      this.petService.deletar(pet.id).subscribe({
        next: () => {
          this.exibirSucesso('Pet removido com sucesso!');
          this.atualizarLista();
        },
        error: () => this.tratarErro(null, 'Erro ao deletar o pet.'),
      });
    }
  }

  // --- UTILS ---
  private exibirSucesso(msg: string): void {
    this.mensagemSucesso = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.mensagemSucesso = '';
      this.cdr.markForCheck();
    }, 4000);
  }

  private tratarErro(err: any, msgPadrao: string): void {
    if (Array.isArray(err?.error) && err.error.length > 0) {
      this.mensagemErro = `Erro em ${err.error[0].campo}: ${err.error[0].mensagem}`;
    } else {
      this.mensagemErro = msgPadrao;
    }
    this.cdr.markForCheck();
  }
}
