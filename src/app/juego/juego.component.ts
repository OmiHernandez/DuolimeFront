import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent {
  categoria: string | null = null;
  level: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoria = this.route.snapshot.paramMap.get('categoria'); // Captura el parámetro directamente
    this.level = this.route.snapshot.paramMap.get('level'); // Captura el parámetro directamente

    // O escucha cambios en los parámetros
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria');
      this.level = params.get('level');

      console.log(`Categoria: ${this.categoria}, nivel ${this.level}`)
    });
  }
}
