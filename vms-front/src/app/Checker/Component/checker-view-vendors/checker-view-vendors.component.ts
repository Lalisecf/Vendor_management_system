import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { CheckEmailExistPayload } from 'src/app/Admin/payloads/admin_check_email_exist_payload';
import { Remark } from 'src/app/Maker/Payloads/remark';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { CheckerService } from '../../Services/checker.service';
import Quill from 'quill';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import saveAs from 'file-saver';
import { Vendors } from 'src/app/Maker/Payloads/vendors';

declare var window: any
@Component({
  selector: 'app-checker-view-vendors',
  templateUrl: './checker-view-vendors.component.html',
  styleUrls: ['./checker-view-vendors.component.css']
})
export class CheckerViewVendorsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('SuccessSwalSendRemark')
  public readonly SuccessSwalSendRemark!: SwalComponent;
  dtOptions: any;
  // min!: number;
  // max!: number;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  postanumber: any;
  fax: any;
  emails: any;
  phone: any;
  names: any;
  site: any;
  location: any;
  industry: any;
  general: any;
  tine: any;
  trade: any;
  other: any;

  status!: any;
  detail_history_modal: any;
  dtOptions_deatil_history: any;
  request_id: any = 0;
  refresh_token_requested = false;
  reject_request_modal: any;
  view_remark_modal: any;
  edit_remark_modal: any;
  reason_modal: any;
  registerForm!: FormGroup;
  reasonForm!: FormGroup;
  editForm!: FormGroup;
  submitted: boolean = false;
  getRemark: boolean = false;
  remarkId: any;
  remark!: Remark;
  remarks!: Remark[];
  email!: CheckEmailExistPayload;
  dtOptions_view_remarks: any;
  replay_remark!: any;
  vendor_id: any = 0;
  reason: any;
  progress_download = 0;
  downloadStatus_title = 'Downloading...';
  filenames: string[] = [];
  document_type!: any;
  preview: boolean = false;
  file_to_preview!: any;

  input_0!: any;
  input_1!: any;
  input_2!: any;
  input_3!: any;
  input_4!: any;
  input_5!: any;
  input_6!: any;
  input_7!: any;
  input_8!: any;
  input_9!: any;
  input_10!: any;
  input_11!: any;
  input_12!: any;
  input_13!: any;
  input_14!: any;
  input_15!: any;
  input_16!: any;
  input_17!: any;
  input_18!: any;

  searchType!: any;

  first_column_id = '0';
  second_column_id = '1';
  third_column_id = '2';
  fourth_column_id = '3';
  fifth_column_id = '4';
  sixth_column_id = '5';
  seventh_column_id = '6';
  eighth_column_id = '7';
  ninth_column_id = '8';
  tenth_column_id = '9';
  eleventh_column_id = '10';
  twelfth_column_id = '11';
  thirteenth_column_id = '12';
  fourteenth_column_id = '13';
  fiveteenth_column_id = '14';
  sixteenth_column_id = '15';
  seventeenth_column_id = '16';
  eighteenth_column_id = '17';
  ninteenth_column_id = '18';


  first_column_title = '-ID-';
  second_column_title = 'Vendor Name';
  third_column_title = 'Total Contract';
  fourth_column_title = 'Category';
  fifth_column_title = 'Service';
  sixth_column_title = 'phone Number';
  seventh_column_title = 'email';
  eighth_column_title = 'Website';
  ninth_column_title = 'Country';
  tenth_column_title = 'address';
  eleventh_column_title = 'Post Number';
  twelfth_column_title = 'Fax Number';
  thirteenth_column_title = 'General Document';
  fourteenth_column_title = 'Trade Licence';
  fiveteenth_column_title = 'Tin Certificate';
  sixteenth_column_title = 'Other Document';
  seventeenth_column_title = 'Registration Date';
  eighteenth_column_title = 'status';
  ninteenth_column_title = 'Action ';



  rmark_first_column_title = 'ID';
  rmark_second_column_title = 'Title';
  rmark_third_column_title = 'Description';
  rmark_fourth_column_title = 'Date';
  rmark_fiveth_column_title = 'Sent From';
  rmark_sixeth_column_title = 'Action';

  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private service: CheckerService,
    private Makerservice: MakerService,
    private utilService: UtilService
  ) {
    this.remark = {
      id: '',
      title: '',
      description: '',
      created_date: '',
      created_by: '',
      email: ''
    };
    this.registerForm = this.formBuilder.group(
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
    this.reasonForm = this.formBuilder.group(
      {
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300),
        ]),
        description: new FormControl('', [
          Validators.required,
        ]),

      },
    );
    this.editForm = this.formBuilder.group(
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
  // reload() {
  //   $('#vendor_table').DataTable().ajax.reload()
  // }
  openDetailHistoryModal(dt: any) {
    if (this.status !== 1 || this.status !== 0)
      this.detail_history_modal.show();
    else {
      Swal.fire({
        icon: 'error',
        title: 'Impossible !',
        text: 'The contract already rejected or pending please check it.',
      });
    }
  }
  ngOnInit(): void {
    const that = this;
    this.Makerservice.Search$.subscribe(value => {
      this.searchType = value;
      console.log('seeeeerrrrcccccchhhhhhh vallllluuuuuuuueeee ' + this.searchType)
    });
    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      lengthChange: true,
      ordering: true,
      paging: true,
      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 7,
      select: true,
      // ajax: '../../../../assets/data/data.json',
      ajax: (dataTablesParameters: any, callback: any) => {
        this.service.getAllVendors().subscribe(
          async (resp: any) => {
            if (resp != null) {
              console.log(
                'response for table: ' + JSON.stringify(resp, null, 2)
              );
              // data: resp
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
                      this.service.getAllVendors().subscribe(
                        async (resp: any) => {
                          if (resp != null) {
                            console.log(
                              'response for table: ' +
                              JSON.stringify(resp, null, 2)
                            );
                            // data: resp
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
          title: this.first_column_title,
          render: function (data: any, type: any, full: any) {
            return 'Vend' + full.id
          }
        },
        {
          title: this.second_column_title,
          data: 'name',
        },
        {
          title: this.third_column_title,
          render: function (data: any, type: any, full: any) {

            if (full.contract.length == 1) {
              return '<a href="javascript: void(0);" search-vendor-namee="' + full.name + '">' + full.contract.length + ' Contract</a>';
            } else if (full.contract.length > 1) {
              return '<a href="javascript: void(0);" search-vendor-namee="' + full.name + '">' + full.contract.length + ' Contracts</a>';
            } else {
              return 'No';
            }
          },
        },
        {
          title: this.fourth_column_title,
          render: function (data: any, type: any, full: any) {
            var r = ''
            for (let i = 0; i < full.products.length; i++)
              if (full.products.length - 1 == i)
                r = r + full.products[i].name
              else
                r = r + full.products[i].name + ', '
            return r
          },
        },
        // {
        //   title: this.fifth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     var r = ''
        //     for (let i = 0; i < full.services.length; i++)
        //       if (full.services.length - 1 == i)
        //         r = r + full.services[i].name
        //       else
        //         r = r + full.services[i].name + ', '
        //     return r
        //   },
        //   data: 'name',
        // },
        {
          title: this.sixth_column_title,
          data: 'phone_number',
        },
        {
          title: this.seventh_column_title,
          data: 'email',
        },
        {
          title: this.eighth_column_title,
          data: 'website',
        },
        {
          title: this.ninth_column_title,
          data: 'location',
        },
        {
          title: this.tenth_column_title,
          data: 'address',
        },
        {
          title: this.eleventh_column_title,
          data: 'post_number',
        },
        {
          title: this.twelfth_column_title,
          data: 'fax_number',
        },
        {
          title: this.thirteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.general_document != null)
              return (
                '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;"  download-general-document="' +
                full.id +
                '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-general-document="' +
                full.id +
                '"></i>Preview'
              );
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },

        {
          title: this.fourteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.trade_licence != null)
              return (
                '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-trade-licence="' +
                full.id +
                '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-trade-licence="' +
                full.id +
                '"></i>Preview'
              );
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },

        {
          title: this.fiveteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.tin_certificate != null)
              return (
                '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-tin-certificate="' +
                full.id +
                '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-tin-certificate="' +
                full.id +
                '"></i>Preview'
              );
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },

        {
          title: this.sixteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.other_document != null)
              return (
                '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-other-document="' +
                full.id +
                '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-other-document="' +
                full.id +
                '"></i>Preview'
              );
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },
        {
          title: this.seventeenth_column_title,
          data: 'vendor_registration_date',
        },
        {
          title: this.eighteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 1)
              return '<span class="badge bg-warning rounded-pill">Pending</span>';
            else if (full.status == 2)
              return '<span class="badge bg-success rounded-pill">Active</span>';
            else if (full.status == 0)
              return '<span class="badge bg-danger rounded-pill">Rejected</span>';
            else
              return '<span class="badge bg-danger rounded-pill">Inactive</span>';
          },
        },
        {
          title: this.ninteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.request_type == "delete")
              return (
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'delete-vendor-name="' +
                full.name +
                '"delete-vendor="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Delete Request</button>'
              );
            else if (full.request_type == 'deactivate')
              return (
                '<button  class="btn btn-outline-warning btn-sm"  ' +
                'deactivate-vendor-name="' +
                full.name +
                '" deactivate-vendor="' +
                full.id +
                '" ><i class="mdi mdi-window-close mr-1"></i>Deactivate Request</button>'
              );
            else if (full.request_type == 'update')
              return (
                '<button  class="btn btn-outline-primary btn-sm"  ' +
                'update-vendor-name="' +
                full.name +
                '" update-vendor="' +
                full.id +
                '"><i class="mdi mdi-update mr-1"></i>Update Request</button>'
              );
            else if (full.request_type == 'activate')
              return (
                '<button  class="btn btn-outline-success btn-sm"  ' +
                'activate-vendor-name="' +
                full.name +
                '"activate-vendor="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Activate Request</button>'
              );
            else {
              if (full.status == 1)
                return (
                  '<button  class="btn btn-outline-success btn-sm"  ' +
                  'approve-vendor-name="' +
                  full.name +
                  '"approve-vendor="' +
                  full.id +
                  '"><i class="mdi mdi-check"></i>Approve</button>' +
                  '<button  class="btn btn-outline-danger btn-sm"  ' +
                  'reject-vendor-name="' +
                  full.name +
                  '"reject-vendor="' +
                  full.id +
                  '"><i class="mdi mdi-window-close mr-1"></i>Reject</button>' +
                  '<button  class="btn btn-outline-warning btn-sm"  ' +
                  'remark-vendor-name="' +
                  full.name +
                  '"remark-vendor="' +
                  full.id +
                  '"><i class="mdi mdi-pencil mr-1"></i>Remark</button>' +
                  '<button  class="btn btn-outline-warning btn-sm"  ' +
                  'view-remark-name="' +
                  full.name +
                  '"view-remark="' +
                  full.id +
                  '"><i class="mdi mdi-eye mr-1"></i>View Remarks</button>'

                );
              else if (full.status == 0)
                return (
                  '<button  class="btn btn-outline-warning btn-sm"  ' +
                  'view-remark-name="' +
                  full.name +
                  '"view-remark="' +
                  full.id +
                  '"><i class="mdi mdi-eye mr-1"></i>View remarks</button>'
                );
              else {
                return (
                  '<i class="mdi mdi-eye-off mr-1">No Request </i>'
                );
              }
            }
            // <button type="button" class="btn btn-warning"><i class="mdi mdi-wrench"></i> </button>
          },
        },
      ],
      dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },
      buttons: {
        buttons: [
          'colvis',
          ,
          // {
          //   extend: 'fixedColumns',
          //   text: 'FixedColumns',
          //   config: {
          //     left: 1,
          //   },
          // },
          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
              // alert('reload success');
            },
          },

          {
            extend: 'selected',
            text: '<i class="mdi mdi-money-bill text-warning">History</i>',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              for (let i = 0; i < rows.length; i++) {
                that.vendor_id = rows[i].id;
                that.status = rows[i].status;
                that.postanumber = rows[i].post_number;

                that.fax = rows[i].fax_number;
                that.emails = rows[i].email;
                that.phone = rows[i].phone_number;
                that.names = rows[i].name;
                that.site = rows[i].website;
                that.location = rows[i].location;
                that.industry = rows[i].industry;
                that.general = rows[i].general_document;
                that.tine = rows[i].tin_certificate;
                that.trade = rows[i].trade_licence;
                that.other = rows[i].other_document;
                // that.paymentFrequency = rows[i].payment_frequency;
                // that.payment_start_date = rows[i].payment_start_date;
                // that.total_value = rows[i].total_amount;

                // that.paymentFinished = false;
                $('#view_detail_vendor_history').DataTable().ajax.reload()
                that.openDetailHistoryModal(dt);
              }
            },
          },
          {
            extend: 'selected',
            text: '<i class="mdi mdi-money-bill text-warning">Bank Detail</i>',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              for (let i = 0; i < rows.length; i++) {
                that.vendor_id = rows[i].id;
                that.Makerservice.getBankDetail(that.vendor_id).subscribe(
                  async (data: Vendors) => { // Explicitly type `data` as `Vendors`
                    Swal.fire({
                      title: 'Bank Detail of ' + data.name,
                      html: `
                                    <style>
                                      .form-group {
                                        display: flex;
                                        align-items: center;
                                        margin-bottom: 15px;
                                      }
                                      .form-group label {
                                        flex: 1;
                                        margin-right: 10px;
                                        text-align: left;
                                      }
                                      .form-group input, .form-group select, .form-group div {
                                        flex: 2;
                                      }
                                      .form-control:focus {
                                       outline: none; /* Optional: Removes the default outline */
                                       border: 2px solid #00008B;
                                      }
                                     #quill-container-beneficiary-address {
                                      border: 1px solid #ccc; /* Default border */
                                      border-radius: 4px;
                                     }
                                    #quill-container-beneficiary-address:focus-within {
                                     border-color: blue; /* Change border color when Quill is focused */
                                     border: 2px solid #00008B;
                                    }
                                    </style>
                                    <div class="form-group">
                                      <label for="bank-name">Bank Name</label>
                                      <input type="text" id="bank-name" class="form-control" value="${data.bank_name}">
                                    </div>
                                    <div class="form-group">
                                      <label for="account-number">Account Number</label>
                                      <input type="text" id="account-number" class="form-control" value="${data.account_number}">
                                    </div>
                                    <div class="form-group">
                                      <label for="branch-name">Branch Name</label>
                                      <input type="text" id="branch-name" class="form-control" value="${data.branch_name}">
                                    </div>
                                    <div class="form-group">
                                      <label for="account-name">Account Name</label>
                                      <input type="text" id="account-name" class="form-control" value="${data.account_name}">
                                    </div>
                                    <div class="form-group">
                                      <label for="swift-code">SWIFT Code</label>
                                      <input type="text" id="swift-code" class="form-control" value="${data.swift_code}">
                                    </div>
                                      <div class="form-group">
                                      <label for="IBAN">IBAN</label>
                                      <input type="text" id="IBAN" class="form-control" value="${data.iban}">
                                    </div>
                                    <br>
                                    <div class="">
                                      <label for="beneficiary-address">Beneficiary Address</label>
                                      <div id="quill-container-beneficiary-address">${data.beneficiary_address}</div>
                                    </div>
                                  `,
                      showCancelButton: true,
                      showConfirmButton: true,
                      confirmButtonText: 'Update',
                      allowOutsideClick: false,
                      confirmButtonColor: '#0acf97',
                      cancelButtonColor: '#3085d6',
                      preConfirm: () => {
                        // Retrieve values from input fields
                        const formData = new FormData();
                        formData.append('id', that.vendor_id);
                        formData.append('bank_name', (document.getElementById('bank-name') as HTMLInputElement).value);
                        formData.append('account_number', (document.getElementById('account-number') as HTMLInputElement).value);
                        formData.append('branch_name', (document.getElementById('branch-name') as HTMLInputElement).value);
                        formData.append('account_name', (document.getElementById('account-name') as HTMLInputElement).value);
                        formData.append('swift_code', (document.getElementById('swift-code') as HTMLInputElement).value);
                        formData.append('iban', (document.getElementById('IBAN') as HTMLInputElement).value);
                        formData.append('beneficiary_address', quillBeneficiaryAddress.root.innerHTML);
                        // const updatedData: Vendors = {
                        //   ...data, // Spread the existing data
                        //   id: that.vendor_id,
                        //   bank_name: (document.getElementById('bank-name') as HTMLInputElement).value,
                        //   account_number: (document.getElementById('account-number') as HTMLInputElement).value,
                        //   branch_name: (document.getElementById('branch-name') as HTMLInputElement).value,
                        //   account_name: (document.getElementById('account-name') as HTMLInputElement).value,
                        //   swift_code: (document.getElementById('swift-code') as HTMLInputElement).value,
                        //   beneficiary_address: quillBeneficiaryAddress.root.innerHTML, // Use Quill for beneficiary address
                        // };
                        return formData; // Return the updated data
                      }
                    }).then((result) => {
                      if (result.isConfirmed && result.value) { // Check if `result.value` is defined
                        // const updatedData: Vendors = result.value; // Get the updated data from preConfirm
                        // Send the updated data to the backend
                        // console.log('here is the bank name to back end'+result.value.bank_name)
                        that.Makerservice.updateBankDetail(result.value).subscribe(
                          (response) => {
                            if (response == true) {
                              Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Bank details updated successfully!',
                              });
                            }
                            else {
                              Swal.fire({
                                icon: 'warning',
                                title: 'error',
                                text: 'Bank details not updated!',
                              });
                            }
                          },
                          (error) => {
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to update bank details!',
                            });
                            console.error('Error updating bank details:', error);
                          }
                        );
                      }
                    });

                    // Initialize Quill editor only for beneficiary address
                    var quillBeneficiaryAddress = new Quill('#quill-container-beneficiary-address', { theme: 'snow' });
                  },
                  (error) => {
                    if (error.error.text === 'access-token-expired') {
                      console.log('Access-token-expired requesting refresh token...');
                      if (that.localStorageService.retrieve('refresh_token_requested') == null) {
                        that.utilService.refreshToken().subscribe(
                          (data) => {
                            if (data === true) {
                              console.log('refresh token success re-requesting the actual request');
                              that.localStorageService.clear('refresh_token_requested');
                              // Re-request the bank details
                              that.Makerservice.getBankDetail(that.vendor_id).subscribe(
                                async (data: Vendors) => { // Explicitly type `data` as `Vendors`
                                  if (data != null) {
                                    Swal.fire({
                                      title: 'Bank Detail of the vendor: ' + data.name,
                                      html: `
                                                  <style>
                                                    .form-group {
                                                      display: flex;
                                                      align-items: center;
                                                      margin-bottom: 15px;
                                                    }
                                                    .form-group label {
                                                      flex: 1;
                                                      margin-right: 10px;
                                                      text-align: left;
                                                    }
                                                    .form-group input, .form-group select, .form-group div {
                                                      flex: 2;
                                                    }
                                                  </style>
                                                  <div class="form-group">
                                                    <label for="bank-name">Bank Name</label>
                                                    <input type="text" id="bank-name" class="form-control" value="${data.bank_name}">
                                                  </div>
                                                  <div class="form-group">
                                                    <label for="account-number">Account Number</label>
                                                    <input type="text" id="account-number" class="form-control" value="${data.account_number}">
                                                  </div>
                                                  <div class="form-group">
                                                    <label for="branch-name">Branch Name</label>
                                                    <input type="text" id="branch-name" class="form-control" value="${data.branch_name}">
                                                  </div>
                                                  <div class="form-group">
                                                    <label for="account-name">Account Name</label>
                                                    <input type="text" id="account-name" class="form-control" value="${data.account_name}">
                                                  </div>
                                                  <div class="form-group">
                                                    <label for="swift-code">SWIFT Code</label>
                                                    <input type="text" id="swift-code" class="form-control" value="${data.swift_code}">
                                                  </div>
                                                  <div class="form-group">
                                                     <label for="IBAN">IBAN</label>
                                                     <input type="text" id="IBAN" class="form-control" value="${data.iban}">
                                                  </div>
                                                  <div class="form-group">
                                                    <label for="beneficiary-address">Beneficiary Address</label>
                                                    <div id="quill-container-beneficiary-address">${data.beneficiary_address}</div>
                                                  </div>
                                                `,
                                      showCancelButton: true,
                                      showConfirmButton: true,
                                      confirmButtonColor: '#0acf97',
                                      cancelButtonColor: '#3085d6',
                                      preConfirm: () => {
                                        // Retrieve values from input fields
                                        const formData = new FormData();
                                        formData.append('id', that.vendor_id);
                                        formData.append('bank_name', (document.getElementById('bank-name') as HTMLInputElement).value);
                                        formData.append('account_number', (document.getElementById('account-number') as HTMLInputElement).value);
                                        formData.append('branch_name', (document.getElementById('branch-name') as HTMLInputElement).value);
                                        formData.append('account_name', (document.getElementById('account-name') as HTMLInputElement).value);
                                        formData.append('swift_code', (document.getElementById('swift-code') as HTMLInputElement).value);
                                        formData.append('iban', (document.getElementById('IBAN') as HTMLInputElement).value);
                                        formData.append('beneficiary_address', quillBeneficiaryAddress.root.innerHTML);
                                        return formData; // Return the updated data
                                      }
                                    }).then((result) => {
                                      if (result.isConfirmed && result.value) { // Check if `result.value` is defined
                                        // const updatedData: Vendors = result.value; // Get the updated data from preConfirm
                                        // Send the updated data to the backend
                                        that.Makerservice.updateBankDetail(result.value).subscribe(
                                          (response) => {
                                            Swal.fire({
                                              icon: 'success',
                                              title: 'Success',
                                              text: 'Bank details updated successfully!',
                                            });
                                          },
                                          (error) => {
                                            Swal.fire({
                                              icon: 'error',
                                              title: 'Error',
                                              text: 'Failed to update bank details!',
                                            });
                                            console.error('Error updating bank details:', error);
                                          }
                                        );
                                      }
                                    });

                                    // Initialize Quill editor only for beneficiary address
                                    var quillBeneficiaryAddress = new Quill('#quill-container-beneficiary-address', { theme: 'snow' });

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
                                    that.SwalSessionExpired.fire();
                                    that._refreshTokenExpired();
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
                            } else {
                              console.log('refresh token expired.');
                              that.SwalSessionExpired.fire();
                              that._refreshTokenExpired();
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
                        that.localStorageService.store('refresh_token_requested', true);
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
            }
          },
          {
            extend: 'copy',
            text: '<u>C</u>opy',
            key: {
              key: 'c',
              altKey: true,
            },
          },
          // 'print',
          // {
          //   extend: 'pdf',
          //   text: 'Pdf',
          // },
          // {
          //   extend: 'pdf',
          //   text: 'Pdf current page',
          //   exportOptions: {
          //     modifier: {
          //       page: 'current',
          //     },
          //   },
          // },
          {
            extend: 'excel',
            text: 'Excel',
          },

          // {
          //   extend: 'collection',
          //   text: 'Header',
          //   autoClose: true,
          //   background: true,
          //   dropup: false,
          //   collectionTitle: '',
          //   buttons: [
          //     {
          //       text: 'Enable fixed header',
          //       key: '1',
          //       action: function (e: any, dt: any, node: any, config: any) {
          //         dt.fixedHeader.enable();
          //       },
          //     },
          //     {
          //       text: 'Disable fixed header',
          //       key: '1',
          //       action: function (e: any, dt: any, node: any, config: any) {
          //         dt.fixedHeader.disable();
          //       },
          //     },
          //   ],
          //   fade: true,
          // },
        ],
      },

      stateSave: true,
      stateDuration: 0,
      fixedFooter: true,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      // searchPanes: {
      //   initCollapsed: true,
      //   cascadePanes: true,
      //   clear: true,
      // },
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
        //   {
        //     searchPanes: {
        //       show: true,
        //     },
        //     targets: [0, 1, 4, 5, 8],
        //   },
        //   {
        //     searchPanes: {
        //       show: false,
        //     },
        //     targets: [2, 3, 6, 7, 9, 10, 11],
        //   },
      ],
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
    };
    let jsonObj = JSON.parse(
      localStorage.getItem('DataTables_users_table_/admin/users')!
    );
    if (jsonObj != null) {
      console.log(jsonObj.columns);
      var counter: number = 0;
      for (let c of jsonObj.columns) {
        console.log(c.search.search);
        if (counter == 0) {
          this.input_0 = c.search.search;
        } else if (counter == 1) {
          this.input_1 = c.search.search;
        } else if (counter == 2) {
          this.input_2 = c.search.search;
        } else if (counter == 3) {
          this.input_3 = c.search.search;
        } else if (counter == 4) {
          this.input_4 = c.search.search;
        } else if (counter == 5) {
          this.input_5 = c.search.search;
        } else if (counter == 6) {
          this.input_6 = c.search.search;
        } else if (counter == 7) {
          this.input_7 = c.search.search;
        } else if (counter == 8) {
          this.input_8 = c.search.search;
        } else if (counter == 9) {
          this.input_9 = c.search.search;
        } else if (counter == 10) {
          this.input_10 = c.search.search;
        } else if (counter == 11) {
          this.input_11 = c.search.search;
        } else if (counter == 12) {
          this.input_12 = c.search.search;
        } else if (counter == 13) {
          this.input_13 = c.search.search;
        } else if (counter == 14) {
          this.input_14 = c.search.search;
        } else if (counter == 15) {
          this.input_15 = c.search.search;
        } else if (counter == 16) {
          this.input_16 = c.search.search;
        } else if (counter == 17) {
          this.input_17 = c.search.search;
        } else if (counter == 18) {
          this.input_18 = c.search.search;
        }

        counter++;
      }
    }
    this.dtOptions_view_remarks = {
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
        this.service.getRemark(this.request_id).subscribe(
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
                      this.service
                        .getRemark(this.request_id).subscribe(
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
          title: this.rmark_first_column_title,
          data: 'id',
        },
        {
          title: this.rmark_second_column_title,
          data: 'title',
        },
        {
          title: this.rmark_third_column_title,
          data: 'description',
        },
        {
          title: this.rmark_fourth_column_title,
          data: 'created_date',
        },
        {
          title: this.rmark_fiveth_column_title,
          render: function (data: any, type: any, full: any) {
            if (full.email == that.email.email)
              return ('<i class="uil uil-forward text-success"></i><i class="mdi mdi-account text-success">From Me</i>')
            else
              return ('<i class="uil uil-backward text-primary"></i><i class="mdi mdi-account text-primary">' + full.created_by + '</i>')
          },
        },
        {
          title: this.rmark_sixeth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.email == that.email.email) {
              return ('<button class="btn btn-success" edit-remark-id="' +
                full.id + '"><i class="mdi mdi-pencil"></i></button>');
            }
            else
              return '<button class="btn btn-primary" replay-remark-id="' +
                full.id + '"><i class="mdi mdi-send"></i></button>';
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
    this.dtOptions_deatil_history = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      lengthChange: true,
      ordering: true,
      paging: true,
      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 7,
      select: false,
      // ajax: '../../../../assets/data/data.json',
      ajax: (dataTablesParameters: any, callback: any) => {
        this.Makerservice.getHistory(this.vendor_id).subscribe(
          async (resp: any) => {
            if (resp != null) {
              console.log(
                'response for table: ' + JSON.stringify(resp, null, 2)
              );
              // data: resp
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
                      this.Makerservice.getHistory(this.vendor_id).subscribe(
                        async (resp: any) => {
                          if (resp != null) {
                            console.log(
                              'response for table: ' +
                              JSON.stringify(resp, null, 2)
                            );
                            // data: resp
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
          title: this.first_column_title,
          data: 'history_id',
        },
        {
          title: this.second_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.names == full.name) {
              return (full.name);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.name + '</span>');
            }
          }
        },
        {
          title: this.third_column_title,
          render: function (data: any, type: any, full: any) {
            var r = ''
            for (let i = 0; i < full.products.length; i++)
              if (full.products.length - 1 == i)
                r = r + full.products[i].name
              else
                r = r + full.products[i].name + ', '
            return r
          },
        },
        {
          title: this.fourth_column_title,
          render: function (data: any, type: any, full: any) {
            var r = ''
            for (let i = 0; i < full.services.length; i++)
              if (full.services.length - 1 == i)
                r = r + full.services[i].name
              else
                r = r + full.services[i].name + ', '
            return r
          },
          // data: 'name',
        },
        {
          title: this.fifth_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.phone == full.phone_number) {
              return (full.phone_number);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.phone_number + '</span>');
            }
          }
        },
        {
          title: this.sixth_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.emails == full.email) {
              return (full.email);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.email + '</span>');
            }
          }
        },
        {
          title: this.seventh_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.site == full.website) {
              return (full.website);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.website + '</span>');
            }
          }
        },
        {
          title: this.eighth_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.location == full.location) {
              return (full.location);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.location + '</span>');
            }
          }
        },
        {
          title: this.ninth_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.industry == full.industry) {
              return (full.industry);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.industry + '</span>');
            }
          }
        },
        {
          title: this.tenth_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.postanumber == full.post_number) {
              return (full.post_number);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.post_number + '</span>');
            }
          }
        },
        {
          title: this.eleventh_column_title,
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.fax == full.fax_number) {
              return (full.fax_number);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.fax_number + '</span>');
            }
          }// data: 'fax_number',
        },
        {
          title: this.thirteenth_column_title,
          data: 'general_document_descreption',
        },
        {
          title: 'General Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.general_document != null) {
              if (that.general == full.general_document) {
                return (
                  '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;"  download-general-document-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-general-document-update="' +
                  full.id +
                  '"></i>Preview'
                );
              } else {
                return (
                  '<span class="badge bg-warning rounded-pill"><i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;"  download-general-document-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-general-document-update="' +
                  full.id +
                  '"></i>Preview </span>'
                );
              }
            }
            else {
              return '<span class=" ">No file uploaded</span>';
            }
          },
        },

        {
          title: 'Trade Licence',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.trade_licence != null) {
              if (that.trade == full.trade_licence) {
                return (
                  '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-trade-licence-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-trade-licence-update="' +
                  full.id +
                  '"></i>Preview'
                );
              } else {
                return (
                  '<span class="badge bg-warning rounded-pill"><i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-trade-licence-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-trade-licence-update="' +
                  full.id +
                  '"></i>Preview</span>'
                );
              }
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },

        {
          title: 'Tin certificate',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.tin_certificate != null) {
              if (that.tine == full.tin_certificate) {
                return (
                  '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-tin-certificate-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-tin-certificate-update="' +
                  full.id +
                  '"></i>Preview'
                );
              } else {
                return (
                  '<span class="badge bg-warning rounded-pill"><i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-tin-certificate-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-tin-certificate-update="' +
                  full.id +
                  '"></i>Preview</span>'
                );
              }
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },

        {
          title: 'Other Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.other_document != null) {
              if (that.other == full.other_document) {
                return (
                  '<i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-other-document-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-other-document-update="' +
                  full.id +
                  '"></i>Preview'
                );
              } else {
                return (
                  '<span class="badge bg-warning rounded-pill"><i class="mdi mdi-18px mdi-download text-primary" style="cursor: pointer;" download-other-document-update="' +
                  full.id +
                  '"></i>Download<i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" preview-other-document-update="' +
                  full.id +
                  '"></i>Preview</span>'
                );
              }
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },
        },
        {
          title: this.fourteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 1)
              return '<span class="badge bg-warning rounded-pill">Pending</span>';
            else if (full.status == 2)
              return '<span class="badge bg-success rounded-pill">Active</span>';
            else if (full.status == 0)
              return '<span class="badge bg-danger rounded-pill">Rejected</span>';
            else
              return '<span class="badge bg-danger rounded-pill">Inactive</span>';
          },
        },

        {
          title: 'Taype',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.request_type != null)
              return (
                full.request_type
              );
            else
              return '<span class=" ">Normal</span>';
          },
        },

      ],
      dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },
      buttons: {
        buttons: [
          'colvis',
          ,
          {
            extend: 'fixedColumns',
            text: 'FixedColumns',
            config: {
              left: 1,
            },
          },
          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
              // alert('reload success');
            },
          },


          {
            extend: 'selected',
            text: '<i class="mdi mdi-money-bill text-warning">History</i>',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              for (let i = 0; i < rows.length; i++) {
                that.vendor_id = rows[i].id;
                that.status = rows[i].status;
                // that.paymentFrequency = rows[i].payment_frequency;
                // that.payment_start_date = rows[i].payment_start_date;
                // that.total_value = rows[i].total_amount;

                // that.paymentFinished = false;
                $('#view_detail_history').DataTable().ajax.reload()
                that.openDetailHistoryModal(dt);
              }
            },
          },
          {
            extend: 'copy',
            text: '<u>C</u>opy',
            key: {
              key: 'c',
              altKey: true,
            },
          },
          'print',
          {
            extend: 'pdf',
            text: 'Pdf',
          },
          {
            extend: 'pdf',
            text: 'Pdf current page',
            exportOptions: {
              modifier: {
                page: 'current',
              },
            },
          },
          {
            extend: 'excel',
            text: 'Excel',
          },

          {
            extend: 'collection',
            text: 'Header',
            autoClose: true,
            background: true,
            dropup: false,
            collectionTitle: '',
            buttons: [
              {
                text: 'Enable fixed header',
                key: '1',
                action: function (e: any, dt: any, node: any, config: any) {
                  dt.fixedHeader.enable();
                },
              },
              {
                text: 'Disable fixed header',
                key: '1',
                action: function (e: any, dt: any, node: any, config: any) {
                  dt.fixedHeader.disable();
                },
              },
            ],
            fade: true,
          },
        ],
      },

      stateSave: true,
      stateDuration: 0,
      fixedFooter: true,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      // searchPanes: {
      //   initCollapsed: true,
      //   cascadePanes: true,
      //   clear: true,
      // },
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
        //   {
        //     searchPanes: {
        //       show: true,
        //     },
        //     targets: [0, 1, 4, 5, 8],
        //   },
        //   {
        //     searchPanes: {
        //       show: false,
        //     },
        //     targets: [2, 3, 6, 7, 9, 10, 11],
        //   },
      ],
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
    };


    this.reject_request_modal = new window.bootstrap.Modal(
      document.getElementById('reject-modal'),
    )
    this.view_remark_modal = new window.bootstrap.Modal(
      document.getElementById('view_remark_modal'),)
    this.edit_remark_modal = new window.bootstrap.Modal(
      document.getElementById('edit_modal'),)
    this.reason_modal = new window.bootstrap.Modal(
      document.getElementById('reason_modal'),)

    this.detail_history_modal = new window.bootstrap.Modal(
      document.getElementById('detail_history_modal'),)
  }
  onSubmitReason() {
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;
      this.RejectVendorRequest(this.vendor_id, this.remark)
      this.reason_modal.hide();
      this.reasonForm.reset();
    } else this.submitted = true;
    return true;
  }

  RejectVendorRequest(id: any, remark: Remark) {
    this.service.RejectVendorRequest(id, remark).subscribe(
      (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' Rejected successfully ' + this.reason,
          });
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload();
            }
          );
          // this.datatableElement.dtInstance.then()
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
                  this.service.RejectVendorRequest(id, remark).subscribe(
                    (data) => {
                      if (data) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' Rejected successfully ' + this.reason,
                        });
                        this.datatableElement.dtInstance.then(
                          (dtInstance: DataTables.Api) => {
                            dtInstance.ajax.reload();
                          }
                        );
                        // this.datatableElement.dtInstance.then()
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
  AcceptVendorRequest(id: any, remark: Remark) {
    var type = 'vendor'
    this.service
      .AcceptVendorRequest(id, remark, type)
      .subscribe(
        (data: any) => {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload((data) => {
                // alert(data);
                Swal.hideLoading();
                Swal.close();
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: ' Successfully Accepted ' + this.reason,
                });
              }, false);
            }
          );
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
                    this.service
                      .AcceptVendorRequest(
                        id, remark, type
                      )
                      .subscribe(
                        (data: any) => {
                          this.datatableElement.dtInstance.then(
                            (dtInstance: DataTables.Api) => {
                              dtInstance.ajax.reload((data) => {
                                // alert(data);
                                Swal.hideLoading();
                                Swal.close();
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Success',
                                  text: ' Successfully Accepted ' + this.reason,
                                });
                              }, false);
                            }
                          );
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
  }
  rejectVendor(id: any, remark: Remark) {
    this.service.rejectVendor(id, remark).subscribe(
      (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' Rejected Successfully',
          });
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload();
            }
          );
          // this.datatableElement.dtInstance.then()
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
                  this.service.rejectVendor(id, remark).subscribe(
                    (data) => {
                      if (data) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' Rejected Successfully',
                        });
                        this.datatableElement.dtInstance.then(
                          (dtInstance: DataTables.Api) => {
                            dtInstance.ajax.reload();
                          }
                        );
                        // this.datatableElement.dtInstance.then()
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


  onSubmit() {

    if (this.registerForm.valid) {
      this.remark = this.registerForm.value;
      this.remark.id = this.replay_remark;
      console.log(
        'values' + JSON.stringify(this.remark, null, 2)

      );
      console.log('request id========>' + this.replay_remark);
      // this.roles

      this.saveRemark(this.request_id, this.remark);
    } else this.submitted = true;
    return true;
  }

  saveRemark(request_id: any, remark: Remark) {
    console.log(
      'Payload: ' + JSON.stringify(this.remark, null, 2)
    );
    this.service.VendorRemark(request_id, remark).subscribe(
      async (data) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'Send Remark',
            text: 'Sent remark successfuly!',
          });
          this.registerForm.reset();
          this.closeModal();
          this.submitted = false;

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
                  this.service.VendorRemark(request_id, remark).subscribe(
                    async (data) => {
                      if (data == true) {

                        Swal.fire({
                          icon: 'success',
                          title: 'Send Remark',
                          text: 'Sent remark successfuly!',
                        });
                        this.registerForm.reset();
                        this.reject_request_modal.close();

                        this.submitted = false;
                        console.log('remark success: ' + data);

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
  updateRemark(remark_id: any, remark: Remark) {
    console.log(
      'Payload: ' + JSON.stringify(this.remark, null, 2)
    );
    this.service.updateRemark(remark_id, remark).subscribe(
      async (data) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: 'Successfully edited',
          });
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload();
            });
          $('#PoolRequest_table').DataTable().ajax.reload()
          this.submitted = false;
          console.log('remark success: ' + data);
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
                  this.service.updateRemark(remark_id, remark).subscribe(
                    async (data) => {
                      if (data == true) {

                        Swal.fire({
                          icon: 'success',
                          title: 'success',
                          text: 'Successfully edited',
                        });
                        this.submitted = false;
                        console.log('remark success: ' + data);

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
  DeleteRemark(remark_id: any) {
    this.service.deleteRemark(remark_id).subscribe(
      async (data) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: 'Successfully deleted',
          });
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload();
            });
          $('#PoolRequest_table').DataTable().ajax.reload()
          this.submitted = false;
          console.log('remark success: ' + data);
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
                  this.service.deleteRemark(remark_id).subscribe(
                    async (data) => {
                      if (data == true) {

                        Swal.fire({
                          icon: 'success',
                          title: 'success',
                          text: 'Successfully deleted',
                        });
                        this.submitted = false;
                        console.log('remark success: ' + data);

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

  closeModal() {
    this.reject_request_modal.hide()
  }
  replay(id: any) {
    this.reject_request_modal.show();
    if (this.registerForm.valid) {
      this.remark = this.registerForm.value;
      console.log(
        'values' + JSON.stringify(this.remark, null, 2)

      );
      console.log('request id========>' + this.request_id);
      // this.roles

      this.saveRemark(id, this.remark);
    } else this.submitted = true;
    return true;

  }
  edit(id: any) {
    this.service.getRemarkById(id).subscribe(
      (data) => {
        if (data != null) {
          this.remark = data
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
          if (!this.refresh_token_requested) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.refresh_token_requested = false;
                  this.service
                    .getRemarkById(id)
                    .subscribe(
                      (data) => {
                        if (data != null) {
                          this.remark = data
                          // this.datatableElement.dtInstance.then()
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Permission',
                            text: 'You are not permitted to perform this action!',
                          });
                        }
                      },
                      (error) => {
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
            this.refresh_token_requested = true;
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

    //this.edit_remark_modal.show();
  }

  update() {
    if (this.editForm.valid) {
      this.remark = this.editForm.value;
      console.log(
        'values' + JSON.stringify(this.remark, null, 2)
      );
      this.updateRemark(this.remarkId, this.remark);
      $('#view_pool_remark').DataTable().ajax.reload()
      this.edit_remark_modal.hide();
      this.view_remark_modal.show();
    } else this.submitted = true;
    return true;


  }
  delete() {
    console.log("id=" + this.remarkId)
    this.DeleteRemark(this.remarkId);
    $('#view_pool_remark').DataTable().ajax.reload()
    this.edit_remark_modal.hide();
    this.view_remark_modal.show();
  }
  getReason(vendor_id: any) {
    var type = 'vendor'
    this.service.getReason(vendor_id, type).subscribe(
      async (data) => {
        if (data != null) {
          this.remark = data;
          console.log(
            'response for table: ' + JSON.stringify(data, null, 2)
          );
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
                  this.service.getReason(vendor_id, type).subscribe(
                    async (data) => {
                      if (data != null) {
                        this.remark = data;;

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

  clearAllSearches() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.rows('.selected').deselect();
      // dtInstance.search('').draw()
      dtInstance
        .search('')
        .column(0)
        .search('')
        .column(1)
        .search('')
        .column(2)
        .search('')
        .column(3)
        .search('')
        .column(4)
        .search('')
        .column(5)
        .search('')
        .column(6)
        .search('')
        .column(7)
        .search('')
        .column(8)
        .search('')
        .column(9)
        .search('')
        .column(10)
        .search('')
        .column(11)
        .search('')
        .column(12)
        .search('')
        .column(13)
        .search('')
        .column(14)
        .search('')
        .column(15)
        .search('')
        .column(16)
        .search('')
        .column(17)
        .search('')
        .column(18)
        .search('')
        .draw();
    });
  }

  //FOOTER SEARCH AND BUTTON ON CLICK
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        $('input', this.footer()).on('keyup change', function () {
          if (this['id'] != '') {
            if (
              dtInstance.column(this['id']).search() !==
              (this as HTMLInputElement).value
            ) {
              dtInstance
                .column(this['id'])
                .search((this as HTMLInputElement).value)
                .draw();
            }
            console.log('the column is: ' + this['id']);
          }
        });
      });
      var columnTitles = $(dtInstance.columns().header()).map(function () {
        return $(this).text().trim();
      }).get();
      if (this.searchType != '') {
        // Clear all previous searches
        dtInstance.search('').columns().search('');

        if (this.searchType == 'Total') {
          // Do nothing as all searches are cleared already
        } else if (this.searchType == 'Has Contract') {
          dtInstance.column(columnTitles.indexOf(this.third_column_title)).search('contract');
        } else if (this.searchType == 'No Contract') {
          dtInstance.column(columnTitles.indexOf(this.third_column_title)).search('No');
        } else if (this.searchType == 'Inactive') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('Inactive');
        } else if (this.searchType == 'Active') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('^Active$', true, false);
        } else if (this.searchType == 'pending') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('pending');
        } else if (this.searchType == 'Activate') {
          dtInstance.column(columnTitles.indexOf(this.ninteenth_column_title)).search('Activate Request');
        } else if (this.searchType == 'Deactivate') {
          dtInstance.column(columnTitles.indexOf(this.ninteenth_column_title)).search('Deactivate Request');
        } else if (this.searchType == 'Update') {
          dtInstance.column(columnTitles.indexOf(this.ninteenth_column_title)).search('Update Request');
        } else if (this.searchType == 'Delete') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('Delete Request');
        } else {
          // View total vendors
          this.clearAllSearches();
        }
        // Draw table after all search operations
        dtInstance.draw();
      }
      dtInstance.on(
        'draw stateRestore-change',
        function (e, settings, details) {
          var c = 0;
          for (let col of settings.aoColumns) {
            if (col.title == that.first_column_title) {
              that.first_column_id = c.toString();
            } else if (col.title == that.second_column_title) {
              that.second_column_id = c.toString();
            } else if (col.title == that.third_column_title) {
              that.third_column_id = c.toString();
            } else if (col.title == that.fourth_column_title) {
              that.fourth_column_id = c.toString();
            } else if (col.title == that.fifth_column_title) {
              that.fifth_column_id = c.toString();
            } else if (col.title == that.sixth_column_title) {
              that.sixth_column_id = c.toString();
            } else if (col.title == that.seventh_column_title) {
              that.seventh_column_id = c.toString();
            } else if (col.title == that.eighth_column_title) {
              that.eighth_column_id = c.toString();
            } else if (col.title == that.ninth_column_title) {
              that.ninth_column_id = c.toString();
            } else if (col.title == that.tenth_column_title) {
              that.tenth_column_id = c.toString();
            } else if (col.title == that.eleventh_column_title) {
              that.eleventh_column_id = c.toString();
            } else if (col.title == that.twelfth_column_title) {
              that.twelfth_column_id = c.toString();
            } else if (col.title == that.thirteenth_column_title) {
              that.thirteenth_column_id = c.toString();
            } else if (col.title == that.fourteenth_column_title) {
              that.fourteenth_column_id = c.toString();
            } else if (col.title == that.fiveteenth_column_title) {
              that.fiveteenth_column_id = c.toString();
            } else if (col.title == that.sixteenth_column_title) {
              that.sixteenth_column_id = c.toString();
            } else if (col.title == that.seventeenth_column_title) {
              that.seventeenth_column_id = c.toString();
            } else if (col.title == that.eighteenth_column_title) {
              that.eighteenth_column_id = c.toString();
            }

            c++;
          }
        }
      );

      dtInstance.on('column-reorder', function (e, settings, details) {
        var c = 0;
        for (let col of settings.aoColumns) {
          if (col.title == that.first_column_title) {
            that.first_column_id = c.toString();
          } else if (col.title == that.second_column_title) {
            that.second_column_id = c.toString();
          } else if (col.title == that.third_column_title) {
            that.third_column_id = c.toString();
          } else if (col.title == that.fourth_column_title) {
            that.fourth_column_id = c.toString();
          } else if (col.title == that.fifth_column_title) {
            that.fifth_column_id = c.toString();
          } else if (col.title == that.sixth_column_title) {
            that.sixth_column_id = c.toString();
          } else if (col.title == that.seventh_column_title) {
            that.seventh_column_id = c.toString();
          } else if (col.title == that.eighth_column_title) {
            that.eighth_column_id = c.toString();
          } else if (col.title == that.ninth_column_title) {
            that.ninth_column_id = c.toString();
          } else if (col.title == that.tenth_column_title) {
            that.tenth_column_id = c.toString();
          } else if (col.title == that.eleventh_column_title) {
            that.eleventh_column_id = c.toString();
          } else if (col.title == that.twelfth_column_title) {
            that.twelfth_column_id = c.toString();
          } else if (col.title == that.thirteenth_column_title) {
            that.thirteenth_column_id = c.toString();
          } else if (col.title == that.fourteenth_column_title) {
            that.fourteenth_column_id = c.toString();
          } else if (col.title == that.fiveteenth_column_title) {
            that.fiveteenth_column_id = c.toString();
          } else if (col.title == that.sixteenth_column_title) {
            that.sixteenth_column_id = c.toString();
          } else if (col.title == that.seventeenth_column_title) {
            that.seventeenth_column_id = c.toString();
          } else if (col.title == that.eighteenth_column_title) {
            that.eighteenth_column_id = c.toString();
          }
          c++;
        }
      });
    });
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('update-vendor')) {
        this.service.getEditedVendorId(event.target.getAttribute('update-vendor')).subscribe(
          async (data) => {
            if (data != null) {
              this.router.navigateByUrl(
                'maker/view-vendors/edit/' + data.id
              );
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
                    if (data == null) {
                      console.log(
                        'refresh token success re-requesting the actual request'
                      );
                      this.localStorageService.clear('refresh_token_requested');
                      //================================================================================
                      this.service.getEditedVendorId(event.target.getAttribute('update-vendor')).subscribe(
                        async (data) => {
                          if (data != null) {
                            this.router.navigateByUrl(
                              'maker/view-vendors/edit/' + data.id
                            );

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
      } else if (event.target.hasAttribute('delete-vendor')) {
        this.reason = "Delete Vendor Request"
        this.vendor_id = event.target.getAttribute('delete-vendor');
        this.getReason(event.target.getAttribute('delete-vendor'));
        Swal.fire({
          title: '<p class="text-warning">Delete Vendor:' + event.target.getAttribute('delete-vendor-name') + "</P>",
          text: ' Are you sure ? you are Acept or Reject  delete request depend on request reason.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'yes   ',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: '<p class="text-primary">Sent from: ' + this.remark.created_by + " on " + this.remark.created_date + ".Delete  " + event.target.getAttribute('delete-vendor-name') + "</p>",
              html: '<div id="quill-container">' + this.remark.description + '</div>', // Use html property to render HTML content
              icon: 'warning',
              showCancelButton: true,
              showCloseButton: true,
              cancelButtonText: 'Reject',
              confirmButtonColor: '#0acf97',
              cancelButtonColor: 'red',
              confirmButtonText: 'Accept',
              preConfirm: () => {
                // Retrieve Quill content and update this.remark.description
                this.remark.description = quill.root.innerHTML;
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.remark.title = this.reason
                this.AcceptVendorRequest(event.target.getAttribute('delete-vendor'), this.remark);

              } else if (result.dismiss === Swal.DismissReason.close) {
              } else {
                this.reason_modal.show();
              }
            });

            // Create a Quill instance and set its container to #quill-container
            var quill = new Quill('#quill-container', {
              theme: 'snow' // Choose a theme for Quill editor
            });

          }
        });

      } else if (event.target.hasAttribute('activate-vendor')) {
        this.reason = "Activate Vendor Request"
        this.vendor_id = event.target.getAttribute('activate-vendor');
        this.getReason(event.target.getAttribute('activate-vendor'));
        Swal.fire({
          title: '<p class="text-warning">Activate Vendor:' + event.target.getAttribute('activate-vendor-name') + "</P>",
          text: ' Are you sure ? you are Acept or Reject  activate request depend on request reason.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'yes   ',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: '<p class="text-primary">Sent from: ' + this.remark.created_by + " on " + this.remark.created_date + ".Activate  " + event.target.getAttribute('activate-vendor-name') + "</p>",
              html: '<div id="quill-container">' + this.remark.description + '</div>', // Use html property to render HTML content
              icon: 'warning',
              showCancelButton: true,
              showCloseButton: true,
              cancelButtonText: 'Reject',
              confirmButtonColor: '#0acf97',
              cancelButtonColor: 'red',
              confirmButtonText: 'Accept',
              preConfirm: () => {
                // Retrieve Quill content and update this.remark.description
                this.remark.description = quill.root.innerHTML;
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.remark.title = this.reason
                this.AcceptVendorRequest(event.target.getAttribute('activate-vendor'), this.remark);
              } else if (result.dismiss === Swal.DismissReason.close) {
              } else {
                this.reason_modal.show();
              }
            });

            // Create a Quill instance and set its container to #quill-container
            var quill = new Quill('#quill-container', {
              theme: 'snow' // Choose a theme for Quill editor
            });

          }
        });
      } else if (event.target.hasAttribute('deactivate-vendor')) {
        this.reason = "Deactivate Vendor Request"
        this.vendor_id = event.target.getAttribute('deactivate-vendor');
        this.getReason(event.target.getAttribute('deactivate-vendor'));
        Swal.fire({
          title: '<p class="text-warning">Deactivate Vendor:' + event.target.getAttribute('deactivate-vendor-name') + "</P>",
          text: ' Are you sure ? you are Acept or Reject  deactivate request depend on request reason.',
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'yes',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: '<p class="text-primary">Sent from: ' + this.remark.created_by + " on " + this.remark.created_date + ".Deactivate  " + event.target.getAttribute('deactivate-vendor-name') + "</p>",
              html: '<div id="quill-container">' + this.remark.description + '</div>', // Use html property to render HTML content
              icon: 'warning',
              showCancelButton: true,
              showCloseButton: true,
              allowOutsideClick: false,
              cancelButtonText: 'Reject',
              confirmButtonColor: '#0acf97',
              cancelButtonColor: 'red',
              confirmButtonText: 'Accept',
              preConfirm: () => {
                // Retrieve Quill content and update this.remark.description
                this.remark.description = quill.root.innerHTML;
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.remark.title = this.reason
                this.AcceptVendorRequest(event.target.getAttribute('deactivate-vendor'), this.remark);
              } else if (result.dismiss === Swal.DismissReason.close) {
              } else {
                this.reason_modal.show();
              }
            });

            // Create a Quill instance and set its container to #quill-container
            var quill = new Quill('#quill-container', {
              theme: 'snow' // Choose a theme for Quill editor
            });

          }
        });
      } else if (event.target.hasAttribute('reject-vendor')) {
        var vendor_name = event.target.getAttribute('reject-vendor-name');
        var vendor_id = event.target.getAttribute('reject-vendor');
        Swal.fire({
          title: 'Reject Vendor: ' + vendor_name,
          text:
            'Are you sure? you are about to Reject ' +
            vendor_name +
            '. This means the vendor will be prevented from using in this system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Reject',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason_modal.show();
            this.vendor_id = event.target.getAttribute('reject-vendor');
            this.reason = "Reject Vendor"
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          }
        });

      } else if (event.target.hasAttribute('approve-vendor')) {
        var vendor_name = event.target.getAttribute('approve-vendor-name');
        var vendor_id = event.target.getAttribute('approve-vendor');
        Swal.fire({
          title: 'Approve Vendor: ' + vendor_name,
          text:
            'Are you sure? you are about to approve ' +
            vendor_name +
            '. This means the vendor ready for use in this system.',
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: 'green',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Approve',
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.ApproveVendor(vendor_id).subscribe(
              async (data) => {
                if (data == true) {
                  Swal.fire({
                    icon: 'success',
                    title: 'success',
                    text: 'Successfully Approved',
                  });
                  this.datatableElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    });
                  $('#PoolRequest_table').DataTable().ajax.reload()
                  this.submitted = false;
                  console.log('remark success: ' + data);
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
                          this.service.ApproveVendor(vendor_id).subscribe(
                            async (data) => {
                              if (data == true) {

                                Swal.fire({
                                  icon: 'success',
                                  title: 'success',
                                  text: 'Successfully Approved',
                                });
                                this.submitted = false;
                                console.log('remark success: ' + data);

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
      } else if (event.target.hasAttribute('remark-vendor')) {
        var selected_request_id = event.target.getAttribute('remark-vendor');
        this.request_id = selected_request_id;
        this.reject_request_modal.show();
      } else if (event.target.hasAttribute('view-remark')) {
        var selected_request_id = event.target.getAttribute('view-remark');
        this.request_id = selected_request_id;
        $('#view_pool_remark').DataTable().ajax.reload()
        this.authService.getEmail().subscribe(
          (data) => {
            this.email = data

          },
          (error) => {
            if (error.error.text === 'access-token-expired') {
              console.log(
                'Access-token-expired requesting refresh token...'
              );
              if (!this.refresh_token_requested) {
                this.utilService.refreshToken().subscribe(
                  (data) => {
                    if (data === true) {
                      console.log(
                        'refresh token success re-requesting the actual request'
                      );
                      this.refresh_token_requested = false;
                      //================================================================================
                      this.authService.getEmail()
                        .subscribe(
                          (data) => {
                            this.email = data
                          },
                          (error) => {
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
                this.refresh_token_requested = true;
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
        this.view_remark_modal.show();
        this.datatableElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
          });
      } else if (event.target.hasAttribute('edit-remark-id')) {
        var remark_id = event.target.getAttribute('edit-remark-id');

        this.edit(remark_id);
        this.edit_remark_modal.show();
        this.remarkId = remark_id;
      } else if (event.target.hasAttribute('replay-remark-id')) {
        this.view_remark_modal.hide();
        this.reject_request_modal.show();
        this.replay_remark = event.target.getAttribute('replay-remark-id');
        // this.onSubmit(event.target.getAttribute('replay-remark-id'));
      } else if (event.target.hasAttribute('download-general-document')) {
        var vendor_id = event.target.getAttribute('download-general-document')
        this.document_type = 'general_document'
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
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-general-document')) {
        var vendor_id = event.target.getAttribute('preview-general-document')
        this.document_type = 'general_document'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('download-trade-licence')) {
        var vendor_id = event.target.getAttribute('download-trade-licence')
        this.document_type = 'trade_licence'
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
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-trade-licence')) {
        var vendor_id = event.target.getAttribute('preview-trade-licence')
        this.document_type = 'trade_licence'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-tin-certificate')) {
        var vendor_id = event.target.getAttribute('download-tin-certificate')
        this.document_type = 'tin_certificate'
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
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-tin-certificate')) {
        var vendor_id = event.target.getAttribute('preview-tin-certificate')
        this.document_type = 'tin_certificate'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-other-document')) {
        var vendor_id = event.target.getAttribute('download-other-document')
        this.document_type = 'other_document'
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
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-other-document')) {
        var vendor_id = event.target.getAttribute('preview-other-document')
        this.document_type = 'other_document'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('preview-general-document-update')) {
        var vendor_id = event.target.getAttribute('preview-general-document-update')
        this.document_type = 'general_document'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('download-trade-licence-update')) {
        var vendor_id = event.target.getAttribute('download-trade-licence-update')
        this.document_type = 'trade_licence'
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
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-trade-licence-update')) {
        var vendor_id = event.target.getAttribute('preview-trade-licence-update')
        this.document_type = 'trade_licence'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-tin-certificate-update')) {
        var vendor_id = event.target.getAttribute('download-tin-certificate-update')
        this.document_type = 'tin_certificate'
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
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-tin-certificate-update')) {
        var vendor_id = event.target.getAttribute('preview-tin-certificate-update')
        this.document_type = 'tin_certificate'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-other-document-update')) {
        var vendor_id = event.target.getAttribute('download-other-document-update')
        this.document_type = 'other_document'
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
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-other-document-update')) {
        var vendor_id = event.target.getAttribute('preview-other-document-update')
        this.document_type = 'other_document'
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
        // this.downloadProgress(event,'vendor');
        this.Makerservice.downloadVendorFilesUpdated(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('search-vendor-namee')) {
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Id: ' + event.target.getAttribute('search-vendor-namee'))
        this.Makerservice.setVendorSearch(event.target.getAttribute('search-vendor-namee'));
        this.router.navigate(['checker/view-contracts']);
      }
    });
  }
  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
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
            // console.log('File url is: ' + JSON.stringify(httpEvent, null, 4));

            saveAs(
              new File([httpEvent.body!], this.document_type, {
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
          } else {
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
  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
      console.log(dtInstance)
    );
  }
  openPreviewInNewTab() {
    window.open(this.file_to_preview, '_blank');
  }
  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
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
          this.localStorageService.clear('roles');
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

/*
//HTML
<swal
  #SwalSessionExpired
  title="Warning"
  text="Your session has expired! please login to continue."
  icon="warning"
  [showCancelButton]="false"
  [showConfirmButton]="false"
  [timer]="3500"
  [focusCancel]="true"
>
</swal>
================================================================================================================
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

================================================================================================================
        ajax: (dataTablesParameters: any, callback: any) => {
          this.adminService.getAllRoles().subscribe(
            async (resp: any) => {
              if (resp != null) {
                console.log(
                  'response for table: ' + JSON.stringify(resp, null, 2)
                );
                // data: resp
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
              }
          );
        },
================================================================================================================
  if (error.error.text === 'access-token-expired') {
    console.log('Access-token-expired requesting refresh token...');
    if (this.localStorageService.retrieve('refresh_token_requested') ==
                null){
      this.utilService.refreshToken().subscribe(
        (data) => {
          if (data === true) {
            console.log(
              'refresh token success re-requesting the actual request'
            );
            this.localStorageService.clear('refresh_token_requested');
            //================================================================================

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
========================================================================================================
  //AFTER TOKEN: REFRESH IF ERROR AGAIN

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
===========================================================================================================

//FUNCTIONS
    _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
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

  function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
===================================================================================================
       this.adminService
          .deleteUser(event.target.getAttribute('delete-vendor'))
          .subscribe(
            (data: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User deleted successfully!',
              });
            },
            (error: any) => {
              
            }
          );
*/
