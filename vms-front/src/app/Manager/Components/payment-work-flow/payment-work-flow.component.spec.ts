import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWorkFlowComponent } from './payment-work-flow.component';

describe('PaymentWorkFlowComponent', () => {
  let component: PaymentWorkFlowComponent;
  let fixture: ComponentFixture<PaymentWorkFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentWorkFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentWorkFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
