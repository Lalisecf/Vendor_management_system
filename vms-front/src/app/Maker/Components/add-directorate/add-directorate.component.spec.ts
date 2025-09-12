import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectorateComponent } from './add-directorate.component';

describe('AddDirectorateComponent', () => {
  let component: AddDirectorateComponent;
  let fixture: ComponentFixture<AddDirectorateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDirectorateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
