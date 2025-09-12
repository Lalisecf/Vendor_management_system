import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { contract } from '../../Payloads/contract';
import { DatePipe } from '@angular/common';
import quill, { Quill } from 'quill';
declare var window: any
@Component({
  selector: 'app-view-contracts',
  templateUrl: './view-contracts.component.html',
  styleUrls: ['./view-contracts.component.css'],
  providers: [
    DatePipe
  ]

})
export class ViewContractsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('SuccessSwalSendRemark')
  public readonly SuccessSwalSendRemark!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor')
  public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor')
  public readonly SuccessSwalUpdateVendor!: SwalComponent;
  dtOptions: any;
  dtOptions_payment_deatil: any;
  dtOptions_deatil_history: any;

  // min!: number;
  // max!: number;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;


  paymentForm!: FormGroup;
  registerContractPayload!: contract;
  confirmationDocument: File[] = [];
  contractDocument: File[] = [];
  onChange: any = () => { };
  onTouched: any = () => { };
  paymentSize: any = 0;
  paymentFinished: boolean = false;
  contractRenewalForm!: FormGroup;
  start_date!: any
  end_date!: any
  total_amount!: any
  save_as!: any;
  status!: any;
  payment_id!: any;
  IdPayment!: any;
  contract!: contract;
  payment_start_date!: any;
  total_value!: any
  paidAmount: any;
  preview: boolean = false;
  file_to_preview!: any;

  request_id: any = 0;
  refresh_token_requested = false;
  reject_request_modal: any;
  add_payment_modal: any;
  view_remark_modal: any;
  edit_remark_modal: any;
  payment_detail_modal: any;
  detail_history_modal: any;
  contract_reneal_modal: any;
  reason_modal: any;
  registerForm!: FormGroup;
  reasonForm!: FormGroup;
  editForm!: FormGroup;
  submitted: boolean = false;
  getRemark: boolean = false;
  confirmation: boolean = false;
  contractdocument: boolean = false;
  remarkId: any;
  remark!: Remark;
  remarks!: Remark[];
  email!: CheckEmailExistPayload;
  dtOptions_view_remarks: any;
  replay_remark!: any;
  vendor_id: any;
  reason: any;
  progress_download = 0;
  downloadStatus_title = 'Downloading...';
  filenames: string[] = [];
  contract_id: number = 0;
  paymentFrequency!: any;

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
  input_19!: any;
  input_20!: any;
  input_21!: any;
  input_22!: any;
  input_23!: any;
  input_24!: any;

  //payment
  input_payment_0!: any;
  input_payment_1!: any;
  input_payment_2!: any;
  input_payment_3!: any;
  input_payment_4!: any;
  input_payment_5!: any;
  input_payment_6!: any;
  input_payment_7!: any;
  input_payment_8!: any;
  input_payment_9!: any;
  input_payment_10!: any;
  input_payment_11!: any;

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
  seveteenth_column_id = '16';
  eighteenth_column_id = '17';
  ninteenth_column_id = '18';
  _20th_column_id = '19';
  _21th_column_id = '20';
  _22th_column_id = '21';
  _23th_column_id = '22';
  _24th_column_id = '23';
  _25th_column_id = '24';
  // payment
  first_payment_column_id = '0';
  second_payment_column_id = '1';
  third_payment_column_id = '2';
  fourth_payment_column_id = '3';
  fifth_payment_column_id = '4';
  sixth_payment_column_id = '5';
  seventh_payment_column_id = '6';
  eighth_payment_column_id = '7';
  ninth_payment_column_id = '8';
  tenth_payment_column_id = '9';
  eleventh_payment_column_id = '10';
  twelveth_payment_column_id = ' 11';

  first_column_title = '-ID-';
  second_column_title = 'Vendor Name';
  third_column_title = 'Product';
  fourth_column_title = 'Service';
  fifth_column_title = 'Contract Type';
  sixth_column_title = ' Contract start Date';
  seventh_column_title = 'Contract end Date';
  eighth_column_title = 'Payment method';
  ninth_column_title = 'Payment frequency';
  tenth_column_title = 'Currency';
  eleventh_column_title = 'Amount per frequency';
  twelfth_column_title = 'Late penality fee';
  thirteenth_column_title = 'payment status';
  fourteenth_column_title = 'Payment start date';
  fiveteenth_column_title = 'Payment end date';
  sixteenth_column_title = 'Security document';
  seveteenth_column_title = 'Security document discription ';
  eighteenth_column_title = 'Total Paid amount';
  ninteenth_column_title = 'Pending payment status';
  _20th_column_title = 'Contract document';
  _21th_column_title = 'SLA document';
  _22th_column_title = 'Total contract amount';
  _23th_column_title = 'Status';
  _24th_column_title = 'Change status';
  _25th_column_title = 'Action';


  first_payment_column_title = 'Id';
  second_payment_column_title = 'Paid date';
  third_payment_column_title = 'Paid amount';
  fourth_payment_column_title = 'Confirmation document';
  fifth_payment_column_title = '<p class="text-warning">Next payment date</p>';
  sixth_payment_column_title = 'Amount per contigency';
  seventh_payment_column_title = 'Payment discription';
  eighth_payment_column_title = 'Payment contigency';
  ninth_payment_column_title = ' Payment frequency';
  tenth_payment_column_title = ' Unpaid amount';
  // eleventh_payment_column_title = ' Unpaid amount';
  twelveth_payment_column_title = ' Status';

  history_first_column_title = '-ID-';
  history_second_column_title = 'Extend/Renew/Hold/Unhold Date';
  history_third_column_title = 'Contract End Date';
  history_fourth_column_title = 'Total Amount Of Contract';
  history_fifth_column_title = 'Contract Document';
  history_sixth_column_title = ' Type';
  history_seventh_column_title = 'Status';




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
    public localStorageService: LocalStorageService,
    private authService: AuthService,
    private service: MakerService,
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private datePipe: DatePipe
  ) {
    this.payment_id = this.activatedRoute.snapshot.paramMap.get('id');
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

    this.paymentForm = this.formBuilder.group(
      {
        paid_date: new FormControl('', [
          // Validators.required,
        ]),
        paid_dated: new FormControl('', [
          // Validators.required,
        ]),

        confirmation_document: new FormControl(null, [
          // Validators.required
        ]),
        amount_per_contigency: new FormControl('', [
          // Validators.required
        ]),
        payment_contigency: new FormControl('', [
          // Validators.required
        ]),

        payment_description: new FormControl('', [
          // Validators.required
        ]),
        paid_amount: new FormControl('', [
          Validators.required
        ]),


      },
    );


    this.contractRenewalForm = this.formBuilder.group(
      {
        start_date: new FormControl('', [
          Validators.required,
        ]),
        end_date: new FormControl('', [
          Validators.required,
        ]),

        contract_document: new FormControl(null, [
          // Validators.required
        ]),

        total_amount: new FormControl('', [
          Validators.required
        ]),


      },
    );

  }

  // reload(){
  //     $('#contracts_table').DataTable().ajax.reload()

  // }

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
  openModal(dt: any) {
    if (this.status == 2)
      this.payment_detail_modal.show();
    else {
      Swal.fire({
        icon: 'error',
        title: 'Impossible !',
        text: 'The contract not ready for start payment.',
      });
    }
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
  ngOnInit(): void {

    const that = this;
    this.service.Search$.subscribe(value => {
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
        this.service.getAllContracts().subscribe(
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
                      this.service.getAllContracts().subscribe(
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
            return 'Cont' + full.id
          }
        },
        {
          title: 'Contract Title',
          data: 'contract_title',
          render: function (data: any, type: any, full: any) {
            return `<a href="/maker/contract-detail/${full.id}">${data}</a>`;
          }
        },
        {
          title: this.second_column_title,
          data: 'vendor_name',
        },
        {
          title: 'directorate',
          data: 'directorate',
        },
        // {
        //   title: this.third_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     var r = ''
        //     for (let i = 0; i < full.products.length; i++)
        //       if (full.products.length - 1 == i)
        //         r = r + full.products[i].name
        //       else
        //         r = r + full.products[i].name + ', '
        //     return r
        //   },
        // },
        // {
        //   title: this.fourth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     var r = ''
        //     for (let i = 0; i < full.services.length; i++)
        //       if (full.services.length - 1 == i)
        //         r = r + full.services[i].name
        //       else
        //         r = r + full.services[i].name + ', '
        //     return r
        //   },
        // },
        {
          title: this.fifth_column_title,
          data: 'contract_type',
        },
        {
          title: this.sixth_column_title,
          data: 'start_date',
        },
        {
          title: this.seventh_column_title,
          data: 'end_date',
        },
        {
          title: this.eighth_column_title,
          data: 'payment_method',
        },
        // {
        //   title: this.ninth_column_title,
        //   data: 'payment_frequency',
        // },
        {
          title: this.tenth_column_title,
          data: 'currency',
        },
        // {
        //   title: this.eleventh_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     const num = full.amount_per_frequency.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        //     const parts = num.split('.'); // Split the number into parts before and after decimal
        //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
        //     return parts.join('.'); // Join parts back together with the decimal separator
        //   }
        //   // data: 'amount_per_frequency',
        // },
        // {
        //   title: this.twelfth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     const num = full.late_penality_fee.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        //     const parts = num.split('.'); // Split the number into parts before and after decimal
        //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
        //     return parts.join('.'); // Join parts back together with the decimal separator
        //   }
        //   // data: 'late_penality_fee',
        // },
        {
          title: this.thirteenth_column_title,
          data: 'payment_status',
        },
        // {
        //   title: this.fourteenth_column_title,
        //   data: 'payment_start_date',
        // },
        // {
        //   title: this.fiveteenth_column_title,
        //   data: 'payment_end_date',
        // },
        {
          title: this.sixteenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.security_document != null) {
              that.save_as = "Security_Document";
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
        // {
        //   title: this.seveteenth_column_title,
        //   data: 'security_document_descreption',
        // },
        // {
        //   title: this.eighteenth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     const num = full.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        //     const parts = num.split('.'); // Split the number into parts before and after decimal
        //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
        //     return parts.join('.'); // Join parts back together with the decimal separator
        //   }
        // },
        // {
        //   title: this.ninteenth_column_title,
        //   data: 'pending_payment_status',
        // },
        {
          title: this._20th_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.contract_document_document != null) {
              that.save_as = "Contract_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file-contract="' +
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
        // {
        //   title: this._21th_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     document
        //       .getElementsByClassName('datatable-buttons')[0]
        //       ?.classList.remove('dt-button');
        //     if (full.sla_document != null)
        //       return (
        //         '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file-sla="' +
        //         full.id +
        //         '"></i>Download <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  preview-sla-document="' +
        //         full.id +
        //         '"></i>Preview'
        //       );
        //     else
        //       return '<span class=" ">No file uploaded</span>';
        //   },
        // },
        {
          title: this._22th_column_title,
          render: function (data: any, type: any, full: any) {
            const num = full.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
            const parts = num.split('.'); // Split the number into parts before and after decimal
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
            return parts.join('.'); // Join parts back together with the decimal separator
          }
        },
        {
          title: this._23th_column_title,
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
            else if (full.status == 3)
              return '<span class="badge bg-danger rounded-pill">Hold</span>';
            else if (full.status == 4)
              return '<span class="badge bg-danger rounded-pill">Terminated</span>'
            else if (full.status == 5)
              return '<span class="badge bg-success rounded-pill">Completed</span>'
            else
              return "";
          },
        },
        {
          title: this._24th_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 2 && full.request_type == null)
              return (
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-contract-name="' +
                full.vendor_name +
                '" deactivate-contract="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Hold</button>'
              );
            else if (full.status == 2 && full.request_type == 'Hold')
              return (
                '<button  class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-contract-name="' +
                full.vendor_name +
                '" deactivate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-window-close mr-1"></i>Hold Request</button>'
              );
            else if (full.status == 2 && full.request_type == 'Extend')
              return (
                '<button  class="btn btn-outline-primary btn-sm"  ' +
                'deactivate-contract-name="' +
                full.vendor_name +
                '" deactivate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-pencil mr-1"></i>Extend Request</button>'
              );
            else if (full.status == 2 && full.request_type == 'Renewal')
              return (
                '<button  class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-contract-name="' +
                full.vendor_name +
                '" deactivate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-pencil mr-1"></i>Renewal Request</button>'
              );

            else if (full.status == 2 && full.request_type == 'Terminate')
              return (
                '<button  class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-contract-name="' +
                full.vendor_name +
                '" deactivate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-window-close mr-1"></i>Terminate Request</button>'
              );
            else if (full.status == 3 && full.request_type == 'Unhold')
              return (
                '<button class="btn btn-outline-success btn-sm"  ' +
                'activate-contract-name="' +
                full.vendor_name +
                '" activate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-check"></i>Unhold Request</button>'
              );
            else if (full.status == 2 && full.request_type == 'Complete')
              return (
                '<button class="btn btn-outline-success btn-sm"  ' +
                'activate-contract-name="' +
                full.vendor_name +
                '" activate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-check"></i>  Completed Request</button>'
              );
            else if (full.status == 3 && full.request_type == null)
              return (
                '<button class="btn btn-outline-success btn-sm"  ' +
                'activate-contract-name="' +
                full.vendor_name +
                '" activate-contract="' +
                full.id +
                '"><i class="mdi mdi-check"></i>Unhold</button>'
              );
            else if (full.status == 1)
              return (
                '<button class="btn btn-outline-warning btn-sm"  ' +
                'activate-contract-name="' +
                full.vendor_name +
                '" activate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-loading"></i> pending</button>'
              );
            else if (full.status == 0)
              return (
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'activate-contract-name="' +
                full.vendor_name +
                '" activate-contract="' +
                full.id +
                '" disabled><i class="mdi mdi-window-close"></i>Already Rejected</button>'
              );
            else
              return ("");
            // <button type="button" class="btn btn-warning"><i class="mdi mdi-wrench"></i> </button>
          },
        },
        {
          title: this._25th_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 1)
              return (
                '<i class="mdi mdi-18px mdi-pencil text-secondary" style="cursor: pointer;" edit-contract="' +
                full.id +
                '"></i>' +
                '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.contract_title +

                '" delete-contract="' +
                full.id +
                '"></i>' +
                '<i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.contract_title +
                '" contract-remark="' +
                full.id +
                '"></i> <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  contract-detail="' +
                full.id +
                '"></i>Detail'
              );
            else if (full.status == 0)
              return (
                '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.name +
                '" delete-contract="' +
                full.id +
                '"></i><i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.contract_title +
                '" contract-remark="' +
                full.id +
                '"></i> <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;"  contract-detail="' +
                full.id +
                '"></i>Detail'
              );
            else if (full.status == 2 && full.request_type == null) {

              that.start_date = full.start_date;
              that.end_date = full.end_date;
              that.total_amount = full.total_amount;

              return (
                '<button  class="btn btn-outline-success btn-sm"  ' +
                'extend-vendor-name="' +
                full.vendor_name +
                '"extend-contract="' +
                full.id +
                '"extend-contract-end-date="' +
                full.end_date +
                '"extend-contract-total-amount="' +
                full.total_amount +
                '"><i class="mdi mdi-pencil"></i>Extend</button>' +
                '<button  class="btn btn-outline-secondary btn-sm"  ' +
                'renew-vendor-name="' +
                full.vendor_name +
                '"renew-contract="' +
                full.id +
                '"renew-contract-end-date="' +
                full.end_date +
                '"renew-contract-total-amount="' +
                full.total_amount +
                '"><i class="mdi mdi-pencil mr-1"></i>Renewal</button>' +
                '<button  class="btn btn-outline-danger btn-sm"  ' +
                'terminate-vendor-name="' +
                full.vendor_name +
                '"terminate-contract="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Terminate</button>' +
                '<button  class="btn btn-outline-warning btn-sm"  ' +
                'terminate-vendor-name-end="' +
                full.vendor_name +
                '"terminate-contract-end="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Terminate After Completed</button>' +
                '<i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.vendor_name +
                '" contract-remark="' +
                full.id +
                '"></i> <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" contract-detail="' +
                full.id +
                '"></i>Detail'


              );
            }
            else if (full.status == 2 && full.request_type != null || full.status == 3 && full.request_type != null)
              return (
                '<i class="mdi mdi-18px mdi-comment text-warning" style="cursor: pointer; margin-left: 4px;" ' +
                'user-name="' +
                full.vendor_name +
                '" contract-remark="' +
                full.id +
                '"></i> <i class="mdi mdi-eye text-primary ml-2" style="cursor: pointer;" contract-detail="' +
                full.id +
                '"></i>Detail'
              );
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
                that.contract_id = rows[i].id;
                that.status = rows[i].status;
                that.paymentFrequency = rows[i].payment_frequency;
                that.payment_start_date = rows[i].payment_start_date;
                that.total_value = rows[i].total_amount;

                // that.paymentFinished = false;
                $('#view_detail_history').DataTable().ajax.reload()
                that.openDetailHistoryModal(dt);
              }
            },
          },
          // {
          //   extend: 'selected',
          //   text: '<i class="mdi mdi-money-bill text-warning">Payment detail</i>',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     for (let i = 0; i < rows.length; i++) {
          //       that.contract_id = rows[i].id;
          //       that.status = rows[i].status;
          //       that.paymentFrequency = rows[i].payment_frequency;
          //       that.payment_start_date = rows[i].payment_start_date;
          //       that.total_value = rows[i].total_amount;

          //       that.paymentFinished = false;
          //       $('#view_detail').DataTable().ajax.reload()
          //       that.openModal(dt);
          //     }
          //   },
          // },
          // {
          //   extend: 'selected',
          //   text: '<i class="mdi mdi-money-bill text-warning">SLA</i>',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     for (let i = 0; i < rows.length; i++) {
          //       that.contract_id = rows[i].id;
          //       that.service.getContractById(that.contract_id).subscribe(
          //         async (data) => {
          //           if (data != null) {
          //             Swal.fire({
          //               title: ' Service Level Agrement Description:',
          //               html: '<div id="quill-container">' + data.sla_description + '</div>', // Use html property to render HTML content
          //               icon: 'warning',
          //               showCancelButton: true,
          //               showConfirmButton: false,
          //               confirmButtonColor: '#0acf97',
          //               cancelButtonColor: '#3085d6',
          //               preConfirm: () => {
          //                 // Retrieve Quill content and update this.remark.description
          //                 data.sla_description = quill.root.innerHTML;
          //               }
          //             })

          //             var quill = new Quill('#quill-container', {
          //               theme: 'snow' // Choose a theme for Quill editor
          //             });
          //             ///

          //           } else {
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Permission',
          //               text: 'You are not permitted to perform this action!',
          //             });
          //           }
          //         },
          //         (error) => {
          //           if (error.error.text === 'access-token-expired') {
          //             console.log('Access-token-expired requesting refresh token...');
          //             if (
          //               that.localStorageService.retrieve('refresh_token_requested') == null
          //             ) {
          //               that.utilService.refreshToken().subscribe(
          //                 (data) => {
          //                   if (data === true) {
          //                     console.log(
          //                       'refresh token success re-requesting the actual request'
          //                     );
          //                     that.localStorageService.clear('refresh_token_requested');
          //                     //================================================================================
          //                     that.service.getContractById(that.contract_id).subscribe(
          //                       async (data) => {
          //                         if (data != null) {
          //                           Swal.fire({
          //                             title: ' Service Level Agrement Description:',
          //                             html: '<div id="quill-container">' + data.sla_description + '</div>', // Use html property to render HTML content
          //                             icon: 'warning',
          //                             showCancelButton: true,
          //                             showConfirmButton: false,
          //                             confirmButtonColor: '#0acf97',
          //                             cancelButtonColor: '#3085d6',
          //                             preConfirm: () => {
          //                               // Retrieve Quill content and update this.remark.description
          //                               data.sla_description = quill.root.innerHTML;
          //                             }
          //                           })

          //                           var quill = new Quill('#quill-container', {
          //                             theme: 'snow' // Choose a theme for Quill editor
          //                           });

          //                         } else {
          //                           Swal.fire({
          //                             icon: 'error',
          //                             title: 'Permission',
          //                             text: 'You are not permitted to perform this action!',
          //                           });
          //                         }
          //                       },
          //                       (error) => {
          //                         if (error.error.text === 'access-token-expired') {
          //                           console.log('refresh token expired.');
          //                           that.SwalSessionExpired.fire();
          //                           that._refreshTokenExpired();
          //                         } else {
          //                           Swal.fire({
          //                             icon: 'error',
          //                             title: 'Oops...',
          //                             text: 'Something went wrong!',
          //                           });
          //                           console.log(
          //                             JSON.stringify(error.error.apierror, null, 2)
          //                           );
          //                         }
          //                       }
          //                     );
          //                     //================================================================================
          //                   } else {
          //                     console.log('refresh token expired.');
          //                     that.SwalSessionExpired.fire();
          //                     that._refreshTokenExpired();
          //                   }
          //                 },
          //                 (error: any) => {
          //                   console.log('error refreshing access token');
          //                   Swal.fire({
          //                     icon: 'error',
          //                     title: 'Oops...',
          //                     text: 'Something went wrong!',
          //                   });
          //                   console.log(JSON.stringify(error.error.apierror, null, 2));
          //                 }
          //               );
          //               that.localStorageService.store('refresh_token_requested', true);
          //             }
          //           }
          //           else {
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(JSON.stringify(error.error.apierror, null, 2));
          //           }
          //         }
          //       );

          //     }
          //   },
          // },
          // {
          //   extend: 'selected',
          //   text: '<i class="mdi mdi-money-bill text-warning">RTO</i>',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     for (let i = 0; i < rows.length; i++) {
          //       that.contract_id = rows[i].id;
          //       that.service.getContractById(that.contract_id).subscribe(
          //         async (data) => {
          //           if (data != null) {
          //             Swal.fire({
          //               title: 'Renewal and Termination Option:',
          //               html: '<div id="quill-container">' + data.renewal_termination_option + '</div>', // Use html property to render HTML content
          //               icon: 'warning',
          //               showCancelButton: true,
          //               showConfirmButton: false,
          //               confirmButtonColor: '#0acf97',
          //               cancelButtonColor: '#3085d6',
          //               preConfirm: () => {
          //                 // Retrieve Quill content and update this.remark.description
          //                 data.renewal_termination_option = quill.root.innerHTML;
          //               }
          //             })

          //             var quill = new Quill('#quill-container', {
          //               theme: 'snow' // Choose a theme for Quill editor
          //             });
          //             ///

          //           } else {
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Permission',
          //               text: 'You are not permitted to perform this action!',
          //             });
          //           }
          //         },
          //         (error) => {
          //           if (error.error.text === 'access-token-expired') {
          //             console.log('Access-token-expired requesting refresh token...');
          //             if (
          //               that.localStorageService.retrieve('refresh_token_requested') == null
          //             ) {
          //               that.utilService.refreshToken().subscribe(
          //                 (data) => {
          //                   if (data === true) {
          //                     console.log(
          //                       'refresh token success re-requesting the actual request'
          //                     );
          //                     that.localStorageService.clear('refresh_token_requested');
          //                     //================================================================================
          //                     that.service.getContractById(that.contract_id).subscribe(
          //                       async (data) => {
          //                         if (data != null) {
          //                           Swal.fire({
          //                             title: 'Renewal and Termination Option:',
          //                             html: '<div id="quill-container">' + data.renewal_termination_option + '</div>', // Use html property to render HTML content
          //                             icon: 'warning',
          //                             showCancelButton: true,
          //                             showConfirmButton: false,
          //                             confirmButtonColor: '#0acf97',
          //                             cancelButtonColor: '#3085d6',
          //                             preConfirm: () => {
          //                               // Retrieve Quill content and update this.remark.description
          //                               data.renewal_termination_option = quill.root.innerHTML;
          //                             }
          //                           })

          //                           var quill = new Quill('#quill-container', {
          //                             theme: 'snow' // Choose a theme for Quill editor
          //                           });
          //                           ///

          //                         } else {
          //                           Swal.fire({
          //                             icon: 'error',
          //                             title: 'Permission',
          //                             text: 'You are not permitted to perform this action!',
          //                           });
          //                         }
          //                       },
          //                       (error) => {
          //                         if (error.error.text === 'access-token-expired') {
          //                           console.log('refresh token expired.');
          //                           that.SwalSessionExpired.fire();
          //                           that._refreshTokenExpired();
          //                         } else {
          //                           Swal.fire({
          //                             icon: 'error',
          //                             title: 'Oops...',
          //                             text: 'Something went wrong!',
          //                           });
          //                           console.log(
          //                             JSON.stringify(error.error.apierror, null, 2)
          //                           );
          //                         }
          //                       }
          //                     );
          //                     //================================================================================
          //                   } else {
          //                     console.log('refresh token expired.');
          //                     that.SwalSessionExpired.fire();
          //                     that._refreshTokenExpired();
          //                   }
          //                 },
          //                 (error: any) => {
          //                   console.log('error refreshing access token');
          //                   Swal.fire({
          //                     icon: 'error',
          //                     title: 'Oops...',
          //                     text: 'Something went wrong!',
          //                   });
          //                   console.log(JSON.stringify(error.error.apierror, null, 2));
          //                 }
          //               );
          //               that.localStorageService.store('refresh_token_requested', true);
          //             }
          //           }
          //           else {
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(JSON.stringify(error.error.apierror, null, 2));
          //           }
          //         }
          //       );

          //     }
          //   },
          // },
          // {
          //   extend: 'selected',
          //   text: '<i class="mdi mdi-money-bill text-warning">PTC</i>',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     for (let i = 0; i < rows.length; i++) {
          //       that.contract_id = rows[i].id;
          //       that.service.getContractById(that.contract_id).subscribe(
          //         async (data) => {
          //           if (data != null) {
          //             Swal.fire({
          //               title: 'Payment Term Condition:'
          //               ,
          //               html: '<div id="quill-container">' + data.payment_term_condition + '</div>', // Use html property to render HTML content
          //               icon: 'warning',
          //               showCancelButton: true,
          //               showConfirmButton: false,
          //               confirmButtonColor: '#0acf97',
          //               cancelButtonColor: '#3085d6',
          //               preConfirm: () => {
          //                 // Retrieve Quill content and update this.remark.description
          //                 data.payment_term_condition = quill.root.innerHTML;
          //               }
          //             })

          //             var quill = new Quill('#quill-container', {
          //               theme: 'snow' // Choose a theme for Quill editor
          //             });
          //             ///

          //           } else {
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Permission',
          //               text: 'You are not permitted to perform this action!',
          //             });
          //           }
          //         },
          //         (error) => {
          //           if (error.error.text === 'access-token-expired') {
          //             console.log('Access-token-expired requesting refresh token...');
          //             if (
          //               that.localStorageService.retrieve('refresh_token_requested') == null
          //             ) {
          //               that.utilService.refreshToken().subscribe(
          //                 (data) => {
          //                   if (data === true) {
          //                     console.log(
          //                       'refresh token success re-requesting the actual request'
          //                     );
          //                     that.localStorageService.clear('refresh_token_requested');
          //                     //================================================================================
          //                     that.service.getContractById(that.contract_id).subscribe(
          //                       async (data) => {
          //                         if (data != null) {
          //                           Swal.fire({
          //                             title: 'Renewal and Termination Option:',
          //                             html: '<div id="quill-container">' + data.payment_term_condition + '</div>', // Use html property to render HTML content
          //                             icon: 'warning',
          //                             showCancelButton: true,
          //                             showConfirmButton: false,
          //                             confirmButtonColor: '#0acf97',
          //                             cancelButtonColor: '#3085d6',
          //                             preConfirm: () => {
          //                               // Retrieve Quill content and update this.remark.description
          //                               data.payment_term_condition = quill.root.innerHTML;
          //                             }
          //                           })

          //                           var quill = new Quill('#quill-container', {
          //                             theme: 'snow' // Choose a theme for Quill editor
          //                           });
          //                           ///

          //                         } else {
          //                           Swal.fire({
          //                             icon: 'error',
          //                             title: 'Permission',
          //                             text: 'You are not permitted to perform this action!',
          //                           });
          //                         }
          //                       },
          //                       (error) => {
          //                         if (error.error.text === 'access-token-expired') {
          //                           console.log('refresh token expired.');
          //                           that.SwalSessionExpired.fire();
          //                           that._refreshTokenExpired();
          //                         } else {
          //                           Swal.fire({
          //                             icon: 'error',
          //                             title: 'Oops...',
          //                             text: 'Something went wrong!',
          //                           });
          //                           console.log(
          //                             JSON.stringify(error.error.apierror, null, 2)
          //                           );
          //                         }
          //                       }
          //                     );
          //                     //================================================================================
          //                   } else {
          //                     console.log('refresh token expired.');
          //                     that.SwalSessionExpired.fire();
          //                     that._refreshTokenExpired();
          //                   }
          //                 },
          //                 (error: any) => {
          //                   console.log('error refreshing access token');
          //                   Swal.fire({
          //                     icon: 'error',
          //                     title: 'Oops...',
          //                     text: 'Something went wrong!',
          //                   });
          //                   console.log(JSON.stringify(error.error.apierror, null, 2));
          //                 }
          //               );
          //               that.localStorageService.store('refresh_token_requested', true);
          //             }
          //           }
          //           else {
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(JSON.stringify(error.error.apierror, null, 2));
          //           }
          //         }
          //       );

          //     }
          //   },
          // },
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
          //   exportOptions: {
          //     title: 'Report Title',
          //     message: 'Report Heading',
          //     customize: function (doc: any) {
          //       doc.content.splice(0, 0, {
          //         text: 'Custom Heading',
          //         style: 'header'
          //       });
          //     }
          //   }
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
            title: 'Contract Information',
            exportOptions: {
              customize: function (xlsx: any) {
                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row c[r^="A1"]', sheet).attr('s', '2');
              }
            }
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

    // this.dtOptions_deatil_history = {
    //   serverSide: false,
    //   scrollX: true,
    //   searching: true,
    //   // lengthMenu: 'ten',
    //   lengthChange: true,
    //   ordering: true,
    //   paging: true,
    //   // scrollY: 400,
    //   pagingType: 'full_numbers',
    //   pageLength: 7,
    //   select: true,
    //   // ajax: '../../../../assets/data/data.json',
    //   ajax: (dataTablesParameters: any, callback: any) => {
    //     this.service.getDetailHistory(that.contract_id).subscribe(
    //       async (resp: any) => {
    //         if (resp != null) {
    //           console.log(
    //             'response for table: ' + JSON.stringify(resp, null, 2)
    //           );
    //           // data: resp
    //           callback({
    //             recordsTotal: resp.recordsTotal,
    //             recordsFiltered: resp.recordsFiltered,
    //             data: resp,
    //           });
    //           console.log(
    //             'records total: ' + JSON.stringify(resp.recordsTotal)
    //           );
    //         } else {
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Permission',
    //             text: 'You are not permitted to perform this action!',
    //           });
    //         }
    //       },
    //       (error: any) => {
    //         if (error.error.text === 'access-token-expired') {
    //           console.log('Access-token-expired requesting refresh token...');
    //           if (
    //             this.localStorageService.retrieve('refresh_token_requested') ==
    //             null
    //           ) {
    //             this.utilService.refreshToken().subscribe(
    //               (data) => {
    //                 if (data === true) {
    //                   console.log(
    //                     'refresh token success re-requesting the actual request'
    //                   );
    //                   this.localStorageService.clear('refresh_token_requested');
    //                   //================================================================================
    //                   this.service.getDetailHistory(that.contract_id).subscribe(
    //                     async (resp: any) => {
    //                       if (resp != null) {
    //                         console.log(
    //                           'response for table: ' +
    //                           JSON.stringify(resp, null, 2)
    //                         );
    //                         // data: resp
    //                         callback({
    //                           recordsTotal: resp.recordsTotal,
    //                           recordsFiltered: resp.recordsFiltered,
    //                           data: resp,
    //                         });
    //                         console.log(
    //                           'records total: ' +
    //                           JSON.stringify(resp.recordsTotal)
    //                         );
    //                       } else {
    //                         Swal.fire({
    //                           icon: 'error',
    //                           title: 'Permission',
    //                           text: 'You are not permitted to perform this action!',
    //                         });
    //                       }
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
    //                   //================================================================================
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
    //   },
    //   columns: [
    //     {
    //       title: this.history_first_column_title,
    //       data: 'id',
    //     },


    //     {
    //       title: this.history_second_column_title,
    //       render: function (data: any, type: any, full: any) {
    //         if (full.start_date == null) {

    //           return ('<i class="text-primary">No (First Old Record)</i>')
    //         }
    //         else {

    //           return (full.start_date)
    //         }
    //       }

    //     },
    //     {
    //       title: this.history_third_column_title,
    //       data: 'end_date',
    //     },


    //     {
    //       title: this.history_fifth_column_title,
    //       render: function (data: any, type: any, full: any) {
    //         document
    //           .getElementsByClassName('datatable-buttons')[0]
    //           ?.classList.remove('dt-button');
    //         if (full.contract_document_document != null) {
    //           that.save_as = "Contract_Document";
    //           return (
    //             '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file-contract-history="' +
    //             full.id +
    //             '"></i>Download contract document'
    //           );
    //         }
    //         else
    //           return '<span class=" ">No file uploaded</span>';
    //       },
    //     },

    //     {
    //       title: this.history_fourth_column_title,
    //       render: function (data: any, type: any, full: any) {
    //         const num = full.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
    //         const parts = num.split('.'); // Split the number into parts before and after decimal
    //         parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
    //         return parts.join('.'); // Join parts back together with the decimal separator
    //       }
    //     },
    //     {
    //       title: this.history_seventh_column_title,
    //       render: function (data: any, type: any, full: any) {
    //         document
    //           .getElementsByClassName('datatable-buttons')[0]
    //           ?.classList.remove('dt-button');
    //         if (full.status == 1)
    //           return '<span class="badge bg-warning rounded-pill">Pending</span>';
    //         else if (full.status == 2)
    //           return '<span class="badge bg-success rounded-pill">Active</span>';
    //         else if (full.status == 0)
    //           return '<span class="badge bg-danger rounded-pill">Rejected</span>';
    //         else if (full.status == 3)
    //           return '<span class="badge bg-danger rounded-pill">Hold</span>';
    //         else if (full.status == 4)
    //           return '<span class="badge bg-danger rounded-pill">Terminated</span>'
    //         else if (full.status == 5)
    //           return '<span class="badge bg-success rounded-pill">Completed</span>'
    //         else
    //           return "";
    //       },
    //     },
    //     {
    //       title: this.history_sixth_column_title,
    //       // data: 'request_type',
    //       render: function (data: any, type: any, full: any) {
    //         if (full.request_type == null) {

    //           return ('<i class="text-primary">Normal</i>')
    //         }
    //         else {

    //           return (full.request_type)
    //         }
    //       }
    //     },
    //   ],
    //   dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
    //   // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
    //   colReorder: {
    //     order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    //     fixedColumnsLeft: 1,
    //     action: function (e: any, dt: any, node: any, config: any) { },
    //   },
    //   buttons: {
    //     buttons: [
    //       'colvis',
    //       ,
    //       {
    //         extend: 'fixedColumns',
    //         text: 'FixedColumns',
    //         config: {
    //           left: 1,
    //         },
    //       },
    //       {
    //         text: 'Reload',
    //         action: function (e: any, dt: any, node: any, config: any) {
    //           dt.ajax.reload();
    //           // alert('reload success');
    //         },
    //       },
    //       // {
    //       //   extend: 'selected',
    //       //   text: '<i class="mdi mdi-money-bill text-warning">Detail History</i>',
    //       //   action: function (e: any, dt: any, node: any, config: any) {
    //       //     var rows = dt.rows({ selected: true }).data().toArray();
    //       //     for (let i = 0; i < rows.length; i++) {
    //       //       that.contract_id = rows[i].id;
    //       //       that.status = rows[i].status;
    //       //       that.paymentFrequency = rows[i].payment_frequency;
    //       //       that.payment_start_date = rows[i].payment_start_date;
    //       //       that.total_value = rows[i].total_amount;

    //       //       that.paymentFinished = false;
    //       //       $('#view_detail_history').DataTable().ajax.reload()
    //       //       that.openDetailHistoryModal(dt);
    //       //     }
    //       //   },
    //       // },
    //       // {
    //       //   extend: 'selected',
    //       //   text: '<i class="mdi mdi-money-bill text-warning">Payment detail</i>',
    //       //   action: function (e: any, dt: any, node: any, config: any) {
    //       //     var rows = dt.rows({ selected: true }).data().toArray();
    //       //     for (let i = 0; i < rows.length; i++) {
    //       //       that.contract_id = rows[i].id;
    //       //       that.status = rows[i].status;
    //       //       that.paymentFrequency = rows[i].payment_frequency;
    //       //       that.payment_start_date = rows[i].payment_start_date;
    //       //       that.total_value = rows[i].total_amount;

    //       //       that.paymentFinished = false;
    //       //       $('#view_detail').DataTable().ajax.reload()
    //       //       that.openModal(dt);
    //       //     }
    //       //   },
    //       // },

    //       {
    //         extend: 'copy',
    //         text: '<u>C</u>opy',
    //         key: {
    //           key: 'c',
    //           altKey: true,
    //         },
    //       },
    //       'print',
    //       {
    //         extend: 'pdf',
    //         text: 'Pdf',
    //         exportOptions: {
    //           title: 'Report Title',
    //           message: 'Report Heading',
    //           customize: function (doc: any) {
    //             doc.content.splice(0, 0, {
    //               text: 'Custom Heading',
    //               style: 'header'
    //             });
    //           }
    //         }
    //       },
    //       {
    //         extend: 'pdf',
    //         text: 'Pdf current page',
    //         exportOptions: {
    //           modifier: {
    //             page: 'current',
    //           },
    //         },
    //       },
    //       {
    //         extend: 'excel',
    //         text: 'Excel',
    //         title: 'Contract Information',
    //         exportOptions: {
    //           customize: function (xlsx: any) {
    //             var sheet = xlsx.xl.worksheets['sheet1.xml'];
    //             $('row c[r^="A1"]', sheet).attr('s', '2');
    //           }
    //         }
    //       },

    //       {
    //         extend: 'collection',
    //         text: 'Header',
    //         autoClose: true,
    //         background: true,
    //         dropup: false,
    //         collectionTitle: '',
    //         buttons: [
    //           {
    //             text: 'Enable fixed header',
    //             key: '1',
    //             action: function (e: any, dt: any, node: any, config: any) {
    //               dt.fixedHeader.enable();
    //             },
    //           },
    //           {
    //             text: 'Disable fixed header',
    //             key: '1',
    //             action: function (e: any, dt: any, node: any, config: any) {
    //               dt.fixedHeader.disable();
    //             },
    //           },
    //         ],
    //         fade: true,
    //       },
    //     ],
    //   },

    //   stateSave: true,
    //   stateDuration: 0,
    //   fixedFooter: true,
    //   fixedHeader: {
    //     header: true,
    //   },
    //   scrollCollapse: true,
    //   // searchPanes: {
    //   //   initCollapsed: true,
    //   //   cascadePanes: true,
    //   //   clear: true,
    //   // },
    //   columnDefs: [
    //     {
    //       targets: '_all',
    //       defaultContent: '-',
    //       // className: 'select-checkbox',
    //     },
    //     //   {
    //     //     searchPanes: {
    //     //       show: true,
    //     //     },
    //     //     targets: [0, 1, 4, 5, 8],
    //     //   },
    //     //   {
    //     //     searchPanes: {
    //     //       show: false,
    //     //     },
    //     //     targets: [2, 3, 6, 7, 9, 10, 11],
    //     //   },
    //   ],
    //   // language: {
    //   //   searchPanes: {
    //   //     count: '{total} found',
    //   //     countFiltered: '{shown} / {total}',
    //   //   },
    //   // },
    // };
    this.dtOptions_payment_deatil = {
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
        this.service.getPaymentDetailByContractId(that.contract_id).subscribe(
          async (resp: any) => {
            if (resp != null) {
              // if (resp.payment_start_date == "Finished")
              //   this.paymentFinished = true;
              console.log("--------------------------------------------------------=" + this.paymentFinished)
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
                      this.service.getPaymentDetailByContractId(that.contract_id).subscribe(
                        async (resp: any) => {
                          if (resp != null) {
                            // if (resp.payment_start_date == "Finished")
                            //   this.paymentFinished = true;
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
          title: this.first_payment_column_title,
          render: function (data: any, type: any, full: any) {
            return 'Payment' + full.id
          }
        },
        {
          title: this.second_payment_column_title,
          data: 'date',
        },
        {
          title: this.third_payment_column_title,
          render: function (data: any, type: any, full: any) {
            const num = full.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
            const parts = num.split('.'); // Split the number into parts before and after decimal
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
            return parts.join('.'); // Join parts back together with the decimal separator
          }
        },
        {
          title: this.fourth_payment_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.confirmation_document != null) {
              that.save_as = "Payment_confirmation_Document";
              return (
                '<i class="mdi mdi-18px mdi-download text-secondary" style="cursor: pointer;" download-file-confirmation="' +
                full.id +
                '"></i>Download payment confirmation'
              );
            }
            else
              return '<span class=" ">No file uploaded</span>';
          },

        },
        {
          title: this.fifth_payment_column_title,
          render: function (data: any, type: any, full: any) {

            if (full.payment_start_date == "Finished") {
              that.paymentFinished = true;
              return ('Already finished payment');
            }
            else if (full.payment_frequency == "phased") {
              return ('It is phased');
            }
            else
              return full.payment_start_date
          },
        },
        {
          title: this.sixth_payment_column_title,
          render: function (data: any, type: any, full: any) {
            const num = full.amount_per_contigency.toString().replace(/,/g, ''); // Convert to string and remove existing commas
            const parts = num.split('.'); // Split the number into parts before and after decimal
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
            return parts.join('.'); // Join parts back together with the decimal separator
          }
        },
        {
          title: this.seventh_payment_column_title,
          data: 'payment_description',
        },
        {
          title: this.eighth_payment_column_title,
          data: 'payment_contigency',
        },

        {
          title: this.ninth_payment_column_title,
          data: 'payment_frequency',
        },

        {
          title: this.tenth_payment_column_title,
          render: function (data: any, type: any, full: any) {
            const num = full.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
            const parts = num.split('.'); // Split the number into parts before and after decimal
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
            return parts.join('.'); // Join parts back together with the decimal separator
          }
        },


        // {
        //   title: this.eleventh_payment_column_title,
        //   data: 'total_amount',
        // },
        {
          title: this.twelveth_payment_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 2)
              return (

                '<i class="mdi mdi-check text-success">Paid</i>'
              );

            else if (full.status == 1 && full.request_type == null)
              return (
                '<button class="btn btn-outline-warning btn-sm"  ' +
                'pending-payment-name="' +
                full.name +
                '" pending-payment="' +
                full.id +
                '"><i class="mdi mdi-loading"></i>Pending</button>' +
                '<button class="btn btn-outline-secondary btn-sm"  ' +
                'edit-payment-name="' +
                full.name +
                '" edit-payment="' +
                full.id +
                '"><i class="mdi mdi-pencil"></i>Update</button>' +
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'delete-payment-name="' +
                full.name +
                '" delete-payment="' +
                full.id +
                '"><i class="mdi mdi-window-close"></i>Delete</button>'
              );
            else if (full.status == 1 && full.request_type !== null)
              return (

                '<i class="mdi mdi-loading text-warning">pending</i> '
              );

            else
              return ("");
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
        this.service.getContractRemark(this.request_id).subscribe(
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
                        .getContractRemark(this.request_id).subscribe(
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
    this.add_payment_modal = new window.bootstrap.Modal(
      document.getElementById('add-payment'),
    )
    this.contract_reneal_modal = new window.bootstrap.Modal(
      document.getElementById('renewal_contract'),
    )

    this.add_payment_modal = new window.bootstrap.Modal(
      document.getElementById('add-payment'),
    )
    this.reject_request_modal = new window.bootstrap.Modal(
      document.getElementById('reject-modal'),
    )
    this.view_remark_modal = new window.bootstrap.Modal(
      document.getElementById('view_remark_modal'),)
    this.edit_remark_modal = new window.bootstrap.Modal(
      document.getElementById('edit_modal'),)
    this.reason_modal = new window.bootstrap.Modal(
      document.getElementById('reason_modal'),)
    this.payment_detail_modal = new window.bootstrap.Modal(
      document.getElementById('payment_detail_modal'),)

    this.detail_history_modal = new window.bootstrap.Modal(
      document.getElementById('detail_history_modal'),)
  }
  onSubmitReason() {
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;
      if (this.reason == "Terminate Contract") {
        this.terminateContract(this.contract_id, this.remark);
        this.reasonForm.reset();
        this.reason_modal.hide();
      }
      else if (this.reason == "Hold Contract") {
        this.deactivateContract(this.contract_id, this.remark);
        this.reasonForm.reset();
        this.reason_modal.hide();
      }
      if (this.reason == "Unhold Contract") {
        this.activateContract(this.contract_id, this.remark);
        this.reasonForm.reset();
        this.reason_modal.hide();
      } if (this.reason == "Terminate Contract After successfully completed") {
        this.completeContract(this.contract_id, this.remark);
        this.reasonForm.reset();
        this.reason_modal.hide();
      }
    } else this.submitted = true;
    return true;
  }
  deactivateContract(id: any, remark: Remark) {
    this.service.deactivateContract(id, remark).subscribe(
      (data) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' You are Successfully Sent Contract Hold Request to Checker!',
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
                  this.service.deactivateContract(id, remark).subscribe(
                    (data) => {
                      if (data == true) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' You are Successfully Sent Contract Hold Request to Checker!',
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
  activateContract(id: any, remark: Remark) {
    this.service.activateContract(id, remark).subscribe(
      (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' You are Successfully Sent Contract Unhold Request to Checker!',
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
                  this.service.activateContract(id, remark).subscribe(
                    (data) => {
                      if (data) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' You are Successfully Sent Contract Unhold Request to Checker!',
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

  completeContract(id: any, remark: Remark) {
    this.service.completeContract(id, remark).subscribe(
      (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: ' You are Successfully Sent Contract Completed Request to Checker!',
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
                  this.service.completeContract(id, remark).subscribe(
                    (data) => {
                      if (data) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: ' You are Successfully Sent Contract Completed Request to Checker!',
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
  terminateContract(id: any, remark: Remark) {
    this.service
      .terminateContract(id, remark)
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
                  text: ' You are Successfully Sent Contract Terminate Request!',
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
                      .terminateContract(
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
                                  text: ' You are Successfully Sent Contract Terminate Request!',
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

  onConfirmationFileSelect(event: any) {
    this.confirmation = true;
    this.confirmationDocument = event.addedFiles;
    this.onChange(this.confirmationDocument);
    this.onTouched();
    console.log('here is the file ' + this.confirmationDocument.at(0)!.name)

  }
  onRemoveConfirmationDocument(event: any) {
    this.confirmation = false;
    console.log(event);
    this.confirmationDocument.splice(this.confirmationDocument.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }

  ContractSubmit() {
    const formData = new FormData();


    if (
      this.contractRenewalForm.valid
    ) {

      if (this.contract_id != null) {
        formData.append('id', this.contract_id.toString());
        formData.append('contract_type', this.reason);

      }

      formData.append('start_date', this.convertDate(this.contractRenewalForm.get('start_date')?.value));
      formData.append('end_date', this.convertDate(this.contractRenewalForm.get('end_date')?.value));

      if (this.contractRenewalForm.get('total_amount')?.value)
        formData.append('total_amount', parseFloat(this.contractRenewalForm.get('total_amount')?.value.replace(/,/g, '')).toString());
      if (this.contractDocument.at(0)! != null)
        formData.append('contract_document_document', this.contractDocument.at(0)!);



      if (this.contract_id != null)
        this.registerPayment(formData);
      $('#contracts_table').DataTable().ajax.reload()
      this.contractRenewalForm.reset();
      this.payment_detail_modal.hide();
      this.contract_reneal_modal.hide();
      console.log('Data from frontend prepared for backend:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

    } else this.submitted = true;

  }

  onContractDocumentFileSelect(event: any) {
    this.contractdocument = true;
    this.contractDocument = event.addedFiles;
    this.onChange(this.contractDocument);
    this.onTouched();
    console.log('here is the file ' + this.contractDocument.at(0)!.name)

  }
  onRemoveContractDocument(event: any) {
    this.contractdocument = false;
    console.log(event);
    this.contractDocument.splice(this.contractDocument.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }

  UpdateRequest() {

    const formData = new FormData();


    if (
      this.paymentForm.valid
    ) {

      if (this.IdPayment !== null) {
        formData.append('id', this.IdPayment.toString());
      }

      formData.append('date', this.convertDate(this.paymentForm.get('paid_date')?.value));


      if (this.paymentForm.get('payment_description')?.value)
        formData.append('payment_deccription', this.paymentForm.get('payment_description')?.value);

      formData.append('payment_contigency', this.paymentForm.get('payment_contigency')?.value);

      if (this.paymentForm.get('amount_per_contigency')?.value)
        formData.append('amount_per_contigency', parseFloat(this.paymentForm.get('amount_per_contigency')?.value.replace(/,/g, '')).toString());

      if (this.confirmationDocument.at(0)! != null)
        formData.append('payment_confirmation_document', this.confirmationDocument.at(0)!);

      if (this.paymentForm.get('paid_amount')?.value)
        formData.append('paid_amount', parseFloat(this.paymentForm.get('paid_amount')?.value.replace(/,/g, '')).toString());

      formData.append('contract_id', this.contract_id.toString());
      formData.append('payment_status', "update");

      if (this.IdPayment != null)
        this.PaymentRequests(formData);
      this.add_payment_modal.hide();
      // this.payment_detail_modal.hide()
      console.log('Data from frontend prepared for backend:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

    } else this.submitted = true;

  }

  pendingRequest() {

    const formData = new FormData();


    if (
      this.paymentForm.valid
    ) {

      if (this.IdPayment !== null) {
        formData.append('id', this.IdPayment.toString());
      }

      formData.append('date', this.convertDate(this.paymentForm.get('paid_date')?.value));
      formData.append('payment_start_date', this.convertDate(this.paymentForm.get('paid_dated')?.value));

      if (this.paymentForm.get('payment_description')?.value)
        formData.append('payment_deccription', this.paymentForm.get('payment_description')?.value);

      formData.append('payment_contigency', this.paymentForm.get('payment_contigency')?.value);

      if (this.paymentForm.get('amount_per_contigency')?.value)
        formData.append('amount_per_contigency', parseFloat(this.paymentForm.get('amount_per_contigency')?.value.replace(/,/g, '')).toString());

      if (this.confirmationDocument.at(0)! != null)
        formData.append('payment_confirmation_document', this.confirmationDocument.at(0)!);

      if (this.paymentForm.get('paid_amount')?.value)
        formData.append('paid_amount', parseFloat(this.paymentForm.get('paid_amount')?.value.replace(/,/g, '')).toString());
      formData.append('contract_id', this.contract_id.toString());
      formData.append('payment_status', "pending");

      if (this.IdPayment != null)
        this.PaymentRequests(formData);
      console.log('Data from frontend prepared for backend:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

    } else this.submitted = true;

  }
  paymentSubmit() {

    const formData = new FormData();

    this.paidAmount = parseFloat(this.paymentForm.get('paid_amount')?.value.replace(/,/g, ''));
    if (
      this.paymentForm.valid && this.paidAmount <= this.total_value
    ) {

      if (this.contract_id == null) {
        formData.append('id', this.contract_id);
      }

      formData.append('date', this.convertDate(this.paymentForm.get('paid_date')?.value));


      if (this.paymentForm.get('payment_description')?.value)
        formData.append('payment_deccription', this.paymentForm.get('payment_description')?.value);

      formData.append('payment_contigency', this.paymentForm.get('payment_contigency')?.value);

      if (this.paymentForm.get('amount_per_contigency')?.value)
        formData.append('amount_per_contigency', this.paymentForm.get('amount_per_contigency')?.value);

      if (this.confirmationDocument.at(0)! != null)
        formData.append('payment_confirmation_document', this.confirmationDocument.at(0)!);

      if (this.paymentForm.get('paid_amount')?.value)
        formData.append('paid_amount', parseFloat(this.paymentForm.get('paid_amount')?.value.replace(/,/g, '')).toString());

      formData.append('contract_id', this.contract_id.toString());
      formData.append('payment_status', "add-payment");

      if (this.contract_id != null)
        this.registerPayment(formData);
      console.log('Data from frontend prepared for backend:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

    } else this.submitted = true;

  }
  PaymentRequests(formData: any) {

    this.service.PaymentRequest(formData).subscribe(
      async (data) => {
        if (data == true) {
          this.add_payment_modal.hide();
          this.paymentForm.reset();
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload((data) => {
                // alert(data);
                Swal.hideLoading();
                Swal.close();
                $('#view_detail').DataTable().ajax.reload()
                if (this.reason == "pending") {
                  this.SuccessSwalRegisterVendor.fire();
                } else {
                  Swal.fire({
                    icon: 'success',
                    title: 'success',
                    text: 'Successfully Updated!',
                  });
                }
              }, false);
            }
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
        console.log('the error: ' + JSON.stringify(error, null, 3));
        if (error.error.text === 'user-is-logged-in') {
          Swal.fire({
            icon: 'warning',
            title: 'You cannot update the Email of the user.',
            text: 'You cannot update user email while the user is logged in. Please try again when the user is logged out of all devices.',
          });
        } else if (error.error.text === 'access-token-expired') {
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
                  this.service.PaymentRequest(formData).subscribe(
                    async (data) => {
                      if (data == true) {
                        this.add_payment_modal.hide();
                        this.paymentForm.reset();
                        this.datatableElement.dtInstance.then(
                          (dtInstance: DataTables.Api) => {
                            dtInstance.ajax.reload((data) => {
                              // alert(data);
                              Swal.hideLoading();
                              Swal.close();
                              $('#view_detail').DataTable().ajax.reload()
                              if (this.reason == "pending") {
                                this.SuccessSwalRegisterVendor.fire();
                              } else {
                                Swal.fire({
                                  icon: 'success',
                                  title: 'success',
                                  text: 'Successfully Updated!',
                                });
                              }
                            }, false);
                          }
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
                          'it is from here...' +
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

  registerPayment(formData: any) {

    this.service.registerContract(formData).subscribe(
      async (data) => {
        if (data == true) {
          $('#view_detail').DataTable().ajax.reload()
          this.SuccessSwalRegisterVendor.fire();

          if (this.contract_id != null) {
            $('#view_detail').DataTable().ajax.reload()
            this.SuccessSwalUpdateVendor.fire();
            this.add_payment_modal.hide();
            this.paymentForm.reset();
            if (this.reason !== 'Renewal' && this.reason !== 'Extend')
              this.payment_detail_modal.show();

            // console.log('update success: ' + data);
          } else {
            this.SuccessSwalRegisterVendor.fire();
            this.add_payment_modal.hide();
            this.paymentForm.reset();
            if (this.reason !== 'Renewal' && this.reason !== 'Extend')
              this.payment_detail_modal.show();
            this.submitted = false;
            console.log('register success: ' + data);
          }
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
                  this.service.registerContract(formData).subscribe(
                    async (data) => {
                      if (data == true) {
                        $('#view_detail').DataTable().ajax.reload()
                        this.SuccessSwalUpdateVendor.fire();
                        if (this.contract_id != null) {
                          this.add_payment_modal.hide();
                          this.paymentForm.reset();
                          if (this.reason !== 'Renewal' && this.reason !== 'Extend')
                            this.payment_detail_modal.show();
                          // console.log('update success: ' + data);
                        } else {
                          this.SuccessSwalRegisterVendor.fire();
                          this.add_payment_modal.hide();
                          this.paymentForm.reset();
                          if (this.reason !== 'Renewal' && this.reason !== 'Extend')
                            this.payment_detail_modal.show();
                          // this.registerForm.get('gender')!.value = 'Male'
                          this.submitted = false;
                          console.log('register success: ' + data);
                        }
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
                          'it is from here...' +
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


  addPayment() {

    this.service.getPayment(this.contract_id).subscribe(
      async (data) => {
        if (data.id != null) {
          this.contract = data;
          if (this.paymentFrequency != "phased")
            this.paymentForm.get("paid_date")?.patchValue(this.formatDate(data.payment_start_date));
          this.total_value = data.total_amount;
        } else {
          this.paymentForm.get("paid_date")?.patchValue(this.formatDate(this.payment_start_date));

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
                  this.service.getPayment(this.contract_id).subscribe(
                    async (data) => {
                      if (data != null) {
                        this.contract = data;
                        if (this.paymentFrequency != "phased")
                          this.paymentForm.get("paid_date")?.patchValue(this.formatDate(data.payment_start_date));
                        this.total_value = data.total_amount;

                      } else {
                        this.paymentForm.get("paid_date")?.patchValue(this.formatDate(this.payment_start_date));

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

    this.add_payment_modal.show();

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
    this.service.contractRemark(request_id, remark).subscribe(
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
                  this.service.contractRemark(request_id, remark).subscribe(
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
        dtInstance.search('').columns().search('');

        if (this.searchType.startsWith('vendor_name')) {
          var searchValue = this.searchType.replace('vendor_name', '').trim();
          dtInstance.column(columnTitles.indexOf(this.second_column_title)).search(searchValue)
        }
        else if (this.searchType.startsWith('Total')) {
        }
        else if (this.searchType.startsWith('Active')) {
          dtInstance.column(columnTitles.indexOf(this._23th_column_title)).search('^Active$', true, false)
        }
        else if (this.searchType.startsWith('Hold')) {
          dtInstance.column(columnTitles.indexOf(this._23th_column_title)).search('^Hold$', true, false)
        }
        else if (this.searchType.startsWith('pending')) {
          dtInstance.column(columnTitles.indexOf(this._23th_column_title)).search('pending')
        }
        else if (this.searchType.startsWith('Hold Request')) {
          dtInstance.column(columnTitles.indexOf(this._24th_column_title)).search('^Hold Request$', true, false)
        }
        else if (this.searchType.startsWith('Unhold Request')) {
          dtInstance.column(columnTitles.indexOf(this._24th_column_title)).search('^Unhold Request$', true, false)
        }
        else if (this.searchType.startsWith('Extend')) {
          dtInstance.column(columnTitles.indexOf(this._24th_column_title)).search('^Extend Request$', true, false)
        }
        else if (this.searchType.startsWith('Renewal')) {
          dtInstance.column(columnTitles.indexOf(this._24th_column_title)).search('^Renewal Request$', true, false)
        }
        else if (this.searchType.startsWith('Terminate Request')) {
          dtInstance.column(columnTitles.indexOf(this._24th_column_title)).search('^Terminate Request$', true, false)
        }

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
          }
          c++;
        }
        // dtInstance.columns().every(function () {
        // var column = this;
        //   $('input', this.footer()).on('keyup change', function() {
        //     if (column.search() !== (this as HTMLInputElement).value) {
        //       column.search((this as HTMLInputElement).value).draw();
        //     }
        //   });
        //   });
      });
    });
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('edit-contract')) {
        this.router.navigateByUrl(
          'maker/view-contracts/edit/' + event.target.getAttribute('edit-contract')
        );
      } else if (event.target.hasAttribute('contract-detail')) {
        this.router.navigateByUrl(
          'maker/contract-detail/' + event.target.getAttribute('contract-detail')
        );
      }
      else if (event.target.hasAttribute('delete-contract')) {
        var selected_contract_name = event.target.getAttribute('user-name');
        Swal.fire({
          title: 'Delete Contract: ' + selected_contract_name,
          text:
            'Are you sure? you are about to delete ' +
            selected_contract_name +
            ' from the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {
            this.service
              .deleteContract(event.target.getAttribute('delete-contract'))
              .subscribe(
                (data: any) => {
                  if (data == true)
                    this.datatableElement.dtInstance.then(
                      (dtInstance: DataTables.Api) => {
                        dtInstance.ajax.reload((data) => {
                          // alert(data);
                          Swal.hideLoading();
                          Swal.close();
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: ' You are successfully  deleted contract request!',
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
                              .deleteContract(event.target.getAttribute('delete-contract'))
                              .subscribe(
                                (data: any) => {
                                  if (data == true)
                                    this.datatableElement.dtInstance.then(
                                      (dtInstance: DataTables.Api) => {
                                        dtInstance.ajax.reload((data) => {
                                          // alert(data);
                                          Swal.hideLoading();
                                          Swal.close();
                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Success',
                                            text: ' You are successfully  deleted contract request!',
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
            // this.reason_modal.show()
            // this.vendor_id = event.target.getAttribute('delete-vendor');
            // this.reason = "Delete Vendor"

            // console.log(
            //   'delete-vendor: ' + event.target.getAttribute('delete-vendor')
            // );
          }
        });
      } else if (event.target.hasAttribute('activate-contract')) {
        var vendor_name = event.target.getAttribute('activate-contract-name');
        var vendor_id = event.target.getAttribute('activate-contract');
        Swal.fire({
          title: 'Unhold Contract Id:: ' + vendor_id,
          text:
            'Are you sure? you are about to unhold contract id = ' +
            vendor_id +
            '.This means the contract will be allowed to use in the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Unhold',
        }).then((result) => {
          if (result.isConfirmed) {
            this.contract_id = event.target.getAttribute('activate-contract');
            this.reason = "Unhold Contract";
            this.reason_modal.show();
          }
        });
      } else if (event.target.hasAttribute('deactivate-contract')) {
        var vendor_name = event.target.getAttribute('deactivate-contract-name');
        var vendor_id = event.target.getAttribute('deactivate-contract');
        Swal.fire({
          title: 'Hold Contract Id: ' + vendor_id,
          text:
            'Are you sure? you are about to Hold  contract id =' +
            vendor_id +
            '. This means the contract will be not work until unhold.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Hold',
        }).then((result) => {
          if (result.isConfirmed) {
            this.contract_id = event.target.getAttribute('deactivate-contract');
            this.reason = "Hold Contract"
            this.reason_modal.show();
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        });
      } else if (event.target.hasAttribute('send-pool-remark')) {
        var selected_request_id = event.target.getAttribute('send-pool-remark');
        this.request_id = selected_request_id;
        this.reject_request_modal.show();
      } else if (event.target.hasAttribute('contract-remark')) {
        var selected_request_id = event.target.getAttribute('contract-remark');
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
      else if (event.target.hasAttribute('download-file')) {
        var contract_id = event.target.getAttribute('download-file')
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
        this.service.downloadSecuritytFiles(contract_id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-security-document')) {
        var contract_id = event.target.getAttribute('preview-security-document')
        // this.document_type = 'tin_certificate'
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
        this.service.downloadSecuritytFiles(contract_id).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('download-file-sla')) {
        var contract_id = event.target.getAttribute('download-file-sla')
        this.save_as = "SLA_Document"
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
        this.service.downloadAddendumFiles(contract_id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });
      } else if (event.target.hasAttribute('preview-sla-document')) {
        var contract_id = event.target.getAttribute('preview-sla-document')
        // this.document_type = 'tin_certificate'
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
        this.service.downloadAddendumFiles(contract_id).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('download-file-contract-history')) {
        var contract_id = event.target.getAttribute('download-file-contract-history')
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
        this.service.downloadContractFilesHistory(contract_id).subscribe((event: any) => {
          this.downloadProgress(event);
        });

      } else if (event.target.hasAttribute('download-file-contract')) {
        var contract_id = event.target.getAttribute('download-file-contract')
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
        this.service.downloadContractFiles(contract_id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('preview-contract-document')) {
        var contract_id = event.target.getAttribute('preview-contract-document')
        // this.document_type = 'general_document'
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
        this.service.downloadContractFiles(contract_id).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
      else if (event.target.hasAttribute('download-file-confirmation')) {
        var payment_id = event.target.getAttribute('download-file-confirmation')
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
        this.service.downloadContracConfirmationPaymenttFiles(payment_id).subscribe((event: any) => {
          this.downloadProgress(event);
        });

      } else if (event.target.hasAttribute('extend-contract')) {
        var vendor_name = event.target.getAttribute('extend-vendor-name');
        var vendor_id = event.target.getAttribute('extend-contract');
        Swal.fire({
          title: 'Extend Contract: ' + vendor_name,
          text:
            'Are you sure? you are about to Extend the contract of  ' +
            vendor_name + '.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'green',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Extend',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason = "Extend";
            this.contractdocument == true;
            this.contractRenewalForm.get("end_date")?.patchValue(this.formatDate(event.target.getAttribute('extend-contract-end-date')));
            this.end_date = this.formatDate(this.end_date);

            const num = event.target.getAttribute('extend-contract-total-amount').toString().replace(/,/g, ''); // Convert to string and remove existing commas
            const parts = num.split('.'); // Split the number into parts before and after decimal
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

            this.contractRenewalForm.get("total_amount")?.patchValue(parts.join('.'));
            // this.contractRenewalForm.get("total_amount")?.patchValue(this.total_amount);
            this.contract_reneal_modal.show();
            this.contract_id = event.target.getAttribute('extend-contract');

            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        });
      } else if (event.target.hasAttribute('renew-contract')) {
        var vendor_name = event.target.getAttribute('renew-vendor-name');
        var vendor_id = event.target.getAttribute('renew-contract');
        Swal.fire({
          title: 'Renew Contract: ' + vendor_name,
          text:
            'Are you sure? you are about to Renew the contract of  ' +
            vendor_name + '.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'green',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Renewal',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason = "Renewal"
            //this.contractdocument == true;
            this.contractRenewalForm.get("end_date")?.patchValue(this.formatDate(event.target.getAttribute('renew-contract-end-date')));
            this.end_date = this.formatDate(this.end_date);

            const num = event.target.getAttribute('renew-contract-total-amount').toString().replace(/,/g, ''); // Convert to string and remove existing commas
            const parts = num.split('.'); // Split the number into parts before and after decimal
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

            this.contractRenewalForm.get("total_amount")?.patchValue(parts.join('.'));
            this.contract_reneal_modal.show();
            this.contract_id = event.target.getAttribute('renew-contract');

            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        });
      } else if (event.target.hasAttribute('terminate-contract')) {
        var vendor_name = event.target.getAttribute('terminate-vendor-name');
        var vendor_id = event.target.getAttribute('terminate-contract');
        Swal.fire({
          title: 'Terminate Contract Id: ' + vendor_id,
          text:
            'Are you sure? you are about to terminate the contract id:  ' +
            vendor_id + '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Terminate',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason = "Terminate Contract"
            this.contract_id = event.target.getAttribute('terminate-contract');
            this.reason_modal.show();

            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        });
      } else if (event.target.hasAttribute('terminate-contract-end')) {
        var vendor_name = event.target.getAttribute('terminate-vendor-name-end');
        var vendor_id = event.target.getAttribute('terminate-contract-end');
        Swal.fire({
          title: 'Complete Contract Id: ' + vendor_id,
          text:
            'Are you sure? you are about to Complete the contract id:  ' +
            vendor_id + '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'green',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Complete',
        }).then((result) => {
          if (result.isConfirmed) {
            this.reason = "Terminate Contract After successfully completed"
            this.contract_id = event.target.getAttribute('terminate-contract-end');
            this.reason_modal.show();

            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        });
      }
      // else if (event.target.hasAttribute('pending-payment')) {
      //   var payment_id = event.target.getAttribute('pending-payment');
      //   Swal.fire({
      //     title: 'Send Payment request',
      //     text:
      //       'Are you sure? you are sending payment request of Payment Id:  payment' +
      //       payment_id + ' to checher.',
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: 'green',
      //     cancelButtonColor: '#3085d6',
      //     confirmButtonText: 'Send Payment Request',
      //   }).then((result) => {
      //     if (result.isConfirmed) {

      //       this.payment_id = event.target.getAttribute('pending-payment');
      //       this.reason = "pending";
      //       this.IdPayment = event.target.getAttribute('pending-payment');
      //       this.service.getPaymentDetail(event.target.getAttribute('pending-payment')).subscribe(
      //         async (data) => {
      //           if (data != null) {
      //             this.contract = data;
      //             if (this.paymentFrequency != "phased")
      //               this.paymentForm.get("paid_date")?.patchValue(this.formatDate(data.date));
      //             // this.paymentForm.get("paid_amount")?.patchValue(data.paid_amount);
      //             const num = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
      //             const parts = num.split('.'); // Split the number into parts before and after decimal
      //             parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

      //             this.paymentForm.get("paid_amount")?.patchValue(parts.join('.'));
      //             this.paymentForm.get("payment_description")?.patchValue(data.payment_description);

      //           } else {
      //           }
      //         },
      //         (error) => {
      //           if (error.error.text === 'access-token-expired') {
      //             console.log('Access-token-expired requesting refresh token...');
      //             if (
      //               this.localStorageService.retrieve('refresh_token_requested') == null
      //             ) {
      //               this.utilService.refreshToken().subscribe(
      //                 (data) => {
      //                   if (data === true) {
      //                     console.log(
      //                       'refresh token success re-requesting the actual request'
      //                     );
      //                     this.localStorageService.clear('refresh_token_requested');
      //                     //================================================================================
      //                     this.service.getPaymentDetail(event.target.getAttribute('pending-payment')).subscribe(
      //                       async (data) => {
      //                         if (data != null) {
      //                           this.contract = data;
      //                           if (this.paymentFrequency != "phased")
      //                             this.paymentForm.get("paid_date")?.patchValue(this.formatDate(data.date));
      //                           // this.paymentForm.get("paid_amount")?.patchValue(data.paid_amount);

      //                           const num = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
      //                           const parts = num.split('.'); // Split the number into parts before and after decimal
      //                           parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

      //                           this.paymentForm.get("paid_amount")?.patchValue(parts.join('.'));
      //                           this.paymentForm.get("payment_description")?.patchValue(data.payment_description);

      //                         } else {
      //                         }
      //                       },
      //                       (error) => {
      //                         if (error.error.text === 'access-token-expired') {
      //                           console.log('refresh token expired.');
      //                           this.SwalSessionExpired.fire();
      //                           this._refreshTokenExpired();
      //                         } else {
      //                           Swal.fire({
      //                             icon: 'error',
      //                             title: 'Oops...',
      //                             text: 'Something went wrong!',
      //                           });
      //                           console.log(
      //                             JSON.stringify(error.error.apierror, null, 2)
      //                           );
      //                         }
      //                       }
      //                     );
      //                     //================================================================================
      //                   } else {
      //                     console.log('refresh token expired.');
      //                     this.SwalSessionExpired.fire();
      //                     this._refreshTokenExpired();
      //                   }
      //                 },
      //                 (error: any) => {
      //                   console.log('error refreshing access token');
      //                   Swal.fire({
      //                     icon: 'error',
      //                     title: 'Oops...',
      //                     text: 'Something went wrong!',
      //                   });
      //                   console.log(JSON.stringify(error.error.apierror, null, 2));
      //                 }
      //               );
      //               this.localStorageService.store('refresh_token_requested', true);
      //             }
      //           }
      //           else {
      //             Swal.fire({
      //               icon: 'error',
      //               title: 'Oops...',
      //               text: 'Something went wrong!',
      //             });
      //             console.log(JSON.stringify(error.error.apierror, null, 2));
      //           }
      //         }
      //       );
      //       this.add_payment_modal.show();


      //     }
      //   });
      // } 
      else if (event.target.hasAttribute('delete-payment')) {
        var payment_id = event.target.getAttribute('delete-payment');
        Swal.fire({
          title: 'Delete Payment Id: ' + payment_id,
          text:
            'Are you sure? you are about to Delete Payment Id:  ' +
            payment_id + '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'green',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {

            this.service
              .deletePayment(event.target.getAttribute('delete-payment'))
              .subscribe(
                (data: any) => {
                  if (data == true)
                    this.datatableElement.dtInstance.then(
                      (dtInstance: DataTables.Api) => {
                        dtInstance.ajax.reload((data) => {
                          // alert(data);
                          Swal.hideLoading();
                          Swal.close();
                          $('#view_detail').DataTable().ajax.reload()
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: ' You are successfully  deleted payment request!',
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
                              .deletePayment(event.target.getAttribute('delete-contract'))
                              .subscribe(
                                (data: any) => {
                                  if (data == true)
                                    this.datatableElement.dtInstance.then(
                                      (dtInstance: DataTables.Api) => {
                                        dtInstance.ajax.reload((data) => {
                                          // alert(data);
                                          Swal.hideLoading();
                                          Swal.close();
                                          $('#view_detail').DataTable().ajax.reload()
                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Success',
                                            text: ' You are successfully  deleted payment request!',
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
        });
      }
      // else if (event.target.hasAttribute('edit-payment')) {
      //   var payment_id = event.target.getAttribute('edit-payment');
      //   Swal.fire({
      //     title: 'Update Payment Id: ' + payment_id,
      //     text:
      //       'Are you sure? you are about to Update Payment Id:  ' +
      //       payment_id + '',
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: 'green',
      //     cancelButtonColor: '#3085d6',
      //     confirmButtonText: 'Update',
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       this.payment_id = null;
      //       this.reason = "update"
      //       this.IdPayment = event.target.getAttribute('edit-payment');
      //       this.service.getPaymentDetail(payment_id).subscribe(
      //         async (data) => {
      //           if (data != null) {
      //             this.contract = data;
      //             if (this.paymentFrequency != "phased")
      //               this.paymentForm.get("paid_date")?.patchValue(this.formatDate(data.date));
      //             const num = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
      //             const parts = num.split('.'); // Split the number into parts before and after decimal
      //             parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

      //             this.paymentForm.get("paid_amount")?.patchValue(parts.join('.'));
      //             this.paymentForm.get("payment_description")?.patchValue(data.payment_description);

      //           } else {
      //           }
      //         },
      //         (error) => {
      //           if (error.error.text === 'access-token-expired') {
      //             console.log('Access-token-expired requesting refresh token...');
      //             if (
      //               this.localStorageService.retrieve('refresh_token_requested') == null
      //             ) {
      //               this.utilService.refreshToken().subscribe(
      //                 (data) => {
      //                   if (data === true) {
      //                     console.log(
      //                       'refresh token success re-requesting the actual request'
      //                     );
      //                     this.localStorageService.clear('refresh_token_requested');
      //                     //================================================================================
      //                     this.service.getPaymentDetail(payment_id).subscribe(
      //                       async (data) => {
      //                         if (data != null) {
      //                           this.contract = data;
      //                           if (this.paymentFrequency != "phased")
      //                             this.paymentForm.get("paid_date")?.patchValue(this.formatDate(data.date));
      //                           const num = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
      //                           const parts = num.split('.'); // Split the number into parts before and after decimal
      //                           parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

      //                           this.paymentForm.get("paid_amount")?.patchValue(parts.join('.'));
      //                           this.paymentForm.get("payment_description")?.patchValue(data.payment_description);

      //                         } else {
      //                         }
      //                       },
      //                       (error) => {
      //                         if (error.error.text === 'access-token-expired') {
      //                           console.log('refresh token expired.');
      //                           this.SwalSessionExpired.fire();
      //                           this._refreshTokenExpired();
      //                         } else {
      //                           Swal.fire({
      //                             icon: 'error',
      //                             title: 'Oops...',
      //                             text: 'Something went wrong!',
      //                           });
      //                           console.log(
      //                             JSON.stringify(error.error.apierror, null, 2)
      //                           );
      //                         }
      //                       }
      //                     );
      //                     //================================================================================
      //                   } else {
      //                     console.log('refresh token expired.');
      //                     this.SwalSessionExpired.fire();
      //                     this._refreshTokenExpired();
      //                   }
      //                 },
      //                 (error: any) => {
      //                   console.log('error refreshing access token');
      //                   Swal.fire({
      //                     icon: 'error',
      //                     title: 'Oops...',
      //                     text: 'Something went wrong!',
      //                   });
      //                   console.log(JSON.stringify(error.error.apierror, null, 2));
      //                 }
      //               );
      //               this.localStorageService.store('refresh_token_requested', true);
      //             }
      //           }
      //           else {
      //             Swal.fire({
      //               icon: 'error',
      //               title: 'Oops...',
      //               text: 'Something went wrong!',
      //             });
      //             console.log(JSON.stringify(error.error.apierror, null, 2));
      //           }
      //         }
      //       );

      //       // this.payment_id = event.target.getAttribute('edit-payment');
      //       this.add_payment_modal.show();


      //     }
      //   });
      // }


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
