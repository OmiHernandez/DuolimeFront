import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  rankingGlobal: { nombre: string, aciertosTotales: number }[] = [];
  rankingTopPlayers: { nombre: string, aciertosTotales: number }[] = [];
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const usernameToken = localStorage.getItem('username');
    console.log('Username Token:', usernameToken);
    if (usernameToken) {
      this.isLoggedIn = true;
      this.getRankingGlobal();
    } else {
      this.isLoggedIn = false;
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

  async getRankingGlobal(): Promise<void> {
    try {
      const response: any = await lastValueFrom(
        this.http.post('https://roughly-expert-rabbit.ngrok-free.app/getRanking', {})
      );

      console.log('Respuesta del servidor para el ranking:', response);

      if (Array.isArray(response)) {
        this.rankingGlobal = response.map(userEntry => ({
          nombre: userEntry.username,
          aciertosTotales: parseInt(userEntry.total_score_global) || 0
        }));
        this.rankingGlobal.sort((a, b) => b.aciertosTotales - a.aciertosTotales);
        this.rankingTopPlayers = this.rankingGlobal.slice(0, 3);

      } else {
        console.warn('La respuesta del ranking no es un array:', response);
        this.rankingGlobal = [];
        this.rankingTopPlayers = [];
        Swal.fire({
          icon: 'info',
          title: 'Sin datos de ranking',
          text: 'No se encontraron datos de ranking o el formato es inesperado.',
        });
      }

      console.log('Ranking Global procesado:', this.rankingGlobal);
      console.log('Ranking Top Jugadores procesado:', this.rankingTopPlayers);

    } catch (error) {
      console.error('Error al obtener el ranking global:', error);
      this.rankingGlobal = [];
      this.rankingTopPlayers = [];
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar el ranking',
        text: 'Hubo un problema al obtener el ranking global. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }
}
