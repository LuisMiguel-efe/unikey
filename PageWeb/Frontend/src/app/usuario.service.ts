import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  cedula: string;
  nombre: string;
  tipo: string // Modificado
}

@Injectable({
  providedIn: 'root' // Servicio global disponible en toda la aplicación
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8081/users'; // URL del backend

  constructor(private http: HttpClient) {}

  getUsuarios(page: number, pageSize: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?page=${page}&size=${pageSize}`); // Obtener usuarios paginados
  }

  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, usuario);
  }

  deleteUsuario(cedula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?cedula=${cedula}`);
  }
  createUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }
}
