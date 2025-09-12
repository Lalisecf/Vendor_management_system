import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrateDetailComponent } from './contrate-detail.component';

describe('ContrateDetailComponent', () => {
  let component: ContrateDetailComponent;
  let fixture: ComponentFixture<ContrateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContrateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
