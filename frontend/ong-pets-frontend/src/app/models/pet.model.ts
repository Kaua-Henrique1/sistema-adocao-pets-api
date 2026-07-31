export interface AdotanteResumo {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export interface Pet {
  id?: number;
  nome: string;
  tipo: string;
  sexo: string;
  raca: string;
  idade: string;
  peso: string;
  logradouro: string;
  numero: string;
  cidade: string;
  tutor?: AdotanteResumo | null;
}
