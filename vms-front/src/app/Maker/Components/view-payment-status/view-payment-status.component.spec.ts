import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentStatusComponent } from './view-payment-status.component';

describe('ViewPaymentStatusComponent', () => {
  let component: ViewPaymentStatusComponent;
  let fixture: ComponentFixture<ViewPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPaymentStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
