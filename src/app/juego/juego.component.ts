import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit{
  categoria: string | null = null;
  level: string | null = null;
  preguntas: any[] = []; // Lista de preguntas
  currentIndex: number = 0; // Índice de la pregunta actual
  respuestaSeleccionada: string | null = null; // Respuesta seleccionada (V o F)
  respuestasCorrectas: number = 0; // Contador de respuestas correctas
  juegoTerminado: boolean = false; // Bandera para el estado del juego

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.categoria = this.route.snapshot.paramMap.get('categoria');
    this.level = this.route.snapshot.paramMap.get('level');

    // Obtener preguntas del backend
    this.fetchPreguntas();
  }

  fetchPreguntas() {
    const body = { tema: this.categoria }; // Modifica según los parámetros necesarios para tu backend
    this.http.post<any>('http://localhost:3000/obtenerPregunta', body).subscribe({
      next: (response) => {
        this.preguntas = response.preguntas;
      },
      error: (err) => {
        console.error('Error al obtener las preguntas', err);
      }
    });
  }

  // Maneja la selección de la respuesta
  seleccionarRespuesta(respuesta: string) {
    this.respuestaSeleccionada = respuesta;

    // Verifica si la respuesta seleccionada es correcta
    if (this.respuestaSeleccionada === this.preguntas[this.currentIndex]?.respuesta) {
      this.respuestasCorrectas++;
    }

    // Verifica si hay más preguntas
    if (this.currentIndex < this.preguntas.length - 1) {
      this.currentIndex++;
      this.respuestaSeleccionada = null; // Resetea la respuesta seleccionada
    } else {
      // Finaliza el juego
      this.juegoTerminado = true;
    }
  }
}
