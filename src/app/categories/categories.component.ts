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
      name: 'Mohamed Yousef',
      description: 'The lorem text the section that contains header with having open functionality. Lorem dolor sit amet consectetur adipisicing elit.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'orange',
      parametro:"1"
    },
    {
      name: 'John Doe',
      description: 'Sample description for John Doe. Lorem ipsum dolor sit amet.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'purple',
      parametro:"2"
    },
    {
      name: 'Jane Smith',
      description: 'Sample description for Jane Smith. Lorem ipsum dolor sit amet.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'green',
      parametro:"3"
    },
    {
      name: 'Mohamed Yousef',
      description: 'The lorem text the section that contains header with having open functionality. Lorem dolor sit amet consectetur adipisicing elit.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'orange',
      parametro:"4"
    },
    {
      name: 'John Doe',
      description: 'Sample description for John Doe. Lorem ipsum dolor sit amet.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'purple',
      parametro:"5"
    },
    {
      name: 'Jane Smith',
      description: 'Sample description for Jane Smith. Lorem ipsum dolor sit amet.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'green',
      parametro:"6"
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
  
    navigateToSlide(id:any){
      this.router.navigate(["/niveles", id]);
    }

    
}
