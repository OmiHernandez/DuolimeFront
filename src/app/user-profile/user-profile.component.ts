import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userData: any = null;
  currentUserId: string | null = null;
  isCurrentUser: boolean = false;
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router  // Cambiado de private a public
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = localStorage.getItem('userId');
    const userId = this.route.snapshot.paramMap.get('userId');
    
    if (!userId) {
      this.router.navigate(['/ranking']);
      return;
    }

    this.isCurrentUser = this.currentUserId === userId;

    try {
      const response: any = await lastValueFrom(
        this.http.post('https://next-eel-firmly.ngrok-free.app/getUserProfile', { id: userId })
      );

      if (response) {
        this.userData = response;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró el perfil del usuario'
        });
        this.router.navigate(['/ranking']);
      }
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar el perfil'
      });
      this.router.navigate(['/ranking']);
    } finally {
      this.loading = false;
    }
  }
  getInitials(username: string): string {
  if (!username) return '';
  const parts = username.split(' ');
  return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
}

formatDate(dateString: string): string {
  if (!dateString) return 'fecha desconocida';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

calculateProgress(score: number): number {
  // Ajusta este cálculo según tus necesidades
  const maxScore = 1000; // Puedes cambiar esto según tu lógica
  return Math.min((score / maxScore) * 100, 100);
}
}