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
  /*categoria: string | null = null;
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
  }*/

  preguntas = [
    { texto: 'Lotso es el nombre del títere de Jigsaw en "Saw".', respuesta: 'F' },
    { texto: 'El agua hierve a 100°C a nivel del mar.', respuesta: 'V' },
    // Agrega más preguntas aquí...
  ];
  indicePregunta = 0;
  tiempoRestante = 20;
  progreso = 0;
  respuestasCorrectas = 0;
  intervalo: any;
  mostrarFeedback = false;
  esRespuestaCorrecta = false;

  ngOnInit() {
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.registrarRespuesta(false); // Marca como incorrecta por tiempo
      }
    }, 1000);
  }

  responder(opcion: 'F' | 'V') {
    const respuestaCorrecta = this.preguntas[this.indicePregunta].respuesta === opcion;
    this.registrarRespuesta(respuestaCorrecta);
  }

  registrarRespuesta(esCorrecta: boolean) {
    this.mostrarFeedback = true;
    this.esRespuestaCorrecta = esCorrecta;

    if (esCorrecta) {
      this.respuestasCorrectas++;
    }

    clearInterval(this.intervalo);

    setTimeout(() => {
      this.mostrarFeedback = false;
      this.pasoSiguiente();
    }, 1000); // Muestra el feedback por 1 segundo
  }

  pasoSiguiente() {
    this.indicePregunta++;
    this.progreso = (this.indicePregunta / this.preguntas.length) * 100;

    if (this.indicePregunta < this.preguntas.length) {
      this.tiempoRestante = 20;
      this.iniciarTemporizador();
    } else {
      // Quiz terminado
      alert(`¡Quiz finalizado! Respuestas correctas: ${this.respuestasCorrectas}`);
    }
  }
}
