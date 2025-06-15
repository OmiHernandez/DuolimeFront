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
import { RouterModule, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
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

  onSlideChange(event: Event) {
    if (!this.swiperInitialized || this.slides.length === 0) return;
    const swiperEl = event.target as any;
    if (!swiperEl.swiper) {
      console.warn('Swiper instance not available');
      return;
    }
    const activeIndex = swiperEl.swiper.activeIndex;
    const slides = swiperEl.querySelectorAll('swiper-slide');

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
      console.log('[CategoriesComponent] Swiper initialized successfully');
    } catch (error) {
      console.error('[CategoriesComponent] Swiper initialization failed:', error);
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.http
      .post('https://roughly-expert-rabbit.ngrok-free.app/getCategories', {})
      .subscribe(
        (response: any) => {
          console.log(
            '[CategoriesComponent] Respuesta completa del backend para getCategories:',
            response
          );
          this.slides = response.map((category: any) => {
            console.log(
              `[CategoriesComponent DEBUG - Backend Category] ID: '${category.id}' (tipo: ${typeof category.id}), Nombre: '${category.name}' (tipo: ${typeof category.name})`
            );
            return {
              id: category.id,
              name: category.name || 'Sin nombre',
              description: 'Descripción no disponible',
              image: '../assets/img/vi.jpg',
              bgColor: this.getRandomColor(),
            };
          });
          if (this.slides.length > 0) {
            this.initializeSwiper();
          } else {
            console.warn('[CategoriesComponent] No se cargaron categorías. Swiper no inicializado.');
          }
        },
        (error) => {
          console.error(
            '[CategoriesComponent] Error al obtener categorías del backend:',
            error
          );
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

  navigateToSlide(slide: any): void {
    if (slide && slide.id && slide.name) {
      console.log(
        `[CategoriesComponent DEBUG] Navegando a niveles con ID: ${slide.id}, Nombre: ${slide.name}`
      );
      this.router.navigate(['/niveles', slide.id, slide.name]);
    } else {
      console.error(
        '[CategoriesComponent ERROR] Datos de slide incompletos para navegar.',
        slide
      );
    }
  }
}
