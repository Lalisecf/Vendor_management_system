import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTemplateComponent } from './payment-template.component';

describe('PaymentTemplateComponent', () => {
  let component: PaymentTemplateComponent;
  let fixture: ComponentFixture<PaymentTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
