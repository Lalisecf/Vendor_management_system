import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedAddendumPaymentsComponent } from './requested-addendum-payments.component';

describe('RequestedAddendumPaymentsComponent', () => {
  let component: RequestedAddendumPaymentsComponent;
  let fixture: ComponentFixture<RequestedAddendumPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedAddendumPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedAddendumPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
