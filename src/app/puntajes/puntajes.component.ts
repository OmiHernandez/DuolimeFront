import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';

interface Category {
  id: number;
  name: string;
}

interface UserScore {
  username: string;
  score: number;
  position?: number;
}

@Component({
  selector: 'app-puntaje',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './puntajes.component.html',
  styleUrls: ['./puntajes.component.css']
})
export class PuntajeComponent implements OnInit {
  categorias: Category[] = [];
  allCategoryScores: { [categoryId: number]: UserScore[] } = {};
  isLoggedIn: boolean = false;
  username: string = '';
  userId: string = '';

  showModal: boolean = false;
  selectedCategory: Category | null = null;
  selectedCategoryScores: UserScore[] | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.username = localStorage.getItem('username') || '';
      this.userId = localStorage.getItem('userId') || '';
      this.getCategoriesAndAllScores();
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

  async getCategoriesAndAllScores(): Promise<void> {
    try {
      const categoriesResponse: any = await lastValueFrom(
        this.http.post('https://roughly-expert-rabbit.ngrok-free.app/getCategories', {})
      );
      this.categorias = categoriesResponse.map((category: any) => ({
        id: category.id,
        name: (Array.isArray(category.name) ? category.name[0] : category.name) || 'Sin nombre'
      }));

      const scorePromises = this.categorias.map(async (category) => {
        try {
          const scores: UserScore[] = await lastValueFrom(
            this.http.post<UserScore[]>(
              'https://roughly-expert-rabbit.ngrok-free.app/getScoresByCategory',
              { categoryId: category.id }
            )
          );

          scores.forEach((scoreEntry, index) => {
            scoreEntry.position = index + 1;
          });

          this.allCategoryScores[category.id] = scores;
        } catch (error) {
          console.error(`Error al obtener puntajes para la categoría ${category.name} (ID: ${category.id}):`, error);
          this.allCategoryScores[category.id] = [];
        }
      });

      await Promise.all(scorePromises);
      console.log('Todas las categorías y sus puntajes cargados:', this.allCategoryScores);

    } catch (error) {
      console.error('Error general al obtener categorías o puntajes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No se pudieron cargar las categorías o los puntajes. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  openScoresModal(category: Category): void {
    this.selectedCategory = category;
    this.selectedCategoryScores = this.allCategoryScores[category.id] || [];
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeScoresModal(): void {
    this.showModal = false;
    this.selectedCategory = null;
    this.selectedCategoryScores = null;
    document.body.classList.remove('modal-open');
  }
}
