import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import saveAs from 'file-saver';
//import { Modal } from 'bootstrap'; 
//import { MakerService } from '../../Services/maker.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UtilService } from 'src/app/services/util-service/util.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CheckerService } from 'src/app/Checker/Services/checker.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from '../../Services/manager.service';
import { Remark } from 'src/app/Maker/Payloads/remark';
import { payments } from 'src/app/Maker/Payloads/payments';
declare var window: any
interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  payment_id: any;
  reasonForm!: FormGroup;
  remark!: Remark;
  paymentDetail: any = {};
  preview: boolean = false;
  file_to_preview!: any;
  progress_download = 0;
  filenames: string[] = [];
  save_as!: any;
  role_name!: any;
  dtOptions!: any;
  reason_modal: any;
  reason: any;
  submitted: boolean = false;
  bond: boolean = false;
  Document_title: any;
  makerService: any;
  downloadStatus_title = 'Downloading...';

  constructor(

    private managerService: ManagerService,
    private formBuilder: FormBuilder,
    private serviceChecker: CheckerService,
    private authService: AuthService,
    private router: Router,
    private utilService: UtilService,
    public localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
    this.remark = {
      id: '',
      title: '',
      description: '',
      created_date: '',
      created_by: '',
      email: ''
    };
    this.payment_id = this.activatedRoute.snapshot.paramMap.get('id');

    this.reasonForm = this.formBuilder.group(
      {
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ]),
        description: new FormControl('', [
          Validators.required,
        ]),

      },
    );
  }


  ngOnInit(): void {
    if (this.payment_id != null) {
      this.getPaymnet();
    }

    this.role_name = "Manager";

    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: true,
      lengthMenu: 'ten',
      lengthChange: true,
      ordering: true,
      paging: true,

      scrollY: 200,
      pagingType: 'full_numbers',
      pageLength: 10,
      select: true,

      ajax: (dataTablesParameters: any, callback: any) => {
        console.log('doc pay-id: ' + this.payment_id)
        this.managerService.getRequestedPaymentDoc(this.payment_id).subscribe(
          async (resp: any) => {
            console.log('doc pay-id: ' + this.payment_id)

            if (resp != null) {
              // console.log('........id.......>' + that.idd)
              console.log(
                'response for table: ' + JSON.stringify(resp[0]?.edit_delete, null, 2)
              );


              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp,
              });
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
                      this.managerService
                        .getRequestedPaymentDoc(this.payment_id).subscribe(
                          async (resp: any) => {
                            if (resp != null) {
                              console.log(
                                'response for table: ' +
                                JSON.stringify(resp, null, 2)
                              );
                              console.log(
                                'ttttttttttttttttttttttttttt: ' +
                                JSON.stringify(resp.amount, null, 2)
                              );

                              callback({
                                FecordsTotal: resp.recordsTotal,
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
      },
      columns: [
        {
          title: 'payment_id',
          data: 'payment_id',
        },
        {
          title: 'id',
          data: 'id',
        },
        {
          title: 'Document Name',
          data: 'name',
        },

        {
          title: 'crtd',
          data: 'crtd',
        },
        {

          title: 'Documents',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.payment_id != null) {
              //that.save_as = "payment_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file="' +
                full.id +
                '"></i>Download <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-payment-document="' +
                full.id +
                '"></i>Preview'
              );
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        }

      ],
      // dom: "<'row mt-2'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },
      // select: false,

      stateSave: true,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,

      // fixed column
      // scrollY: true,
      //scrollX:        true,
      //scrollCollapse: true,
      // paging:         false,
      // fixedColumns: false,

    };

  }

  ngAfterViewInit(): void {
    const that = this;

    this.renderer.listen('document', 'click', (event) => {
      const roles: Role[] = this.authService.getroles();
      const userRoles = roles.map((role) => role.name);

      if (event.target.hasAttribute('payment-detail')) {
        const paymentDetailId = event.target.getAttribute('payment-detail');
        if (userRoles.includes('Director')) {
          this.router.navigateByUrl('Director/payment-detail/' + paymentDetailId);
        } else if (userRoles.includes('Finance')) {
          this.router.navigateByUrl('Finance/payment-detail/' + paymentDetailId);
        } else {
          this.router.navigateByUrl('Manager/payment-detail/' + paymentDetailId);
        }
      }

      else if (event.target.hasAttribute('download-file')) {
        const id = event.target.getAttribute('download-file');
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

        // Trigger file download
        this.managerService.downloadPaymenttFiles(id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });
      }

      else if (event.target.hasAttribute('preview-payment-document')) {
        const id = event.target.getAttribute('preview-payment-document');
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
              b!.textContent = this.progress_download.toString();
            }, 100);
          },
        });

        this.managerService.downloadPaymenttFiles(id).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });
      }
    });
  }


  getPaymnet() {
    this.managerService.getPaymentById(this.payment_id).subscribe(
      async (data: any) => {
        console.log('IDkkkkkkk ' + this.payment_id)
        if (data != null) {
          console.log('amount ' + data.amount)
          this.paymentDetail.amount = data.amount
          this.paymentDetail.dueDate = data.dueDate
          this.paymentDetail.paymentDescription = data.paymentDescription
          this.paymentDetail.status = data.status
          this.paymentDetail.initait_by = data.initait_by
          this.paymentDetail.initaited_date = data.initaited_date
          this.paymentDetail.paymentTerm = data.paymentTerm
          const roles: Role[] = this.authService.getroles();

          const userRoles = roles.map((role) => role.name);
          if (userRoles.includes('Director')) {
            this.paymentDetail.approved_by = data.approved_by
          } else if (userRoles.includes('Finance')) {
            this.paymentDetail.approved_by = data.approved_by
          } else {
            this.paymentDetail.approved_by = "Not Yet";
          }


        }



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
                  this.managerService.getPaymentById(this.payment_id).subscribe(
                    (data: any) => {

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



  downloadPaymentDocument() {
    this.save_as = "Payment document"
    this.managerService.downloadPaymenttFiles(this.payment_id).subscribe((event: any) => {
      this.preview = false;
      this.downloadProgress(event);
    });
  }
  previewPaymentDocument() {
    this.managerService.downloadPaymenttFiles(this.payment_id).subscribe((event: any) => {
      this.preview = true;
      this.downloadProgress(event);
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
              new File([httpEvent.body!], this.save_as, {
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



  approvePayment() {
    Swal.fire({

      // title: 'Approve contract with title : ' + this.paymentDetail.payment_description,
      text:
        'Are you sure? you are about to approve a payment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0acf97',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Approve',
    }).then((result) => {
      if (result.isConfirmed) {
        this.managerService.approvePayment(this.payment_id).subscribe(
          async (data) => {
            if (data == true) {
              Swal.fire({
                icon: 'success',
                title: 'success',
                text: 'Successfully Approved',
              });
              const roles: Role[] = this.authService.getroles();
              const userRoles = roles.map((role) => role.name);
              if (userRoles.includes('Director')) {
                this.router.navigateByUrl('/Director/View-Requested-payment');
              } else if (userRoles.includes('Finance')){
                this.router.navigateByUrl('/Finance/View-Requested-payment');
              } else if (userRoles.includes('Manager')){
                this.router.navigateByUrl('/Manager/View-Requested-payment');
              } else if (userRoles.includes('Chief')) {
                this.router.navigateByUrl('/Chief/View-Requested-payment');
              }

              // this.submitted = false;
              // console.log('remark success: ' + data);
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
                      //================================================================================
                      this.managerService.approvePayment(this.payment_id).subscribe(
                        async (data) => {
                          if (data == true) {

                            Swal.fire({
                              icon: 'success',
                              title: 'success',
                              text: 'Successfully Approved',
                            });
                            // this.submitted = false;
                            // console.log('remark success: ' + data);

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
            }
            else {
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
  rejectPayment() {
    Swal.fire({
      title: 'Reject request!',
      text: 'Are you sure? You are about to reject a payment request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      input: 'text',
      inputPlaceholder: 'Enter your reason here...',
      inputValidator: (value) => {
        if (!value) {
          return 'You must provide a reason!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.remark.description = result.value;
        this.reason = "Reject payment";
        console.log('Reason for rejectioneeee:', this.reason);

        console.log('Reason for rejection:', this.remark.description);
        this.RejectPaymentRequest(this.payment_id, this.remark, this.reason);

        const roles: Role[] = this.authService.getroles();
        const userRoles = roles.map((role) => role.name);
        if (userRoles.includes('Director')) {
          this.router.navigateByUrl('/Director/View-Requested-payment');
        } else if (userRoles.includes('Manager')) {
          this.router.navigateByUrl('/Manager/View-Requested-payment');
        } else if (userRoles.includes('Finance')) {
          this.router.navigateByUrl('/Finance/View-Requested-payment');
        } else if (userRoles.includes('Chief')) {
          this.router.navigateByUrl('/Chief/View-Requested-payment');
        }
      }
    });
  }



  onSubmitReason() {
    console.log('reasonForm', this.reasonForm.value);
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;
      if (this.reason == "Reject payment") {

        this.RejectPaymentRequest(this.payment_id, this.remark, this.reason)
      }
      this.reason_modal.hide();
      this.reasonForm.reset();
    } else this.submitted = true;
    return true;
  }
  bondHistory() {
    this.bond = true;

  }
  RejectPaymentRequest(id: any, remark: Remark, reason: any) {
    console.log('Reason for rejection:', reason);
    this.managerService.RejectPaymentRequest(id, remark, reason).subscribe(
      (data) => {
        if (data) {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' Rejected successfully ' + reason,
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
                  this.managerService.RejectPaymentRequest(id, remark, reason).subscribe(
                    (data) => {
                      if (data) {
                        $('#view_detail').DataTable().ajax.reload()

                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' Rejected successfully ' + this.reason,
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


