import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Porteria, PorteriasService } from '../porterias.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gestion-porterias',
  standalone: true,
  templateUrl: './gestion-porterias.component.html',
  styleUrls: ['./gestion-porterias.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [PorteriasService]
})
export class GestionPorteriasComponent implements OnInit {
  porteriaForm: FormGroup;
  displayedColumns: string[] = ['id', 'nombre', 'mac'];
  dataSource = new MatTableDataSource<Porteria>();
  selectedPorteria: Porteria | null = null;

  constructor(private fb: FormBuilder, private porteriasService: PorteriasService) {
    this.porteriaForm = this.fb.group({
      id: [''],
      nombre: [''],
      mac: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerPorterias();
  }

  obtenerPorterias(): void {
    this.porteriasService.obtenerPorterias().subscribe((data: Porteria[]) => {
      this.dataSource.data = data;
    });
  }

  selectPorteria(porteria: Porteria) {
    this.selectedPorteria = porteria;
    this.porteriaForm.patchValue(porteria);
  }

  crearPorteria() {
    const nuevaPorteria: Porteria = this.porteriaForm.value;
    this.porteriasService.crearPorteria(nuevaPorteria).subscribe((porteriaCreada) => {
      this.dataSource.data = [...this.dataSource.data, porteriaCreada];
      this.limpiarFormulario();
    });
  }

  actualizarPorteria() {
    if (this.selectedPorteria) {
      const porteriaActualizada = { ...this.selectedPorteria, ...this.porteriaForm.value };
      this.porteriasService.actualizarPorteria(porteriaActualizada).subscribe((porteria) => {
        const index = this.dataSource.data.findIndex(p => p.id === porteria.id);
        this.dataSource.data[index] = porteria;
        this.dataSource._updateChangeSubscription();
        this.limpiarFormulario();
      });
    }
  }

  eliminarPorteria() {
    if (this.selectedPorteria) {
      this.porteriasService.eliminarPorteria(this.selectedPorteria.id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(p => p.id !== this.selectedPorteria?.id);
        this.limpiarFormulario();
      });
    }
  }

  limpiarFormulario() {
    this.porteriaForm.reset();
    this.selectedPorteria = null;
  }
}
