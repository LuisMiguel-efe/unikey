import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;
  errorLogin: string = "k";
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      contrasena: ['', Validators.required]
    });
  }
  onSubmit(): void {
    this.formSubmitted = true;
    const { cedula, contrasena } = this.loginForm.value;

    if (cedula === '1083812082' && contrasena === '123') {
      this.router.navigate(['/admin-interfaz']);
    } else {
      this.loginError = true;
    }
  }

  hasErrors(controlName: string, errorName: string): boolean {
    return this.loginForm.controls[controlName].hasError(errorName);
  }
}
