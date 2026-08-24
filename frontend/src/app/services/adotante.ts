import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <- IMPORTANTE: Não esqueça esta linha
import { environment } from '../../environments/environment';
import { AdotanteRequest, AdotanteResponse } from '../models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class AdotanteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/adotantes`;

  listarTodosAdotantes(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  listar(termo?: string): Observable<any> {
    const url = termo ? `${this.apiUrl}?nome=${encodeURIComponent(termo)}` : this.apiUrl;
    return this.http.get<any>(url);
  }

  buscarPorId(id: number): Observable<AdotanteResponse> {
    return this.http.get<AdotanteResponse>(`${this.apiUrl}/${id}`);
  }

  cadastrar(adotante: AdotanteRequest): Observable<AdotanteResponse> {
    return this.http.post<AdotanteResponse>(this.apiUrl, adotante);
  }

  atualizar(id: number, adotante: AdotanteRequest): Observable<AdotanteResponse> {
    return this.http.put<AdotanteResponse>(`${this.apiUrl}/${id}`, adotante);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
