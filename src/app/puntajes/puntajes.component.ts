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
  puntajes: { [categoria: string]: number } = {};
  isLoggedIn: boolean = false;
  username: string = '';
  userId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.username = localStorage.getItem('username') || '';
      this.userId = localStorage.getItem('userId') || '';
      this.getCategories();
    } else {
      this.showLoginAlert();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('username') !== null;
  }

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
      } else {
        window.location.href = '/home';
      }
    });
  }

  getCategories(): void {
    this.http.post('http://localhost:3000/getCategories', {})
      .subscribe(
        (response: any) => {
          this.categorias = response.map((category: any) => category.name[0] || 'Sin nombre');
          this.getPuntajes();
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }

  getPuntajes(): void {
    this.categorias.forEach((categoria) => {
      this.http.post('http://localhost:3000/getPuntaje', { id: this.userId, category: categoria })
        .subscribe(
          (response: any) => {
            const puntaje = response ? response : 0;
            this.puntajes[categoria] = puntaje;
          },
          (error) => {
            console.error(`Error al obtener puntaje para la categoría ${categoria}:`, error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener puntajes',
              text: `No tienes puntajes registrados para la categoría "${categoria}" Ponte a ello!!!.`,
            });
          }
        );
    });
  }
}
