import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { PetResponse, PetRequest } from '../../../../models/domain.model';

@Component({
  selector: 'app-modal-edicao-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edicao-cadastro.html',
})
export class ModalEdicaoCadastro implements OnChanges {
  @Input() exibirModal = false;
  @Input() pet: PetResponse | null = null;
  @Input() mensagemErro = '';

  @Output() salvar = new EventEmitter<PetRequest>();
  @Output() fechar = new EventEmitter<void>();

  @ViewChild('formContainer', { read: ElementRef }) formContainer?: ElementRef<HTMLElement>;

  private httpBackend = inject(HttpBackend);
  private httpExterno = new HttpClient(this.httpBackend);

  formData: any = this.getFormVazio();
  avisosAjustes: string[] = [];
  buscandoCep = false;

  get isEdicao(): boolean {
    return !!this.pet?.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] || changes['exibirModal']) {
      this.avisosAjustes = [];
      if (this.pet) {
        this.formData = {
          nome: this.pet.nome || '',
          tipo: this.pet.tipo || 'CACHORRO',
          sexo: this.pet.sexo || 'MACHO',
          raca: this.pet.raca || '',
          dataNascimento: this.pet.dataNascimento
            ? new Date(this.pet.dataNascimento).toISOString().split('T')[0]
            : '',
          peso: this.pet.peso || 0,
          endereco: {
            cep: (this.pet.endereco as any)?.cep || '',
            logradouro: this.pet.endereco?.logradouro || '',
            numero: this.pet.endereco?.numero || '',
            cidade: this.pet.endereco?.cidade || '',
          },
        };
      } else {
        this.formData = this.getFormVazio();
      }
    }

    if (changes['mensagemErro'] && this.mensagemErro) {
      this.scrollToTop();
    }
  }

  private getFormVazio(): any {
    return {
      nome: '',
      tipo: 'CACHORRO',
      sexo: 'MACHO',
      raca: '',
      dataNascimento: new Date().toISOString().split('T')[0],
      peso: 0.5,
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        cidade: '',
      },
    };
  }

  buscarCep(): void {
    const rawValue = this.formData.endereco?.cep || '';
    const cepApenasNumeros = String(rawValue).replace(/\D/g, '');

    if (cepApenasNumeros.length !== 8) return;

    this.buscandoCep = true;

    this.httpExterno.get<any>(`https://viacep.com.br/ws/${cepApenasNumeros}/json/`).subscribe({
      next: (dados: any) => {
        this.buscandoCep = false;
        if (!dados.erro) {
          this.formData.endereco.logradouro = dados.logradouro || '';
          this.formData.endereco.cidade = dados.localidade || '';

          setTimeout(() => {
            const numeroInput = document.getElementById('numeroPet') as HTMLInputElement;
            numeroInput?.focus();
          }, 50);
        } else {
          alert('CEP não encontrado. Por favor, verifique o número.');
        }
      },
      error: () => {
        this.buscandoCep = false;
        alert('Não foi possível consultar o CEP no momento.');
      },
    });
  }

  onSalvar(): void {
    this.avisosAjustes = [];
    let houveAjusteAutomatico = false;

    const nomeOriginal = this.formData.nome || '';
    const nomeTratado = nomeOriginal
      .replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]/g, '')
      .trim();
    if (nomeOriginal !== nomeTratado) {
      this.avisosAjustes.push('Números e símbolos inválidos foram removidos do Nome.');
      houveAjusteAutomatico = true;
    }

    const pesoOriginal = Number(this.formData.peso);
    let pesoTratado = pesoOriginal;
    if (isNaN(pesoOriginal) || pesoOriginal <= 0) {
      pesoTratado = 0.1;
      this.avisosAjustes.push('O peso informado era inválido e foi ajustado para o valor mínimo.');
      houveAjusteAutomatico = true;
    }

    const logradouroOriginal = this.formData.endereco?.logradouro || '';
    const logradouroTratado = logradouroOriginal.replace(/[()]/g, '').trim();
    if (logradouroOriginal !== logradouroTratado) {
      this.avisosAjustes.push('Parênteses foram removidos do logradouro para melhor legibilidade.');
      houveAjusteAutomatico = true;
    }

    const cidadeOriginal = this.formData.endereco?.cidade || '';
    const cidadeTratada = cidadeOriginal
      .replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]/g, '')
      .trim();
    if (cidadeOriginal && cidadeOriginal !== cidadeTratada) {
      this.avisosAjustes.push('Números e símbolos foram removidos do campo Cidade.');
      houveAjusteAutomatico = true;
    }

    const racaOriginal = this.formData.raca || '';
    const racaTratada = racaOriginal
      .replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]/g, '')
      .trim();
    if (racaOriginal && racaOriginal !== racaTratada) {
      this.avisosAjustes.push('Símbolos e números foram removidos do campo Raça.');
      houveAjusteAutomatico = true;
    }

    this.formData.nome = nomeTratado;
    this.formData.peso = pesoTratado;
    this.formData.endereco.logradouro = logradouroTratado;
    this.formData.endereco.cidade = cidadeTratada;
    this.formData.raca = racaTratada;

    if (houveAjusteAutomatico) {
      this.scrollToTop();
      return;
    }

    const payload: PetRequest = {
      ...this.formData,
      nome: nomeTratado,
      raca: racaTratada,
      peso: pesoTratado,
      endereco: {
        cep: this.formData.endereco?.cep?.trim() || '',
        logradouro: logradouroTratado,
        numero: this.formData.endereco?.numero?.trim() || '',
        cidade: cidadeTratada,
      },
    };

    this.salvar.emit(payload);
  }

  onFechar(): void {
    this.fechar.emit();
  }

  private scrollToTop(): void {
    setTimeout(() => {
      if (this.formContainer?.nativeElement) {
        this.formContainer.nativeElement.scrollTop = 0;
      }
    }, 100);
  }
}
