import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-datos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatCardModule, MatFormFieldModule, MatSelectModule, LoadingSpinnerComponent],
  templateUrl: './registro-datos.component.html',
  styleUrls: ['./registro-datos.component.css']
})
export class RegistroDatosComponent implements OnInit {
  registroForm!: FormGroup;
  huellaRegistrada: boolean = false;
  tomandoHuella: boolean = false;

  constructor(private fb: FormBuilder, private router:Router) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      nombre: ['', Validators.required],
      tipoUsuario: ['', Validators.required]
    });
  }

  onRegistrarHuella(): void {
    this.tomandoHuella = true;
    setTimeout(() => {
      this.tomandoHuella = false;
      this.huellaRegistrada = true;
    }, 3000); // Simula la toma de huella durante 3 segundos
  }

  hasErrors(controlName: string, errorName: string): boolean {
    return this.registroForm.controls[controlName].hasError(errorName);
  }
  regresar(): void {
    this.router.navigate(['/admin-interfaz']);
  
}}