import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  data_subscription: Subscription;
  constructor(private homeService: HomeService) {
    this.data_subscription = interval(500).subscribe((x) => {
      this.get_counts();
    });
  }
  get_counts() {
    this.homeService.getTotalCount().subscribe((data: any) => {
      this.total_counter = data.total
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    this.homeService.getCourtCount().subscribe((data: any) => {
      this.court_counter = data.total;
    });
    this.homeService.getIndSCCount().subscribe((data: any) => {
      this.ind_sc_total_counter = data.total.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    this.homeService.getIndHCCount().subscribe((data: any) => {
      this.ind_hc_total_counter = data.total.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    this.homeService.getIndTribunalCount().subscribe((data: any) => {
      this.ind_tribunal_total_counter = data.total.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    this.homeService.getSgSCCount().subscribe((data: any) => {
      this.sg_sc_total_counter = data.total.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
  }
  total_counter: any = 0;
  court_counter: any = 0;
  ind_sc_total_counter:any=0;
  ind_hc_total_counter:any=0;
  ind_tribunal_total_counter:any=0;
  sg_sc_total_counter:any=0;
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
    // document.getElementById('redirect')?.click();
    this.get_counts();
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
