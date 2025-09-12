import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDirectorateComponent } from './view-directorate.component';

describe('ViewDirectorateComponent', () => {
  let component: ViewDirectorateComponent;
  let fixture: ComponentFixture<ViewDirectorateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDirectorateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
