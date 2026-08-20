import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PetRequest, PetResponse } from '../models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/pets`;

  cadastrar(pet: PetRequest): Observable<PetResponse> {
    return this.http.post<PetResponse>(this.apiUrl, pet);
  }

  buscarPorId(id: number): Observable<PetResponse> {
    return this.http.get<PetResponse>(`${this.apiUrl}/${id}`);
  }

  listarDisponiveis(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/disponiveis?page=${page}&size=${size}`);
  }

  listarPorCidade(cidade: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cidade/${cidade}?page=${page}&size=${size}`);
  }

  atualizar(id: number, pet: PetRequest): Observable<PetResponse> {
    return this.http.put<PetResponse>(`${this.apiUrl}/${id}`, pet);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adotar(petId: number, adotanteId: number): Observable<PetResponse> {
    return this.http.patch<PetResponse>(`${this.apiUrl}/${petId}/adotar`, null, {
      params: { adotanteId: adotanteId.toString() },
    });
  }
}
