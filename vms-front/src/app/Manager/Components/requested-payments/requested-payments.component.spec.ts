import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedPaymentsComponent } from './requested-payments.component';

describe('RequestedPaymentsComponent', () => {
  let component: RequestedPaymentsComponent;
  let fixture: ComponentFixture<RequestedPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
