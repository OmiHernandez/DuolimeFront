import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './niveles.component.html',
  styleUrl: './niveles.component.css',
})
export class NivelesComponent {
  categoria: string | null = null;
  backgroundStyle = '';
  userId: string | null = localStorage.getItem('userId');
  levels = Array.from({ length: 10 }, (_, index) => ({
    number: index + 1, // Nivel (del 1 al 10)
    unlocked: false, // Todos bloqueados inicialmente
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient // Inyección de HttpClient para hacer solicitudes
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
    switch (this.categoria) {
      case 'Banderas':
        this.backgroundStyle = 'linear-gradient(to bottom, #ff3200, #ff8b00)';
        break;
      case 'Series':
        this.backgroundStyle = 'linear-gradient(to bottom, #ff9700, #ffdc00)';
        break;
      case 'Películas':
        this.backgroundStyle = 'linear-gradient(to bottom, #ffd500, #a6ff00)';
        break;
      case 'Cultura pop':
        this.backgroundStyle = 'linear-gradient(to bottom, #a2da00, #00da1e)';
        break;
      case 'Historia':
        this.backgroundStyle = 'linear-gradient(to bottom, #1ada00, #00da8e)';
        break;
      case 'Arte':
        this.backgroundStyle = 'linear-gradient(to bottom, #00da70, #00dad0)';
        break;
      case 'Geografía':
        this.backgroundStyle = 'linear-gradient(to bottom, #00dac6, #006dda)';
        break;
      case 'Anime':
        this.backgroundStyle = 'linear-gradient(to bottom, #0081da, #2400da)';
        break;
      case 'Ciencia':
        this.backgroundStyle = 'linear-gradient(to bottom, #ac64e1, #e164d9)';
        break;
      case 'Libros':
        this.backgroundStyle = 'linear-gradient(to bottom, #b200da, #da00a5)';
        break;
      case 'Videojuegos':
        this.backgroundStyle = 'linear-gradient(to bottom, #f000d3, #f0006d)';
        break;
      case 'Música':
        this.backgroundStyle = 'linear-gradient(to bottom, #f0007f, #f00000)';
        break;
    }
  }
  /**
   * Obtiene el progreso del usuario desde el backend
   */
  getUserProgress(userId: string, category: string): void {
    this.http
      .post('http://localhost:3000/getProgress', { id: userId, category })
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
   * Registra el progreso del usuario en el backend
   */
  registerProgress(userId: string, category: string, newLevel: number): void {
    this.http
      .post('http://localhost:3000/registerProgress', {
        id: userId,
        category,
        newlevel: newLevel,
      })
      .subscribe({
        next: () => {
          console.log('Progreso registrado correctamente.');
          this.unlockNextLevel(newLevel - 1);
        },
        error: (err) => {
          console.error('Error al registrar el progreso:', err);
        },
      });
  }

  /**
   * Desbloquea el siguiente nivel en la interfaz
   */
  unlockNextLevel(currentLevel: number): void {
    if (currentLevel < this.levels.length - 1) {
      this.levels[currentLevel + 1].unlocked = true;
    }
  }

  /**
   * Navega al nivel seleccionado
   */
  navigateToSlide(category: string | null, level: number): void {
    if (category && this.levels[level - 1].unlocked) {
      this.router.navigate(['/juego', category, level]);
    }
  }

  /**
   * Juega el siguiente nivel desbloqueado
   */
  playNextUnlocked(): void {
    const nextUnlocked = this.levels.find((lvl) => !lvl.unlocked);
    if (nextUnlocked) {
      const nextLevel = nextUnlocked.number;
      if (this.categoria && this.userId) {
        this.registerProgress(this.userId, this.categoria, nextLevel);
      }
      this.navigateToSlide(this.categoria, nextLevel);
    }
  }
}
