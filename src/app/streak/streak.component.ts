import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface UserStreakEntry {
  nombre: string;
  rachaTotal: number;
}

@Component({
  selector: 'app-streak',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streak.component.html',
  styleUrl: './streak.component.css'
})
export class StreakComponent implements OnInit {
  racha: number | null = null;
  isLoggedIn: boolean = false;

  streakRankingGlobal: UserStreakEntry[] = [];
  streakRankingTopPlayers: UserStreakEntry[] = [];
  currentUserStreakPosition: number | null = null;
  currentUserUsername: string = '';

  showGlobalStreakModal: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      const userId = localStorage.getItem('userId');
      this.currentUserUsername = localStorage.getItem('username') || '';
      if (userId) {
        this.updateRacha(userId);
        this.getStreakRankings();
      } else {
        console.error('UserId no encontrado en localStorage.');
      }
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
      text: 'Debes iniciar sesión para ver tu Racha y los Rankings.',
      confirmButtonText: 'Ir a Login',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/loggin']);
      } else if (result.isDismissed) {
        this.router.navigate(['/home']);
      }
    });
  }

  async updateRacha(userId: string): Promise<void> {
    try {
      const response: any = await lastValueFrom(
        this.http.post('https://roughly-expert-rabbit.ngrok-free.app/updateRacha', { id: userId })
      );
      this.racha = parseInt(response, 10);
    } catch (error) {
      console.error('Error al actualizar la racha personal:', error);
      this.racha = 0;
    }
  }

  async getStreakRankings(): Promise<void> {
    try {
      const response: any = await lastValueFrom(
        this.http.post('https://roughly-expert-rabbit.ngrok-free.app/getStreakRanking', {})
      );

      console.log('Respuesta del servidor para ranking de rachas:', response);

      if (Array.isArray(response)) {
        this.streakRankingGlobal = response.map(entry => ({
          nombre: entry.username,
          rachaTotal: parseInt(entry.streak_count) || 0
        }));
        this.streakRankingGlobal.sort((a, b) => b.rachaTotal - a.rachaTotal);
        this.streakRankingTopPlayers = this.streakRankingGlobal.slice(0, 3);
        const foundIndex = this.streakRankingGlobal.findIndex(
          user => user.nombre === this.currentUserUsername
        );
        if (foundIndex !== -1) {
          this.currentUserStreakPosition = foundIndex + 1;
        } else {
          this.currentUserStreakPosition = null;
        }

      } else {
        console.warn('La respuesta del ranking de rachas no es un array:', response);
        this.streakRankingGlobal = [];
        this.streakRankingTopPlayers = [];
        this.currentUserStreakPosition = null;
      }
    } catch (error) {
      console.error('Error al obtener los rankings de racha:', error);
      this.streakRankingGlobal = [];
      this.streakRankingTopPlayers = [];
      this.currentUserStreakPosition = null;
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar rankings de racha',
        text: 'Hubo un problema al obtener los rankings de racha. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  openGlobalStreakRankingModal(): void {
    this.showGlobalStreakModal = true;
    document.body.classList.add('modal-open');
  }

  closeGlobalStreakRankingModal(): void {
    this.showGlobalStreakModal = false;
    document.body.classList.remove('modal-open');
  }
}
