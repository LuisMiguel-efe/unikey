import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select'; 
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { UsuarioService } from '../usuario.service';
import { HttpClientModule } from '@angular/common/http';

interface Usuario {
  cedula: string;  
  nombre: string;
  tipo: string;
}

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatSelectModule,
    ScrollingModule, 
    HttpClientModule 
  ],
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css'],
  providers: [UsuarioService]
})
export class GestionUsuarioComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'tipo'];
  dataSource = new MatTableDataSource<Usuario>();
  usuarioForm: FormGroup;
  selectedUsuario: Usuario | null = null;
  isLoading = false;
  isCreating = false; 

  page = 0;
  pageSize = 100;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService
  ) {
    this.usuarioForm = this.fb.group({
      cedula:['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios(); 
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios(this.page, this.pageSize).subscribe((usuarios: Usuario[]) => {
      this.dataSource.data = [...this.dataSource.data, ...usuarios];
      this.isLoading = false;
    });
  }

  selectUsuario(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.usuarioForm.patchValue({
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      tipo: usuario.tipo
    });
  }

  eliminarUsuario(): void {
    if (this.selectedUsuario) {
      this.usuarioService.deleteUsuario(this.selectedUsuario.cedula).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(u => u !== this.selectedUsuario);
        this.selectedUsuario = null;
        this.usuarioForm.reset();
        this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 2000 });
      });
    }
  }

  actualizarUsuario(): void {
    if (this.selectedUsuario && this.usuarioForm.valid) {
      if(this.dataSource.data.find(u => u.cedula === this.usuarioForm.value.cedula && u.cedula !== this.selectedUsuario!.cedula)) {
        this.snackBar.open('La cédula ya está en uso', 'Cerrar', { duration: 2000 });
        return;
      }
      const updatedUsuario = { ...this.selectedUsuario, ...this.usuarioForm.value };
      this.usuarioService.updateUsuario(updatedUsuario).subscribe(() => {
        const index = this.dataSource.data.findIndex(u => u.cedula === this.selectedUsuario!.cedula);
        this.dataSource.data[index] = updatedUsuario;
        this.dataSource._updateChangeSubscription();  
        this.snackBar.open('Usuario actualizado', 'Cerrar', { duration: 2000 });
      });
    }
  }

  crearUsuario(): void {
    if (this.usuarioForm.valid) {
      this.isCreating = true; // Mostrar el GIF al comenzar
      const newUsuario = this.usuarioForm.value;
      this.usuarioService.createUsuario(newUsuario).subscribe(
        (usuario: Usuario) => {
          this.dataSource.data = [newUsuario, ...this.dataSource.data];
          this.dataSource._updateChangeSubscription();
          this.snackBar.open('Usuario Creado', 'Cerrar', { duration: 2000 });
          this.isCreating = false; // Ocultar el GIF al finalizar
        },
        () => {
          this.isCreating = false; // Ocultar el GIF en caso de error
        }
      );
    }
  }

  limpiarFormulario(): void {
    this.selectedUsuario = null;
    this.usuarioForm.reset();
  }

  hasErrors(controlName: string, errorName: string): boolean {
    return this.usuarioForm.controls[controlName].hasError(errorName);
  }
}
