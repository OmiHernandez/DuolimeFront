import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
// Registrar Swiper custom elements
register();

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements AfterViewInit, OnInit {
  @ViewChild('swiper') swiper!: ElementRef<any>;

  constructor(private http: HttpClient, private router: Router) {}

  slides: any[] = [];
  swiperInitialized = false;

  slidesPerView = 1;
  spaceBetween = 25;

  paginationConfig = {
    clickable: true,
    dynamicBullets: true,
  };

  breakpoints = {
    0: { slidesPerView: 1 },
    520: { slidesPerView: 2 },
    950: { slidesPerView: 3 },
  };

  // Evento para cambiar el fondo según el slide activo
  onSlideChange(event: Event) {
    if (!this.swiperInitialized || this.slides.length === 0) return;
    const swiperEl = event.target as any;
    if (!swiperEl.swiper) {
      console.warn('Swiper instance not available');
      return;
    }
    const activeIndex = swiperEl.swiper.activeIndex;
    const slides = swiperEl.querySelectorAll('swiper-slide');

    // Verificar que exista el slide activo
    if (!slides || slides.length <= activeIndex) {
      console.warn('Active slide not found');
      return;
    }

    const activeSlide = slides[activeIndex];
    const newBgColor = activeSlide.getAttribute('data-bg');
    if (newBgColor) {
      document.body.style.backgroundColor = newBgColor;
    }
  }

  ngAfterViewInit(): void {
    if (this.slides.length > 0) {
      this.initializeSwiper();
    }
  }

  private initializeSwiper() {
    try {
      this.swiper.nativeElement.initialize();
      this.swiperInitialized = true;
      console.log('Swiper initialized successfully');
    } catch (error) {
      console.error('Swiper initialization failed:', error);
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  // Método para obtener las categorías desde el backend
  getCategories(): void {
    this.http
      .post('https://next-eel-firmly.ngrok-free.app/getCategories', {})
      .subscribe(
        (response: any) => {
          console.log('Categorías obtenidas:', response);
          this.slides = response.map((category: any) => ({
            id: category.id,
            name: category.name || 'Sin nombre',
            // Valores por defecto para propiedades faltantes
            description: 'Descripción no disponible',
            image: '../assets/img/vi.jpg',
            bgColor: this.getRandomColor(), // Generar color aleatorio
            parametro: category.name, // Usar ID como parámetro
          }));
          this.initializeSwiper();
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }

  private getRandomColor(): string {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  }

  navigateToSlide(categoria: any): void {
    this.router.navigate(['/niveles', categoria]);
  }
}
