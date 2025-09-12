import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIssuerBankComponent } from './view-issuer-bank.component';

describe('ViewIssuerBankComponent', () => {
  let component: ViewIssuerBankComponent;
  let fixture: ComponentFixture<ViewIssuerBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIssuerBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIssuerBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
