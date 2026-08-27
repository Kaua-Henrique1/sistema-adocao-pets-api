import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  formData: PetRequest = this.getFormVazio();
  avisosAjustes: string[] = [];

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

  private getFormVazio(): PetRequest {
    return {
      nome: '',
      tipo: 'CACHORRO',
      sexo: 'MACHO',
      raca: '',
      dataNascimento: new Date().toISOString().split('T')[0],
      peso: 0.5,
      endereco: {
        logradouro: '',
        numero: '',
        cidade: '',
      },
    };
  }

  onSalvar(): void {
    this.avisosAjustes = [];
    let houveAjusteAutomatico = false;

    // 1. Tratamento do NOME: Remove números e símbolos
    const nomeOriginal = this.formData.nome || '';
    const nomeTratado = nomeOriginal
      .replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]/g, '')
      .trim();

    if (nomeOriginal !== nomeTratado) {
      this.avisosAjustes.push('Números e símbolos inválidos foram removidos do Nome.');
      houveAjusteAutomatico = true;
    }

    // 2. Tratamento do PESO: Garante valor positivo/válido
    const pesoOriginal = Number(this.formData.peso);
    let pesoTratado = pesoOriginal;

    if (isNaN(pesoOriginal) || pesoOriginal <= 0) {
      pesoTratado = 0.1; // Valor mínimo seguro
      this.avisosAjustes.push('O peso informado era inválido e foi ajustado para o valor mínimo.');
      houveAjusteAutomatico = true;
    }

    // 3. Tratamento do LOGRADOURO: Remove parênteses
    const logradouroOriginal = this.formData.endereco?.logradouro || '';
    const logradouroTratado = logradouroOriginal.replace(/[()]/g, '').trim();

    if (logradouroOriginal !== logradouroTratado) {
      this.avisosAjustes.push('Parênteses foram removidos do logradouro para melhor legibilidade.');
      houveAjusteAutomatico = true;
    }

    // 4. Tratamento da CIDADE: Remove números e símbolos
    const cidadeOriginal = this.formData.endereco?.cidade || '';
    const cidadeTratada = cidadeOriginal
      .replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]/g, '')
      .trim();

    if (cidadeOriginal && cidadeOriginal !== cidadeTratada) {
      this.avisosAjustes.push('Números e símbolos foram removidos do campo Cidade.');
      houveAjusteAutomatico = true;
    }

    // 5. Tratamento da RAÇA: Remove números e símbolos
    const racaOriginal = this.formData.raca || '';
    const racaTratada = racaOriginal
      .replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]/g, '')
      .trim();

    if (racaOriginal && racaOriginal !== racaTratada) {
      this.avisosAjustes.push('Símbolos e números foram removidos do campo Raça.');
      houveAjusteAutomatico = true;
    }

    // Atualiza os valores limpos no formulário atual
    this.formData.nome = nomeTratado;
    this.formData.peso = pesoTratado;
    this.formData.endereco.logradouro = logradouroTratado;
    this.formData.endereco.cidade = cidadeTratada;
    this.formData.raca = racaTratada;

    // Se houve qualquer ajuste automático, faz o scroll e suspende o salvamento no 1º clique
    if (houveAjusteAutomatico) {
      this.scrollToTop();
      return;
    }

    // Emissão do payload limpo para o backend
    const payload: PetRequest = {
      ...this.formData,
      nome: nomeTratado,
      raca: racaTratada,
      peso: pesoTratado,
      endereco: {
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
