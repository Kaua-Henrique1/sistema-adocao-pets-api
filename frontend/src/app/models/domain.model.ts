export interface Endereco {
  logradouro: string;
  numero: string;
  cidade: string;
}

export interface PetRequest {
  nome: string;
  tipo: 'CACHORRO' | 'GATO';
  sexo: 'MACHO' | 'FEMEA';
  raca: string;
  dataNascimento: string;
  peso: number;
  endereco: Endereco;
}

export interface PetResponse {
  id: number;
  nome: string;
  tipo: 'CACHORRO' | 'GATO';
  sexo: 'MACHO' | 'FEMEA';
  raca: string;
  dataNascimento: string;
  peso: number;
  tutorId?: number | null;
  tutorNome?: string | null;
  endereco: Endereco;
  createdAt: string;
}

export interface AdotanteRequest {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: Endereco;
}

export interface AdotanteResponse {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
