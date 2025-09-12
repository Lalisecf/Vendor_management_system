import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { VendorContractReportComponent } from 'src/app/Maker/Components/vendor-contract-report/vendor-contract-report.component';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { ManagerService } from 'src/app/Manager/Services/manager.service';
import { AuthService } from 'src/app/services/auth-service.service';
@Component({
  selector: 'app-leftside-menu',
  templateUrl: './leftside-menu.component.html',
  styleUrls: ['./leftside-menu.component.css'],
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class LeftsideMenuComponent implements OnInit {
  authService: AuthService;
  //managerService: ManagerService;

  totalCurrencyRemarks: any
  totalaccountRemarks!: any
  pendingCount: number = 0;
  AddedumpendingCount: number = 0;
  constructor(
    private authServicee: AuthService,
    private router: Router,
    private dataSharingService: MakerService,
    private managerService: ManagerService,

    public localStorageService: LocalStorageService,


  ) {
    this.authService = authServicee;
    // this.componentVendorContractReportComponent.type="hhh"
  }

  onChange(value: any) {
    console.log("value:" + value)
    this.dataSharingService.setAbc(value);
    this.router.navigateByUrl(`Report/${value}`);
  

  }


  ngOnInit(): void {
    this.getRequestedPayments();
    this.getRequestedAddedumPayments();
    // this.accountService.getCurrentWorkspace().subscribe(
    //   (data: any) => {
    //     console.log('WORKSPACE on init data: ' + JSON.stringify(data, null, 4));
    //     // reconciliation_type
    //     if (data.reconciliation_type != null)
    //       this.localStorageService.store(
    //         'current_reconciliation_type_' + this.localStorageService.retrieve('user'),
    //         data.reconciliation_type
    //       );
    //     else {
    //       // console.log('')
    //     }
    //   },
    //   (error: any) => {
    //     // console.log('WORKSPACE on init error: ' + JSON.stringify(error, null, 4));
    //   }
    // );


    //const that=this
    //=============================================================================
    // this.totalCurrencyRemarks.GetTotalCurrencyrmark().subscribe ((data: any)=>{
    //   this.totalCurrencyRemarks=data.total
    //   console.log("ppppppppppppppppppppppppppppp="+this.totalCurrencyRemarks);
    // } );
    // this.totalCurrencyRemarks.GetTotalaccountrmark().subscribe((data:any)=>{
    //   this.totalaccountRemarks=data.total})
    // console.log(
    //   'num of li: ' + document.getElementsByClassName('side-nav-link').length
    // );
    //=============================================================================
    // this.totalCurrencyRemarks.GetTotalCurrencyrmark().subscribe((data: { total: any; })=>{
    //   this.totalCurrencyRemarks=data.total

    // } )
    // this.totalCurrencyRemarks.GetTotalaccountrmark().subscribe((data: { total: any; })=>{
    //   this.totalaccountRemarks=data.total})
    // console.log(
    //   'num of li: ' + document.getElementsByClassName('side-nav-link').length
    // );

    // this.totalCurrencyRemarks.GetTotalCurrencyRemark().subscribe((data: { total: any; })=>{
    //   this.totalCurrencyRemarks=data.total
    // }, (error: any) => {
    //   console.log('error')
    // } )
    // this.totalCurrencyRemarks.GetTotalaccountrmark().subscribe((data: { total: any; })=>{
    //   this.totalaccountRemarks=data.total})
    // console.log(
    //   'num of li: ' + document.getElementsByClassName('side-nav-link').length
    // );


    // const body_all = document.body
    // const left_side_menu_container = document.getElementById(
    //   'leftside-menu-container',
    // )
    // const c_container = document.getElementById('c_container')
    // if (body_all.hasAttribute('data-leftbar-compact-mode')) {
    //   console.log('it is condensed.')
    //   left_side_menu_container?.classList.remove('overflow_x')
    //   c_container?.classList.add('d-none')
    //   c_container?.classList.remove('d-block')
    // } else {
    //   left_side_menu_container?.classList.add('overflow_x')
    //   c_container?.classList.add('d-block')
    //   c_container?.classList.remove('d-none')
    //   console.log('it is expanded.')
    // }
  }

  getRequestedPayments() {
    this.managerService.getRequestedPaymentDetail().subscribe(data => {
      this.pendingCount = data.length; 
      console.log('pendingCount:', this.pendingCount);
    });
  }
  getRequestedAddedumPayments() {
    this.managerService.getRequestedAddendumPaymentDetail().subscribe(data => {
      this.AddedumpendingCount = data.length; 
      console.log('AddedumpendingCount:', this.AddedumpendingCount);
    });
  }
  goToPage(pageName: string) {
    // this.router.navigate([{ outlets: { inner_outlet: [`${pageName}`] } }])
    this.router.navigate([`${pageName}`]);
  }
  // setReconciliationType(type: string) {
  //   console.log('type: ' + type);
  //   console.log(
  //     'from local type: ' +
  //       this.localStorageService.retrieve('current_reconciliation_type')
  //   );
  //   if (
  //     type != this.localStorageService.retrieve('current_reconciliation_type')
  //   )
  //     this.accountService.setWorkspace(type).subscribe(
  //       (data: any) => {
  //         console.log('WORKSPACE: ' + JSON.stringify(data, null, 4));
  //         this.goToPage('/home');
  //         this.localStorageService.store('current_reconciliation_type_' + this.localStorageService.retrieve('user'), type);
  //         Swal.fire({
  //           title: 'Success: ' + type,
  //           text: 'Workspace set successfully!',
  //           icon: 'success',
  //         });
  //       },

  //       (error: any) => {
  //         if ((error.error.text = 'workspace-is-not-free')) {
  //           Swal.fire({
  //             title: 'Unable to set ' + type,
  //             text: 'Another user is already working on this workspace',
  //             icon: 'warning',
  //           });
  //         }
  //         console.log('WORKSPACE: ' + JSON.stringify(error, null, 4));
  //       }
  //     );
  //   else console.log('equal');
  // }
  onResize(event: { target: { innerWidth: any } }) {
    //   const body_all = document.body;
    //   const left_side_menu_container = document.getElementById(
    //     'leftside-menu-container'
    //   );
    //   const c_container = document.getElementById('c_container');
    //   if (body_all.hasAttribute('data-leftbar-compact-mode')) {
    //     console.log('it is condensed.');
    //     left_side_menu_container?.classList.remove('overflow_x');
    //     c_container?.classList.add('d-none');
    //     c_container?.classList.remove('d-block');
    //   } else {
    //     left_side_menu_container?.classList.add('overflow_x');
    //     c_container?.classList.add('d-block');
    //     c_container?.classList.remove('d-none');
    //     console.log('it is expanded.');
    //   }
  }
}
