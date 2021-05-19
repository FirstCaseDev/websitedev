import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}
  testimonials: any[] = [
    {
      name: 'Saul Goodman',
      src: '../../assets/img/testimonials/testimonials-1.jpg',
      alt: 'Image 1',
      title: 'CEO & Founder',
    },
    {
      name: 'Sara Wilson',
      src: '../../assets/img/testimonials/testimonials-2.jpg',
      alt: 'Image 2',
      title: 'Designer',
    },
    {
      name: 'Jena Karlis',
      src: '../../assets/img/testimonials/testimonials-3.jpg',
      alt: 'Image 3',
      title: 'Store Owner',
    },
    {
      name: 'Matt Brandon',
      src: '../../assets/img/testimonials/testimonials-4.jpg',
      alt: 'Image 4',
      title: 'Freelancer',
    },
    {
      name: 'John Larson',
      src: '../../assets/img/testimonials/testimonials-5.jpg',
      alt: 'Image 5',
      title: 'Entrepreneur',
    },
  ];

  clients: any[] = [
    {
      src: '../../assets/img/clients/client-1.png',
    },
    {
      src: '../../assets/img/clients/client-2.png',
    },
    {
      src: '../../assets/img/clients/client-3.png',
    },
    {
      src: '../../assets/img/clients/client-4.png',
    },
    {
      src: '../../assets/img/clients/client-5.png',
    },
    {
      src: '../../assets/img/clients/client-6.png',
    },
    {
      src: '../../assets/img/clients/client-7.png',
    },
    {
      src: '../../assets/img/clients/client-8.png',
    },
  ];

  ngOnInit(): void {
    document.getElementById('redirect')?.click();
  }

  config: SwiperOptions = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    spaceBetween: 100,
    slidesPerView: 3,
    observer: false, // Set to to true to enable automatic update calls.
    // spaceBetween: 30,              // Space in pixels between the Swiper items (Default: 0).
    // slidesPerView: 2,             // Number of the items per view or 'auto' (Default: 1).
    direction: 'horizontal', // Direction of the Swiper (Default: 'horizontal').
    threshold: 10, // Distance needed for the swipe action (Default: 0).
    centeredSlides: false,
  };
}

// /**
//    * Clients Slider
//    */
//  new Swiper(".clients-slider", {
//   speed: 400,
//   loop: true,
//   autoplay: {
//     delay: 5000,
//     disableOnInteraction: false,
//   },
//   slidesPerView: "auto",
//   pagination: {
//     el: ".swiper-pagination",
//     type: "bullets",
//     clickable: true,
//   },
//   breakpoints: {
//     320: {
//       slidesPerView: 2,
//       spaceBetween: 40,
//     },
//     480: {
//       slidesPerView: 3,
//       spaceBetween: 60,
//     },
//     640: {
//       slidesPerView: 4,
//       spaceBetween: 80,
//     },
//     992: {
//       slidesPerView: 6,
//       spaceBetween: 120,
//     },
//   },
// });

// /**
//  * Testimonials slider
//  */
// new Swiper(".testimonials-slider", {
//   speed: 600,
//   loop: true,
//   autoplay: {
//     delay: 5000,
//     disableOnInteraction: false,
//   },
//   slidesPerView: "auto",
//   pagination: {
//     el: ".swiper-pagination",
//     type: "bullets",
//     clickable: true,
//   },
//   breakpoints: {
//     320: {
//       slidesPerView: 1,
//       spaceBetween: 40,
//     },

//     1200: {
//       slidesPerView: 3,
//     },
//   },
// });

// /**
//  * Animation on scroll
//  */
// function aos_init() {
//   AOS.init({
//     duration: 1000,
//     easing: "ease-in-out",
//     once: true,
//     mirror: false,
//   });
// }
// window.addEventListener("load", () => {
//   aos_init();
// });
// })();
