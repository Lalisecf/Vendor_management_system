import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDropdownServiceComponent } from './multi-dropdown-service.component';

describe('MultiDropdownServiceComponent', () => {
  let component: MultiDropdownServiceComponent;
  let fixture: ComponentFixture<MultiDropdownServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDropdownServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDropdownServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
