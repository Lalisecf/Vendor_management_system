import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedumPaymentDetailComponent } from './addedum-payment-detail.component';

describe('AddedumPaymentDetailComponent', () => {
  let component: AddedumPaymentDetailComponent;
  let fixture: ComponentFixture<AddedumPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddedumPaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddedumPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
