import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import Swal from 'sweetalert2';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { Vendors } from 'src/app/Maker/Payloads/vendors';
import { contract } from 'src/app/Maker/Payloads/contract';
import { payments } from 'src/app/Maker/Payloads/payments';
import { requestedPayments } from '../../payloads/requestedPayments';
import { ManagerService } from '../../Services/manager.service';

interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-requested-payments',
  templateUrl: './requested-payments.component.html',
  styleUrls: ['./requested-payments.component.css'],
  providers: [
    DatePipe
  ]
})
export class RequestedPaymentsComponent implements OnInit {

  @ViewChild('SwalSessionExpired') public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor') public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor') public readonly SuccessSwalUpdateVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdatedVendor') public readonly SuccessSwalUpdatedVendor!: SwalComponent;

  @Input() reload: boolean = false;
  @Output() reloadComplete = new EventEmitter<boolean>();

  @ViewChild('datatableElement') datatableElement: any; // Add this line to define the datatableElement

  dtOptions: any;

  submitted: boolean = false;
  vendor!: Vendors[];
  contract!: contract[];
  payment!: payments[];
  paymentId: number = 0;
  filteredVendors!: Vendors[];
  requestedPayments!: requestedPayments[];
  confirmationDocument: File[] = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  status: string = '';
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private managerService: ManagerService,
    private makerService: MakerService,
    private router: Router,
    private renderer: Renderer2,
    public localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const roles: Role[] = this.authService.getroles();

    console.log('Retrieved roles:', roles);

    const userRoles = roles.map((role) => role.name);

    if (userRoles.includes('Manager')) {
      this.status = '2';
    } else if (userRoles.includes('Director')) {
      this.status = '4';
    } else if (userRoles.includes('Chief')) {
      this.status = '5';
    } else if (userRoles.includes('Finance')) {
      this.status = '6';
    } else {
      this.status = '1';
    }

    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: false,
      lengthChange: false,
      ordering: true,
      paging: false,
      pagingType: 'full_numbers',
      pageLength: 7,
      select: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.managerService.getRequestedPaymentDetail().subscribe(
          async (resp: any) => {
            if (resp != null) {
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp,
              });
              console.log('records total: ' + JSON.stringify(resp.recordsTotal));
            }
          },
          (error: any) => {
            this.handleApiError(error);
          }
        );
      },
      columns: [
        {
          title: "ID",
          render: function (data: any, type: any, full: any) {
            return full.id;
          }
        },

        {
          title: "Vendor Name",
          data: 'name',
        },
        {
          title: "Contract Name",
          data: 'contract_title',
        },
        {
          title: "PaymentTerm",
          data: 'paymentTerm',
        },
        {
          title: 'Detail',
          render: (data: any, type: any, full: any) => {
            if (full.status === '2' || full.status === '4' || full.status === '6' || full.status === '5') {
              return `<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" payment-detail="${full.id}">Detail</i>`;
            }
            return '';
          }
        },
        {
          title: 'Payment Request Form',
          render: (data: any, type: any, full: any) => {
            if (full.status === '2' || full.status === '4' || full.status === '6' || full.status === '5' || full.status === '7') {
              return `<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" payment-template="${full.id}">Show</i>`;
            }
            return '';
          }
        }
      ],
      stateSave: true,
      stateDuration: 0,
      fixedFooter: true,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
        },
      ],
    };
  }


  getPayments(contractId: any) {
    this.makerService.getPaymentDetail(contractId).subscribe(
      (data: any) => {
        this.payment = data;
      },
      (error: any) => {
        this.handleApiError(error);
      }
    );
  }

  getRequestedPayments() {
    this.managerService.getRequestedPaymentDetail().subscribe(
      (data: any) => {
        this.requestedPayments = data;
        console.log(this.requestedPayments);
      },
      (error: any) => {
        this.handleApiError(error);
      }
    );
  }

  ngAfterViewInit(): void {


    const roles: Role[] = this.authService.getroles();

    const userRoles = roles.map((role) => role.name);

    // if (userRoles.includes('Director')) {
    //   this.status = '4';
    // } else if (userRoles.includes('Manager')){
    //   this.status = '2'; 
    // } else {
    //   this.status = ''; 
    // }
    console.log('status view:', this.status);
    this.renderer.listen('document', 'click', (event) => {
      console.log('status view:', this.status);
      if (event.target.hasAttribute('payment-detail')) {
        const paymentDetailId = event.target.getAttribute('payment-detail');
        if (userRoles.includes('Director')) {
          this.router.navigateByUrl('Director/payment-detail/' + paymentDetailId);
        } else if (userRoles.includes('Manager')) {
          this.router.navigateByUrl('Manager/payment-detail/' + paymentDetailId);
        } else if (userRoles.includes('Chief')) {
          this.router.navigateByUrl('Chief/payment-detail/' + paymentDetailId);
        } else if (userRoles.includes('Finance')) {
          this.router.navigateByUrl('Finance/payment-detail/' + paymentDetailId);
        } else {
          this.router.navigateByUrl('home');

        }
      } else if (event.target.hasAttribute('payment-template')) {
        const paymentDetailId = event.target.getAttribute('payment-template');
        if (userRoles.includes('Director')) {
          this.router.navigateByUrl('Director/payment-template/' + paymentDetailId);
        } else if (userRoles.includes('Manager')) {
          this.router.navigateByUrl('Manager/payment-template/' + paymentDetailId);
        } else if (userRoles.includes('Chief')) {
          this.router.navigateByUrl('Chief/payment-template/' + paymentDetailId);
        } else if (userRoles.includes('Finance')) {
          this.router.navigateByUrl('Finance/payment-template/' + paymentDetailId);
        } else {
          this.router.navigateByUrl('home');

        }
      }
    });
  }

  handleApiError(error: any): void {
    if (error.error.text === 'access-token-expired') {
      console.log('Access-token-expired requesting refresh token...');
      if (this.localStorageService.retrieve('refresh_token_requested') == null) {
        this.utilService.refreshToken().subscribe(
          (data) => {
            if (data === true) {
              this.localStorageService.clear('refresh_token_requested');
              this.getRequestedPayments();
            } else {
              this.handleSessionExpired();
            }
          },
          (error: any) => {
            this.handleSessionExpired();
          }
        );
        this.localStorageService.store('refresh_token_requested', true);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
      console.log(JSON.stringify(error.error.apierror, null, 2));
    }
  }

  handleSessionExpired(): void {
    console.log('refresh token expired.');
    this.SwalSessionExpired.fire();
    this._refreshTokenExpired();
  }

  _refreshTokenExpired() {
    console.log('logging out');
    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('products');
        }
      },
      (error) => {
        console.log('Error: ' + JSON.stringify(error.error.apierror.message, null, 2));
      }
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
