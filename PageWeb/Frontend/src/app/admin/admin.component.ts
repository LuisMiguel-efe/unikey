import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

constructor(private router : Router){
 
}
  registrar(){
    this.router.navigate(['/app-registro-datos']);
  }
  gestionar(){
    this.router.navigate(['/gestion-usuario']);
  }
  gestionarPorterias(){
    this.router.navigate(['/gestion-porterias']);
  }
  regresar(){
    this.router.navigate(['/']);
  }
  reportes(){
    this.router.navigate(['/app-accesos']);
  }
}

