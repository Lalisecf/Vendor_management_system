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
import saveAs from 'file-saver';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { MakerService } from '../../Services/maker.service';
import { Remark } from '../../Payloads/remark';
import { CheckEmailExistPayload } from '../../Payloads/email';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import Quill from 'quill';
import { Vendors } from '../../Payloads/vendors';
declare var window: any
@Component({
  selector: 'app-view-licence',
  templateUrl: './view-licence.component.html',
  styleUrls: ['./view-licence.component.css']
})
export class ViewLicenceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('SuccessSwalSendRemark')
  public readonly SuccessSwalSendRemark!: SwalComponent;
  dtOptions: any;
  // min!: number;
  // max!: number;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  role_name: any;
  vendor_name: any;
  contract_title: any;
  product_service_name: any;
  licence_quantity: any;
  product_category: any;
  licence_type: any;
  start_date: any;
  expiry_date: any;
  renewal_date: any;
  total_cost: any;
  support_period: any;
  file_path: any;
  additional_info: any;
  request_id: any = 0;
  status!: any;
  detail_history_modal: any;
  dtOptions_deatil_history: any;
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
  licence_id: any = 0;
  reason: any;
  progress_download = 0;
  downloadStatus_title = 'Downloading...';
  filenames: string[] = [];
  preview: boolean = false;
  file_to_preview!: any;
  document_type!: any;

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
  input_18!: any

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
  ninteenth_column_id = '18'

  first_column_title = '-ID-';
  second_column_title = 'Vendor Name';
  third_column_title = 'Total Contract';
  fourth_column_title = 'Category';
  fifth_column_title = 'Service';
  sixth_column_title = 'phone Number';
  seventh_column_title = 'email';
  eighth_column_title = 'Website';
  ninth_column_title = 'Country';
  tenth_column_title = 'Address';
  eleventh_column_title = 'Posta Number';
  twelfth_column_title = 'Fax Number';
  thirteenth_column_title = 'General Document';
  fourteenth_column_title = 'Trade Licence';
  fiveteenth_column_title = 'Tin Certificate';
  sixteenth_column_title = 'Other Document';
  seventeenth_column_title = 'status';
  eighteenth_column_title = 'Change Status';
  nineteenth_column_title = 'Action'

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
    private service: MakerService,
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
          Validators.maxLength(30),
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


  // reload() {
  //   $('#vendors_table').DataTable().ajax.reload()
  // }

  ngOnInit(): void {
    const that = this;
    this.service.Search$.subscribe(value => {
      this.searchType = value;
      console.log('seeeeerrrrcccccchhhhhhh vallllluuuuuuuueeee ' + this.searchType)
    });

    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (item.name == "Checker") {
        this.role_name = "Checker";

      } else {
        this.role_name = "Maker";
      }
    }

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
        this.service.getAllLicences().subscribe(
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
                      this.service.getAllLicences().subscribe(
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
          title: 'ID',
          data: 'id'
        },
        {
          title: 'Vendor name',
          data: 'vendor_name'
        },
        {
          title: 'contract title',
          data: 'contract_title'
        },
        {
          title: 'product or service name',
          data: 'product_service_name',
        },
        {
          title: 'Quantity',
          data: 'licence_quantity'

        },
        {
          title: 'product category',
          data: 'product_category'

        },

        {
          title: 'Licence Type',
          data: 'licence_type',
        },
        {
          title: 'Start Date',
          data: 'start_date',
        },
        {
          title: 'Expiry Date',
          data: 'expiry_date',
        },
        {
          title: 'Renewal Date',
          data: 'renewal_date',
        },
        {
          title: 'Total cost',
          data: 'total_cost',
        },
        {
          title: 'Support Period',
          data: 'support_period',
        },
        {
          title: 'Licence Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.file_path != null)
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
          title: 'additional info',
          data: 'additional_info'
        },

        {
          title: 'status',
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
        ...(that.role_name !== 'Checker' ? [{
          title: 'Change Status',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 2 && full.request_type == null)
              return (
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-vendor-name="' +
                full.name +
                '" deactivate-vendor="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Terminate</button>'
              );
            else if (full.status == 2 && full.request_type == 'deactivate')
              return (
                '<button  class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-vendor-name="' +
                full.name +
                '" deactivate-vendor="' +
                full.id +
                '" disabled><i class="mdi mdi-window-close mr-1"></i>Deactivate Request</button>'
              );
            else if (full.status == 2 && full.request_type != null)
              return (
                '<button  class="btn btn-outline-primary btn-sm"  ' +
                'deactivate-vendor-name="' +
                full.name +
                '" deactivate-vendor="' +
                full.id +
                '" disabled><i class="mdi mdi-update mr-1"></i>Update/Renew Request</button>'
              );
            else if (full.status == 2 && full.request_type == 'delete')
              return (
                '<button  class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-vendor-name="' +
                full.name +
                '" deactivate-vendor="' +
                full.id +
                '" disabled><i class="mdi mdi-window-close mr-1"></i>Delete Request</button>'
              );
            else if (full.status == 3 && full.request_type == 'activate')
              return (
                '<button class="btn btn-outline-success btn-sm"  ' +
                'activate-vendor-name="' +
                full.name +
                '" activate-vendor="' +
                full.id +
                '" disabled><i class="mdi mdi-check"></i>Activate Request</button>'
              );
            else if (full.status == 3 && full.request_type == null)
              return (
                '<button class="btn btn-outline-success btn-sm"  ' +
                'activate-vendor-name="' +
                full.name +
                '" activate-vendor="' +
                full.id +
                '"><i class="mdi mdi-check"></i>Activate</button>'
              );
            else if (full.status == 1)
              return (
                '<button class="btn btn-outline-warning btn-sm"  ' +
                'activate-vendor-name="' +
                full.name +
                '" activate-vendor="' +
                full.id +
                '" disabled><i class="mdi mdi-loading"></i>pending</button>'
              );
            else if (full.status == 0)
              return (
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'activate-vendor-name="' +
                full.name +
                '" activate-vendor="' +
                full.id +
                '" disabled><i class="mdi mdi-window-close"></i>Already Rejected</button>'
              );
            else
              return ("");
            // <button type="button" class="btn btn-warning"><i class="mdi mdi-wrench"></i> </button>
          },
        }] : []),
        {
          title: 'Action',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            console.log('ddddddddd===========' + full.general_document + '     id   ' + full.id)
            if (that.role_name == 'Maker' && (full.status == 1 || full.status == 2 && full.request_type == null || full.status == 3 && full.request_type == null))
              return (
                '<i class="mdi mdi-18px mdi-pencil text-secondary" style="cursor: pointer;" edit-vendor="' +
                full.id +
                '"></i>' +
                '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.name +

                '" delete-vendor="' +
                full.id +
                '"></i>' +
                '<i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.name +
                '" vendor-remark="' +
                full.id +
                '"></i>'
              );
            else if (full.status == 0)
              return (
                '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.name +
                '" delete-vendor="' +
                full.id +
                '"></i><i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.name +
                '" vendor-remark="' +
                full.id +
                '"></i>'
              );
            else if (that.role_name == 'Maker' && (full.status == 2 && full.request_type != null || full.status == 3 && full.request_type != null))
              return (
                '<i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.name +
                '" vendor-remark="' +
                full.id +
                '"></i>'
              );
            else if (that.role_name == 'Checker' && full.status == 1)
              return (
                '<i class="btn btn-outline-success btn-sm" style="cursor: pointer; margin-left: 4px;" ' +
                'expiry-date="' +
                full.expiry_date +
                '" approve-licence="' +
                full.id +
                '"> Approve</i>' +
                '<i class="btn btn-outline-danger btn-sm" style="cursor: pointer; margin-left: 4px;" ' +
                'expiry-date="' +
                full.expiry_date +
                '" approve-licence="' +
                full.id +
                '"> Reject</i>'
              );
            else if (that.role_name == 'Checker' && full.status == 2 && full.request_type == null)
              return (
                'No request'
              );
            else if (that.role_name == 'Checker' && full.status == 2 && full.request_type != null) {
              return (
                '<button  class="btn btn-outline-primary btn-sm"  ' +
                'Approve-licence-request="' +
                full.expiry_date +
                '" approve-request="' +
                full.id +
                '"><i class="mdi mdi-update mr-1"></i>Update/Renew Request</button>'
              );
            }
            else
              return ("");
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
                that.licence_id = rows[i].id;
                that.status = rows[i].status;

                that.vendor_name = rows[i].vendor_name;

                that.contract_title = rows[i].contract_title;
                that.product_service_name = rows[i].product_service_name;
                that.licence_quantity = rows[i].licence_quantity;
                that.product_category = rows[i].product_category;
                that.licence_type = rows[i].licence_type;
                that.start_date = rows[i].start_date;
                that.expiry_date = rows[i].expiry_date;
                that.renewal_date = rows[i].renewal_date;
                that.total_cost = rows[i].total_cost;
                that.support_period = rows[i].support_period;
                that.additional_info = rows[i].additional_inf;
                that.file_path = rows[i].file_path;
                // that.payment_start_date = rows[i].payment_start_date;
                // that.total_value = rows[i].total_amount;

                // that.paymentFinished = false;
                $('#view_detail_licence_history').DataTable().ajax.reload()
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
        // {
        //   targets: '_all', // Apply to all columns
        //   className: 'dt-body-wrap', // Add a class to the body cells
        //   createdCell: function (td:any, cellData: any, rowData: any, row: any, col: any) {
        //     $(td).css('white-space', 'normal'); // Ensure text wraps
        //   },
        // },
        // {
        //   targets: [1], // Example: Apply specific widths to certain columns
        //   width: '200px', // Set a fixed width for these columns
        // },
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
      // pagingType: 'full_numbers',
      pageLength: 7,
      select: false,
      // ajax: '../../../../assets/data/data.json',
      ajax: (dataTablesParameters: any, callback: any) => {
        this.service.getLicenceHistory(this.licence_id).subscribe(
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
                      this.service.getLicenceHistory(this.licence_id).subscribe(
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
          title: 'ID',
          data: 'id',
        },
        {
          title: 'Vendor Name',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.vendor_name == full.vendor_name) {
              return (full.vendor_name);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.vendor_name + '</span>');
            }
          }
        },
        {
          title: this.third_column_title,
          render: function (data: any, type: any, full: any) {
            if (that.contract_title == full.contract_title) {
              return (full.contract_title);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.contract_title + '</span>');
            }
          },
        },
        {
          title: 'product or service name',
          render: function (data: any, type: any, full: any) {
            if (that.product_service_name == full.product_service_name) {
              return (full.product_service_name);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.product_service_name + '</span>');
            }
          },
          // data: 'name',
        },
        {
          title: 'quantity',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.licence_quantity == full.licence_quantity) {
              return (full.licence_quantity);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.licence_quantity + '</span>');
            }
          }
        },
        {
          title: 'product category',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.product_category == full.product_category) {
              return (full.product_category);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.product_category + '</span>');
            }
          }
        },
        {
          title: 'licence type',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.licence_type == full.licence_type) {
              return (full.licence_type);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.licence_type + '</span>');
            }
          }
        },
        {
          title: 'start date',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.start_date == full.start_date) {
              return (full.start_date);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.start_date + '</span>');
            }
          }
        },
        {
          title: 'expiry date',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.expiry_date == full.expiry_date) {
              return (full.expiry_date);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.expiry_date + '</span>');
            }
          }
        },
        {
          title: 'renewal date',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.renewal_date == full.renewal_date) {
              return (full.renewal_date);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.renewal_date + '</span>');
            }
          }
        },
        {
          title: 'total cost',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.total_cost == full.total_cost) {
              return (full.total_cost);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.total_cost + '</span>');
            }
          }// data: 'fax_number',
        },
        {
          title: 'support period',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.support_period == full.support_period) {
              return (full.support_period);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.support_period + '</span>');
            }
          }
        },
        {
          title: 'licence Document',
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.file_path != null) {
              if (that.file_path == full.file_path) {
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
          title: 'addtional info',
          render: function (data: any, type: any, full: any) {
            // data: 'post_number',
            if (that.additional_info == full.additional_info) {
              return (full.additional_info);
            } else {
              return ('<span class="badge bg-warning rounded-pill">' + full.additional_info + '</span>');
            }
          }
        },
      ],
      // dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
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
                that.licence_id = rows[i].id;
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
  clearAllSearches() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.rows('.selected').deselect();
      dtInstance.search('').draw(); // Clear global search

      dtInstance.columns().every(function () {
        this.search(''); // Clear column search
      });

      dtInstance.draw(); // Redraw the table
    });
  }



  onSubmitReason() {
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;
      if (this.reason == "Delete Vendor") {
        this.deleteVendor(this.licence_id, this.remark);
        this.reason_modal.hide();
        this.reasonForm.reset();

      }
      else if (this.reason == "Activate Vendor") {
        this.activateVendor(this.licence_id, this.remark);
        this.reason_modal.hide();
        this.reasonForm.reset();
      }
      if (this.reason == "Deactivate Vendor") {
        this.deactivateVendor(this.licence_id, this.remark);
        this.reason_modal.hide();
        this.reasonForm.reset();
      }
    } else this.submitted = true;
    return true;
  }
  deactivateVendor(id: any, remark: Remark) {
    this.service.deactivateVendor(id, remark).subscribe(
      (data) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' You are Successfully Sent Vendor Deactivated Request to Checker!',
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
                  this.service.deactivateVendor(id, remark).subscribe(
                    (data) => {
                      if (data == true) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' You are Successfully Sent Vendor Deactivated Request to Checker!',
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
  activateVendor(id: any, remark: Remark) {
    this.service.activateVendor(id, remark).subscribe(
      (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' You are Successfully Sent Vendor Activated Request to Checker!',
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
                  this.service.activateVendor(id, remark).subscribe(
                    (data) => {
                      if (data) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' You are Successfully Sent Vendor Activated Request to Checker!',
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
  deleteVendor(id: any, remark: Remark) {
    this.service
      .deleteVendor(id, remark)
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
                  text: ' You are Successfully Sent Vendor Delete Request!',
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
                      .deleteVendor(
                        id, remark
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
                                  text: ' You are Successfully Sent Vendor Delete Request!',
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
            title: 'Replay Remark',
            text: 'You are replay remark successfuly!',
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
                          title: 'Replay Remark',
                          text: 'You are replay remark successfuly!',
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
      console.log(' here is the search typeeeeeee0000000 ' + this.searchType)
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
          dtInstance.column(columnTitles.indexOf(this.seventeenth_column_title)).search('Inactive');
        } else if (this.searchType == 'Active') {
          dtInstance.column(columnTitles.indexOf(this.seventeenth_column_title)).search('^Active$', true, false);
        } else if (this.searchType == 'pending') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('pending');
        } else if (this.searchType == 'Activate') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('Activate Request');
        } else if (this.searchType == 'Deactivate') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('Deactivate Request');
        } else if (this.searchType == 'Update') {
          dtInstance.column(columnTitles.indexOf(this.eighteenth_column_title)).search('Update Request');
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
          }
          c++;
        }
      });
    });
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('edit-vendor')) {
        this.router.navigateByUrl(
          'maker/view-licences/edit/' + event.target.getAttribute('edit-vendor')
        );
      } else if (event.target.hasAttribute('approve-request')) {
        this.router.navigateByUrl(
          'maker/view-licences/edit/' + event.target.getAttribute('approve-request'));
      }
      else if (event.target.hasAttribute('approve-licence')) {
        var expiry_date = event.target.getAttribute('expiry-date');
        var licence_id = event.target.getAttribute('approve-licence');
        Swal.fire({
          title: 'Approve licence',
          text:
            'Are you sure? you are about to approve licence with expiry date ' +
            expiry_date +
            '. This means the licence will be valid for use in this system until ' + expiry_date,
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: 'green',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Approve',
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.ApproveLicence(licence_id).subscribe(
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
                  $('#licence_table').DataTable().ajax.reload()
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
                          this.service.ApproveLicence(licence_id).subscribe(
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
      }
      else if (event.target.hasAttribute('delete-vendor')) {
        var selected_vendor_name = event.target.getAttribute('user-name');
        Swal.fire({
          title: 'Delete Vendor: ' + selected_vendor_name,
          text:
            'Are you sure? you are about to delete ' +
            selected_vendor_name +
            ' from the system.',
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {
            // const sw = Swal.fire({
            //   title: 'Please wait !',
            //   allowOutsideClick: false,
            //   // timer: 4000,
            //   showConfirmButton: false,
            //   showCancelButton: false,
            //   showCloseButton: false,
            //   showDenyButton: false,
            //   didOpen: () => {
            //     Swal.showLoading(Swal.getDenyButton()!);
            //   },
            // });
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.reason_modal.show()
            this.licence_id = event.target.getAttribute('delete-vendor');
            this.reason = "Delete Vendor"

            console.log(
              'delete-vendor: ' + event.target.getAttribute('delete-vendor')
            );
          }
        });
      } else if (event.target.hasAttribute('activate-vendor')) {
        console.log('you are here for checking those individuals')
        var vendor_name = event.target.getAttribute('activate-vendor-name');
        var licence_id = event.target.getAttribute('activate-vendor');
        Swal.fire({
          title: 'Activate Vendor: ' + vendor_name,
          text:
            'Are you sure? you are about to activate ' +
            vendor_name +
            '.This means the user will be allowed to use the system.',
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Activate',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason_modal.show();
            this.licence_id = event.target.getAttribute('activate-vendor');
            this.reason = "Activate Vendor"
          }
        });
      } else if (event.target.hasAttribute('deactivate-vendor')) {
        var vendor_name = event.target.getAttribute('deactivate-vendor-name');
        var licence_id = event.target.getAttribute('deactivate-vendor');
        Swal.fire({
          title: 'Deactivate Vendor: ' + vendor_name,
          text:
            'Are you sure? you are about to deactivate ' +
            vendor_name,
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Deactivate',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason_modal.show();
            this.licence_id = event.target.getAttribute('deactivate-vendor');
            this.reason = "Deactivate Vendor"
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        });
      } else if (event.target.hasAttribute('send-pool-remark')) {
        var selected_request_id = event.target.getAttribute('send-pool-remark');
        this.request_id = selected_request_id;
        this.reject_request_modal.show();
      } else if (event.target.hasAttribute('vendor-remark')) {
        var selected_request_id = event.target.getAttribute('vendor-remark');
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
      }

      else if (event.target.hasAttribute('download-general-document')) {
        var licence_id = event.target.getAttribute('download-general-document')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-general-document')) {
        var licence_id = event.target.getAttribute('preview-general-document')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('download-trade-licence')) {
        var licence_id = event.target.getAttribute('download-trade-licence')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-trade-licence')) {
        var licence_id = event.target.getAttribute('preview-trade-licence')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-tin-certificate')) {
        var licence_id = event.target.getAttribute('download-tin-certificate')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-tin-certificate')) {
        var licence_id = event.target.getAttribute('preview-tin-certificate')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-other-document')) {
        var licence_id = event.target.getAttribute('download-other-document')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-other-document')) {
        var licence_id = event.target.getAttribute('preview-other-document')
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
        this.service.downloadVendorFiles(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('preview-general-document-update')) {
        var licence_id = event.target.getAttribute('preview-general-document-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('download-trade-licence-update')) {
        var licence_id = event.target.getAttribute('download-trade-licence-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-trade-licence-update')) {
        var licence_id = event.target.getAttribute('preview-trade-licence-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-tin-certificate-update')) {
        var licence_id = event.target.getAttribute('download-tin-certificate-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-tin-certificate-update')) {
        var licence_id = event.target.getAttribute('preview-tin-certificate-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-other-document-update')) {
        var licence_id = event.target.getAttribute('download-other-document-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-other-document-update')) {
        var licence_id = event.target.getAttribute('preview-other-document-update')
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
        this.service.downloadVendorFilesUpdated(licence_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('search-vendor-name')) {
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Id: ' + event.target.getAttribute('search-vendor-name'))
        this.service.setVendorSearch('vendor_name' + event.target.getAttribute('search-vendor-name'));
        this.router.navigateByUrl('maker/view-contracts');
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
  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }
  openPreviewInNewTab() {
    window.open(this.file_to_preview, '_blank');
  }

  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
      console.log(dtInstance)
    );
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
