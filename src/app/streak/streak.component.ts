import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StreakService } from '../servicios/streak.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-streak',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streak.component.html',
  styleUrl: './streak.component.css'
})
export class StreakComponent {
  racha: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.updateRacha(userId);
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  updateRacha(userId: string): void {
    this.http.post('https://liked-walleye-trusting.ngrok-free.app/updateRacha', { id: userId })
      .subscribe({
        next: (response: any) => {
          this.racha = parseInt(response, 10);
        },
        error: () => {
          console.error('Error al actualizar la racha.');
        }
      });
  }
}
