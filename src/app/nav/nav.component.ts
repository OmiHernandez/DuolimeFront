import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  userRankingPosition: number | null = null;
  userTotalScore: number | null = null;
  constructor(public router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.username) {
      this.getUserRankingPosition();
    }
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  get userId(): string | null {
    return localStorage.getItem('userId');
  }

  async getUserRankingPosition(): Promise<void> {
    try {
      const response: any = await lastValueFrom(
        this.http.post('https://roughly-expert-rabbit.ngrok-free.app/getRanking', {})
      );

      if (Array.isArray(response)) {
        const globalRanking = response.map(userEntry => ({
          username: userEntry.username,
          totalScore: parseInt(userEntry.total_score_global) || 0
        }));

        globalRanking.sort((a, b) => b.totalScore - a.totalScore);

        const currentUser = this.username;
        const foundIndex = globalRanking.findIndex(user => user.username === currentUser);

        if (foundIndex !== -1) {
          this.userRankingPosition = foundIndex + 1;
          this.userTotalScore = globalRanking[foundIndex].totalScore;
        } else {
          this.userRankingPosition = null;
          this.userTotalScore = null;
          console.warn('Usuario actual no encontrado en el ranking global del NavComponent.');
        }

      } else {
        console.warn('La respuesta del ranking no es un array o es inesperada en NavComponent:', response);
        this.userRankingPosition = null;
        this.userTotalScore = null;
      }
    } catch (error) {
      console.error('Error al obtener el ranking para el NavComponent:', error);
      this.userRankingPosition = null;
      this.userTotalScore = null;
    }
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.router.navigate(['/loggin']);
  }
}
