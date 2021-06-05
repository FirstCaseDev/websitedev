import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EmailService } from '../email.service';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-form',
  templateUrl: './ilsa.component.html',
  styleUrls: ['./ilsa.component.css'],
})
export class ILSAComponent implements OnInit {
  questionForm: FormGroup;
  disabledSubmitButton: boolean = true;

  constructor(
    private connectionService: EmailService,
    private title: Title,
    private metaService: Meta
  ) {
    this.questionForm = new FormGroup({
      contactFormEmail: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      contactFormResponse: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.metaService.updateTag({
      name: 'title',
      content: 'FirstCase | ILSA',
    });
    this.metaService.updateTag({
      name: 'description',
      content: "It's been dubbed the Alexa for law.",
    });
  }

  processForm() {
    this.connectionService.ISLAForm(this.questionForm.value).subscribe(
      (data: any) => {
        console.log(data);
        if (data.status) {
          alert('Your message has been sent.');
        } else {
          alert('Error in sending mail');
        }
        this.questionForm.reset();
        this.disabledSubmitButton = true;
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  get f() {
    return this.questionForm.controls;
  }

  changeResponse(e: any) {
    // console.log(e.target.value);
  }
}
