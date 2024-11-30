import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Acceso {
  cedula: string;
  porteria: number;
  fecha_hora: string;
  autenticado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccesosService {
  private apiUrl = 'http://localhost:8081/accesos';
  constructor(private http: HttpClient) {}

  obtenerAccesosPorPorteria(porteria: number): Observable<Acceso[]> {
    return this.http.get<Acceso[]>(`${this.apiUrl}?porteria=${porteria}`);
  }
  getAllAccesos(): Observable<Acceso[]> {
    return this.http.get<Acceso[]>('http://localhost:8081/accesos/all');
  }
}
