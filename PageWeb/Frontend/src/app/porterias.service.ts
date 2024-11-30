// porterias.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Porteria {
  id: number;
  mac:String;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class PorteriasService {
  private apiUrl = 'http://localhost:8081/porterias';

  constructor(private http: HttpClient) {}

  obtenerPorterias(): Observable<Porteria[]> {
    return this.http.get<Porteria[]>(this.apiUrl);
  }

  crearPorteria(porteria: Porteria): Observable<Porteria> {
    return this.http.post<Porteria>(this.apiUrl, porteria);
  }

  actualizarPorteria(porteria: Porteria): Observable<Porteria> {
    return this.http.put<Porteria>(this.apiUrl, porteria);
  }

  eliminarPorteria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?id=${id}`);
  }
}
