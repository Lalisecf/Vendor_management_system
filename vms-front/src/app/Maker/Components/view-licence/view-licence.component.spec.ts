import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLicenceComponent } from './view-licence.component';

describe('ViewLicenceComponent', () => {
  let component: ViewLicenceComponent;
  let fixture: ComponentFixture<ViewLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLicenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
