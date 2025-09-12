import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorContractReportComponent } from './vendor-contract-report.component';

describe('VendorContractReportComponent', () => {
  let component: VendorContractReportComponent;
  let fixture: ComponentFixture<VendorContractReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorContractReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorContractReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
