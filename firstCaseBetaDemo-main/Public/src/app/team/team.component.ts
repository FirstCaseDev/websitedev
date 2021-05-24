import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  constructor() {}
  members: any;

  ngOnInit(): void {
    this.members = [
      {
        name: 'Utkarsh Agrawal',
        img: '../../assets/img/team/team-1-utkarsh.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
      {
        name: 'Puneet Shrivas',
        img: '../../assets/img/team/team-2-puneet.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
      {
        name: 'Rishabh Jain',
        img: '../../assets/img/team/team-3-rishabh.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
      {
        name: 'Pushpak Ladhe',
        img: '../../assets/img/team/team-4-pushpak.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
      {
        name: 'Utkarsh Chowksey',
        img: '../../assets/img/team/team-5-utkarsh.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
      {
        name: 'Rohan Singh',
        img: '../../assets/img/team/team-6-rohan.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
      {
        name: 'Tejas Ladhe',
        img: '../../assets/img/team/team-7-tejas.jpg',
        title: 'Title',
        linkedin: '',
        facebook: '',
        info: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enimcorporis et voluptate.',
      },
    ];
  }
}
