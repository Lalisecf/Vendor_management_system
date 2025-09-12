import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { Vendors } from '../../Payloads/vendors';
import { contract } from '../../Payloads/contract';
import { payments } from '../../Payloads/payments';
import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import saveAs from 'file-saver';
import { Remark } from '../../Payloads/remark';
import { Reason } from '../../Payloads/reason';
import { NgToastService } from 'ng-angular-popup';

// Global declarations should be separate from component
declare global {
  interface Window {
    previewFile: (fileId: string) => void;
    downloadFile: (fileId: string) => void;
    deleteFile: (fileId: string) => void;
  }
}

@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css'],
  providers: [
    DatePipe
  ]
})
export class PaymentProcessComponent implements OnInit, OnDestroy {
  [x: string]: any;
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalpaymentProcess')
  public readonly SuccessSwalPaymentProcess!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor')
  public readonly SuccessSwalUpdateVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdatedVendor')
  public readonly SuccessSwalUpdatedVendor!: SwalComponent;

  @Input() reload: boolean = false;
  @Output() reloadComplete = new EventEmitter<boolean>();

  dtOptions: any;
  downloadStatus_title = 'Downloading...';
  progress_download = 0;
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
  paymentSelected: any = ""
  payment_taype: any = "";
  paymentTerm: any = "";
  preview: boolean = false;
  viewPaymentSummary: boolean = false;
  viewAddendumPaymentSummary: boolean = false;
  filenames: string[] = [];
  save_as!: any;
  file_to_preview!: any;
  registerForm!: FormGroup;
  submitted: boolean = false;
  vendor!: Vendors[];
  contract!: contract[];
  payment!: payments[];
  cont: any = {};
  cont_addendum: any = {};
  ven: any = {};
  paymentId: number = -1;
  contract_id: number = 0
  contract_id_selected: number = 0
  filteredVendors!: Vendors[];
  confirmationDocument: File[] = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  // TooltipLabel = TooltipLabel;
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
    private datePipe: DatePipe,
    private toastMessage: NgToastService
  ) {

  }
  ngOnDestroy(): void {
    window.previewFile = () => { };
    window.downloadFile = () => { };
    window.deleteFile = () => { };
  }
  private initializeFileActions() {
    // Use arrow functions to maintain class context
    window.previewFile = (fileId: string) => this.handleFilePreview(fileId);
    window.downloadFile = (fileId: string) => this.handleFileDownload(fileId);
    window.deleteFile = (fileId: string) => this.handleFileDeletion(fileId);
  }

  private handleFilePreview(fileId: string) {
    const sw = Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: false,
      showDenyButton: false,
      html: 'wait...',
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton()!);
        const b = Swal.getHtmlContainer()!.querySelector('b');
        const timerInterval = setInterval(() => {
          // b!.textContent = this.progress_download.toString();
        }, 100);
      },
    });
    // this.downloadProgress(event,'vendor');
    this.makerService.downloadFiles(fileId).subscribe((event: any) => {
      this.preview = true;
      this.downloadProgress(event);
    });

  }

  private handleFileDownload(fileId: string) {
    console.log(`Downloading file: ${fileId}`);
    const sw = Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: false,
      showDenyButton: false,
      html: this.downloadStatus_title + ' <span><b></b>%</span>',
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton()!);
        const b = Swal.getHtmlContainer()!.querySelector('b');
        const timerInterval = setInterval(() => {
          b!.textContent = this.progress_download.toString();
        }, 100);
      },
    });
    // this.downloadProgress(event,'vendor');
    this.makerService.downloadFiles(fileId).subscribe((event: any) => {
      this.preview = false;
      this.downloadProgress(event);
    });

  }

  private handleFileDeletion(fileId: string) {
    Swal.fire({
      title: 'Delete file Confirmation',
      text:
        'Are you sure? you are about to Delete Files Id:  ' +
        fileId + '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {

        this.makerService
          .deleteFile(fileId)
          .subscribe(
            (data: any) => {
              if (data == true)
                this.toastMessage.success({
                  detail: 'SUCCESS',
                  summary: 'File Deleted  Successfully',
                });
              return false
            },
            (error: any) => {
              if (error.error.text === 'access-token-expired') {
                console.log(
                  'Access-token-expired requesting refresh token...'
                );
                if (
                  this.localStorageService.retrieve(
                    'refresh_token_requested'
                  ) == null
                ) {
                  this.utilService.refreshToken().subscribe(
                    (data) => {
                      if (data === true) {
                        console.log(
                          'refresh token success re-requesting the actual request'
                        );
                        this.localStorageService.clear(
                          'refresh_token_requested'
                        );
                        //================================================================================
                        this.makerService
                          .deleteFile(fileId)
                          .subscribe(
                            (data: any) => {
                              if (data == true)
                                this.toastMessage.success({
                                  detail: 'SUCCESS',
                                  summary: 'File Deleted  Successfully',
                                });
                              return false
                            },
                            (error: any) => {
                              if (
                                error.error.text === 'access-token-expired'
                              ) {
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
                                  JSON.stringify(
                                    error.error.apierror,
                                    null,
                                    2
                                  )
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
                      console.log(
                        JSON.stringify(error.error.apierror, null, 2)
                      );
                    }
                  );
                  this.localStorageService.store(
                    'refresh_token_requested',
                    true
                  );
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
    });

  }

  private downloadProgress(
    httpEvent: HttpEvent<string[] | Blob>,
  ): void {
    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress:
        // this.uploadStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
        this.progress_download = Math.round(
          (100 * httpEvent.loaded) / httpEvent.total!
        );
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          if (!this.preview) {

            saveAs(
              new File([httpEvent.body!], "documents", {
                type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`,
              })
            );
            this.progress_download = 0;
            Swal.hideLoading();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File downloaded successfully!',
            });
          }

          else {
            this.file_to_preview = URL.createObjectURL(httpEvent.body!);
            Swal.hideLoading();
            Swal.close();
            this.openPreviewInNewTab();
          }
        }
        break;
      default:
        console.log('the default' + httpEvent);
    }
  }
  openPreviewInNewTab() {
    window.open(this.file_to_preview, '_blank');
  }
  ngOnInit(): void {
    this.initializeFileActions();
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
        this.makerService.get_payment_by_itsId(this.paymentId, this.contract_id).subscribe(
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
              Swal.fire({
                icon: 'error',
                title: 'Permission',
                text: 'You are not permitted to perform this action!',
              });
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
                      this.makerService.get_payment_by_itsId(this.paymentId, this.contract_id).subscribe(
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
            // Format number with commas
            const num = amount.toFixed(2); // Ensure it's formatted correctly
            const parts = num.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to integer part

            return parts.join('.'); // Join integer and decimal parts
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
          title: 'Status',
          render: (data: any, type: any, full: any) => {
            const statusMap: { [key: string]: { text: string; class: string } } = {
              "1": { text: "Not Initiated", class: "bg-warning" },
              "2": { text: "Under Manager Review", class: "bg-primary" },
              "3": { text: "Rejected", class: "bg-danger" },
              "4": { text: "Under Director Review", class: "bg-info" },
              "5": { text: "Under Senior IT Chief Review", class: "bg-primary" },
              "6": { text: "Under Finance Review", class: "bg-info" },
              "7": { text: "Paid", class: "bg-success" },
            };

            return statusMap[full.status]
              ? `<span class="badge ${statusMap[full.status].class} rounded-pill">${statusMap[full.status].text}</span>`
              : "";
          }

        },
        {
          title: 'Action',
          render: (data: any, type: any, full: any) => {
            if (full.status == "1") {
              return `
              <button
                class="btn btn-outline-primary btn-sm"
                payment-process="${full.id}"
                payment-amount="${full.amount}"
                due-date="${full.dueDate}"
                payment-description="${full.paymentDescription}"
                 payment-addendum="${full.addendum_type}"
              >
                <i class="mdi mdi-update mr-1"></i>Process
              </button>
            `;
            } else if (full.status == 2) {
              return `
              <button
                class="btn btn-outline-primary btn-sm"
                payment-edit="${full.id}"
                payment-amount="${full.paid_amount}"
                payment-amount-schedule="${full.amount}"
                due-date="${full.dueDate}"
                payment-description="${full.paymentDescription}"
                payment-addendum="${full.addendum_type}"
              >
                <i class="mdi mdi-pen mr-1"></i>Update
              </button>
               <button
                class="btn btn-outline-danger btn-sm"
                payment-delete="${full.id}"
                payment-amount="${full.amount}"
                due-date="${full.dueDate}"
                payment-description="${full.paymentDescription}"
                 payment-addendum="${full.addendum_type}"
              >
                <i class="mdi mdi-delete"></i>Delete
              </button>
            `;
            } else if (full.status == 3) {
              return `
              <button
                class="btn btn-outline-primary btn-sm"
                payment-reason="${full.id}"
                payment-amount="${full.paid_amount}"
                payment-amount-schedule="${full.amount}"
                due-date="${full.dueDate}"
                payment-description="${full.paymentDescription}"
              >
                <i class="mdi mdi-comment mr-1 text-warning"></i>Reason
              </button>
                            <button
                class="btn btn-outline-primary btn-sm"
                payment-edit="${full.id}"
                payment-amount="${full.paid_amount}"
                payment-amount-schedule="${full.amount}"
                due-date="${full.dueDate}"
                payment-description="${full.paymentDescription}"
                payment-addendum="${full.addendum_type}"
              >
                <i class="mdi mdi-pen mr-1"></i>Update
              </button>
               <button
                class="btn btn-outline-danger btn-sm"
                payment-delete="${full.id}"
                payment-amount="${full.amount}"
                due-date="${full.dueDate}"
                payment-description="${full.paymentDescription}"
                payment-addendum="${full.addendum_type}"
              >
                <i class="mdi mdi-delete"></i>Delete
              </button>
            `;
            } else
              return "";
          },
        },
        {
          title: 'Payment initaited date',
          render: (data: any, type: any, full: any) => {
            if (full.status == "1") {
              return '<span class="badge bg-warning rounded-pill">Not Initaited</span>';

            } else if (full.status != 1)
              return full.initaited_date;
            else
              return "";
          },
        },
        {
          title: 'Reason',
          render: (data: any, type: any, full: any) => {
            if (full.amount == full.paid_amount || full.status == 1) {
              return '<span class="badge bg-warning rounded-pill">Not Reason</span>';

            } else if (full.amount != full.paid_amount && full.status != 1)
              return full.reason;
            else
              return "";
          },
        },
        {
          title: 'Initaited By',
          render: (data: any, type: any, full: any) => {
            if (full.status == 1) {
              return '<span class="badge bg-warning rounded-pill">Not Initaited</span>';

            } else if (full.status != 1)
              return full.initait_by;
            else
              return "";
          },
        },
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
  getVendorById(vendorId: any, roleName: any) {
    this.makerService.getVendorById(vendorId, roleName).subscribe(
      (data: any) => {
        this.ven = data;
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
                  this.makerService.getVendorById(vendorId, roleName).subscribe(
                    (data: any) => {
                      this.ven = data;
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
  previewFile(fileId: string) {
    console.log('Previewing file with ID:', fileId);
    // Add preview logic here
  }

  downloadFile(fileId: string) {
    console.log('Downloading file with ID:', fileId);
    // Add download logic here
  }

  deleteFile(fileId: string) {

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
    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (item.name == "Checker") {
        this.getVendorById(event.target.value, 'Checker');
      } else {
        this.getVendorById(event.target.value, 'Maker');
      }
    }
    this.payment_taype = "";
    this.viewPaymentSummary = false;
    const selectedVendorId = event.target.value;
    this.contract_id_selected = 0;
    this.contract_id = 0;
    this.contract = [];
    this.paymentId = 0;
    this.payment = [];
    this.getContracts(selectedVendorId);
    $('#payments_by_its_id').DataTable().ajax.reload();
  }
  onContractChange(event: any): void {
    this.payment_taype = "";
    this.viewPaymentSummary = false;
    this.paymentId = 0;
    this.payment = [];
    const selectedContractId = event.target.value;
    this.contract_id_selected = selectedContractId;
    this.getPayments(this.contract_id_selected);
    this.contract_id = 0;
    $('#payments_by_its_id').DataTable().ajax.reload();
  }
  onPaymentChange(event: any): void {
    this.viewPaymentSummary = false;
    this.paymentSelected = event.target.value;
    if (event.target.value == "all") {
      this.contract_id = this.contract_id_selected;
    } else {
      this.paymentId = event.target.value;
      this.contract_id = 0;
    }
    this.payment_taype = event.target.value;
    $('#payments_by_its_id').DataTable().ajax.reload();
    this.getContractbyId(this.contract_id_selected);
  }
  onAddendumPaymentViewChange(event: any): void {
    if (this.addedumscheduled_amount === 0.00) {
      Swal.fire({
        icon: 'warning',
        title: 'Impissible',
        text: 'this contract don`t  have Addendum.',
      });
      return;
    }
    this.getAddendumContractbyId(this.contract_id);
    this.viewAddendumPaymentSummary = JSON.parse(event.target.value);
  }
  onPaymentViewChange(event: any): void {
    if (!this.paymentSelected && this.contract_id_selected !== 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Payment Selection Required',
        text: 'To proceed, please choose the "All Payments" option from the dropdown.',
      });
      return;
    }

    if (this.paymentSelected && this.paymentSelected !== "all" && this.contract_id_selected !== 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Selection',
        text: 'For a complete view, please select the "All Payments" option from the dropdown.',
      });
      return;
    }

    if (this.contract_id_selected === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Vendor and Contract Required',
        text: 'Please select both a vendor and a contract to view the payment summary.',
      });
      return;
    }

    this.viewPaymentSummary = JSON.parse(event.target.value);
  }

  ngAfterViewInit(): void {
    const that = this;
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('payment-process')) {
        const paymentId = event.target.getAttribute('payment-process');
        const paymentAmount = parseFloat(event.target.getAttribute('payment-amount')); // Original amount from the attribute
        const dueDate = event.target.getAttribute('due-date');
        const description = event.target.getAttribute('payment-description');
        const addendum = event.target.getAttribute('payment-addendum');
        let files: { file: File; label: string }[] = [];

        Swal.fire({
          title: '<strong><i class="mdi mdi-cash-multiple text-success"></i> Payment Process</strong>',
          html: `
          <div style="text-align: left; font-family: Arial, sans-serif;">
            <style>
              .modal-content {
                background-color: #f9f9f9;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              }
              .text-primary {
                color: #007bff;
              }
              .highlight {
                background-color: #e9f7fe;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
              }
              .swal2-input {
                border: 1px solid #007bff;
                border-radius: 5px;
                padding: 10px;
                width: calc(100% - 22px);
                margin-bottom: 10px;
              }
              .file-upload {
                margin-top: 20px;
              }
              .attach-btn {
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.3s ease;
              }
              .attach-btn:hover {
                background-color: #0056b3;
              }
              .description {
                font-size: 14px;
                color: #555;
              }
              .two-column {
                display: flex;
                justify-content: space-between;
                gap: 20px;
              }
              .column {
                flex: 1;
              }
              .input-group {
                display: flex;
                align-items: center; / Align items vertically /
                margin-bottom: 15px; / Space between input groups /
              }
              .input-group label {
                flex: 0 0 150px; / Fixed width for labels /
                margin-right: 10px; / Space between label and input /
              }
              .input-group input {
                flex: 1; / Input takes remaining space /
              }
            </style>
            <div class="modal-content">
              <div class="two-column">
                <div class="column">
                  <div class="input-group">
                    <label class="text-primary"><strong>Amount: *</strong></label>
                   <input type="number" id="paymentAmount" class="swal2-input" value="${paymentAmount}" min="0" max="${paymentAmount}" required>
                  </div>
                  <div class="input-group">
                    <label class="text-primary"><strong>File Title: *</strong></label>
                    <input type="text" id="fileLabel" class="swal2-input" placeholder="Enter the required upload file Title" required>
                  </div>
                    <div class="input-group">
                    <label class="text-primary"><strong>Upload file: * </strong></label>
                    <input type="file" id="documentUpload" class="swal2-file" accept=".pdf,.doc,.docx" multiple>
                  </div>
                </div>
                <div class="column">
                  <div class="input-group">
                    <label class="text-primary"><strong>Due Date: </strong></label>
                    <input type="date" id="dueDate" class="swal2-input" value="${dueDate}" readonly>
                  </div>
                  <div class="input-group">
                    <label class="text-primary"><strong>Description: </strong></label>
                    <div id="description" class="swal2-input bg-blue-50 text-blue-700 border border-blue-500 rounded-lg px-4 py-2">
                      ${description}
                    </div>
                  </div>
                </div>
              </div>
              <div class="file-upload">
                <button type="button" id="addFileBtn" class="attach-btn">Attach File</button>
                 <h4 class="text-warning"> Selected Files</h4>
                <ul id="fileList"></ul>
              </div>
            </div>
          </div>
        `,
          showCancelButton: true,
          width: '80%',
          confirmButtonText: '<i class="mdi mdi-check-circle"></i> Confirm',
          cancelButtonText: '<i class="mdi mdi-close-circle"></i> Cancel',
          allowOutsideClick: false,
          customClass: {
            closeButton: 'swal2-close',
          },
          didOpen: () => {
            const fileInput = document.getElementById('documentUpload') as HTMLInputElement;
            const fileLabelInput = document.getElementById('fileLabel') as HTMLInputElement;
            const fileList = document.getElementById('fileList') as HTMLUListElement;
            const addFileBtn = document.getElementById('addFileBtn') as HTMLButtonElement;
            addFileBtn.addEventListener('click', () => {
              if (fileInput.files?.length && fileLabelInput.value.trim() !== '') {
                Array.from(fileInput.files).forEach((file) => {
                  files.push({ file, label: fileLabelInput.value.trim() });
                  const li = document.createElement('li');
                  li.textContent = `${file.name} - ${fileLabelInput.value.trim()}`;

                  const removeBtn = document.createElement('button');
                  removeBtn.innerHTML = '<i class="mdi mdi-close-circle text-danger">Remove</i>';
                  removeBtn.style.marginLeft = '10px';
                  removeBtn.style.border = 'none';
                  removeBtn.style.background = 'none';
                  removeBtn.style.cursor = 'pointer';

                  removeBtn.addEventListener('click', () => {
                    files = files.filter((f) => f.file !== file);
                    li.remove();
                  });

                  li.appendChild(removeBtn);
                  fileList.appendChild(li);
                });

                // Clear the file input and label after adding files
                fileInput.value = '';
                fileLabelInput.value = '';
              } else if (!fileInput.files?.length && fileLabelInput.value.trim() !== '') {
                this.toastMessage.error({
                  detail: 'ERROR',
                  summary: 'Please upload required file',
                });
                return

              } else if (fileInput.files?.length && fileLabelInput.value.trim() === '') {
                this.toastMessage.error({
                  detail: 'ERROR',
                  summary: 'Please enter file title',
                });
                return
              } else {
                this.toastMessage.error({
                  detail: 'ERROR',
                  summary: 'Please both enter file title and upload required file',
                });
                return

              }
            });
          },
          preConfirm: () => {
            const amountInput = document.getElementById('paymentAmount') as HTMLInputElement;
            const dueDateInput = document.getElementById('dueDate') as HTMLInputElement;

            const updatedAmount = parseFloat(amountInput.value); // Updated amount entered by the user
            const updatedDueDate = dueDateInput.value;

            // Validation checks
            if (!updatedAmount || updatedAmount <= 0) {
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please enter a valid amount.',
              });
              return false
            }
            if (updatedAmount > paymentAmount) {
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please enter a valid amount. Process amount must be less than or equal to Scheduled amount (Scheduled amount: ' + paymentAmount + ', Processing amount: ' + updatedAmount + ').',
              });
              return false

            }
            if (!updatedDueDate) {
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please select a due date.',
              });
              return false

            }
            if (this.ven.account_number == "" || this.ven.account_number == null) {
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please attach the correct bank details for the vendor before initiating the payment.',
              });
              return false
            }
            if (files.length === 0) {
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please upload at least one document.',
              });
              return false

            }


            const difference = updatedAmount - paymentAmount;

            if (difference !== 0.0) {
              return Swal.fire({
                title: 'Reason for Change Amount',
                input: 'text',
                inputLabel: 'Please enter a reason for the change in amount:',
                inputPlaceholder: 'Enter reason...',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                preConfirm: (reason) => {
                  if (!reason || reason.trim() === '') {
                    Swal.showValidationMessage('Reason is required when the amount changes.');
                    return false;
                  }
                  return reason;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  return {
                    updatedAmount,
                    updatedDueDate,
                    files,
                    reason: result.value, // Use the reason entered in SweetAlert
                  };
                }
                return false; // If cancelled, return false
              });
            }

            return {
              updatedAmount,
              updatedDueDate,
              files,
              reason: '',
            };
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const { updatedAmount, updatedDueDate, files, reason } = result.value;
            const formData = new FormData();
            if (paymentId != null) {
              formData.append('id', paymentId.toString());
            }
            formData.append('dueDate', this.convertDate(updatedDueDate));
            formData.append('amount', paymentAmount.toString());
            formData.append('paidAmount', updatedAmount.toString());
            formData.append('reason', reason);
            formData.append('addendum', addendum);
            files.forEach((fileObj) => {
              formData.append('files', fileObj.file);
              formData.append('file_labels', fileObj.label);
            });
            this.makerService.PaymentProcess(formData).subscribe(
              async (data) => {
                if (data === true) {
                  $('#payments_by_its_id').DataTable().ajax.reload();
                  this.toastMessage.success({
                    detail: 'Success',
                    summary: 'Payment Processed Request sent successfully!',
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Permission',
                    text: 'You are not permitted to perform this action!',
                  });
                }
              },
              (error) => {
                console.log('the error: ' + JSON.stringify(error, null, 3));
                if (error.error.text === 'user-is-logged-in') {
                  Swal.fire({
                    icon: 'warning',
                    title: 'You cannot update the Email of the user.',
                    text: 'You cannot update user email while the user is logged in. Please try again when the user is logged out of all devices.',
                  });
                } else if (error.error.text === 'access-token-expired') {
                  console.log('Access-token-expired requesting refresh token...');
                  if (this.localStorageService.retrieve('refresh_token_requested') == null) {
                    this.utilService.refreshToken().subscribe(
                      (data) => {
                        if (data === true) {
                          console.log('refresh token success re-requesting the actual request');
                          this.localStorageService.clear('refresh_token_requested');
                          this.makerService.PaymentProcess(formData).subscribe(
                            async (data) => {
                              if (data === true) {
                                $('#payments_by_its_id').DataTable().ajax.reload();
                                this.toastMessage.success({
                                  detail: 'Success',
                                  summary: 'Payment Processed Request sent successfully!',
                                });
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Permission',
                                  text: 'You are not permitted to perform this action!',
                                });
                              }
                            },
                            (error) => {
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
                                console.log('it is from here...' + JSON.stringify(error.error.apierror, null, 2));
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
                        console.log('it is here 2' + JSON.stringify(error, null, 2));
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
                  console.log('it is here 1' + JSON.stringify(error, null, 2));
                }
              }
            );
          }
        });
      } else if (event.target.hasAttribute('payment-edit')) {
        const paymentId = event.target.getAttribute('payment-edit');
        let attachedfiles: { file: File; label: string, id: string, status: string }[] = [];
        let files: { file: File; label: string }[] = [];
        const paymentAmount = parseFloat(event.target.getAttribute('payment-amount')); // Original amount from the attribute
        const ScheduledpaymentAmount = parseFloat(event.target.getAttribute('payment-amount-schedule')); // Original amount from the attribute
        const dueDate = event.target.getAttribute('due-date');
        const description = event.target.getAttribute('payment-description');
        const addendum = event.target.getAttribute('payment-addendum');
        Swal.fire({
          title: '<strong><i class="mdi mdi-cash-multiple text-primary"></i> Update Payment Process</strong>',
          html: `
            <div style="text-align: left; font-family: Arial, sans-serif;">
              <div class="modal-content">
                <div class="row">
                  <div class="column">
                   <div class="form-group col-sm-6">
                      <label class="text-primary"><strong>Scheduled Amount: </strong></label>
                      <input type="number" id="ScheduledpaymentAmount" class="swal2-input" value="${ScheduledpaymentAmount}" min="0" readonly>                    </div>
                    <div class="form-group col-sm-6">
                      <label class="text-primary"><strong>Processed Amount: *</strong></label>
                      <input type="number" id="paymentAmount" class="swal2-input" value="${paymentAmount}" min="0"  max="${ScheduledpaymentAmount}"required>
                    </div>
                      <div class="form-group col-sm-12">
                      <label class="text-primary"><strong>Due Date: </strong></label>
                      <input type="date" id="dueDate" class="swal2-input" value="${dueDate}" readonly>
                    </div>
                     <div class="form-group col-sm-9">
                      <label class="text-primary"><strong>Description: </strong></label>
                      <br>
                      ${description}
                    </div>
                  </div>
                  <div class="form-group col-sm-9">
                    <div class="form-group col-sm-12">
                      <label class="text-primary"><strong>File Title: </strong></label>
                      <input type="text" id="fileLabel" class="swal2-input" placeholder="Enter the required upload file Title" required>
                    </div>
                    <div class="form-group col-sm-9">
                      <label class="text-primary"><strong>Upload File: </strong></label>
                     <input type="file" id="documentUpload" class="swal2-file" accept=".pdf,.doc,.docx" multiple>
                    </div>
                  </div>
                </div>
                  <br>
                  <br>
                <div class="file-upload">
                  <button type="button" id="addFileBtn" class="attach-btn text-info">Attach File</button>
                  <br>
                   <br>
                  <ul id="fileList"></ul>
                </div>
                 <br>
                  <h4 class="text-primary"> Attached Files</h4>
                <div id="fileTableContainer"></div> <!-- Table will be inserted here -->
              </div>
            </div>
          `,
          showCancelButton: true,
          width: '80%',
          confirmButtonText: '<i class="mdi mdi-check-circle"></i> Confirm',
          cancelButtonText: '<i class="mdi mdi-close-circle"></i> Cancel',
          allowOutsideClick: false,
          customClass: {
            closeButton: 'swal2-close',
          },
          didOpen: () => {
            const fileInput = document.getElementById('documentUpload') as HTMLInputElement;
            const fileLabelInput = document.getElementById('fileLabel') as HTMLInputElement;
            const fileList = document.getElementById('fileList') as HTMLUListElement;
            const addFileBtn = document.getElementById('addFileBtn') as HTMLButtonElement;

            // Handle file adding logic
            addFileBtn.addEventListener('click', () => {
              if (fileInput.files?.length && fileLabelInput.value.trim() !== '') {
                Array.from(fileInput.files).forEach((file) => {
                  files.push({ file, label: fileLabelInput.value.trim() });
                  const li = document.createElement('li');
                  li.textContent = `${file.name} - ${fileLabelInput.value.trim()}`;

                  const removeBtn = document.createElement('button');
                  removeBtn.innerHTML = '<i class="mdi mdi-close-circle text-danger">Remove</i>';
                  removeBtn.style.marginLeft = '10px';
                  removeBtn.style.border = 'none';
                  removeBtn.style.background = 'none';
                  removeBtn.style.cursor = 'pointer';

                  removeBtn.addEventListener('click', () => {
                    files = files.filter((f) => f.file !== file);
                    li.remove();
                  });

                  li.appendChild(removeBtn);
                  fileList.appendChild(li);
                });

                fileInput.value = '';
                fileLabelInput.value = '';
              } else if (!fileInput.files?.length && fileLabelInput.value.trim() !== '') {
                this.toastMessage.error({
                  detail: 'ERROR',
                  summary: 'Please upload required file',
                });
                return
              } else if (fileInput.files?.length && fileLabelInput.value.trim() === '') {
                this.toastMessage.error({
                  detail: 'ERROR',
                  summary: 'Please enter file title',
                });
                return
              } else {
                this.toastMessage.error({
                  detail: 'ERROR',
                  summary: 'Please both enter file title and upload required file',
                });
                return
              }
            });

            // Fetch files data after modal is opened and then render the table
            this.makerService.payment_files_by_payment_id(paymentId).subscribe((data: any[]) => {
              data.forEach(file => {
                attachedfiles.push({ file: file.document, label: file.name, id: file.id, status: file.status });
              });
              const fileTableContainer = document.getElementById('fileTableContainer');
              if (fileTableContainer) {
                const fileTable = document.createElement('table');
                fileTable.style.width = '100%';
                fileTable.style.borderCollapse = 'collapse';
                fileTable.innerHTML = `
                  <thead>
                    <tr class="text-primary">
                      <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Preview</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Download</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${attachedfiles.map(file => `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${file.id || 'N/A'}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${file.label}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                          <button class="action-btn text-primary mdi mdi-eye" onclick="previewFile('${file.id}')"></button>
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                          <button class="action-btn text-info mdi mdi-download" onclick="downloadFile('${file.id}')"></button>
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                          <button class="action-btn text-danger mdi mdi-delete" onclick="deleteFile('${file.id}')"></button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                `;
                fileTableContainer.appendChild(fileTable); // Append the table to the modal container
              }
            }, (error) => {
              console.error('Error fetching files:', error);
            });


          },
          preConfirm: () => {
            const amountInput = document.getElementById('paymentAmount') as HTMLInputElement;
            const dueDateInput = document.getElementById('dueDate') as HTMLInputElement;

            const updatedAmount = parseFloat(amountInput.value);
            const updatedDueDate = dueDateInput.value;

            if (!updatedAmount || updatedAmount <= 0) {
              Swal.showValidationMessage('Please enter a valid amount');
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please enter a valid amount',
              });
              return false
            }
            if (updatedAmount > ScheduledpaymentAmount) {
              this.toastMessage.error({
                detail: 'ERROR',
                summary: 'Please enter a valid amount. Process amount must be less than or equal to Scheduled amount (Scheduled amount: ' + paymentAmount + ', Processing amount: ' + updatedAmount + ').',
              });
              return false

            }
            if (!updatedDueDate) {
              Swal.showValidationMessage('Please select a due date');
              return false;
            }
            const difference = updatedAmount - paymentAmount;

            if (difference !== 0.0) {
              return Swal.fire({
                title: 'Reason for Change Amount',
                input: 'text',
                inputLabel: 'Please enter a reason for the change in amount:',
                inputPlaceholder: 'Enter reason...',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                preConfirm: (reason) => {
                  if (!reason || reason.trim() === '') {
                    Swal.showValidationMessage('Reason is required when the amount changes.');
                    return false;
                  }
                  return reason;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  return {
                    updatedAmount,
                    updatedDueDate,
                    files,
                    reason: result.value, // Use the reason entered in SweetAlert
                  };
                }
                return false; // If cancelled, return false
              });
            }

            return {
              updatedAmount,
              updatedDueDate,
              files,
              reason: '',
            };
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const { updatedAmount, updatedDueDate, files, reason } = result.value;
            const formData = new FormData();
            if (paymentId != null) {
              formData.append('id', paymentId.toString());
            }
            formData.append('dueDate', this.convertDate(updatedDueDate));
            formData.append('amount', paymentAmount.toString());
            formData.append('paidAmount', updatedAmount.toString());
            formData.append('reason', reason);
            formData.append('addendum', addendum);
            const hasFiles = files && files.length > 0;
            if (hasFiles) {
              files.forEach((fileObj) => {
                formData.append('files', fileObj.file);
                formData.append('file_labels', fileObj.label);
              });
            } else {
              formData.append('files', new File([], 'placeholder.txt'), 'placeholder.txt');
              formData.append('file_labels', 'no_files_submitted');
            }


            this.makerService.PaymentProcess(formData).subscribe(
              async (data) => {
                if (data === true) {
                  $('#payments_by_its_id').DataTable().ajax.reload();
                  this.toastMessage.success({
                    detail: 'SUCCESS',
                    summary: 'Payment Process Request Updated Successfully',
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Permission',
                    text: 'You are not permitted to perform this action!',
                  });
                }
              },
              (error) => {
                console.log('the error: ' + JSON.stringify(error, null, 3));
                if (error.error.text === 'user-is-logged-in') {
                  Swal.fire({
                    icon: 'warning',
                    title: 'You cannot update the Email of the user.',
                    text: 'You cannot update user email while the user is logged in. Please try again when the user is logged out of all devices.',
                  });
                } else if (error.error.text === 'access-token-expired') {
                  console.log('Access-token-expired requesting refresh token...');
                  if (this.localStorageService.retrieve('refresh_token_requested') == null) {
                    this.utilService.refreshToken().subscribe(
                      (data) => {
                        if (data === true) {
                          console.log('refresh token success re-requesting the actual request');
                          this.localStorageService.clear('refresh_token_requested');
                          this.makerService.PaymentProcess(formData).subscribe(
                            async (data) => {
                              if (data === true) {
                                $('#payments_by_its_id').DataTable().ajax.reload();
                                this.toastMessage.success({
                                  detail: 'SUCCESS',
                                  summary: 'Payment Process Request Updated Successfully',
                                });
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Permission',
                                  text: 'You are not permitted to perform this action!',
                                });
                              }
                            },
                            (error) => {
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
                                console.log('it is from here...' + JSON.stringify(error.error.apierror, null, 2));
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
                        console.log('it is here 2' + JSON.stringify(error, null, 2));
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
                  console.log('it is here 1' + JSON.stringify(error, null, 2));
                }
              }
            );
          }
        });
      } else if (event.target.hasAttribute('payment-delete')) {
        const paymentId = event.target.getAttribute('payment-delete');
        const addendum = event.target.getAttribute('payment-addendum');
        Swal.fire({
          title: 'Remove Pending Payment Process',
          text:
            'Are you sure? you are about to remove pending payment process request Id:  ' +
            paymentId + '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'red',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {

            this.makerService
              .remove_pending_payment(paymentId, addendum)
              .subscribe(
                (data: any) => {
                  if (data == true)
                    Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: ' You are successfully remove pending payment request !',
                    });
                  $('#payments_by_its_id').DataTable().ajax.reload();
                },
                (error: any) => {
                  if (error.error.text === 'access-token-expired') {
                    console.log(
                      'Access-token-expired requesting refresh token...'
                    );
                    if (
                      this.localStorageService.retrieve(
                        'refresh_token_requested'
                      ) == null
                    ) {
                      this.utilService.refreshToken().subscribe(
                        (data) => {
                          if (data === true) {
                            console.log(
                              'refresh token success re-requesting the actual request'
                            );
                            this.localStorageService.clear(
                              'refresh_token_requested'
                            );
                            //================================================================================
                            this.makerService
                              .remove_pending_payment(paymentId, addendum)
                              .subscribe(
                                (data: any) => {
                                  if (data == true)
                                    Swal.fire({
                                      icon: 'success',
                                      title: 'Success',
                                      text: ' You are successfully remove pending payment request !',
                                    });
                                  $('#payments_by_its_id').DataTable().ajax.reload();

                                },
                                (error: any) => {
                                  if (
                                    error.error.text === 'access-token-expired'
                                  ) {
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
                                      JSON.stringify(
                                        error.error.apierror,
                                        null,
                                        2
                                      )
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
                          console.log(
                            JSON.stringify(error.error.apierror, null, 2)
                          );
                        }
                      );
                      this.localStorageService.store(
                        'refresh_token_requested',
                        true
                      );
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
        });
      } else if (event.target.hasAttribute('payment-reason')) {
        const paymentId = event.target.getAttribute('payment-reason');

        Swal.fire({
          title: 'Reason for Rejection',
          text: 'Fetching reason details...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Show loading spinner
          },
        });

        this.makerService.getReasonByPaymentId(paymentId).subscribe(
          (data: Reason[]) => {
            if (data && data.length > 0) {
              // Construct the table HTML
              let tableHtml = `
                <table class="table table-bordered" style="width:100%">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reason</th>
                      <th>Created By</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
              `;

              data.forEach((reason, index) => {
                tableHtml += `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${reason.reason}</td>
                    <td>${reason.created_by}</td>
                    <td>${reason.date}</td>
                  </tr>
                `;
              });

              tableHtml += `</tbody></table>`;

              Swal.fire({
                title: 'Reason for Rejection',
                html: tableHtml,
                icon: 'info',
                confirmButtonText: 'OK',
                width: '60%', // Adjust modal width
              });
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'No Reasons Found',
                text: 'No rejection reasons were found for this payment.',
              });
            }
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong while fetching reasons!',
            });
            console.error(error);
          }
        );
      }


    });
  }
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

