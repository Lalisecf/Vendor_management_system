import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import saveAs from 'file-saver';
import { MakerService } from '../../Services/maker.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UtilService } from 'src/app/services/util-service/util.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CheckerService } from 'src/app/Checker/Services/checker.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Remark } from '../../Payloads/remark';
import { data } from 'jquery';
declare var window: any
@Component({
  selector: 'app-contrate-detail',
  templateUrl: './contrate-detail.component.html',
  styleUrls: ['./contrate-detail.component.css']
})
export class ContrateDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  contract_id: any;
  reasonForm!: FormGroup;
  remark!: Remark;
  contractDetail: any = {};
  preview: boolean = false;
  file_to_preview!: any;
  progress_download = 0;
  filenames: string[] = [];
  save_as!: any;
  role_name!: any;
  dtOptions_payments!: any;
  contract_history: any;
  contract_addendum: any;
  reason_modal: any;
  reason: any;
  submitted: boolean = false;
  history: boolean = false;
  TogleAddendum: boolean = false;
  isThereAddendum: boolean = false;
  bond: boolean = false;
  downloadStatus_title = 'Downloading...';

  constructor(
    private renderer: Renderer2,
    private makerService: MakerService,
    private formBuilder: FormBuilder,
    private serviceChecker: CheckerService,
    private authService: AuthService,
    private router: Router,
    private utilService: UtilService,
    public localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.remark = {
      id: '',
      title: '',
      description: '',
      created_date: '',
      created_by: '',
      email: ''
    };
    this.contract_id = this.activatedRoute.snapshot.paramMap.get('id');

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
  // ngAfterViewInit(): void {
  //   // Optional: Initialize DataTables if needed
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     console.log('DataTable initialized:', dtInstance);
  //   });
  // }
  ngOnInit(): void {
    this.contractHistory();
    this.makerService.getContractAddendum(this.contract_id).subscribe(
      async (data: any) => {
        console.log('Received data:', data); // Log the data to check its structure

        if (data.length > 0) {
          // If data exists and the contractAddendum has records
          this.isThereAddendum = true;
        } else {
          this.isThereAddendum = false;
          console.log('No contract addendum available.');
        }
      },
      (error) => {
        console.error('Error fetching contract data:', error);
        this.isThereAddendum = false;
      }
    );

    this.getcontractAddendum()
    if (this.contract_id != null) {
      this.getContract();
    }

    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (item.name == "Checker") {
        this.role_name = "Checker";

      } else {
        this.role_name = "Maker";
      }
    }

    this.reason_modal = new window.bootstrap.Modal(
      document.getElementById('reason_modal'),)

    this.dtOptions_payments = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      // lengthChange: true,
      //ordering: true,
      //paging: true,

      // scrollY: 400,
      //pagingType: 'full_numbers',
      //pageLength: 10,
      // select: true,

      ajax: (dataTablesParameters: any, callback: any) => {
        this.makerService.getPaymentDetail(this.contract_id).subscribe(
          async (resp: any) => {

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
                      this.makerService
                        .getPaymentDetail(this.contract_id).subscribe(
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
                              // this.reasonEditDelete = []
                              // console.log("the length: " + this.length)
                              // for (let i = 0; i < this.length; i++) {
                              //   console.log('ids: ' + resp[i]?.edit_reason_id)
                              //   if (resp[i]?.edit_reason_id == resp[i + 1]?.edit_reason_id) {
                              //     var aa = new RasonEditDeletePayload();
                              //     aa.reason = resp[i]?.reason
                              //     aa.by = resp[i]?.firstname + ' ' + resp[i]?.lastname
                              //     aa.date = resp[i]?.date
                              //     this.reasonEditDelete.push(aa)
                              //     i++
                              //   }
                              //   else {
                              //     var aa = new RasonEditDeletePayload();
                              //     aa.reason = resp[i]?.reason
                              //     aa.by = resp[i]?.firstname + ' ' + resp[i]?.lastname
                              //     aa.date = resp[i]?.date
                              //     this.reasonEditDelete.push(aa)
                              //   }
                              //   // this.editedBy.push(resp[i]?.firstname + ' ' + resp[i]?.lastname)
                              //   // this.editDate.push(resp[i]?.date)
                              // }
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
          title: 'id',
          data: 'id',
          visible: false,
        },
        {
          title: 'Payment Term',
          data: 'paymentTerm',
        },
        {
          title: 'Amount',
          data: 'amount',
        },
        {
          title: 'Due Date',
          data: 'dueDate',
        },
        {
          title: 'Description',
          data: 'paymentDescription',
        },
        {
          title: 'status',
          render: function (data: any, type: any, full: any) {
            if (full.status == 1)
              return ('<i class=" text-warning">Not Initiated</i>')
            else if (full.status == 2)
              return ('<i class=" text-primary">Under Manager review</i>')
            else if (full.status == 3)
              return ('<i class=" text-primary">Rejected</i>')
            else if (full.status == 4)
              return ('<i class=" text-primary">Under director review</i>')
            else if (full.status == 5)
              return ('<i class=" text-primary">Under SCIO review</i>')
            else if (full.status == 6)
              return ('<i class=" text-primary">Under finance review</i>')
            else
              return ('<i class=" text-success">Paid</i>')
          },
        },

      ],
      // dom: "<'row mt-2'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },



      select: false,

      stateSave: true,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,

      // fixed column
      scrollY: true,
      //scrollX:        true,
      //scrollCollapse: true,
      // paging:         false,
      // fixedColumns: false,

    };
  }

  getContract() {
    this.makerService.getContractById(this.contract_id).subscribe(
      async (data: any) => {
        this.contractDetail = data
        console.log('here is the the data ' + this.contractDetail.payment_status)

        const num = data.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts = num.split('.'); // Split the number into parts before and after decimal
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.total_amount = parts.join('.');

        // const kk = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        // const partss = kk.split('.'); // Split the number into parts before and after decimal
        // partss[0] = partss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        // data.paid_amount = partss.join('.');

        // const kkk = data.late_penality_fee.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        // const partsss = kkk.split('.'); // Split the number into parts before and after decimal
        // partsss[0] = partsss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        // data.late_penality_fee = partsss.join('.');
        // console.log('vendor--------------------vendor--------------------------------- ' + data.vendor_name);
        // console.log('Result Vendor: ' + JSON.stringify(data, null, 3));

        // console.log('the length of products: ' + data.products.length);
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
                  this.makerService.getContractById(this.contract_id).subscribe(
                    (data: any) => {
                      const num = data.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      const parts = num.split('.'); // Split the number into parts before and after decimal
                      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      data.total_amount = parts.join('.');

                      // const kk = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      // const partss = kk.split('.'); // Split the number into parts before and after decimal
                      // partss[0] = partss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      // data.paid_amount = partss.join('.');

                      // const kkk = data.late_penality_fee.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      // const partsss = kkk.split('.'); // Split the number into parts before and after decimal
                      // partsss[0] = partsss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      // data.late_penality_fee = partsss.join('.');
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

  downloadContractDocument() {
    this.save_as = "Contract document"
    this.makerService.downloadContractFiles(this.contract_id).subscribe((event: any) => {
      this.preview = false;
      this.downloadProgress(event);
    });
  }

  downloaSecurityDocument() {
    this.save_as = "Bond document"
    this.makerService.downloadSecuritytFiles(this.contract_id).subscribe((event: any) => {
      this.preview = false;
      this.downloadProgress(event);
    });
  }
  previewContractDocument() {
    this.makerService.downloadContractFiles(this.contract_id).subscribe((event: any) => {
      this.preview = true;
      this.downloadProgress(event);
    });
  }
  previewSecurityDocument() {
    this.makerService.downloadSecuritytFiles(this.contract_id).subscribe((event: any) => {
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
  editContractByMakerBeforeAproval() {
    this.router.navigateByUrl(
      'maker/view-contracts/edit/' + this.contract_id)
  }

  changeContractByMakerafterAproval(requestType: any) {
    this.router.navigate(['maker/view-contracts/edit', this.contract_id], { queryParams: { requestType: requestType } });
  }

  approveContractRequests(requestType: any) {
    this.router.navigate(['maker/view-contracts/edit', this.contract_id], { queryParams: { requestType: requestType } });
  }


  deleteContractBeforeApproval() {
    Swal.fire({
      title: 'Delete Contract: ' + this.contractDetail.contract_title,
      text:
        'Are you sure? you are about to delete ' +
        this.contractDetail.contract_title +
        ' from the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.makerService
          .deleteContract(this.contract_id)
          .subscribe(
            (data: any) => {
              if (data == true)
                // alert(data);
                Swal.hideLoading();
              Swal.close();
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: ' You are successfully  deleted contract request!',
              });

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
                          .deleteContract(this.contract_id)
                          .subscribe(
                            (data: any) => {
                              if (data == true)

                                // alert(data);
                                Swal.hideLoading();
                              Swal.close();
                              Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: ' You are successfully  deleted contract request!',
                              });

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
        // this.reason_modal.show()
        // this.vendor_id = event.target.getAttribute('delete-vendor');
        // this.reason = "Delete Vendor"

        // console.log(
        //   'delete-vendor: ' + event.target.getAttribute('delete-vendor')
        // );
      }
    });
  }


  approveContract() {
    Swal.fire({
      title: 'Approve contract with title : ' + this.contractDetail.contract_title,
      text:
        'Are you sure? you are about to approve a contract.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0acf97',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Approve',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceChecker.ApproveContract(this.contract_id).subscribe(
          async (data) => {
            if (data == true) {
              Swal.fire({
                icon: 'success',
                title: 'success',
                text: 'Successfully Approved',
              });
              window.location.reload();

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
                      this.serviceChecker.ApproveContract(this.contract_id).subscribe(
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
  rejectContract() {
    Swal.fire({
      title: 'Reject request! ',
      text:
        'Are you sure? you are about to reject a contract creation request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Reject',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.contract_id = event.target.getAttribute('reject-contract');
        this.reason = "Reject contract"
        this.reason_modal.show();
      }
    });
  }

  onSubmitReason() {
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;
      if (this.reason == "Reject contract") {

        this.RejectContractRequest(this.contract_id, this.remark, this.reason)
      }
      this.reason_modal.hide();
      this.reasonForm.reset();
    } else this.submitted = true;
    return true;
  }
  bondHistory() {
    this.bond = true;

  }
  RejectContractRequest(id: any, remark: Remark, reason: any) {
    this.serviceChecker.RejectContractRequest(id, remark, reason).subscribe(
      (data) => {
        if (data) {
          // $('#view_detail').DataTable().ajax.reload()

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
                  this.serviceChecker.RejectContractRequest(id, remark, reason).subscribe(
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

  toggleTableAddendum() {
    if (this.TogleAddendum)
      this.TogleAddendum = false;
    else
      this.TogleAddendum = true
  }
  toggleTableHistory() {
    if (this.history)
      this.history = false;
    else
      this.history = true
  }
  contractHistory() {
    console.log('test one')
    this.contract_history = {
      serverSide: false,
      scrollX: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.makerService.getContractHistory(this.contract_id).subscribe(
          async (resp: any) => {
            if (resp != null) {
              console.log(
                'ttttttttttttttttttttttttttt: ' +
                JSON.stringify(resp, null, 2));

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
                      this.makerService
                        .getContractHistory(this.contract_id).subscribe(
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

        { title: 'ID', data: 'id' },

        {
          title: 'Action',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.request_type == 'Update request') {
              return 'Updated';
            }
            else
              return 'renewed';
          },
        },
        { title: 'Contract Title', data: 'contract_title' },
        // { title: 'Vendor Name', data: 'name_vendor' },
        { title: 'Directorate', data: 'directorate' },
        { title: 'Contract Type', data: 'contract_type' },
        { title: 'Start Date', data: 'start_date' },
        { title: 'End Date', data: 'end_date' },
        { title: 'Total Amount', data: 'total_amount' },
        { title: 'Currency', data: 'currency' },
        { title: 'Including vat?', data: 'vat' },
        { title: 'sla?', data: 'sla' },
        { title: 'Payment Method', data: 'payment_method' },
        { title: 'Payment Status', data: 'payment_status' },
        {
          title: 'Contrat Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.contract_document_document != null) {
              // that.save_as = "Contract_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file-AddendumContract="' +
                full.id +
                '"></i>Download <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-contract-document="' +
                full.id +
                '"></i>Preview'
              );
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },
        { title: 'Bond Amount', data: 'bond_amount' },
        { title: 'Bond expiry date', data: 'bond_expiry_date' },
        { title: 'Issuer bank', data: 'issuer_bank' },
        {
          title: 'Bond Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.security_document != null) {
              // that.save_as = "Security_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file="' +
                full.id +
                '"></i>Download <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-security-document="' +
                full.id +
                '"></i>Preview'
              );
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },
        { title: 'Requested By', data: 'requested_by' },
        { title: 'Approved By', data: 'approved_by' },
        {
          title: 'Payments',
          orderable: false,
          render: function () {
            return '<button class="btn btn-primary btn-sm toggle-details">view</button>';
          },
        },




      ],
      // dom: "<'row mt-2'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },



      select: false,

      stateSave: true,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,

      // fixed column
      scrollY: true,
      //scrollX:        true,
      //scrollCollapse: true,
      paging: false,
      // fixedColumns: false,

      rowCallback: (row: Node, data: any, index: number) => {
        $('td .toggle-details', row).unbind('click');
        $('td .toggle-details', row).bind('click', () => {
          this.togglePaymentHistoryDetails(row, data);
        });
      },

    };

  }
  togglePaymentHistoryDetails(row: any, data: any) {
    const table = $('#contractHistory').DataTable();
    const tr = $(row).closest('tr');
    const rowData = table.row(tr);

    if (rowData.child.isShown()) {
      rowData.child.hide();
      tr.removeClass('shown');
    } else {
      // Fetch payment details from the API
      this.makerService.getOldPaymentDetail(data.id).subscribe((paymentData: any) => {
        let nestedTable = `<table class="table table-bordered">
            <thead>
              <tr>
                <th>Payment ID</th>
                 <th>Payment term</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>payment description</th>
              </tr>
            </thead>
            <tbody>`;

        paymentData.forEach((payment: any) => {
          nestedTable += `
            <tr>
              <td class="text-center">${payment.id}</td>
              <td class="text-center">${payment.paymentTerm}</td>
              <td class="text-center">${payment.amount}</td>
              <td class="text-center">${payment.dueDate}</td>
              <td class="text-center">${payment.paymentDescription}</td>
            </tr>`;
        });

        nestedTable += `</tbody></table>`;

        rowData.child(nestedTable).show();
        tr.addClass('shown');
      });
    }
  }
  getcontractAddendum() {
    console.log('test one')
    this.contract_addendum = {
      serverSide: false,
      scrollX: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        console.log('test two')
        this.makerService.getContractAddendum(this.contract_id).subscribe(
          async (resp: any) => {
            if (resp != null) {
              console.log('test three')
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
                      this.makerService
                        .getContractAddendum(this.contract_id).subscribe(
                          async (resp: any) => {
                            if (resp != null) {
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
        { title: 'ID', data: 'id' },
        {
          title: 'Action',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            return 'Addendum';
          },
        },
        { title: 'Contract Title', data: 'contract_title' },
        // { title: 'Vendor Name', data: 'name_vendor' },
        { title: 'Directorate', data: 'directorate' },
        { title: 'Contract Type', data: 'contract_type' },
        { title: 'Start Date', data: 'start_date' },
        { title: 'End Date', data: 'end_date' },
        { title: 'Total Amount', data: 'total_amount' },
        { title: 'Currency', data: 'currency' },
        { title: 'Including vat?', data: 'vat' },
        { title: 'sla?', data: 'sla' },
        { title: 'Payment Method', data: 'payment_method' },
        { title: 'Payment Status', data: 'payment_status' },
        {
          title: 'Contrat Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.contract_document_document != null) {
              // that.save_as = "Contract_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file-AddendumContract="' +
                full.id +
                '"></i>Download <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-contract-document="' +
                full.id +
                '"></i>Preview'
              );
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },
        { title: 'Bond Amount', data: 'bond_amount' },
        { title: 'Bond expiry date', data: 'bond_expiry_date' },
        { title: 'Issuer bank', data: 'issuer_bank' },
        {
          title: 'Bond Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.security_document != null) {
              // that.save_as = "Security_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file="' +
                full.id +
                '"></i>Download <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-security-document="' +
                full.id +
                '"></i>Preview'
              );
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },
        { title: 'Requested By', data: 'requested_by' },
        { title: 'Approved By', data: 'approved_by' },
        {
          title: 'Payments',
          orderable: false,
          render: function () {
            return '<button class="btn btn-primary btn-sm toggle-details">view</button>';
          },
        },




      ],
      // dom: "<'row mt-2'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },



      select: false,

      stateSave: true,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,

      // fixed column
      scrollY: true,
      //scrollX:        true,
      //scrollCollapse: true,
      paging: false,
      // fixedColumns: false,

      rowCallback: (row: Node, data: any, index: number) => {
        $('td .toggle-details', row).unbind('click');
        $('td .toggle-details', row).bind('click', () => {
          this.toggleAddendumPaymentDetails(row, data);
        });
      },

    };

  }
  toggleAddendumPaymentDetails(row: any, data: any) {
    const table = $('#contractAddendum').DataTable();
    const tr = $(row).closest('tr');
    const rowData = table.row(tr);

    if (rowData.child.isShown()) {
      rowData.child.hide();
      tr.removeClass('shown');
    } else {
      // Fetch payment details from the API
      this.makerService.getAddendumPaymentDetail(data.id).subscribe((paymentData: any) => {

        const paymentStatusMap: { [key: number]: string } = {
          1: "Not Initiated",
          2: "Under Manager Review",
          3: "Rejected",
          4: "Under Director Review",
          5: "Under SCIO Review",
          6: "Under Finance Review",
          7: "Paid",
        };

        let nestedTable = `<table class="table table-bordered">
            <thead>
              <tr>
                <th>Payment ID</th>
                 <th>Payment term</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>payment description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>`;

        paymentData.forEach((payment: any) => {
          nestedTable += `
            <tr>
              <td class="text-center">${payment.id}</td>
              <td class="text-center">${payment.paymentTerm}</td>
              <td class="text-center">${payment.amount}</td>
              <td class="text-center">${payment.dueDate}</td>
              <td class="text-center">${payment.paymentDescription}</td>
              <td class="text-center">${paymentStatusMap[payment.status] || "Unknown Status"}</td>
            </tr>`;
        });

        nestedTable += `</tbody></table>`;

        rowData.child(nestedTable).show();
        tr.addClass('shown');
      });
    }
  }
  ngAfterViewInit(): void {
    var that = this;
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('download-file-AddendumContract')) {
        var addendum_contract_id = event.target.getAttribute('download-file-AddendumContract')
        console.log('here is the addundum id ' + addendum_contract_id);
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
        this.makerService.downloadAddendumFiles(addendum_contract_id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

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
