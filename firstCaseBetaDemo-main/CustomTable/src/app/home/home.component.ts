import { Component, OnInit } from '@angular/core';
import List from '../models/case';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  rows: List[] = [];
  headers = ['idx', 'name', 'age', 'gender', 'country'];

  // loadScripts() {
  //   const dynamicScripts = ['../../assets/scripts/search.js'];
  //   for (let i = 0; i < dynamicScripts.length; i++) {
  //     const node = document.createElement('script');
  //     node.src = dynamicScripts[i];
  //     node.type = 'text/javascript';
  //     node.async = false;
  //     node.charset = 'utf-8';
  //     document.getElementsByTagName('head')[0].appendChild(node);
  //   }
  // }

  constructor(private homeService: HomeService) {
    // this.loadScripts();
  }

  ngOnInit(): void {
    this.homeService
      .getCases()
      .subscribe((data: any) => (this.rows = data.list));
  }
}

// inside -- export class HomeComponent implements OnInit
// rows = [
//   {
//     idx: '1',
//     name: 'Rahul',
//     age: '21',
//     gender: 'Male',
//     country: 'India',
//   },
//   {
//     idx: '2',
//     name: 'Ajay',
//     age: '25',
//     gender: 'Male',
//     country: 'India',
//   },
//   {
//     idx: '3',
//     name: 'Vikram',
//     age: '31',
//     gender: 'Male',
//     country: 'Australia',
//   },
//   {
//     idx: '4',
//     name: 'Riya',
//     age: '20',
//     gender: 'Female',
//     country: 'India',
//   },
//   {
//     idx: '5',
//     name: 'John',
//     age: '23',
//     gender: 'Male',
//     country: 'USA',
//   },
//   {
//     idx: '6',
//     name: 'Raman',
//     age: '27',
//     gender: 'Male',
//     country: 'India',
//   },
//   {
//     idx: '7',
//     name: 'Mohan',
//     age: '39',
//     gender: 'Male',
//     country: 'India',
//   },
//   {
//     idx: '8',
//     name: 'Shreya',
//     age: '21',
//     gender: 'Female',
//     country: 'India',
//   },
// ];
