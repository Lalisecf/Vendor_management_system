import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssuerBankComponent } from './add-issuer-bank.component';

describe('AddIssuerBankComponent', () => {
  let component: AddIssuerBankComponent;
  let fixture: ComponentFixture<AddIssuerBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIssuerBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIssuerBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
