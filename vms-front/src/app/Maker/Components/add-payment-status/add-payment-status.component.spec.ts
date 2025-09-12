import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentStatusComponent } from './add-payment-status.component';

describe('AddPaymentStatusComponent', () => {
  let component: AddPaymentStatusComponent;
  let fixture: ComponentFixture<AddPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
