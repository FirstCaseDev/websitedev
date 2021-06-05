import { Component, OnInit, HostListener } from '@angular/core';
import { EmailService } from '../email.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  members: any;
  contactForm: FormGroup;
  disabledSubmitButton: boolean = true;
  optionsSelect: Array<any> = [];

  @HostListener('input') oninput() {
    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }
  constructor(
    private connectionService: EmailService,
    private fb: FormBuilder
  ) {
    this.contactForm = fb.group({
      contactFormName: ['', Validators.required],
      contactFormEmail: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      contactFormSubject: ['', Validators.required],
      contactFormMessage: ['', Validators.required],
      contactFormCopy: [''],
    });
  }

  processForm() {
    // console.log(this.contactForm.value);
    this.connectionService.sendMessage(this.contactForm.value).subscribe(
      (data: any) => {
        console.log(data);
        if (data.status) {
          alert('Your message has been sent.');
        } else {
          alert('Error in sending mail');
        }
        this.contactForm.reset();
        this.disabledSubmitButton = true;
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  ngOnInit(): void {
    this.members = [
      {
        name: 'Utkarsh Agrawal',
        img: '../../assets/img/team/team-1-utkarsh.jpg',
        title: 'Co-founder & CEO',
        mail: 'utkarsh@firstcase.io',
        linkedin: 'https://www.linkedin.com/in/utkarsh-agrawal-13816797',
        facebook: '',
        education: 'Indian School of Business',
        experience: [
          'Ex Associate Legal Manager ITC',
          'Ex Associate Cyril Amarchand Mangaldas',
          'LLB, NUJS',
          'Ex-IIT Kanpur',
        ],
      },
      {
        name: 'Puneet Shrivas',
        img: '../../assets/img/team/team-2-puneet.jpg',
        title: 'Co-founder & CTO',
        mail: 'puneet@firstcase.io',
        linkedin: 'https://www.linkedin.com/in/puneet-shrivas/',
        facebook: 'https://www.facebook.com/puneet.shrivas.7/',
        education: 'B.Tech, IIT Bombay',
        experience: [],
      },
      {
        name: 'Tejas Ladhe',
        img: '../../assets/img/team/team-7-tejas.jpg',
        title: 'Full Stack Developer',
        mail: 'tejasladhe24@gmail.com',
        linkedin: 'https://www.linkedin.com/in/tejasladhe24/',
        facebook: 'https://www.facebook.com/tejasladhe24/',
        education: 'B.Tech + M.Tech, IIT Bombay',
        experience: [],
      },

      {
        name: 'Pushpak Ladhe',
        img: '../../assets/img/team/team-4-pushpak.jpg',
        title: 'Head of Data Management',
        mail: 'ladhepushpak@gmail.com',
        linkedin: 'https://www.linkedin.com/in/pushpak-ladhe-1a9931146/',
        facebook: 'https://www.facebook.com/pushpak26',
        education: 'B.E., MITS, Gwalior',
        experience: [],
      },
      {
        name: 'Rishabh Jain',
        img: '../../assets/img/team/team-3-rishabh.jpg',
        title: 'Product Manager',
        mail: 'rishabhjain03april@gmail.com',
        linkedin: 'https://www.linkedin.com/in/rishabh-jain-9a114512a/',
        facebook: 'https://www.facebook.com/profile.php?id=100038231587855',
        education: 'B.Tech + M.Tech, IIT Bombay',
        experience: [],
      },
      {
        name: 'Utkarsh Chouksay',
        img: '../../assets/img/team/team-5-utkarsh.jpg',
        title: 'Data Scientist',
        mail: 'utkarshc611@gmail.com',
        linkedin: 'https://www.linkedin.com/in/utkarsh-chouksay-1452a3195/',
        facebook: 'https://www.facebook.com/utkarsh.chouksay/',
        education: 'B.Tech, MITS Gwalior',

        experience: [],
      },
      {
        name: 'Rohan Singh',
        img: '../../assets/img/team/team-6-rohan.jpg',
        title: 'Product Manager',
        mail: 'rohan21071999@gmail.com',
        linkedin: 'https://www.linkedin.com/in/rohan-singh-738580179/',
        facebook: 'https://www.facebook.com/sin.ron.775',
        education: 'B.Tech + M.Tech, IIT Bombay',
        experience: [],
      },
    ];
  }
}
