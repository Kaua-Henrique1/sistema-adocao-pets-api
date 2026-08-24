import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PetService } from '../../services/pet';
import { AdotanteService } from '../../services/adotante';
import { PetResponse, PetRequest, AdotanteResponse } from '../../models/domain.model';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pets.html',
  styleUrls: ['./pets.css'],
})
export class Pets implements OnInit {
  private petService = inject(PetService);
  private adotanteService = inject(AdotanteService);
  private cdr = inject(ChangeDetectorRef);

  pets: PetResponse[] = [];
  carregando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  termoCidade = '';
  termoId: number | null = null;
  exibindoAdotados = false;

  // Estados dos Modais
  exibirModalEdicao = false;
  exibirModalCadastro = false;
  exibirModalAdocao = false;

  idEmEdicao: number | null = null;
  petParaAdotar: PetResponse | null = null;
  adotanteIdInput: number | null = null;

  // Estado da Busca e Seleção de Adotantes
  termoBuscaAdotante = '';
  adotantesEncontrados: AdotanteResponse[] = [];
  adotanteSelecionado: AdotanteResponse | null = null;
  carregandoAdotantes = false;

  petForm: PetRequest = this.getFormVazio();
  novoPetForm: PetRequest = this.getFormVazio();

  paginaAtual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  ngOnInit(): void {
    this.carregarDisponiveis();
  }

  private getFormVazio(): PetRequest {
    return {
      nome: '',
      tipo: 'CACHORRO',
      sexo: 'MACHO',
      raca: '',
      dataNascimento: new Date().toISOString().split('T')[0],
      peso: 0.5,
      endereco: { logradouro: '', numero: '', cidade: '' },
    };
  }

  carregarDisponiveis(pagina: number = 0): void {
    this.termoCidade = '';
    this.termoId = null;
    this.paginaAtual = pagina;
    this.exibindoAdotados = false;
    this.carregando = true;
    this.mensagemErro = '';
    this.cdr.markForCheck();

    this.petService.listarDisponiveis(this.paginaAtual, 10).pipe(
      finalize(() => {
        this.carregando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar pets disponíveis.';
        this.pets = [];
      },
    });
  }

  carregarAdotados(pagina: number = 0): void {
    this.termoCidade = '';
    this.termoId = null;
    this.paginaAtual = pagina;
    this.exibindoAdotados = true;
    this.carregando = true;
    this.mensagemErro = '';
    this.cdr.markForCheck();

    this.petService.listarAdotados(this.paginaAtual, 10).pipe(
      finalize(() => {
        this.carregando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar pets adotados (Verifique se o endpoint /adotados existe no backend).';
        this.pets = [];
      },
    });
  }

  buscarPorCidade(pagina: number = 0): void {
    this.termoId = null;
    this.mensagemErro = '';

    const cidadeLimpa = this.termoCidade.trim();
    if (!cidadeLimpa) {
      this.exibindoAdotados ? this.carregarAdotados() : this.carregarDisponiveis();
      return;
    }

    this.paginaAtual = pagina;
    this.carregando = true;
    this.cdr.markForCheck();

    this.petService.listarPorCidade(encodeURIComponent(cidadeLimpa), this.paginaAtual, 10).pipe(
      finalize(() => {
        this.carregando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;
      },
      error: (err) => {
        this.pets = [];
        if (err.status !== 404) {
          this.mensagemErro = 'Erro ao conectar com o servidor para a busca por cidade.';
        }
      },
    });
  }

  buscarPorId(): void {
    this.termoCidade = '';
    this.mensagemErro = '';

    if (!this.termoId) {
      this.exibindoAdotados ? this.carregarAdotados() : this.carregarDisponiveis();
      return;
    }

    this.carregando = true;
    this.cdr.markForCheck();

    this.petService.buscarPorId(this.termoId).pipe(
      finalize(() => {
        this.carregando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (dado) => {
        this.pets = dado ? [dado] : [];
      },
      error: () => {
        this.mensagemErro = `Pet com ID #${this.termoId} não encontrado.`;
        this.pets = [];
      },
    });
  }

  atualizarLista(): void {
    if (this.termoId) {
      this.buscarPorId();
    } else if (this.termoCidade.trim()) {
      this.buscarPorCidade(this.paginaAtual);
    } else if (this.exibindoAdotados) {
      this.carregarAdotados(this.paginaAtual);
    } else {
      this.carregarDisponiveis(this.paginaAtual);
    }
  }

  // --- MODAL DE ADOÇÃO COM FILTRO E CONFIRMAÇÃO ---
  abrirModalAdocao(pet: PetResponse): void {
    this.petParaAdotar = pet;
    this.termoBuscaAdotante = '';
    this.adotantesEncontrados = [];
    this.adotanteSelecionado = null;
    this.adotanteIdInput = null;
    this.mensagemErro = '';
    this.exibirModalAdocao = true;
    this.buscarAdotantes();
  }

  fecharModalAdocao(): void {
    this.exibirModalAdocao = false;
    this.petParaAdotar = null;
    this.adotanteSelecionado = null;
    this.adotanteIdInput = null;
    this.adotantesEncontrados = [];
    this.termoBuscaAdotante = '';
    this.mensagemErro = '';
  }

  buscarAdotantes(): void {
    this.carregandoAdotantes = true;
    this.mensagemErro = '';
    this.cdr.markForCheck();

    this.adotanteService.listar(this.termoBuscaAdotante.trim()).pipe(
      finalize(() => {
        this.carregandoAdotantes = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.adotantesEncontrados = [...lista];
      },
      error: () => {
        this.adotantesEncontrados = [];
      },
    });
  }

  selecionarAdotante(adotante: AdotanteResponse): void {
    this.adotanteSelecionado = adotante;
    this.adotanteIdInput = adotante.id;
  }

  confirmarAdocao(): void {
    if (!this.petParaAdotar || !this.adotanteSelecionado) {
      this.mensagemErro = 'Selecione um adotante na lista para continuar.';
      return;
    }

    const mensagemConfirmacao = `Confirmar a adoção do pet "${this.petParaAdotar.nome}" (#${this.petParaAdotar.id}) para o adotante "${this.adotanteSelecionado.nome}" (CPF: ${this.adotanteSelecionado.cpf})?`;

    if (confirm(mensagemConfirmacao)) {
      this.mensagemErro = '';
      this.cdr.markForCheck();

      this.petService.adotar(this.petParaAdotar.id, this.adotanteSelecionado.id).subscribe({
        next: (petAdotado) => {
          this.mensagemSucesso = `Adoção realizada com sucesso! O pet "${petAdotado.nome}" foi adotado por ${this.adotanteSelecionado?.nome}.`;
          this.fecharModalAdocao();
          this.atualizarLista();

          setTimeout(() => {
            this.mensagemSucesso = '';
            this.cdr.markForCheck();
          }, 4000);
        },
        error: (err) => {
          if (err.status === 404) {
            this.mensagemErro = 'Pet ou Adotante não encontrado no sistema.';
          } else if (err.status === 400) {
            this.mensagemErro = 'Este pet já foi adotado ou a requisição é inválida.';
          } else {
            this.mensagemErro = 'Erro ao processar adoção. Tente novamente.';
          }
          this.cdr.markForCheck();
        },
      });
    }
  }

  // --- MODAL DE CADASTRO ---
  abrirModalCadastro(): void {
    this.novoPetForm = this.getFormVazio();
    this.mensagemErro = '';
    this.exibirModalCadastro = true;
  }

  fecharModalCadastro(): void {
    this.exibirModalCadastro = false;
    this.novoPetForm = this.getFormVazio();
    this.mensagemErro = '';
  }

  cadastrarPet(): void {
    this.mensagemErro = '';
    const logradouroLimpo = (this.novoPetForm.endereco?.logradouro || '').replace(/[0-9]/g, '').trim();

    const payload: PetRequest = {
      nome: this.novoPetForm.nome?.trim(),
      tipo: this.novoPetForm.tipo,
      sexo: this.novoPetForm.sexo,
      raca: this.novoPetForm.raca?.trim(),
      dataNascimento: this.novoPetForm.dataNascimento,
      peso: Number(this.novoPetForm.peso),
      endereco: {
        logradouro: logradouroLimpo,
        numero: this.novoPetForm.endereco?.numero?.trim(),
        cidade: this.novoPetForm.endereco?.cidade?.trim(),
      },
    };

    this.petService.cadastrar(payload).subscribe({
      next: (petCadastrado: PetResponse) => {
        this.mensagemSucesso = `Pet "${petCadastrado.nome}" cadastrado com sucesso!`;
        this.fecharModalCadastro();
        this.atualizarLista();

        setTimeout(() => {
          this.mensagemSucesso = '';
          this.cdr.markForCheck();
        }, 4000);
      },
      error: (err) => {
        if (Array.isArray(err.error) && err.error.length > 0) {
          this.mensagemErro = `Erro em ${err.error[0].campo}: ${err.error[0].mensagem}`;
        } else {
          this.mensagemErro = 'Erro ao cadastrar o pet.';
        }
        this.cdr.markForCheck();
      },
    });
  }

  // --- MODAL DE EDIÇÃO ---
  abrirModalEdicao(pet: PetResponse): void {
    this.idEmEdicao = pet.id;
    this.mensagemErro = '';
    this.petForm = {
      nome: pet.nome || '',
      tipo: pet.tipo || 'CACHORRO',
      sexo: pet.sexo || 'MACHO',
      raca: pet.raca || 'SRD',
      dataNascimento: pet.dataNascimento || new Date().toISOString().split('T')[0],
      peso: pet.peso && pet.peso >= 0.5 ? pet.peso : 0.5,
      endereco: {
        logradouro: pet.endereco?.logradouro || '',
        numero: pet.endereco?.numero || '',
        cidade: pet.endereco?.cidade || '',
      },
    };
    this.exibirModalEdicao = true;
  }

  fecharModal(): void {
    this.exibirModalEdicao = false;
    this.idEmEdicao = null;
    this.petForm = this.getFormVazio();
    this.mensagemErro = '';
  }

  confirmarAtualizacao(): void {
    if (!this.idEmEdicao) return;
    this.mensagemErro = '';

    const logradouroLimpo = (this.petForm.endereco?.logradouro || '').replace(/[0-9]/g, '').trim();

    const payload: PetRequest = {
      nome: this.petForm.nome?.trim(),
      tipo: this.petForm.tipo,
      sexo: this.petForm.sexo,
      raca: this.petForm.raca?.trim(),
      dataNascimento: this.petForm.dataNascimento,
      peso: Number(this.petForm.peso),
      endereco: {
        logradouro: logradouroLimpo,
        numero: this.petForm.endereco?.numero?.trim(),
        cidade: this.petForm.endereco?.cidade?.trim(),
      },
    };

    if (confirm(`Tem certeza que deseja atualizar "${payload.nome}"?`)) {
      this.petService.atualizar(this.idEmEdicao, payload).subscribe({
        next: (petAtualizado: PetResponse) => {
          this.mensagemSucesso = 'Pet atualizado com sucesso!';
          const index = this.pets.findIndex((p) => p.id === this.idEmEdicao);
          if (index !== -1) {
            this.pets[index] = { ...petAtualizado };
            this.pets = [...this.pets];
          } else {
            this.atualizarLista();
          }
          this.fecharModal();
          this.cdr.markForCheck();

          setTimeout(() => {
            this.mensagemSucesso = '';
            this.cdr.markForCheck();
          }, 4000);
        },
        error: (err) => {
          if (Array.isArray(err.error) && err.error.length > 0) {
            this.mensagemErro = `Erro em ${err.error[0].campo}: ${err.error[0].mensagem}`;
          } else {
            this.mensagemErro = 'Erro ao atualizar o pet.';
          }
          this.cdr.markForCheck();
        },
      });
    }
  }

  deletarPet(pet: PetResponse): void {
    if (confirm(`Deseja realmente remover o pet "${pet.nome}" (ID: #${pet.id}) do sistema?`)) {
      this.petService.deletar(pet.id).subscribe({
        next: () => {
          this.mensagemSucesso = 'Pet removido com sucesso!';
          this.atualizarLista();
          setTimeout(() => {
            this.mensagemSucesso = '';
            this.cdr.markForCheck();
          }, 4000);
        },
        error: () => {
          this.mensagemErro = 'Erro ao deletar o pet.';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
