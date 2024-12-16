import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css'],
})
export class NivelesComponent {
  categoria: string | null = null;
  backgroundStyle = '';
  userId: string | null = localStorage.getItem('userId');
  levels = Array.from({ length: 10 }, (_, index) => ({
    number: index + 1, // Nivel (del 1 al 10)
    unlocked: index === 0, // El nivel 1 está desbloqueado por defecto
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.categoria = this.route.snapshot.paramMap.get('categoria');
    this.updateBackground();

    if (this.userId && this.categoria) {
      this.getUserProgress(this.userId, this.categoria);
    }
  }

  /**
   * Actualiza los estilos de fondo según la categoría
   */
  updateBackground(): void {
    const backgroundStyles: { [key: string]: string } = {
      Banderas: 'linear-gradient(to bottom, #ff3200, #ff8b00)',
      Series: 'linear-gradient(to bottom, #ff9700, #ffdc00)',
      Películas: 'linear-gradient(to bottom, #ffd500, #a6ff00)',
      'Cultura pop': 'linear-gradient(to bottom, #a2da00, #00da1e)',
      Historia: 'linear-gradient(to bottom, #1ada00, #00da8e)',
      Arte: 'linear-gradient(to bottom, #00da70, #00dad0)',
      Geografía: 'linear-gradient(to bottom, #00dac6, #006dda)',
      Anime: 'linear-gradient(to bottom, #0081da, #2400da)',
      Ciencia: 'linear-gradient(to bottom, #ac64e1, #e164d9)',
      Libros: 'linear-gradient(to bottom, #b200da, #da00a5)',
      Videojuegos: 'linear-gradient(to bottom, #f000d3, #f0006d)',
      Música: 'linear-gradient(to bottom, #f0007f, #f00000)',
    };

    this.backgroundStyle = backgroundStyles[this.categoria || ''] || '';
  }

  /**
   * Obtiene el progreso del usuario desde el backend
   */
  getUserProgress(userId: string, category: string): void {
    this.http
      .post('https://liked-walleye-trusting.ngrok-free.app/getProgress', { id: userId, category })
      .subscribe({
        next: (response: any) => {
          const level = parseInt(response, 10);
          this.unlockLevelsUpTo(level);
        },
        error: (err) => {
          console.error('Error al obtener el progreso del usuario:', err);
        },
      });
  }

  /**
   * Desbloquea niveles hasta el especificado
   */
  unlockLevelsUpTo(level: number): void {
    this.levels.forEach((lvl, index) => {
      lvl.unlocked = index < level; // Desbloquea hasta el nivel actual
    });
  }

  /**
   * Registra el progreso y desbloquea el siguiente nivel
   */
  registerProgressAndUnlock(level: number): void {
    if (!this.userId || !this.categoria) {
      console.error('No se encontró el usuario o categoría.');
      return;
    }

    const nextLevel = level + 1;

    this.http
      .post('https://liked-walleye-trusting.ngrok-free.app/registerProgress', {
        id: this.userId,
        category: this.categoria,
        newlevel: nextLevel,
      })
      .subscribe({
        next: () => {
          console.log('Progreso registrado correctamente.');
          this.unlockLevelsUpTo(nextLevel);
        },
        error: (err) => {
          console.error('Error al registrar el progreso:', err);
        },
      });
  }

  /**
   * Navega al nivel seleccionado
   */
  navigateToSlide(category: string | null, level: number): void {
    if (category && this.levels[level - 1].unlocked) {
      this.registerProgressAndUnlock(level); // Registrar progreso al intentar un nivel
      this.router.navigate(['/juego', category, level]);
    }
  }
}
