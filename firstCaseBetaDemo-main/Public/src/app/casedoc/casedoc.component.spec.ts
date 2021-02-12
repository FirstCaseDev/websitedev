import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasedocComponent } from './casedoc.component';

describe('CasedocComponent', () => {
  let component: CasedocComponent;
  let fixture: ComponentFixture<CasedocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasedocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasedocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
