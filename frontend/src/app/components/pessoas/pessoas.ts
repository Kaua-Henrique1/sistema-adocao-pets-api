import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdotanteService } from '../../services/adotante';
import { AdotanteRequest, AdotanteResponse } from '../../models/domain.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './pessoas.html',
  styleUrls: ['./pessoas.css'],
})
export class Pessoas implements OnInit {
  private fb = inject(FormBuilder);
  private adotanteService = inject(AdotanteService);
  private cdr = inject(ChangeDetectorRef); // <-- Injeção do ChangeDetectorRef

  adotantes: AdotanteResponse[] = [];
  exibirFormulario = false;
  mensagemSucesso = '';
  mensagemErro = '';
  carregando = false;

  idEmEdicao: number | null = null;
  termoId: number | null = null;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    endereco: this.fb.group({
      logradouro: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\s.,'-]+$/)]],
      numero: ['', [Validators.required, Validators.pattern(/^(S\/N|\d+[A-Za-z]?)$/i)]],
      cidade: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
    }),
  });

  ngOnInit(): void {
    this.carregarAdotantes();
  }

  paginaAtual: number = 0;
  tamanhoPagina: number = 10;
  totalPaginas: number = 0;
  totalElementos: number = 0;

  carregarAdotantes(pagina: number = 0): void {
    this.paginaAtual = pagina;
    this.carregando = true;
    this.mensagemErro = '';

    this.adotanteService.listarTodos(this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (resposta: any) => {
        // Guarda os dados da lista
        this.adotantes = [...(resposta?.content ?? [])];

        // Guarda as informações de paginação vindas do Spring Data Page
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar adotantes:', erro);
        this.adotantes = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.carregarAdotantes(this.paginaAtual + 1);
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.carregarAdotantes(this.paginaAtual - 1);
    }
  }

  irParaPagina(pagina: number): void {
    this.carregarAdotantes(pagina);
  }

  buscarPorId(): void {
    if (!this.termoId) {
      this.carregarAdotantes();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.adotanteService.buscarPorId(this.termoId).subscribe({
      next: (dado) => {
        this.adotantes = dado ? [dado] : [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Adotante não encontrado:', err);
        this.mensagemErro = `Adotante com ID #${this.termoId} não encontrado.`;
        this.adotantes = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  novoAdotante(): void {
    this.idEmEdicao = null;
    this.form.reset();
    this.exibirFormulario = true;
  }

  editar(adotante: AdotanteResponse): void {
    this.idEmEdicao = adotante.id;
    this.exibirFormulario = true;

    this.form.patchValue({
      nome: adotante.nome,
      cpf: adotante.cpf,
      telefone: adotante.telefone,
      email: adotante.email,
      endereco: {
        logradouro: adotante.endereco?.logradouro || '',
        numero: adotante.endereco?.numero || '',
        cidade: adotante.endereco?.cidade || '',
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as AdotanteRequest;

    if (this.idEmEdicao) {
      this.adotanteService.atualizar(this.idEmEdicao, payload).subscribe({
        next: () => {
          this.mensagemSucesso = 'Adotante atualizado com sucesso!';
          this.finalizarAcao();
        },
        error: () => (this.mensagemErro = 'Erro ao atualizar adotante.'),
      });
    } else {
      this.adotanteService.cadastrar(payload).subscribe({
        next: () => {
          this.mensagemSucesso = 'Adotante cadastrado com sucesso!';
          this.finalizarAcao();
        },
        error: () => (this.mensagemErro = 'Erro ao cadastrar adotante.'),
      });
    }
  }

  deletar(id: number): void {
    if (confirm('Deseja realmente remover este adotante?')) {
      this.adotanteService.deletar(id).subscribe({
        next: () => this.carregarAdotantes(),
        error: (err) => console.error('Erro ao deletar:', err),
      });
    }
  }

  private finalizarAcao(): void {
    this.form.reset();
    this.exibirFormulario = false;
    this.idEmEdicao = null;
    this.carregarAdotantes();
    setTimeout(() => (this.mensagemSucesso = ''), 4000);
  }
}
