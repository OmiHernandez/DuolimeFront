import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import Swiper from 'swiper';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements AfterViewInit {
  cards = [
    {
      name: 'Mohamed Yousef',
      description: 'The lorem text the section that contains header with having open functionality. Lorem dolor sit amet consectetur adipisicing elit.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'orange'
    },
    {
      name: 'John Doe',
      description: 'Sample description for John Doe. Lorem ipsum dolor sit amet.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'purple'
    },
    {
      name: 'Jane Smith',
      description: 'Sample description for Jane Smith. Lorem ipsum dolor sit amet.',
      image: 'https://tinypic.host/images/2022/12/19/img_avatar.png',
      bgColor: 'green'
    }
  ];

  items = [
    { title: 'Banderas', action: 'Entrar' },
    { title: 'Series', action: 'Entrar' },
    { title: 'Películas', action: 'Entrar' },
    { title: 'Videojuegos', action: 'Entrar' },
    { title: 'Ciencias', action: 'Entrar' },
  ];
  
  ngAfterViewInit(): void {
    const swiper = new Swiper('.slide-content', {
      slidesPerView: 3,
      spaceBetween: 25,
      loop: true,
      centeredSlides: true, // Cambiado a boolean
      fadeEffect: { crossFade: true }, // Cambiado a boolean
      grabCursor: true, // Cambiado a boolean
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        520: {
          slidesPerView: 2,
        },
        950: {
          slidesPerView: 3,
        },
      },
    });

    swiper.on('slideChange', () => {
      const activeSlide = swiper.slides[swiper.activeIndex];
      const newBgColor = activeSlide.getAttribute('data-bg') ?? 'white'; // Default color
      document.body.style.backgroundColor = newBgColor;
    });
  }
}
