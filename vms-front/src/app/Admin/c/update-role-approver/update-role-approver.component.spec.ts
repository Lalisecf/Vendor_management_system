import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleApproverComponent } from './update-role-approver.component';

describe('UpdateRoleApproverComponent', () => {
  let component: UpdateRoleApproverComponent;
  let fixture: ComponentFixture<UpdateRoleApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRoleApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRoleApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
