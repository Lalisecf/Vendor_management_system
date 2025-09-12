import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerViewVendorsComponent } from './checker-view-vendors.component';

describe('CheckerViewVendorsComponent', () => {
  let component: CheckerViewVendorsComponent;
  let fixture: ComponentFixture<CheckerViewVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckerViewVendorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckerViewVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
