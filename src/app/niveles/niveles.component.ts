import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [],
  templateUrl: './niveles.component.html',
  styleUrl: './niveles.component.css'
})
export class NivelesComponent {
  userId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id'); // Captura el parámetro directamente
    // O escucha cambios en los parámetros
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      console.log(this.userId)
    });
  }
}
