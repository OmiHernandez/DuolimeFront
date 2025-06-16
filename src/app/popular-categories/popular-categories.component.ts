import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

interface PopularCategory {
  category_id: number;
  category_name: string;
  total_score: number;
}

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css'
})
export class PopularCategoriesComponent implements OnInit {
  popularCategories: PopularCategory[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPopularCategories();
  }

  async getPopularCategories(): Promise<void> {
    this.isLoading = true;
    try {
      const response: any = await lastValueFrom(
        this.http.post(' https://liked-walleye-trusting.ngrok-free.app/getPopularCategories', {})
      );

      console.log('Categorías populares obtenidas:', response);

      if (Array.isArray(response)) {
        this.popularCategories = response.map((cat: any) => ({
          category_id: cat.category_id,
          category_name: cat.category_name || 'Sin nombre',
          total_score: parseInt(cat.total_score, 10) || 0,
        }));
        this.popularCategories.sort((a, b) => b.total_score - a.total_score);

      } else {
        console.warn('La respuesta de categorías populares no es un array:', response);
        this.popularCategories = [];
      }
    } catch (error) {
      console.error('Error al obtener categorías populares:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No se pudieron cargar las categorías populares. Por favor, inténtalo de nuevo más tarde.',
      });
      this.popularCategories = [];
    } finally {
      this.isLoading = false;
    }
  }
}
