import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SpacyService } from './spacy.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DmsComponent implements OnInit {
  constructor(private spacy: SpacyService) {}

  spacy_query = '';

  ngOnInit(): void {}

  spacy_search() {
    this.spacy.get(this.spacy_query).subscribe((data: any) => {
      console.log(data);
    });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  tagCategory: any = [
    // { id: 'docName', name: 'Judge Name', subtitle: 'Judge' },
  ];

  tags_list: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.toString();
    if ((value || '').trim()) {
      if (!this.tags_list.includes(value.trim())) {
        this.tags_list.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags_list.indexOf(tag);
    if (index >= 0) {
      this.tags_list.splice(index, 1);
    }
  }

  showFilter = false;

  show_filters() {
    this.showFilter = !this.showFilter;
  }
}
