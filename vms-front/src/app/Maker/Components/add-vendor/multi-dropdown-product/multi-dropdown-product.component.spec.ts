import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDropdownProductComponent } from './multi-dropdown-product.component';

describe('MultiDropdownProductComponent', () => {
  let component: MultiDropdownProductComponent;
  let fixture: ComponentFixture<MultiDropdownProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDropdownProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDropdownProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
