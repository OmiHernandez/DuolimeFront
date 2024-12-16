import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-puntaje',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './puntajes.component.html',
  styleUrls: ['./puntajes.component.css']
})
export class PuntajeComponent implements OnInit {
  categorias: string[] = [];
  puntajes: { [categoria: string]: { id: string; score: number }[] } = {};
  isLoggedIn: boolean = false;
  username: string = '';  // Guarda el username
  userId: string = '';    // Guarda el id del usuario

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.username = localStorage.getItem('username') || '';
      this.userId = localStorage.getItem('userId') || '';  // Obtén el id del usuario
      console.log('UserId:', this.userId); // Verificación
      this.getCategories();  // Obtener categorías si el usuario está logueado
    } else {
      this.showLoginAlert();
    }
  }

  // Verificar si el usuario está logueado
  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('username') !== null;
    console.log('Está logueado:', this.isLoggedIn);  // Verificación
  }

  // Mostrar alerta si el usuario no está logueado
  showLoginAlert(): void {
    Swal.fire({
      icon: 'warning',
      title: '¡Atención!',
      text: 'Debes iniciar sesión para ver los puntajes por categoría.',
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

  // Obtener categorías
  getCategories(): void {
    this.http.post('http://localhost:3000/getCategories', {})
      .subscribe(
        (response: any) => {
          console.log('Categorías obtenidas:', response);  // Verificación
          this.categorias = response.map((category: any) => category.name[0] || 'Sin nombre');
          this.getPuntajes();  // Obtener puntajes después de obtener las categorías
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }

  getPuntajes(): void {
    this.categorias.forEach((categoria) => {
      console.log(`Enviando solicitud a: http://localhost:3000/getPuntaje?id=${this.userId}&category=${categoria}`);
      this.http.post('http://localhost:3000/getPuntaje', { id: this.userId, category: categoria })
        .subscribe(
          (response: any) => {
            // Suponemos que la respuesta tiene la estructura: { category: 'Anime', score: 510 }
            const puntaje = response.score ? response.score : 0;

            // Si no existe la categoría en puntajes, inicialízala
            if (!this.puntajes[categoria]) {
              this.puntajes[categoria] = [];
            }

            // Guarda el puntaje para el usuario en esta categoría
            this.puntajes[categoria].push({ id: this.userId, score: puntaje });
          },
          (error) => {
            console.error(`Error al obtener puntaje para la categoría ${categoria}:`, error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener puntajes',
              text: `No se pudo obtener el puntaje para la categoría "${categoria}".`,
            });
          }
        );
    });
  }


}
