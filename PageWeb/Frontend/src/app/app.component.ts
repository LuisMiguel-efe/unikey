import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegistroDatosComponent } from "./registro-datos/registro-datos.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { AdminComponent } from "./admin/admin.component";
import { EliminarUsuariosComponent } from './eliminar-usuarios/eliminar-usuarios.component';
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, CommonModule, LoginComponent, MatCardModule, MatFormFieldModule, MatInputModule, EliminarUsuariosComponent ,MatButtonModule, RegistroDatosComponent, LoadingSpinnerComponent, AdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';
  constructor(private router: Router) {}

  onHeaderClick(): void {
    this.router.navigate(['/admin-interfaz']);
  }
}
