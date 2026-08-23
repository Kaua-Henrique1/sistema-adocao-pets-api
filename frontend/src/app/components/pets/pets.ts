import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PetService } from '../../services/pet';
import { PetResponse, PetRequest } from '../../models/domain.model';

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
  mensagemSucesso = '';

  termoCidade = '';
  termoId: number | null = null;

  exibirModalEdicao = false;
  exibirModalCadastro = false;
  idEmEdicao: number | null = null;

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
    this.carregando = true;
    this.mensagemErro = '';

    this.petService.listarDisponiveis(this.paginaAtual, 10).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar pets disponíveis.';
        this.pets = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscarPorCidade(pagina: number = 0): void {
    this.termoId = null;
    this.mensagemErro = '';

    const cidadeLimpa = this.termoCidade.trim();
    if (!cidadeLimpa) {
      this.carregarDisponiveis();
      return;
    }

    this.paginaAtual = pagina;
    this.carregando = true;

    this.petService.listarPorCidade(cidadeLimpa, this.paginaAtual, 10).subscribe({
      next: (resposta: any) => {
        const lista = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.pets = [...lista];
        this.totalPaginas = resposta?.totalPages ?? 0;
        this.totalElementos = resposta?.totalElements ?? 0;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Trata HTTP 404 (nenhum pet encontrado com aquele termo parcial) sem quebrar a aplicação
        if (err.status === 404) {
          this.pets = [];
        } else {
          this.mensagemErro = `Erro ao conectar com o servidor para a busca por cidade.`;
          this.pets = [];
        }
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscarPorId(): void {
    this.termoCidade = '';
    this.mensagemErro = '';

    if (!this.termoId) {
      this.carregarDisponiveis();
      return;
    }

    this.carregando = true;
    this.petService.buscarPorId(this.termoId).subscribe({
      next: (dado) => {
        this.pets = dado ? [dado] : [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = `Pet com ID #${this.termoId} não encontrado.`;
        this.pets = [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

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
        this.carregarDisponiveis();

        setTimeout(() => {
          this.mensagemSucesso = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        if (Array.isArray(err.error) && err.error.length > 0) {
          this.mensagemErro = `Erro em ${err.error[0].campo}: ${err.error[0].mensagem}`;
        } else {
          this.mensagemErro = 'Erro ao cadastrar o pet. Verifique os dados fornecidos.';
        }
        this.cdr.detectChanges();
      },
    });
  }

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

  atualizarLista(): void {
    if (this.termoId) {
      this.buscarPorId();
    } else if (this.termoCidade.trim()) {
      this.buscarPorCidade(this.paginaAtual);
    } else {
      this.carregarDisponiveis(this.paginaAtual);
    }
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

    if (confirm(`Tem certeza que deseja atualizar as informações de "${payload.nome}"?`)) {
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
          this.cdr.detectChanges();

          setTimeout(() => {
            this.mensagemSucesso = '';
            this.cdr.detectChanges();
          }, 4000);
        },
        error: (err) => {
          if (Array.isArray(err.error) && err.error.length > 0) {
            this.mensagemErro = `Erro em ${err.error[0].campo}: ${err.error[0].mensagem}`;
          } else {
            this.mensagemErro = 'Erro ao atualizar o pet.';
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  deletarPet(pet: PetResponse): void {
    if (confirm(`Deseja realmente remover o pet "${pet.nome}" (ID: #${pet.id}) do sistema?`)) {
      this.petService.deletar(pet.id).subscribe({
        next: () => {
          this.mensagemSucesso = 'Pet removido com sucesso!';
          this.carregarDisponiveis(this.paginaAtual);
          setTimeout(() => (this.mensagemSucesso = ''), 4000);
        },
        error: () => (this.mensagemErro = 'Erro ao deletar o pet.'),
      });
    }
  }
}
