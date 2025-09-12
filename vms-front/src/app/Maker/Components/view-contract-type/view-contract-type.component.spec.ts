import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractTypeComponent } from './view-contract-type.component';

describe('ViewContractTypeComponent', () => {
  let component: ViewContractTypeComponent;
  let fixture: ComponentFixture<ViewContractTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContractTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContractTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
