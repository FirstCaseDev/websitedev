import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ILSAComponent } from './ilsa.component';

describe('ILSAComponent', () => {
  let component: ILSAComponent;
  let fixture: ComponentFixture<ILSAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ILSAComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ILSAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
