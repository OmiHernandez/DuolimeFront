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

  constructor(private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoria = this.route.snapshot.paramMap.get('categoria'); // Captura el parámetro directamente
    // O escucha cambios en los parámetros
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria');
      console.log(this.categoria)
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
}
