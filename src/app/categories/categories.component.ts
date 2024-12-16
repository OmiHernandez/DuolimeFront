import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
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
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements AfterViewInit, OnInit {
  @ViewChild('swiper') swiper!: ElementRef<any>;

  constructor(private http: HttpClient, private router: Router) {}

  slides: any[] = [];

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
    const swiperEl = event.target as any;
    const activeIndex = swiperEl.swiper.activeIndex;
    const activeSlide = swiperEl.querySelectorAll('swiper-slide')[activeIndex];
    const newBgColor = activeSlide.getAttribute('data-bg');
    document.body.style.backgroundColor = newBgColor;
  }

  ngAfterViewInit(): void {
    this.swiper.nativeElement.initialize();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  // Método para obtener las categorías desde el backend
  getCategories(): void {
    this.http.post('https://liked-walleye-trusting.ngrok-free.app/getCategories', {})
      .subscribe(
        (response: any) => {
          this.slides = response.map((category: any) => ({
            name: category.name[0] || 'Sin nombre',
            description: category.description[0] || '',
            image: category.image[0] || '../assets/img/default.jpg',
            bgColor: category.bgColor[0] || '#ffffff',
            parametro: category.parametro[0] || category.name[0],
          }));
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }


  navigateToSlide(categoria: any): void {
    this.router.navigate(['/niveles', categoria]);
  }
}
