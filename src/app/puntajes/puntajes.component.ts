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
  puntajes: { [categoria: string]: number[] } = {};
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
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
      } else if (result.isDismissed) {
        window.location.href = '/home';
      }
    });
  }

  getCategories(): void {
    this.http.post('http://localhost:3000/getCategories', {})
      .subscribe(
        (response: any) => {
          this.categorias = response.map((category: any) => category.name[0] || 'Sin nombre');
          this.initializePuntajes();
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }

  initializePuntajes(): void {
    this.categorias.forEach(categoria => {
      this.puntajes[categoria] = Array(10).fill(0);
    });
  }

  actualizarPuntaje(categoria: string, nivel: number, aciertos: number): void {
    if (nivel >= 1 && nivel <= 10) {
      this.puntajes[categoria][nivel - 1] = aciertos;
    }
  }
}
