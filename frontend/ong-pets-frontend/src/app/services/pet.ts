import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pets`;
  listarTodos(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  cadastrar(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet);
  }
}
