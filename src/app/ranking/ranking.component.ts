import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  rankingGlobal: { nombre: string, aciertosTotales: number }[] = [];
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('username');
    console.log('Token:', token);
    if (token) {
      this.isLoggedIn = true;
      this.getRankingGlobal();
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

  getRankingGlobal(): void {
    this.http.post('http://localhost:3000/getRanking', {})
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor:', response);

          // Asegurarnos de que response sea un array
          const users = Array.isArray(response) ? response : [response];

          this.rankingGlobal = users.map(user => ({
            nombre: `Usuario ${user.$.id}`,
            aciertosTotales: parseInt(user.maxscore[0])
          }));

          // Ordenar por aciertos totales
          this.rankingGlobal.sort((a, b) => b.aciertosTotales - a.aciertosTotales);

          console.log('Ranking procesado:', this.rankingGlobal);
        },
        error: (error) => {
          console.error('Error al obtener el ranking global:', error);
          this.rankingGlobal = [];
        }
      });
  }

}
