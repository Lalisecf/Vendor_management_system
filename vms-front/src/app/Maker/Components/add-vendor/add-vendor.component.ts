import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
// import { registerVendorPayload } from 'src/app/Admin/payloads/register_actor_payload';
import { CheckEmailExistPayload } from 'src/app/Admin/payloads/admin_check_email_exist_payload';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { MultiDropdownProductComponent } from './multi-dropdown-product/multi-dropdown-product.component';
import { phoneNumberValidator } from 'src/app/Admin/validators/phone_number_validator';
import { MultiDropdownServiceComponent } from './multi-dropdown-service/multi-dropdown-service.component';
import { Vendors } from '../../Payloads/vendors';
import { MakerService } from '../../Services/maker.service';
import { Product } from '../../Payloads/product';
import { services } from '../../Payloads/services';
import { Remark } from '../../Payloads/remark';
// import intlTelInput from 'intl-tel-input';
// import 'intl-tel-input/build/js/utils';

import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import saveAs from 'file-saver';


declare var window: any;
@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent implements OnInit {
  @ViewChild(MultiDropdownProductComponent)
  componentMultiProducts!: MultiDropdownProductComponent;
  @ViewChild(MultiDropdownServiceComponent)
  componentMultiService!: MultiDropdownServiceComponent;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor')
  public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor')
  public readonly SuccessSwalUpdateVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdatedVendor')
  public readonly SuccessSwalUpdatedVendor!: SwalComponent;
  dtOptions: any;
  ProductselectedItems = [];
  ServiceselectedItems = [];
  vendor_id: any;
  role_name: any;
  vendor_product: any;
  vendor_service: any;
  status: any;
  slect_product: boolean = false;
  preview: boolean = false;
  file_to_preview!: any;
  document_type!: any;
  progress_download = 0;
  downloadStatus_title = 'Downloading...';
  filenames: string[] = [];
  reason_modal: any;
  reasonForm!: FormGroup;
  remark!: Remark;

  //form and other
  registerForm!: FormGroup;
  submitted: boolean = false;
  activeTab = 1;
  // emailChecked: boolean = false;
  registerVendorPayload!: Vendors;
  checkEmailExistPayload!: CheckEmailExistPayload;
  products!: Product[];
  services!: services[];
  vendor: any;
  files: File[] = [];
  files2: File[] = [];
  files3: File[] = [];
  files4: File[] = [];
  maxFileSize: number = 8000000
  fileSizeError1: string = '';
  fileSizeError2: string = '';
  fileSizeError3: string = '';
  fileSizeError4: string = '';
  moreDocuments: boolean = false;
  IsEthiopianPhone: boolean | undefined;
  Phoneformat: boolean = true;
  // countrycode:string='251'
  // phonenumber:any



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

  first_column_title = '-ID-';
  second_column_title = 'Vendor Name';
  third_column_title = 'Product';
  fourth_column_title = 'Service';
  fifth_column_title = 'phone Number';
  sixth_column_title = 'email';
  seventh_column_title = 'Website';
  eighth_column_title = 'Location';
  tenth_column_title = 'Posta Number';
  eleventh_column_title = 'Fax Number';
  twelfth_column_title = 'Document';
  thirteenth_column_title = 'General Document Discription';
  fourteenth_column_title = 'status';
  fiveteenth_column_title = 'Change Status';
  sixteenth_column_title = 'Action';


  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  // TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.Ethiopia,
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
    private cdRef: ChangeDetectorRef
  ) {
    this.vendor_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.vendor_product = this.activatedRoute.snapshot.paramMap.get('product');
    this.vendor_service = this.activatedRoute.snapshot.paramMap.get('service');

    this.checkEmailExistPayload = {
      email: '',
    };
    this.remark = {
      id: '',
      title: '',
      description: '',
      created_date: '',
      created_by: '',
      email: ''
    };

    this.registerVendorPayload = {
      id: null,
      name: '',
      phone_number: '',
      email: '',
      website: '',
      location: '',
      address: '',
      post_number: '',
      fax_number: '',
      general_document: null,
      general_document_descreption: '',
      bank_name: '',
      branch_name: '',
      account_name: '',
      account_number: '',
      swift_code: '',
      beneficiary_address: '',
      iban: '',
      request_type: '',
      product: '',
      service: '',
      contract: '',
      status: ''
    };

    this.registerForm = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        phone_number: new FormControl('', [
          // Validators.required,
          this.phoneValidator.bind(this)
        ]),
        email: new FormControl('', [
          // Validators.required,
          Validators.email
          // Validators.pattern('^[a-zA-Z0-9_.]+@gmail.com$'),
        ]),
        website: new FormControl('', [

        ]),
        location: new FormControl('', [
          Validators.required,
        ]),
        address: new FormControl('', [
          Validators.required,
        ]),
        post_number: new FormControl('', [
        ]),
        fax_number: new FormControl('', [
        ]),
        general_document: new FormControl('', [
        ]),
        general_document_descreption: new FormControl('', [
        ]),
        bank_name: new FormControl('', [
        ]),
        branch_name: new FormControl('', [
        ]),
        account_name: new FormControl('', [
        ]),
        account_number: new FormControl('', [
        ]),
        swift_code: new FormControl('', [
        ]),
        beneficiary_address: new FormControl('', [
        ]),
        iban: new FormControl('', [
        ]),
      },

      { validators: phoneNumberValidator.MatchValidator },

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
  }

  onCountryChange(country: any) {
    // autofill country name, country code on phone number and fax number
    this.registerForm.get('location')?.setValue(country.name);
    this.registerForm.get('phone_number')?.setValue('+' + country.dialCode)
    this.registerForm.get('fax_number')?.setValue('+' + country.dialCode)
  }

  // Method to go to the next tab
  nextTab(): void {
    if (this.activeTab < 3) {
      this.activeTab++;
    }
  }

  // Method to go to the previous tab
  previousTab(): void {
    if (this.activeTab > 1) {
      this.activeTab--;
    }
  }

  // Method to select a specific tab (called on click)
  selectTab(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  phoneValidator(control: any) {
    const selectedCountry = control.parent?.get('phone_number')?.value?.countryCode;
    const phoneNumber = control.value?.number || '';
    this.Phoneformat = true;
    // Validate Ethiopian phone numbers
    if (selectedCountry === 'ET') {
      this.IsEthiopianPhone = true;
      console.log('is ethiopian phone number true')
      // Accept numbers starting with 09 or 07 (local format) or +2519 and +2517 (international format)
      const localPattern = /^(09|07)\d{8}$/;
      const internationalPattern = /^\+251(9|7)\d{8}$/;
      console.log("phone " + phoneNumber)
      if (phoneNumber.startsWith('07')) {
        this.Phoneformat = false
      }

      if (!localPattern.test(phoneNumber) && !internationalPattern.test(phoneNumber)) {
        return { invalidPhoneNumber: true };
      }
    }
    else {
      this.IsEthiopianPhone = false;
    }
    return null;
  }


  ngOnInit(): void {
    if (this.vendor_id != null) {

      for (const item of this.localStorageService.retrieve('roles') as any[]) {
        if (item.name == "Checker") {
          this.role_name = "Checker";
          this.getVendors(this.vendor_id, 'Checker');
        } else {
          this.getVendors(this.vendor_id, 'Maker');
        }
      }


    }
    this.reason_modal = new window.bootstrap.Modal(
      document.getElementById('reason_modal'),)


    const that = this;
    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: false,
      // lengthMenu: 'ten',
      lengthChange: false,
      ordering: true,
      paging: false,
      // scrollY: 400,
      // pagingType: 'full_numbers',
      // pageLength: 7,
      select: false,
      // ajax: '../../../../assets/data/data.json',
      ajax: (dataTablesParameters: any, callback: any) => {
        this.makerService.getAllVendor(this.vendor_id).subscribe(
          async (resp: any) => {
            if (resp != null) {
              console.log(
                'response for table edited: ' + JSON.stringify(resp, null, 2)
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
                      this.makerService.getAllVendor(this.vendor_id).subscribe(
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
          data: 'id',
        },
        {
          title: this.second_column_title,
          data: 'name',
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
          data: 'name',
        },
        {
          title: this.fifth_column_title,
          data: 'phone_number',
        },
        {
          title: this.sixth_column_title,
          data: 'email',
        },
        {
          title: this.seventh_column_title,
          data: 'website',
        },
        {
          title: this.eighth_column_title,
          data: 'location',
        },
        {
          title: this.tenth_column_title,
          data: 'post_number',
        },
        {
          title: this.eleventh_column_title,
          data: 'fax_number',
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
          title: 'Trade Licence',
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
          title: 'Tin certificate',
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
          title: 'Other Document',
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
      fixedFooter: false,
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
  }

  getVendors(vendor_id: any, roleName: any) {
    this.makerService.getVendorById(vendor_id, roleName).subscribe(
      (data: any) => {
        this.vendor = data;
        this.status = data.status
        console.log('status--------------------status--------------------------------- ' + data.status);
        console.log('Result Vendor before edited: ' + JSON.stringify(data, null, 3));
        this.registerForm.patchValue(data);
        this.registerForm.get('phone_number')?.patchValue(data.phone_number.replace(/\s+/g, ''));
        console.log('the length of products: ' + data.products.length);
        let tmp1: any[] = [];
        for (let i = 0; i < data.products.length; i++) {
          if (data.products[i].status != null)
            tmp1.push({ id: data.products[i].id, name: data.products[i].name });
        }
        this.componentMultiProducts.ProductselectedItems = tmp1;
        let tmp2: any[] = [];
        for (let i = 0; i < data.services.length; i++) {
          if (data.services[i].status != null)
            tmp2.push({ id: data.services[i].id, name: data.services[i].name });
        }
        this.componentMultiService.ServiceselectedItems = tmp2;
        console.log(
          'selected items: ' +
          JSON.stringify(this.componentMultiProducts.ProductselectedItems)
        );
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
                  this.adminService.getUser(this.vendor_id).subscribe(
                    (data: any) => {
                      this.registerForm.patchValue(data);
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

  onFileSelect1(event: any) {
    this.files = event.addedFiles;
    // console.log('here is the file ' + this.files.at(0)!.name)
    console.log('=========aa=================>' + event.addedFiles)
    if (this.files.length == 0) {
      console.log('=========bb=================>')
      this.fileSizeError1 = 'error';
      this.files = []; // Clear the files array if the file size exceeds the limit
    } else {
      this.fileSizeError1 = '';
    }

  }
  onFileSelect2(event: any) {
    this.files2 = event.addedFiles;
    // console.log('here is the file ' + this.files.at(0)!.name)
    console.log('=========aa=================>' + event.addedFiles)
    if (this.files2.length == 0) {
      console.log('=========bb=================>')
      this.fileSizeError2 = 'error';
      this.files2 = []; // Clear the files array if the file size exceeds the limit
    } else {
      this.fileSizeError2 = '';
    }

  }
  onFileSelect3(event: any) {
    this.files3 = event.addedFiles;
    // console.log('here is the file ' + this.files.at(0)!.name)
    console.log('=========aa=================>' + event.addedFiles)
    if (this.files3.length == 0) {
      console.log('=========bb=================>')
      this.fileSizeError3 = 'error';
      this.files3 = []; // Clear the files array if the file size exceeds the limit
    } else {
      this.fileSizeError3 = '';
    }

  }

  onFileSelect4(event: any) {
    this.files4 = event.addedFiles;
    // console.log('here is the file ' + this.files.at(0)!.name)
    console.log('=========aa=================>' + event.addedFiles)
    if (this.files4.length == 0) {
      console.log('=========bb=================>')
      this.fileSizeError4 = 'error';
      this.files4 = []; // Clear the files array if the file size exceeds the limit
    } else {
      this.fileSizeError4 = '';
    }

  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  onRemove2(event: any) {
    console.log(event);
    this.files2.splice(this.files2.indexOf(event), 1);
  }
  onRemove3(event: any) {
    console.log(event);
    this.files3.splice(this.files3.indexOf(event), 1);
  }
  onRemove4(event: any) {
    console.log(event);
    this.files4.splice(this.files4.indexOf(event), 1);
  }
  moreDocument() {
    this.moreDocuments = true;
  }
  onSubmit() {
    const formData = new FormData();
    console.log(
      JSON.stringify(this.componentMultiProducts.ProductselectedItems, null, 3)
    );
    if (
      this.registerForm.valid && this.fileSizeError1 == '' && this.fileSizeError2 == '' && this.fileSizeError3 == '' && this.fileSizeError4 == ''
      // this.emailChecked &&
      // this.componentMultiProducts.ProductselectedItems.length > 0
    ) {
      this.registerVendorPayload = this.registerForm.value;
      console.log(
        'values' + JSON.stringify(this.registerVendorPayload, null, 2)
      );
      if (this.vendor_id != null) this.registerVendorPayload.id = this.vendor_id;
      // this.products
      // var role = this.products.find((role) => {
      //   return role.name === this.registerVendorPayload.role;
      // });
      console.log(
        'products: ' +
        this.registerVendorPayload.product +
        ':::' +
        JSON.stringify(this.products, null, 3)
      );
      // console.log('role: ' + role + ':::' + JSON.stringify(role, null, 3));
      var product_ids: any[] = [];
      var service_ids: any[] = [];


      // if (role != undefined)
      //   this.registerVendorPayload.role = role!.id.toLocaleString();
      console.log('selected items: ' + this.componentMultiProducts.ProductselectedItems);
      for (var i = 0; i < this.componentMultiProducts.ProductselectedItems.length; i++) {
        console.log(
          'selected item: ' + this.componentMultiProducts.ProductselectedItems[i].id
        );
        product_ids.push(
          this.componentMultiProducts.ProductselectedItems[i].id
            .toLocaleString()
            .replace(',', '')
        );
      }
      // for (var i = 0; i < this.componentMultiService.ServiceselectedItems.length; i++) {
      //   console.log(
      //     'selected item: ' + this.componentMultiService.ServiceselectedItems[i].id
      //   );
      //   service_ids.push(
      //     this.componentMultiService.ServiceselectedItems[i].id
      //       .toLocaleString()
      //       .replace(',', '')
      //   );
      // }

      this.registerVendorPayload.product = product_ids.toLocaleString();
      // this.registerVendorPayload.service = service_ids.toLocaleString();
      if (this.registerVendorPayload.product != null) {
        this.slect_product = true;
      } else {
        this.slect_product = false;
      }
      console.log('yyyyyyyyyy' + this.slect_product);
      console.log('sssssssssssssssssnnnnnnnnnnnnnn  ' + JSON.stringify(this.registerVendorPayload))
      if (this.registerVendorPayload.id != null)
        formData.append('id', this.registerVendorPayload.id);
      if (this.files.at(0)! != null)
        formData.append('general_document', this.files.at(0)!);
      if (this.files2.at(0)! != null)
        formData.append('trade_document', this.files2.at(0)!);
      if (this.files3.at(0)! != null)
        formData.append('tin_document', this.files3.at(0)!);
      if (this.files4.at(0)! != null)
        formData.append('other_document', this.files4.at(0)!);
      formData.append('name', this.registerVendorPayload.name);
      formData.append('phone_number', this.registerForm.get('phone_number')?.value.internationalNumber);
      formData.append('email', this.registerVendorPayload.email);
      formData.append('website', this.registerVendorPayload.website);
      formData.append('location', this.registerVendorPayload.location);
      formData.append('address', this.registerVendorPayload.address)
      formData.append('fax_number', this.registerVendorPayload.fax_number);
      formData.append('post_number', this.registerVendorPayload.post_number);
      formData.append('product', this.registerVendorPayload.product);
      formData.append('service', this.registerVendorPayload.service);
      formData.append('general_document_descreption', this.registerVendorPayload.general_document_descreption);
      formData.append('bank_name', this.registerVendorPayload.bank_name);
      formData.append('branch_name', this.registerVendorPayload.branch_name);
      formData.append('account_name', this.registerVendorPayload.account_name);
      formData.append('account_number', this.registerVendorPayload.account_number);
      formData.append('swift_code', this.registerVendorPayload.swift_code);
      formData.append('beneficiary_address', this.registerVendorPayload.beneficiary_address);
      formData.append('iban', this.registerVendorPayload.iban);
      if (this.registerVendorPayload.id != null) {
        formData.append('status', this.status);
        formData.append('availability', this.role_name);
      }
      console.log('here is the ibannnnn ' + this.registerVendorPayload.iban)
      console.log('here is country code with phone number--===' + this.registerForm.get('phone_number')?.value.internationalNumber);
      if (this.registerVendorPayload.id == null) {
        this.makerService.checkVendorExist(this.registerVendorPayload.name).subscribe(
          (data: Boolean) => {
            if (data == true) {
              Swal.fire({
                icon: 'error',
                title: 'Duplication',
                text: 'Vendor already exist',
              });
            } else if (data == false) {
              this.registerVendor(formData);
            }
          },
        );
      }
      else {
        this.registerVendor(formData);
      }
    } else this.submitted = true;
  }
  rejectUpdateRequests() {
    this.reason_modal.show();
  }
  onSubmitReason() {
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;
      this.rejectUpdateRequest(this.vendor_id, this.remark);

    } else this.submitted = true;
    return true;
  }

  rejectUpdateRequest(id: any, remark: Remark) {
    this.makerService
      .rejectUpdat(id, remark)
      .subscribe(
        (data: any) => {
          if (data == true)
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: ' You are Successfully Rejected Updated Request!',
            });
          this.router.navigateByUrl('checker/view-vendors');

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
                      .rejectUpdat(
                        id, remark
                      )
                      .subscribe(
                        (data: any) => {
                          if (data == true)
                            Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: ' You are Successfully Rejected Updated Request!',
                            });
                          this.router.navigateByUrl('checker/view-vendors');
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
  openPreviewInNewTab() {
    window.open(this.file_to_preview, '_blank');
  }
  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('download-general-document')) {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
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
        this.makerService.downloadVendorFiles(vendor_id, this.document_type).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      }
    });
  }
  registerVendor(formData: any) {
    console.log(
      'Payload: ' + JSON.stringify(this.registerVendorPayload, null, 2)
    );
    this.makerService.registerVendor(formData).subscribe(
      async (data) => {
        if (data == true) {
          // this.SuccessSwalRegisterVendor.fire();

          if (this.vendor_id != null) {
            if (this.role_name == "Checker") {
              this.SuccessSwalUpdatedVendor.fire();
              this.router.navigateByUrl('/checker/view-vendors');
            } else {
              this.SuccessSwalUpdateVendor.fire();
              this.router.navigateByUrl('/maker/view-vendors');
            }
            // console.log('update success: ' + data);
          } else {
            this.SuccessSwalRegisterVendor.fire();
            this.router.navigateByUrl('/maker/view-vendors');
            this.registerForm.reset();
            this.componentMultiProducts.ProductselectedItems = [];
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
                  this.makerService.registerVendor(formData).subscribe(
                    async (data) => {
                      if (data == true) {
                        this.SuccessSwalUpdateVendor.fire();
                        if (this.vendor_id != null) {
                          this.router.navigateByUrl('/maker/view-vendors');
                          // console.log('update success: ' + data);
                        } else {
                          this.SuccessSwalRegisterVendor.fire();
                          this.router.navigateByUrl('/maker/view-vendors');
                          this.registerForm.reset();
                          this.componentMultiProducts.ProductselectedItems = [];
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
