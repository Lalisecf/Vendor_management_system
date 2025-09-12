import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFormatDirectiveComponent } from './number-format-directive.component';

describe('NumberFormatDirectiveComponent', () => {
  let component: NumberFormatDirectiveComponent;
  let fixture: ComponentFixture<NumberFormatDirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberFormatDirectiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberFormatDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
