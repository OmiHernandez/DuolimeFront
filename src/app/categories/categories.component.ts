import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
register();
// register Swiper custom elements
register();

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements AfterViewInit {
  

  @ViewChild('swiper') swiper!: ElementRef<any>

  constructor(private router: Router) {}

  slides = [
    {
      name: 'Banderas',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#ff3200',
      parametro:"Banderas"
    },
    {
      name: 'Series',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#ff9700',
      parametro:"Series"
    },
    {
      name: 'Películas',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#ffd500',
      parametro:"Películas"
    },
    {
      name: 'Cultura pop',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#a2da00',
      parametro:"Cultura pop"
    },
    {
      name: 'Historia',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#1ada00',
      parametro:"Historia"
    },
    {
      name: 'Arte',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#00da70',
      parametro:"Arte"
    },
    {
      name: 'Geografía',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#00dac6',
      parametro:"Geografía"
    },
    {
      name: 'Anime',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#0081da',
      parametro:"Anime"
    },
    {
      name: 'Ciencia',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#ac64e1',
      parametro:"Ciencia"
    },
    {
      name: 'Libros',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#b200da',
      parametro:"Libros"
    },
    {
      name: 'Videojuegos',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#f000d3',
      parametro:"Videojuegos"
    },
    {
      name: 'Música',
      description: 'Jujuy',
      image: '../assets/img/vi.jpg',
      bgColor: '#f0007f',
      parametro:"Música"
    }
  ];
  
  
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
    const swiperEl = event.target as any; // El evento proviene de `swiper-container`
    const activeIndex = swiperEl.swiper.activeIndex; // Obtiene el índice activo
    const activeSlide = swiperEl.querySelectorAll('swiper-slide')[activeIndex]; // Selecciona el slide activo
    const newBgColor = activeSlide.getAttribute('data-bg'); // Obtiene el color de fondo
    document.body.style.backgroundColor = newBgColor; // Cambia el fondo
  }

  /*onSlideChange(event: any) {
    console.log("AAAAAAA")
    const swiper = event[0].swiper; // Obtén la instancia de Swiper
    const activeSlide = swiper.slides[swiper.activeIndex];
    const newBgColor = activeSlide.getAttribute('data-bg');
    document.body.style.backgroundColor = newBgColor;
  }*/
  
    ngAfterViewInit(): void {
      this.swiper.nativeElement.initialize();
    }
  
    navigateToSlide(categoria:any){
      this.router.navigate(["/niveles", categoria]);
    }


}
