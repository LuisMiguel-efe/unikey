import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-eliminar-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatCardModule, MatFormFieldModule, LoadingSpinnerComponent],
  templateUrl: './eliminar-usuarios.component.html',
  styleUrls: ['./eliminar-usuarios.component.css']
})
export class EliminarUsuariosComponent implements OnInit {
  eliminarForm!: FormGroup;
  eliminacionExitosa: boolean = false;
  eliminacionFallida: boolean = false;
  eliminando: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.eliminarForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  onEliminar(): void {
    if (this.eliminarForm.valid) {
      this.eliminando = true;
      // Simulación de operación de eliminación
      setTimeout(() => {
        this.eliminando = false;
        const fueEliminado = this.simularEliminacion(); // Lógica simulada
        if (fueEliminado) {
          this.eliminacionExitosa = true;
          this.eliminacionFallida = false;
        } else {
          this.eliminacionFallida = true;
          this.eliminacionExitosa = false;
        }
      }, 3000); // Simula una operación de eliminación durante 3 segundos
    }
  }

  hasErrors(controlName: string, errorName: string): boolean {
    return this.eliminarForm.controls[controlName].hasError(errorName);
  }

  simularEliminacion(): boolean {
    // Aquí podrías tener la lógica para eliminar el usuario a través de un servicio real
    return true; // Simulamos que siempre se elimina correctamente
  }
}
