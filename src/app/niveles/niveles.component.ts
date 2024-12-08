import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './niveles.component.html',
  styleUrl: './niveles.component.css'
})
export class NivelesComponent {
  categoria: string | null = null;
  backgroundStyle = '';

  constructor(private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoria = this.route.snapshot.paramMap.get('categoria'); // Captura el parámetro directamente
    // O escucha cambios en los parámetros
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria');
      console.log(this.categoria)
      this.updateBackground()
    });
  }

  levels = Array.from({ length: 10 }, (_, index) => ({
    number: index + 1, // Nivel (del 1 al 10)
    unlocked: index === 0, // Solo el primer nivel está desbloqueado al inicio
  }));

  unlockNextLevel(currentLevel: number): void {
    if (currentLevel < this.levels.length) {
      this.levels[currentLevel].unlocked = true; // Desbloquea el siguiente nivel
    }
  }

  navigateToSlide(categoria:any,level:any){
    this.router.navigate(["/juego", categoria,level]);
  }

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

}
