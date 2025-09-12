import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerViewContractsComponent } from './checker-view-contracts.component';

describe('CheckerViewContractsComponent', () => {
  let component: CheckerViewContractsComponent;
  let fixture: ComponentFixture<CheckerViewContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckerViewContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckerViewContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
