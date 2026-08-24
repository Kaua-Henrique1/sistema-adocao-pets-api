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
  private cdr = inject(ChangeDetectorRef);

  adotantes: AdotanteResponse[] = [];
  carregando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  termoId: number | null = null;
  idEmEdicao: number | null = null;
  exibirModalEdicao = false;

  paginaAtual: number = 0;
  tamanhoPagina: number = 10;
  totalPaginas: number = 0;
  totalElementos: number = 0;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
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

  carregarAdotantes(pagina: number = 0): void {
    this.paginaAtual = pagina;
    this.carregando = true;
    this.mensagemErro = '';

    this.adotanteService.listarTodosAdotantes(this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (resposta: any) => {
        this.adotantes = [...(resposta?.content ?? [])];
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar adotantes:', erro);
        this.adotantes = [];
        this.mensagemErro = 'Erro ao carregar lista de adotantes.';
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

  aplicarMascaraTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)$/, '($1');
    }

    input.value = valor;
    this.form.get('telefone')?.setValue(valor, { emitEvent: false });
  }

  abrirModalEdicao(adotante: AdotanteResponse): void {
    this.idEmEdicao = adotante.id;

    let telFormatado = adotante.telefone || '';
    const digitos = telFormatado.replace(/\D/g, '');
    if (digitos.length === 11) {
      telFormatado = digitos.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (digitos.length === 10) {
      telFormatado = digitos.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    this.form.patchValue({
      nome: adotante.nome,
      cpf: adotante.cpf,
      telefone: telFormatado,
      email: adotante.email,
      endereco: {
        logradouro: adotante.endereco?.logradouro || '',
        numero: adotante.endereco?.numero || '',
        cidade: adotante.endereco?.cidade || '',
      },
    });

    this.form.get('cpf')?.disable();
    this.exibirModalEdicao = true;
    this.cdr.detectChanges();
  }

  fecharModal(): void {
    this.exibirModalEdicao = false;
    this.idEmEdicao = null;
    this.form.get('cpf')?.enable();
    this.form.reset();
    this.cdr.detectChanges();
  }

  private apenasNumeros(valor: string | undefined | null): string {
    return valor ? valor.replace(/\D/g, '') : '';
  }

  confirmarAtualizacao(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.idEmEdicao) return;

    this.carregando = true;
    this.mensagemErro = '';

    const rawValue = this.form.getRawValue();

    const payload: AdotanteRequest = {
      ...rawValue,
      cpf: this.apenasNumeros(rawValue.cpf),
      telefone: this.apenasNumeros(rawValue.telefone),
    } as AdotanteRequest;

    this.adotanteService.atualizar(this.idEmEdicao, payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Adotante atualizado com sucesso!';
        this.fecharModal();
        this.carregarAdotantes(this.paginaAtual);
        setTimeout(() => (this.mensagemSucesso = ''), 4000);
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
        this.mensagemErro =
          err.error?.message || 'Erro ao atualizar dados do adotante. Verifique os campos.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  deletar(id: number): void {
    if (confirm('Deseja realmente remover este adotante?')) {
      this.adotanteService.deletar(id).subscribe({
        next: () => this.carregarAdotantes(this.paginaAtual),
        error: (err) => console.error('Erro ao deletar:', err),
      });
    }
  }
}
