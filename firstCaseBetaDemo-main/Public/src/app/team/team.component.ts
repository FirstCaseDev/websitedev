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
        title: 'Co-founder & CEO',
        mail: 'utkarshonly@gmail.com',
        linkedin: 'https://www.linkedin.com/in/utkarsh-agrawal-13816797',
        facebook: '',
        education: 'ISB PGP Cohort 22',
        experience: [
          'Ex Associate Legal Manager ITC',
          'Ex Associate Cyril Amarchand Mangaldas',
          'LLB, NUJS, 2018',
          'Ex-IIT Kanpur',
        ],
      },
      {
        name: 'Puneet Shrivas',
        img: '../../assets/img/team/team-2-puneet.jpg',
        title: 'Co-founder & CTO',
        mail: 'puneetshrivas32@gmail.com',
        linkedin: 'https://www.linkedin.com/in/puneet-shrivas/',
        facebook: 'https://www.facebook.com/puneet.shrivas.7/',
        education: 'B.Tech, IIT Bombay, 2021',
        experience: ['Engineering Intern, Lear Corporation'],
      },
      {
        name: 'Tejas Ladhe',
        img: '../../assets/img/team/team-7-tejas.jpg',
        title: 'Full Stack Developer',
        mail: 'tejasladhe24@gmail.com',
        linkedin: 'https://www.linkedin.com/in/tejasladhe24/',
        facebook: 'https://www.facebook.com/tejasladhe24/',
        education: 'B.Tech + M.Tech, IIT Bombay, 2022',
        experience: [],
      },

      {
        name: 'Pushpak Ladhe',
        img: '../../assets/img/team/team-4-pushpak.jpg',
        title: 'Head of Data Management',
        mail: 'ladhepushpak@gmail.com',
        linkedin: 'https://www.linkedin.com/in/pushpak-ladhe-1a9931146/',
        facebook: 'https://www.facebook.com/pushpak26',
        education: 'B.E., MITS, Gwalior, 2020',
      },
      {
        name: 'Rishabh Jain',
        img: '../../assets/img/team/team-3-rishabh.jpg',
        title: 'Product Manager',
        mail: 'rishabhjain03april@gmail.com',
        linkedin: 'https://www.linkedin.com/in/rishabh-jain-9a114512a/',
        facebook: 'https://www.facebook.com/profile.php?id=100038231587855',
        education: 'B.Tech + M.Tech, IIT Bombay, 2024',

        experience: [],
      },
      {
        name: 'Utkarsh Chouksay',
        img: '../../assets/img/team/team-5-utkarsh.jpg',
        title: 'Data Scientist',
        mail: 'utkarshc611@gmail.com',
        linkedin: 'https://www.linkedin.com/in/utkarsh-chouksay-1452a3195/',
        facebook: 'https://www.facebook.com/utkarsh.chouksay/',
        education: 'B.Tech, MITS Gwalior, 2021',

        experience: [],
      },
      {
        name: 'Rohan Singh',
        img: '../../assets/img/team/team-6-rohan.jpg',
        title: 'Product Manager',
        mail: 'rohan21071999@gmail.com',
        linkedin: 'https://www.linkedin.com/in/rohan-singh-738580179/',
        facebook: 'https://www.facebook.com/sin.ron.775',
        education: 'B.Tech + M.Tech, IIT Bombay, 2022',
        experience: ['Application Engineering Intern, KLA Tencor'],
      },
    ];
  }
}
