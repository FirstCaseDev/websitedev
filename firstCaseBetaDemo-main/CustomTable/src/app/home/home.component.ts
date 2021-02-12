import { Component, OnInit } from '@angular/core';
import List from '../models/case';
import { HomeService } from '../home/home.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  rows: List[] = [];
  headers = ['idx', 'name', 'age', 'gender', 'country'];

  constructor(private homeService: HomeService) {
    // this.loadScripts();
  }

  ngOnInit(): void {
    document.getElementById('redirect')?.click();
  }
}
