import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { LocalStorageService } from 'ngx-webstorage';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { contract } from 'src/app/Maker/Payloads/contract';
import { payments } from 'src/app/Maker/Payloads/payments';
import { Vendors } from 'src/app/Maker/Payloads/vendors';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';

interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.css'],
  providers: [DatePipe]
})
export class ViewPaymentComponent implements OnInit {
  [x: string]: any;

  @ViewChild('SwalSessionExpired') public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor') public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor') public readonly SuccessSwalUpdateVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdatedVendor') public readonly SuccessSwalUpdatedVendor!: SwalComponent;

  @Input() reload: boolean = false;
  @Output() reloadComplete = new EventEmitter<boolean>();

  dtOptions: any;
  registerForm!: FormGroup;
  submitted: boolean = false;
  viewPaymentSummary: boolean = false;
  viewAddendumPaymentSummary: boolean = false;

  scheduled_amount: number = 0.00;
  unscheduled_amount: number = 0.00;
  diffscheduled_amount: number = 0.00;
  processed_amount: number = 0.00;
  manager_amount: number = 0.00;
  director_amount: number = 0.00;
  chief_amount: number = 0.00;
  finance_amount: number = 0.00;
  paid_amount: number = 0.00;
  rejected_amount: number = 0.00;
  difference_amount: number = 0.00;
  //  addendum
  addedumscheduled_amount: number = 0.00;
  addedumunscheduled_amount: number = 0.00;
  addedumdiffscheduled_amount: number = 0.00;
  addedumprocessed_amount: number = 0.00;
  addedummanager_amount: number = 0.00;
  addedumdirector_amount: number = 0.00;
  addedumchief_amount: number = 0.00;
  addedumfinance_amount: number = 0.00;
  addedumpaid_amount: number = 0.00;
  addedumrejected_amount: number = 0.00;
  addendumdifference_amount: number = 0.00;

  vendorSelected: boolean = false;
  contractSelected: boolean = false;
  addedum: boolean = false;
  vendor!: Vendors[];
  contract!: contract[];
  payment!: payments[];
  cont: any = {};
  cont_addendum: any = {};
  paymentId: number = 0;
  contract_id: number = 0;
  filteredVendors!: Vendors[];
  confirmationDocument: File[] = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  userRole: string = '';
  CountryISO = CountryISO;

  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private makerService: MakerService,
    private authService: AuthService,
    private utilService: UtilService,
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
      this.userRole = 'Manager';
    } else if (userRoles.includes('Director')) {
      this.userRole = 'Director';
    } else if (userRoles.includes('Finance')) {
      this.userRole = 'Finance';
    } else if (userRoles.includes('Chief')) {
      this.userRole = 'Chief';
    } else {
      this.userRole = '';
    }

    console.log('userRole:', this.userRole);


    this.getVendors();
    const that = this
    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: false,
      // lengthMenu: 'ten',
      lengthChange: false,
      ordering: true,
      paging: false,
      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 7,
      select: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.makerService.getPaymentsByContractId(this.contract_id).subscribe(
          async (resp: any) => {
            if (resp != null) {
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp,
              });
              console.log(
                'records total: ' + JSON.stringify(resp.recordsTotal)
              );
            } else {
              // Swal.fire({
              //   icon: 'error',
              //   title: 'Permission',
              //   text: 'You are not permitted to perform this action!',
              // });
            }
          },
          (error: any) => {
            if (error.error.text === 'access-token-expired') {
              console.log('Access-token-expired requesting refresh token...');
              if (
                this.localStorageService.retrieve('refresh_token_requested') ==
                null
              ) {
                this.utilService.refreshToken().subscribe(
                  (data) => {
                    if (data === true) {
                      console.log(
                        'refresh token success re-requesting the actual request'
                      );
                      this.localStorageService.clear('refresh_token_requested');
                      //================================================================================
                      this.makerService.getPaymentsByContractId(this.contract_id).subscribe(
                        async (resp: any) => {
                          if (resp != null) {
                            callback({
                              recordsTotal: resp.recordsTotal,
                              recordsFiltered: resp.recordsFiltered,
                              data: resp,
                            });
                            console.log(
                              'records total: ' +
                              JSON.stringify(resp.recordsTotal)
                            );
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Permission',
                              text: 'You are not permitted to perform this action!',
                            });
                          }
                        },
                        (error: any) => {
                          if (error.error.text === 'access-token-expired') {
                            console.log('refresh token expired.');
                            this.SwalSessionExpired.fire();
                            this._refreshTokenExpired();
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!',
                            });
                            console.log(
                              JSON.stringify(error.error.apierror, null, 2)
                            );
                          }
                        }
                      );
                      //================================================================================
                    } else {
                      console.log('refresh token expired.');
                      this.SwalSessionExpired.fire();
                      this._refreshTokenExpired();
                    }
                  },
                  (error: any) => {
                    console.log('error refreshing access token');
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                    });
                    console.log(JSON.stringify(error.error.apierror, null, 2));
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
        );
      },
      columns: [
        {
          title: "ID",
          render: function (data: any, type: any, full: any) {
            return full.id
          }
        },

        {
          title: "PaymentTerm",
          data: 'paymentTerm',
        },
        {
          title: "Amount",
          //render: function (data: any, type: any, full: any) {
          render: function (data: any, type: any, full: any, meta: any) {
            if (meta.row === 0) {
              that.scheduled_amount = 0.00; // Reset at the start of processing rows
              that.unscheduled_amount = 0.00;
              that.diffscheduled_amount = 0.00;
              that.addedumscheduled_amount = 0.00;
            }
            let amount = parseFloat((full.amount || "0").toString().replace(/,/g, '')) || 0;
            if (full.addendum_type == 0) {
              that.scheduled_amount += amount;
              if (full.amount != full.paid_amount) {
                that.diffscheduled_amount += (full.amount - full.paid_amount);
              }
            }
            if (full.addendum_type == 1) {
              that.addedumscheduled_amount += amount;
            }
            const num = full.amount.toString().replace(/,/g, '');
            const parts = num.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
          }
        },
        {
          title: "Processed Amount",
          render: function (data: any, type: any, full: any, meta: any) {
            if (meta.row === 0) {
              that.processed_amount = 0.00; // Reset total processed amount
              that.manager_amount = 0.00; // Reset manager amount
              that.director_amount = 0.00; // Reset director amount
              that.finance_amount = 0.00; // Reset finance amount
              that.difference_amount = 0.00;
              that.paid_amount = 0.00;
              that.chief_amount = 0.00;
              that.rejected_amount = 0.00;
              //addendum
              that.addedumprocessed_amount = 0.00;
              that.addedummanager_amount = 0.00;
              that.addedumdirector_amount = 0.00;
              that.addedumchief_amount = 0.00;
              that.addedumfinance_amount = 0.00;
              that.addedumpaid_amount = 0.00;
              that.addedumrejected_amount = 0.00;
              that.addendumdifference_amount = 0.00;

            }

            let paidAmount = parseFloat((full.paid_amount || "0").toString().replace(/,/g, '')) || 0;
            if (full.addendum_type == 0) {
              that.processed_amount += paidAmount; // Ensure total processed amount is updated

              switch (full.status) {
                case "2":
                  that.manager_amount += paidAmount;
                  break;
                case "3":
                  that.rejected_amount += paidAmount;
                  break;
                case "4":
                  that.director_amount += paidAmount;
                  break;
                case "5":
                  that.chief_amount += paidAmount;
                  break;
                case "6":
                  that.finance_amount += paidAmount;
                  break;
                case "7":
                  that.paid_amount += paidAmount;
                  break;
              }
            } else if (full.addendum_type == "1") {

              that.addedumprocessed_amount += paidAmount; // Ensure total processed amount is updated

              switch (full.status) {
                case "2":
                  that.addedummanager_amount += paidAmount;
                  break;
                case "3":
                  that.addedumrejected_amount += paidAmount;
                  break;
                case "4":
                  that.addedumdirector_amount += paidAmount;
                  break;
                case "5":
                  that.addedumchief_amount += paidAmount;
                  break;
                case "6":
                  that.addedumfinance_amount += paidAmount;
                  break;
                case "7":
                  that.addedumpaid_amount += paidAmount;
                  break;
              }
              if (full.amount != full.paid_amount) {

                that.difference_amount += (full.amount - paidAmount);
              }
            }
            // Format number with commas
            const num = paidAmount.toFixed(2);
            const parts = num.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return parts.join('.');
          }
        },
        {
          title: "DueDate",
          data: 'dueDate'
        },
        {
          title: "PaymentDescription",
          data: 'paymentDescription'
        },
        {
          title: 'Addendum',
          render: (data: any, type: any, full: any) => {
            if (full.addendum_type == "1") {
              return '<span class="badge bg-success rounded-pill">Yes</span>';

            }
            else
              return ' <span class="badge bg-danger rounded-pill">No</span>';
          },
        },
        {
          title: 'Action',
          render: (data: any, type: any, full: any) => {
            if (this.userRole === 'Manager') {
              if (full.status == "1") {
                return '<span class="badge bg-primary rounded-pill">Not Intiated</span>';
              } else if (full.status == 2)
                return '<span class="badge bg-warning rounded-pill">Need Descision</span>';
              else if (full.status == 3)
                return '<span class="badge bg-danger rounded-pill">Rejected</span>';
              else if (full.status == 4)
                return '<span class="badge bg-info rounded-pill"> Send to Director and Senior IT Chief</span>';
              else if (full.status == 5)
                return '<span class="badge bg-success rounded-pill">Sent to Senior IT Chief</span>'
              else if (full.status == 6)
                return '<span class="badge bg-success rounded-pill">Sent to Finance</span>'
              else if (full.status == 7)
                return '<span class="badge bg-success rounded-pill">Sent to paid</span>'
              else
                return "";
            } else if (this.userRole === 'Director') {
              if (full.status == "1") {
                return '<span class="badge bg-primary rounded-pill">Not Intiated</span>';
              } else if (full.status == 2)
                return '<span class="badge bg-info rounded-pill">sent to Division Head</span>';
              else if (full.status == 3)
                return '<span class="badge bg-danger rounded-pill">Rejected By Division Head</span>';
              else if (full.status == 4)
                return '<span class="badge bg-warning rounded-pill"> Need Descision</span>';
              else if (full.status == 5)
                return '<span class="badge bg-success rounded-pill">Sent to Senior IT Chief</span>'
              else if (full.status == 6)
                return '<span class="badge bg-success rounded-pill">Sent to Finance</span>'
              else if (full.status == 7)
                return '<span class="badge bg-success rounded-pill">Sent to paid</span>'
              else
                return "";
            } else if (this.userRole === 'Finance') {
              if (full.status == "1") {
                return '<span class="badge bg-primary rounded-pill">Not Intiated</span>';
              } else if (full.status == 2)
                return '<span class="badge bg-info rounded-pill">sent to Division Head</span>';
              else if (full.status == 3)
                return '<span class="badge bg-danger rounded-pill">Rejected By Division Head</span>';
              else if (full.status == 4)
                return '<span class="badge bg-warning rounded-pill"> Send to Director</span>';
              else if (full.status == 5)
                return '<span class="badge bg-success rounded-pill">Sent to Senior IT Chief</span>'
              else if (full.status == 6)
                return '<span class="badge bg-success rounded-pill">Need Descision</span>'
              else if (full.status == 7)
                return '<span class="badge bg-success rounded-pill">paid</span>'
              else
                return "";
            } else if (this.userRole === 'Chief') {
              if (full.status == "1") {
                return '<span class="badge bg-primary rounded-pill">Not Intiated</span>';
              } else if (full.status == 2)
                return '<span class="badge bg-info rounded-pill">sent to Division Head</span>';
              else if (full.status == 3)
                return '<span class="badge bg-danger rounded-pill">Rejected By Division Head</span>';
              else if (full.status == 4)
                return '<span class="badge bg-warning rounded-pill"> Send to Director</span>';
              else if (full.status == 5)
                return '<span class="badge bg-success rounded-pill">Need Descision</span>'
              else if (full.status == 6)
                return '<span class="badge bg-success rounded-pill">Sent to Finance</span>'
              else if (full.status == 7)
                return '<span class="badge bg-success rounded-pill">paid</span>'
              else
                return "";


            } else {
              return "";
            }
          },

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

  ngAfterViewInit(): void {
    const roles: Role[] = this.authService.getroles();
    const userRoles = roles.map((role) => role.name);
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('payment-template')) {
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

  toggleSummary(): void {
    this.viewPaymentSummary = !this.viewPaymentSummary;

  }

  toggleAddendumSummary(): void {
    this.viewAddendumPaymentSummary = !this.viewAddendumPaymentSummary;
  }



  filterVendors(searchTerm: any) {
    const searchText = searchTerm.target.value.trim().toLowerCase();

    if (searchText !== '') {
      this.filteredVendors = this.vendor.filter(vendor =>
        vendor.name.toLowerCase().includes(searchText)
      );

      if (this.filteredVendors.length > 0) {
        const selectedVendorId = this.filteredVendors[0].id;
        console.log("Selected Vendor ID:", selectedVendorId);
      } else if (this.filteredVendors.length > 1) {
      } else {

      }
    } else {
      this.filteredVendors = [...this.vendor];
    }
  }



  getVendors() {
    this.makerService.getVendor().subscribe(
      (data: any) => {
        this.vendor = data;
        this.filteredVendors = data;
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  this.makerService.getVendor().subscribe(
                    (data: any) => {
                      this.vendor = data;
                    },
                    (error: any) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    }
                  );
                } else {
                  console.log('refresh token expired.');
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
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
    );
  }

  getContracts(vendorId: any) {
    console.log("vendorIds=" + vendorId)
    this.makerService.getContractByVendorId(vendorId).subscribe(
      (data: any) => {
        this.contract = data;
        console.log("contractdetail=" + data.total_amount)
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  this.makerService.getContractByVendorId(vendorId).subscribe(
                    (data: any) => {
                      this.vendor = data;
                    },
                    (error: any) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    }
                  );
                } else {
                  console.log('refresh token expired.');
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
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
    );
  }
  getPayments(contractId: any) {
    this.makerService.getPaymentDetail(contractId).subscribe(
      (data: any) => {
        this.payment = data;
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  this.makerService.getPaymentDetail(contractId).subscribe(
                    (data: any) => {
                      this.payment = data;
                    },
                    (error: any) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    }
                  );
                } else {
                  console.log('refresh token expired.');
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
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
    );
  }
  onSubmit() {
  }
  formatDate(date: string) {
    const parsedDate = new Date(date);
    return this.datePipe.transform(parsedDate, 'MM/dd/yy');
  }
  convertDate(str: string) {
    var date = new Date(str);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join('-');
  }
  onVendorChange(event: any): void {
    const selectedVendorId = event.target.value;
    console.log("vendorId=" + selectedVendorId)
    this.vendorSelected = !!selectedVendorId;
    this.getContracts(selectedVendorId);

  }
  // onPaymentChange(event: any): void {
  //   this.paymentId = event.target.value;
  //   console.log("=========" + this.paymentId)
  //   $('#payments_by_its_id').DataTable().ajax.reload();
  // }
  onContractChange(event: any): void {
    this.contract_id = event.target.value;
    console.log("contIds=" + this.contract_id)
    this.contractSelected = !!this.contract_id;
    this.getContractbyId(this.contract_id);
    this.getAddendumContractbyId(this.contract_id);
    this.getPayments(this.contract_id);
    $('#payments_by_contId').DataTable().ajax.reload();
  }

  getContractbyId(contractId: any) {
    this.makerService.getContractById(contractId).subscribe(
      (data: any) => {
        this.cont = data;
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  this.makerService.getContractById(contractId).subscribe(
                    (data: any) => {
                      this.cont = data;
                    },
                    (error: any) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    }
                  );
                } else {
                  console.log('refresh token expired.');
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
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
    );
  }
  getAddendumContractbyId(contractId: any) {
    this.makerService.getContractAddendum(contractId).subscribe(
      (data: any) => {
        this.cont_addendum = data[0];
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  this.makerService.getContractAddendum(contractId).subscribe(
                    (data: any) => {
                      this.cont_addendum = data;
                    },
                    (error: any) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    }
                  );
                } else {
                  console.log('refresh token expired.');
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
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
    );
  }


  //   getRequestedPayments() {
  //     this.managerService.getRequestedPaymentDetail().subscribe(
  //       (data: any) => {
  //         this.requestedPayments = data;
  //       },
  //       (error: any) => {
  //         if (error.error.text === 'access-token-expired') {
  //           console.log('Access-token-expired requesting refresh token...');
  //           if (
  //             this.localStorageService.retrieve('refresh_token_requested') == null
  //           ) {
  //             this.utilService.refreshToken().subscribe(
  //               (data) => {
  //                 if (data === true) {
  //                   console.log(
  //                     'refresh token success re-requesting the actual request'
  //                   );
  //                   this.localStorageService.clear('refresh_token_requested');
  //                   this.managerService.getRequestedPaymentDetail().subscribe(
  //                     (data: any) => {
  //                       this.requestedPayments = data;
  //                     },
  //                     (error: any) => {
  //                       if (error.error.text === 'access-token-expired') {
  //                         console.log('refresh token expired.');
  //                         this.SwalSessionExpired.fire();
  //                         this._refreshTokenExpired();
  //                       } else {
  //                         Swal.fire({
  //                           icon: 'error',
  //                           title: 'Oops...',
  //                           text: 'Something went wrong!',
  //                         });
  //                         console.log(
  //                           JSON.stringify(error.error.apierror, null, 2)
  //                         );
  //                       }
  //                     }
  //                   );
  //                 } else {
  //                   console.log('refresh token expired.');
  //                   this.SwalSessionExpired.fire();
  //                   this._refreshTokenExpired();
  //                 }
  //               },
  //               (error: any) => {
  //                 console.log('error refreshing access token');
  //                 Swal.fire({
  //                   icon: 'error',
  //                   title: 'Oops...',
  //                   text: 'Something went wrong!',
  //                 });
  //                 console.log(JSON.stringify(error.error.apierror, null, 2));
  //               }
  //             );
  //             this.localStorageService.store('refresh_token_requested', true);
  //           }
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Something went wrong!',
  //           });
  //           console.log(JSON.stringify(error.error.apierror, null, 2));
  //         }
  //       }
  //     );
  //   }

  //   _refreshTokenExpired() {
  //     console.log('logging out');

  //     this.authService.clearCookies().subscribe(
  //       (data) => {
  //         if (data) {
  //           console.log(data);
  //           delay(3500);
  //           this.router.navigateByUrl('/login');
  //           this.localStorageService.clear('user');
  //           this.localStorageService.clear('products');
  //         } else {
  //           console.log('login failed 001');
  //         }
  //       },
  //       (error) => {
  //         console.log(
  //           'Error: ' + JSON.stringify(error.error.apierror.message, null, 2)
  //         );
  //       }
  //     );
  //   }
  // }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('products');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        console.log(
          'Error: ' + JSON.stringify(error.error.apierror.message, null, 2)
        );
      }
    );
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




