import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegistroDatosComponent } from './registro-datos/registro-datos.component';
import { EliminarUsuariosComponent } from './eliminar-usuarios/eliminar-usuarios.component';
import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';
import { GestionPorteriasComponent } from './gestion-porterias/gestion-porterias.component';
import { AccesosComponent } from './accesos/accesos.component';

export const routes: Routes = [
    {path : '', component: LoginComponent},
    { path: 'admin-interfaz', component: AdminComponent },
    {path: 'app-registro-datos', component: RegistroDatosComponent},
    {path: 'app-eliminar-usuarios', component: EliminarUsuariosComponent},
    {path:'gestion-usuario', component: GestionUsuarioComponent},
    {path: 'gestion-porterias', component: GestionPorteriasComponent},
    {path :'app-accesos', component: AccesosComponent}
];
