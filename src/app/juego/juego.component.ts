import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css',
})
export class JuegoComponent implements OnInit {
  categoria: string | null = null;
  level: string | null = null;
  preguntas: any[] = [];
  currentIndex: number = 0;
  respuestasCorrectas: number = 0;
  juegoTerminado: boolean = false;
  indicePregunta = 0;
  tiempoRestante = 20;
  progreso = 0;
  intervalo: any;
  mostrarFeedback: boolean = false;
  esRespuestaCorrecta: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.categoria = this.route.snapshot.paramMap.get('categoria');
    this.level = this.route.snapshot.paramMap.get('level');
    this.fetchPreguntas();
  }

  fetchPreguntas() {
    const body = { tema: this.categoria };
    this.http
      .post<any>('https://next-eel-firmly.ngrok-free.app/obtenerPregunta', body)
      .subscribe({
        next: (response) => {
          this.preguntas = response.preguntas;
          if (this.preguntas && this.preguntas.length > 0) {
            this.iniciarTemporizador();
          }
        },
        error: (err) => {
          console.error('Error al obtener las preguntas', err);
        },
      });
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.registrarRespuesta(false);
      }
    }, 1000);
  }

  responder(opcion: 'F' | 'V') {
    const respuestaCorrecta =
      this.preguntas[this.indicePregunta].respuesta === opcion;
    this.registrarRespuesta(respuestaCorrecta);
  }

  registrarRespuesta(esCorrecta: boolean) {
    this.esRespuestaCorrecta = esCorrecta;
    this.mostrarFeedback = true;
  
    if (esCorrecta) {
      this.respuestasCorrectas++;
    }
  
    clearInterval(this.intervalo);
  
    // Ocultar feedback después de 1.5 segundos y pasar a la siguiente pregunta
    setTimeout(() => {
      this.mostrarFeedback = false;
      this.pasoSiguiente();
    }, 1500);
  }
  
  pasoSiguiente() {
    this.indicePregunta++;
    this.progreso = (this.indicePregunta / this.preguntas.length) * 100;

    if (this.indicePregunta < this.preguntas.length) {
      this.tiempoRestante = 20;
      this.iniciarTemporizador();
    } else {
      this.juegoTerminado = true;
      this.enviarPuntaje();
    }
  }

  enviarPuntaje() {
    const userId = localStorage.getItem('userId'); // ID del usuario en localStorage
    if (!userId || !this.categoria) {
      console.error('ID de usuario o categoría no encontrados.');
      return;
    }

    const body = {
      id: userId,
      category: this.categoria,
      newscore: this.respuestasCorrectas.toString(),
    };

    this.http.post('https://next-eel-firmly.ngrok-free.app/registerPuntaje', body).subscribe({
      next: () => {
        console.log('Puntaje registrado con éxito.');
      },
      error: (err) => {
        console.error('Error al registrar el puntaje', err);
      },
    });
  }
}
// Quiz terminado
//alert(`¡Quiz finalizado! Respuestas correctas: ${this.respuestasCorrectas}`);

// Maneja la selección de la respuesta
/*seleccionarRespuesta(respuesta: string) {
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
