import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Category {
  id: number;
  name: string;
}

interface UserProgress {
  category: Category;
  level: number;
}

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progreso.component.html',
  styleUrl: './progreso.component.css'
})
export class ProgresoComponent implements OnInit {
  isLoggedIn: boolean = false;
  userId: string | null = null;
  categorias: Category[] = [];
  userProgressMap: { [categoryId: number]: number } = {};
  userProgressList: UserProgress[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn && this.userId) {
      this.loadProgressData();
    } else {
      this.showLoginAlert();
    }
  }

  checkLoginStatus(): void {
    this.userId = localStorage.getItem('userId');
    this.isLoggedIn = this.userId !== null;
  }

  showLoginAlert(): void {
    Swal.fire({
      icon: 'warning',
      title: '¡Atención!',
      text: 'Debes iniciar sesión para ver tu progreso.',
      confirmButtonText: 'Ir a Login',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/loggin']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  async loadProgressData(): Promise<void> {
    try {
      const categoriesResponse: any = await lastValueFrom(
        this.http.post(' https://next-eel-firmly.ngrok-free.app/getCategories', {})
      );

      this.categorias = categoriesResponse.map((cat: any) => ({
        id: cat.id,
        name: (Array.isArray(cat.name) ? cat.name[0] : cat.name) || 'Sin nombre',
      }));

      const progressPromises = this.categorias.map(async (category) => {
        try {
          const progressResponse: any = await lastValueFrom(
            this.http.post(
              ' https://next-eel-firmly.ngrok-free.app/getProgress',
              { id: this.userId, category: category.id }
            )
          );
          const level = parseInt(progressResponse, 10);
          this.userProgressMap[category.id] = level;
          this.userProgressList.push({ category: category, level: level });
        } catch (error) {
          console.warn(`No se encontró progreso para la categoría ${category.name} (ID: ${category.id}) o hubo un error:`, error);
          this.userProgressMap[category.id] = 0;
          this.userProgressList.push({ category: category, level: 0 });
        }
      });

      await Promise.all(progressPromises);
      console.log('Progreso de usuario cargado:', this.userProgressList);
      this.userProgressList.sort((a, b) => a.category.name.localeCompare(b.category.name));

    } catch (error) {
      console.error('Error general al cargar los datos de progreso:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar progreso',
        text: 'Hubo un problema al obtener tu progreso. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }
}
