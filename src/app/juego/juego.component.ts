import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css',
})
export class JuegoComponent implements OnInit, OnDestroy {
  categoryId: string | null = null;
  categoryName: string | null = null;
  level: number | null = null;
  preguntas: any[] = [];
  currentIndex: number = 0;
  respuestasCorrectas: number = 0;
  juegoTerminado: boolean = false;
  indicePregunta: number = 0;
  tiempoRestante = 20;
  progreso = 0;
  intervalo: any;
  mostrarFeedback: boolean = false;
  esRespuestaCorrecta: boolean = false;
  userId: string | null = null;

  private SUCCESS_THRESHOLD_PERCENTAGE = 0.7;
  private MAX_LEVELS_IN_CATEGORY = 10;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      Swal.fire({
        icon: 'warning',
        title: 'No logueado',
        text: 'Debes iniciar sesión para jugar y guardar tu progreso.',
        confirmButtonText: 'Ir a Login',
      }).then(() => {
        this.router.navigate(['/loggin']);
      });
      return;
    }

    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.categoryName = this.route.snapshot.paramMap.get('categoryName');
    const levelParam = this.route.snapshot.paramMap.get('level');
    this.level = levelParam ? parseInt(levelParam, 10) : null;

    console.group('[JuegoComponent DEBUG] ngOnInit - Parámetros de Ruta');
    console.log(`1. categoryId de ruta: '${this.categoryId}' (tipo: ${typeof this.categoryId})`);
    console.log(`2. categoryName de ruta: '${this.categoryName}' (tipo: ${typeof this.categoryName})`);
    console.log(`3. level de ruta: ${this.level} (tipo: ${typeof this.level})`);
    console.groupEnd();

    if (
      !this.categoryId ||
      this.categoryId.trim() === '' ||
      !this.categoryName ||
      this.categoryName.trim() === '' ||
      this.level === null
    ) {
      console.error('Categoría ID, nombre o nivel no proporcionados o son inválidos en la URL.');
      this.router.navigate(['/home']);
      return;
    }

    this.fetchPreguntas();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  fetchPreguntas() {
    const body = { tema: this.categoryName };
    this.http
      .post<any>(' https://liked-walleye-trusting.ngrok-free.app/obtenerPregunta', body)
      .subscribe({
        next: (response) => {
          this.preguntas = response.preguntas;
          if (this.preguntas && this.preguntas.length > 0) {
            this.iniciarTemporizador();
          } else {
            console.warn('No se recibieron preguntas para esta categoría.');
            this.juegoTerminado = true;
          }
        },
        error: (err) => {
          console.error('Error al obtener las preguntas', err);
          this.juegoTerminado = true;
          Swal.fire({
            icon: 'error',
            title: 'Error de preguntas',
            text: 'No se pudieron cargar las preguntas para esta categoría.',
          });
        },
      });
  }

  iniciarTemporizador() {
    clearInterval(this.intervalo);
    this.tiempoRestante = 20;
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.registrarRespuesta(false);
      }
    }, 1000);
  }

  responder(opcion: 'F' | 'V') {
    if (this.mostrarFeedback) return;
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
      this.enviarResultsFinales();
    }
  }

  async enviarResultsFinales(): Promise<void> {
    if (
      !this.userId ||
      !this.categoryId || this.categoryId.trim() === '' ||
      !this.categoryName || this.categoryName.trim() === '' ||
      this.level === null
    ) {
      console.error('Datos incompletos para enviar resultados finales.');
      Swal.fire({
        icon: 'error',
        title: 'Error de envío',
        text: 'No se pudo guardar tu progreso o puntaje. Vuelve a intentarlo.',
      });
      return;
    }

    try {
      const puntajeBody = {
        id: this.userId,
        category: this.categoryId,
        newscore: this.respuestasCorrectas.toString(),
        level: this.level,
      };
      await lastValueFrom(
        this.http.post(
          ' https://liked-walleye-trusting.ngrok-free.app/registerPuntaje',
          puntajeBody
        )
      );
      console.log('Puntaje registrado con éxito.');

      const totalQuestions = this.preguntas.length;
      const scorePercentage =
        totalQuestions > 0 ? this.respuestasCorrectas / totalQuestions : 0;
      const currentLevelNumber = this.level;

      let finalSwalTitle: string;
      let finalSwalText: string;
      let finalSwalIcon: 'success' | 'info' | 'warning' | 'error' = 'info';

      if (
        scorePercentage >= this.SUCCESS_THRESHOLD_PERCENTAGE &&
        currentLevelNumber < this.MAX_LEVELS_IN_CATEGORY
      ) {
        let highestCompletedLevelForCategory: number = 0;
        try {
          const progressResponse: any = await lastValueFrom(
            this.http.post(
              ' https://liked-walleye-trusting.ngrok-free.app/getProgress',
              { id: this.userId, category: this.categoryId }
            )
          );
          highestCompletedLevelForCategory = parseInt(progressResponse, 10);
        } catch (error) {
          console.warn('No se encontró progreso previo, asumiendo 0 o 1:', error);
          highestCompletedLevelForCategory = 0;
        }

        if (currentLevelNumber >= highestCompletedLevelForCategory) {
          const nextLevelToUnlock = currentLevelNumber + 1;

          const progressBody = {
            id: this.userId,
            category: this.categoryId,
            newlevel: nextLevelToUnlock,
          };
          await lastValueFrom(
            this.http.post(
              ' https://liked-walleye-trusting.ngrok-free.app/registerProgress',
              progressBody
            )
          );
          console.log(
            `Progreso de nivel actualizado a ${nextLevelToUnlock} para la categoría ID '${this.categoryId}'.`
          );
          finalSwalTitle = '¡Nivel Completado!';
          finalSwalText = `Has completado el Nivel ${currentLevelNumber} con éxito. ¡El Nivel ${nextLevelToUnlock} está desbloqueado!`;
          finalSwalIcon = 'success';
        } else {
          console.log(
            'Nivel completado, pero no se actualiza progreso porque ya tiene un nivel más alto registrado.'
          );
          finalSwalTitle = '¡Nivel Completado!';
          finalSwalText = `Has completado el Nivel ${currentLevelNumber} con éxito.`;
          finalSwalIcon = 'success';
        }
      } else {
        let message = `Has terminado el Nivel ${currentLevelNumber}. Respuestas correctas: ${this.respuestasCorrectas} de ${totalQuestions}.`;
        if (scorePercentage < this.SUCCESS_THRESHOLD_PERCENTAGE) {
          message += ` Necesitas al menos ${this.SUCCESS_THRESHOLD_PERCENTAGE * 100}% para desbloquear el siguiente nivel.`;
          finalSwalIcon = 'warning';
        } else if (currentLevelNumber === this.MAX_LEVELS_IN_CATEGORY) {
          message = `¡Felicidades! Has completado el último nivel (${currentLevelNumber}) de esta categoría.`;
          finalSwalIcon = 'info';
        }
        finalSwalTitle = 'Juego Terminado';
        finalSwalText = message;
      }

      await Swal.fire({
        icon: finalSwalIcon,
        title: finalSwalTitle,
        text: finalSwalText,
        confirmButtonText: 'Continuar'
      });

      this.router.navigate(['/puntajes']);

    } catch (error) {
      console.error('Error al registrar el puntaje o progreso:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de guardado',
        text: 'Hubo un problema al guardar tus resultados. Inténtalo de nuevo.',
      });
    }
  }
}
