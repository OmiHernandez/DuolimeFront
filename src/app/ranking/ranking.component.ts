import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  categorias: string[] = [];
  rankingPorCategoria: { [categoria: string]: any[] } = {};
  rankingGlobal: any[] = [];
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('username');
    if (token) {
      this.isLoggedIn = true;
      this.getCategories();
    } else {
      this.showLoginAlert();
    }
  }

   showLoginAlert(): void {
     Swal.fire({
       icon: 'warning',
       title: '¡Atención!',
       text: 'Debes iniciar sesión para ver el Ranking.',
       confirmButtonText: 'Ir a Login',
       showCancelButton: true,
       cancelButtonText: 'Cancelar',
       reverseButtons: true
     }).then((result) => {
       if (result.isConfirmed) {
         window.location.href = '/loggin';
       } else if (result.isDismissed) {
         window.location.href = '/home';
       }
     });
   }

  // Obtener categorías del backend
  getCategories(): void {
    this.http.post('http://localhost:3000/getCategories', {})
      .subscribe(
        (response: any) => {
          this.categorias = response.map((category: any) => category.name[0] || 'Sin nombre');
          this.initializeRanking();
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }

  // Inicializar los puntajes (puedes ajustar esta lógica según tu backend)
  initializeRanking(): void {
    // Aquí deberías agregar la lógica para obtener y mostrar los puntajes para cada categoría
    this.categorias.forEach(categoria => {
      // Ejemplo de cómo podrías obtener los puntajes de cada categoría
      this.rankingPorCategoria[categoria] = [
        { nombre: 'Chuy', aciertos: 97, nivel1: 10, nivel2: 8, nivel3: 9, nivel4: 7 },
        { nombre: 'Lupe', aciertos: 95, nivel1: 10, nivel2: 8, nivel3: 7, nivel4: 8 },
        // Otros usuarios por categoría
      ];
    });

    this.calcularRankingGlobal();  // Calcular el ranking global después de inicializar los puntajes
  }

  // Función para calcular el ranking global
  calcularRankingGlobal() {
    let globalRanking: { nombre: string, aciertosTotales: number }[] = [];

    // Iterar por cada categoría y agregar los aciertos al ranking global
    Object.keys(this.rankingPorCategoria).forEach(categoria => {
      this.rankingPorCategoria[categoria].forEach(usuario => {
        let usuarioExistente = globalRanking.find(u => u.nombre === usuario.nombre);
        if (usuarioExistente) {
          usuarioExistente.aciertosTotales += usuario.aciertos;
        } else {
          globalRanking.push({ nombre: usuario.nombre, aciertosTotales: usuario.aciertos });
        }
      });
    });

    this.rankingGlobal = globalRanking.sort((a, b) => b.aciertosTotales - a.aciertosTotales);
  }
}
