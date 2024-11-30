import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Acceso, AccesosService } from '../accesos.service';
import { HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

// Registrar componentes de Chart.js
Chart.register(...registerables);

// Definir módulo de Angular
@Component({
  selector: 'app-accesos',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.css'],
  providers: [AccesosService]
})

export class AccesosComponent implements OnInit {
  selectedDate: string = '';
  formattedDate: string = '';
  showSelectors: boolean = false;  // Variable para controlar la visibilidad de los selectores

  accesos: Acceso[] = []; // Lista de accesos recopilados de la base de datos
  selectedPorteria: number | null = null; // Porteria seleccionada en la interfaz
  selectedMonth: string = ''; // Almacena el mes seleccionado en la interfaz de las graficas
  private myChart: Chart | null = null; // Almacena las graficas de lineas, barras e histogramas
  private myChart2: Chart<'pie', number[], string> | null = null; // Almacena las graficas circulares de procentajes
  graficoSeleccionado: string = 'first'; // Variable para obtener el tipo de gráfico seleccionado y graficarlo

  // Variables para KPIs
  totalAccesos: number = 0;
  porcentajeAutenticados: number = 0;
  diaMayorAcceso: string = '';
  porteriaFrecuente: number | null = null;

  // Referencias a cada boton de graficas
  @ViewChild('accesosBtn') accesosBtn!: ElementRef;
  @ViewChild('porteriasBtn') porteriasBtn!: ElementRef;
  @ViewChild('tendenciasBtn') tendenciasBtn!: ElementRef;
  @ViewChild('porcentajeBtn') porcentajeBtn!: ElementRef;
  @ViewChild('histogramaBtn') histogramaBtn!: ElementRef;


  constructor(private accesosService: AccesosService) {}

  ngOnInit(): void {
    // Inicialización o cualquier llamada inicial
  }

  // Seleccionar portería y obtener accesos
  seleccionarPorteria(porteria: number): void {
    this.selectedPorteria = porteria;
    this.obtenerAccesos(porteria);
  }
  // Obtener accesos por portería desde el servicio backend
  obtenerAccesos(porteria: number): void {
    // Si la opcion seleccionado es "general" la porteria "0" recolectaria todos los accesos de todas las porterias
    if(porteria==0){
      // Obtener todos los accesos y Activar el boton para ver estadisticas de porterias más utilizadas
      this.accesosService.getAllAccesos().subscribe((data) => {
        this.accesos = data;
        this.porteriasBtn.nativeElement.disabled = false;
      });
    } else{
      // Obtener accesos de una determinada porteria y Desactivar el boton para ver estadisticas de porterias más utilizadas
      this.accesosService.obtenerAccesosPorPorteria(porteria).subscribe((data) => {
        this.accesos = data;
        this.porteriasBtn.nativeElement.disabled = true;
      });
    }

  }
  // Generar reportes según el gráfico seleccionado
  generarReportes(): void {
    if (this.myChart) {
      this.myChart.destroy();
    }
    if (this.myChart2) {
      this.myChart2.destroy();
    }
    this.calcularKPIs(); // Calcular KPIs antes de generar el gráfico
    this.showSelectors = false; // Por defecto desaparecer calendar (solo para histograma)
    switch (this.graficoSeleccionado) {
      case 'bar':
        // Mostrar el canvas principal y ocultar el circular
        document.getElementById('myChart2')!.style.display = 'none';
        document.getElementById('myChart')!.style.display = 'block';
        this.generarGraficoBarras();
        break;
      case 'first':
        // Mostrar el canvas principal y ocultar el circular
        document.getElementById('myChart2')!.style.display = 'none';
        document.getElementById('myChart')!.style.display = 'block';
        // Enfocar grafico en pantalla
        const chartContainer = document.getElementById("chart-container");
        if (chartContainer) {
          chartContainer.style.display = "block"; // Cambia a visible
        }
        this.generarGraficoAccesosMensuales();
        if (chartContainer) {
          chartContainer.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
        break;
      case 'histogram':
        // Mostrar el canvas principal y ocultar el circular
        document.getElementById('myChart2')!.style.display = 'none';
        document.getElementById('myChart')!.style.display = 'block';
        this.generarHistogramaHoras();
        break;
      case 'pie':
        // Mostrar el canvas del gráfico circular
        document.getElementById('myChart2')!.style.display = 'block';
        document.getElementById('myChart')!.style.display = 'none';
        this.generarGraficoCircular();
        break;
      case 'line':
        // Mostrar el canvas principal y ocultar el circular
        document.getElementById('myChart2')!.style.display = 'none';
        document.getElementById('myChart')!.style.display = 'block';
        this.generarGraficoLineas();
        break;
     }


  }
  // Calcular los KPIs (indicadores clave de rendimiento)
  calcularKPIs(): void {
    this.totalAccesos = this.accesos.length;
    const autenticados = this.accesos.filter(acceso => acceso.autenticado).length;
    const autenticos = this.accesos.filter(acceso => acceso.autenticado);
    this.porcentajeAutenticados = (autenticados / this.totalAccesos) * 100;
    // Cálculo del día con más accesos
    const accesosPorDia = autenticos.reduce((acc, acceso) => {
      const dia = this.extraerDia(acceso.fecha_hora);
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    this.diaMayorAcceso = Object.keys(accesosPorDia).reduce((a, b) => accesosPorDia[a] > accesosPorDia[b] ? a : b);
    // Cálculo de la portería más utilizada
    const accesosPorPorteria = this.accesos.reduce((acc, acceso) => {
      acc[acceso.porteria] = (acc[acceso.porteria] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    this.porteriaFrecuente = +Object.keys(accesosPorPorteria).reduce((a, b) =>
      accesosPorPorteria[+a] > accesosPorPorteria[+b] ? a : b
    );

    if(this.selectedMonth){
      const accesosFiltrados = this.accesos.filter(acceso => {
        return this.selectedMonth ? this.extraerMes(acceso.fecha_hora) === this.selectedMonth : true;
      });

      this.totalAccesos = accesosFiltrados.length;
      const autenticados = accesosFiltrados.filter(acceso => acceso.autenticado).length;
      const autenticos = accesosFiltrados.filter(acceso => acceso.autenticado);
      this.porcentajeAutenticados = (autenticados / this.totalAccesos) * 100;
      // Cálculo del día con más accesos
      const accesosPorDia = autenticos.reduce((acc, acceso) => {
        const dia = this.extraerDia(acceso.fecha_hora);
        acc[dia] = (acc[dia] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      this.diaMayorAcceso = Object.keys(accesosPorDia).reduce((a, b) => accesosPorDia[a] > accesosPorDia[b] ? a : b);
      // Cálculo de la portería más utilizada
      const accesosPorPorteria = accesosFiltrados.reduce((acc, acceso) => {
        acc[acceso.porteria] = (acc[acceso.porteria] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      this.porteriaFrecuente = +Object.keys(accesosPorPorteria).reduce((a, b) =>
        accesosPorPorteria[+a] > accesosPorPorteria[+b] ? a : b
      );
    }
  }

  // Gráfico de accesos mensuales filtrado por el mes seleccionado
  private generarGraficoAccesosMensuales(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const accesosFiltrados = this.accesos.filter(acceso => {
      return this.selectedMonth ? this.extraerMes(acceso.fecha_hora) === this.selectedMonth : true;
    });

    const labels = [...new Set(accesosFiltrados.map(acceso => this.extraerDia(acceso.fecha_hora)))];
    const autenticados = labels.map(dia =>
      accesosFiltrados.filter(acceso => this.extraerDia(acceso.fecha_hora) === dia && acceso.autenticado).length
    );
    const noAutenticados = labels.map(dia =>
      accesosFiltrados.filter(acceso => this.extraerDia(acceso.fecha_hora) === dia && !acceso.autenticado).length
    );

    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Accesos Autenticados', data: autenticados, backgroundColor: 'rgba(75, 192, 192, 0.7)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
          { label: 'Accesos No Autenticados', data: noAutenticados, backgroundColor: 'rgba(255, 99, 132, 0.7)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }
        ]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  // Gráfico circular para autenticados vs no autenticados
  private generarGraficoCircular(): void {
    var autenticados = this.accesos.filter(acceso => acceso.autenticado).length;
    var noAutenticados = this.accesos.length - autenticados;
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
    // Verificar si es esta filtrando por mes
    if(this.selectedMonth){
      const accesosFiltrados = this.accesos.filter(acceso => {
        return this.selectedMonth ? this.extraerMes(acceso.fecha_hora) === this.selectedMonth : true;
      });
      autenticados = accesosFiltrados.filter(acceso => acceso.autenticado).length;
      noAutenticados = accesosFiltrados.length - autenticados;
    }
    // Crear el gráfico circular con tamaño reducido
    this.myChart2 = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Autenticados', 'No Autenticados'],
        datasets: [{
          data: [autenticados, noAutenticados],
          backgroundColor: ['#4CAF50', '#F44336']
        }]
      },
      options: {
        responsive:false,
        maintainAspectRatio:false
       }
    });
  }

  // Gráfico de barras para accesos por portería
  private generarGraficoBarras(): void {
    var accesosPorPorteria = this.accesos.reduce((acc, acceso) => {
      acc[acceso.porteria] = (acc[acceso.porteria] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    if(this.selectedMonth){
      const accesosFiltrados = this.accesos.filter(acceso => {
        return this.selectedMonth ? this.extraerMes(acceso.fecha_hora) === this.selectedMonth : true;
      });
        accesosPorPorteria = accesosFiltrados.reduce((acc, acceso) => {
        acc[acceso.porteria] = (acc[acceso.porteria] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
    }

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(accesosPorPorteria),
        datasets: [{ label: 'Accesos por Portería', data: Object.values(accesosPorPorteria), backgroundColor: '#2196F3' }]
      },
      options: { responsive: true }
    });
  }

  // Gráfico de líneas para tendencia de accesos por día
  private generarGraficoLineas(): void {
    var accesosPorDia = this.accesos.reduce((acc, acceso) => {
      const dia = this.extraerDia(acceso.fecha_hora);
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    // Verificar filtraje por mes
    if(this.selectedMonth){
      const accesosFiltrados = this.accesos.filter(acceso => {
        return this.selectedMonth ? this.extraerMes(acceso.fecha_hora) === this.selectedMonth : true;
      });
      accesosPorDia = accesosFiltrados.reduce((acc, acceso) => {
      const dia = this.extraerDia(acceso.fecha_hora);
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
      }, {} as Record<string, number>);
    }
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(accesosPorDia),
        datasets: [{ label: 'Tendencia de Accesos', data: Object.values(accesosPorDia), backgroundColor: '#FF9800', borderColor: '#FF9800', fill: false }]
      },
      options: { responsive: true }
    });
  }

// Histograma de accesos por hora (acumulado por hora completa)
private generarHistogramaHoras(): void {
  // Desactivar boton de mes, solo fecha calendar dia
  this.showSelectors = true;

  const etiquetasHoras = this.generarEtiquetasHoras();
  const accesosPorHora = etiquetasHoras.reduce((acc, hora) => {
    acc[hora] = 0; // Inicializamos el contador de accesos por cada hora
    return acc;
  }, {} as Record<string, number>);
  // Filtrar dia y mes
  if (this.selectedDate) {
    // Aquí estamos construyendo la fecha sin usar la zona horaria local
    const date = new Date(this.selectedDate + 'T00:00:00');  // Forzamos la hora a las 00:00:00 para evitar problemas con la zona horaria
    const day = String(date.getDate()).padStart(2, '0');  // Asegura el formato de dos dígitos para el día
    let month = date.toLocaleString('en-US', { month: 'short' }); // Mes abreviado
    // Convertir la primera letra a mayúscula y el resto a minúscula
    month = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    this.formattedDate = `${day} ${month}`;
    }

  const accesosFiltrados = this.accesos.filter(acceso => {
    return this.formattedDate ? this.extraerFecha(acceso.fecha_hora) === this.formattedDate : true;
  });
  // Acumular accesos por hora
  accesosFiltrados.forEach(acceso => {
    const horaExtraida = this.extraerHora(acceso.fecha_hora); // Ejemplo: "04:23:15"
    const hora = `${horaExtraida.split(':')[0].padStart(2, '0')}:00:00`; // Ejemplo: "04:00:00"
    if (etiquetasHoras.includes(hora)) {
      accesosPorHora[hora]++;
    }
  });

  // Crear gráfico
  const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  this.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetasHoras,
      datasets: [{
        label: 'Accesos por Hora',
        data: etiquetasHoras.map(hora => accesosPorHora[hora] || 0),
        backgroundColor: '#8BC34A'
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
           title: { display: true, text: 'Horas del Día' }
          },
        y: { title: { display: true, text: 'Cantidad de Accesos'}}
      }
    }
  });
}
// Generar etiquetas para las 24 horas del día
private generarEtiquetasHoras(): string[] {
  return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00:00`);
}



  // Funciones utilizadas
  // Extraer informacion de las fechas en formato manejable
  // Extraer día de la fecha
  extraerDia(fecha: string): string {
    return fecha.split(' ')[2]; // Día es el tercer elemento
  }
  // Extraer mes de la fecha (abreviado)
  extraerMes(fecha: string): string {
    return fecha.split(' ')[1]; // Mes es el segundo elemento
  }
  // Extraer hora de la fecha
  extraerHora(fecha: string): string {
    return fecha.split(' ')[3]; // Hora completa es el cuarto elemento
  }
  extraerFecha(fecha: string): string {
    return `${fecha.split(' ')[2]} ${fecha.split(' ')[1]}`; // Día y mes abreviado
  }


  // Segun el gráfico seleccionado, generar reportes y mostrar graficas
  // Cambiar el tipo de gráfico seleccionado y generar reporte
  obtenerTipo(tipo: string): void {
    this.graficoSeleccionado = tipo;
    this.generarReportes();
  }
  // Actualizar el gráfico cuando cambie el mes seleccionado
  onMonthChange(): void {
    this.generarReportes();
  }

  onDateChange(): void {

  }
}
