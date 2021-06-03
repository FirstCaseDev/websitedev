import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SpacyService } from '../spacy.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DmsComponent implements OnInit {
  constructor(private spacy: SpacyService) {}

  spacy_query = '';
  filter_owner_list: any = [
    { value: 'anyone', text: 'Anyone' },
    { value: 'me', text: 'Me' },
    { value: 'person', text: 'Person' },
  ];

  filter_fileType_list: any = [
    { value: 'any', text: 'Any' },
    { value: 'pdf', text: 'Document' },
    { value: 'image', text: 'Images' },
  ];

  filter_dateModified_list: any = [
    { value: 'any', text: 'Any time' },
    { value: '0', text: 'Today' },
    { value: '1', text: 'Yesterday' },
    { value: '7', text: 'Last Week' },
    { value: '30', text: 'Last Month' },
    { value: '90', text: 'Last 90 days' },
  ];

  filter_owner: any;
  filter_fileType: any;
  filter_dateModified: any;
  recents: any[] = [];
  filter_includeWords = '';
  filter_owner_person = '';

  ngOnInit(): void {
    this.filter_owner = this.filter_owner_list[0];
    this.filter_fileType = this.filter_fileType_list[0];
    this.filter_dateModified = this.filter_dateModified_list[0];
  }

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
