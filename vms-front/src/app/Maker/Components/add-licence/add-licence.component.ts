import { AfterViewInit, Component, OnInit, Renderer2, ViewChild, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import saveAs from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
// import { registerVendorPayload } from 'src/app/Admin/payloads/register_actor_payload';
import { CheckEmailExistPayload } from 'src/app/Admin/payloads/admin_check_email_exist_payload';
import { AdminService } from 'src/app/Admin/services/admin.service';

import { phoneNumberValidator } from 'src/app/Admin/validators/phone_number_validator';

import { Vendors } from '../../Payloads/vendors';
import { MakerService } from '../../Services/maker.service';
import { Product } from '../../Payloads/product';
import { services } from '../../Payloads/services';
import { contract } from '../../Payloads/contract';
import { DatePipe } from '@angular/common';
import { payments } from '../../Payloads/payments';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AddContractComponent } from '../add-contract/add-contract.component';
import { MONTH } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-add-licence',
  templateUrl: './add-licence.component.html',
  styleUrls: ['./add-licence.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddLicenceComponent),
      multi: true
    },
    DatePipe
  ]
})
export class AddLicenceComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  authservice(): any {
    throw new Error('Method not implemented.');
  }
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor')
  public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor')
  public readonly SuccessSwalUpdateVendor!: SwalComponent;
  request_date: any;
  requested_by: any;
  licence_id: any;
  progress_download = 0;
  downloadStatus_title = 'Downloading...';
  preview: boolean = false;
  file_to_preview!: any;
  filenames: string[] = [];
  save_as!: any;
  status: any;
  role_name: any;
  slect_product: boolean = false;
  currentStep: number = 1;
  //form and other
  registerForm!: FormGroup;
  submitted: boolean = false;
  // emailChecked: boolean = false;
  registerVendorPayload!: contract;
  checkEmailExistPayload!: CheckEmailExistPayload;
  dtOptions_currentLicence: any
  vendor: any[] = [];
  contract: any[] = [];
  productCategory: any[] = [];
  Directorates: any[] = [];
  files: File[] = [];
  paymentConfirmation: File[] = [];
  securityDocument: File[] = [];
  SLADocument: File[] = [];
  onChange: any = () => { };
  onTouched: any = () => { };
  start_date: any;
  end_date: any;
  minDate: Date | undefined = undefined;
  maxDate: Date | undefined = undefined;
  selectedVendorId: any;
  // selectedServiceId: any;
  // selectedProductId: any;
  serviceDropdownSettings: any;
  ProductDropdownSettings: any;
  serviceList: any[] = [];
  productList: any[] = []; // Populate this with your service data
  selectedServices: any[] = [];
  selectedProducts: any[] = [];
  request_type: any;
  constructor(
    private formBuilder: FormBuilder,
    private makerService: MakerService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.licence_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.registerForm = this.formBuilder.group(
      {
        vendor_id: new FormControl('', [
          Validators.required,
        ]),
        contract_id: new FormControl('', [
          Validators.required,
        ]),
        product_service_name: new FormControl('', [
          Validators.required
        ]),
        licence_quantity: new FormControl('', [
          Validators.required
        ]),
        product_category: new FormControl('', [
          Validators.required
        ]),
        licence_type: new FormControl('', []),
        start_date: new FormControl('', [
          Validators.required
        ]),
        expiry_date: new FormControl('', [
          Validators.required
        ]),
        renewal_date: new FormControl('', [
          Validators.required
        ]),
        total_cost: new FormControl('', [
          Validators.required
        ]),
        support_period: new FormControl('', [
        ]),
        additional_info: new FormControl('', [
        ]),
        licence_document: new FormControl(null, [
          // Validators.required
        ]),
      },
      { validators: phoneNumberValidator.MatchValidator },

    );
  }
  AutoFillDate() {
    const expiryDate = this.registerForm?.get('expiry_date')?.value;
    if (expiryDate) {
      const renewalDate = new Date(expiryDate); // Convert expiry_date to a Date object
      renewalDate.setMonth(renewalDate.getMonth() - 3); // Subtract 3 months

      this.registerForm?.get('renewal_date')?.setValue(renewalDate); // Set the new value
    }
  }

  onDateChange() {
    // Get dates from form
    const startDateRaw = this.registerForm?.get('start_date')?.value;
    const expiryDateRaw = this.registerForm?.get('expiry_date')?.value;

    // Ensure proper date conversion
    const startDate = startDateRaw ? new Date(startDateRaw) : null;
    const expiryDate = expiryDateRaw ? new Date(expiryDateRaw) : null;

    // Set minDate and maxDate only if values exist
    if (startDate != null) {
      this.minDate = startDate;
    }

    if (expiryDate != null) {
      this.maxDate = expiryDate;
    }
  }

  writeValue(files: any): void {
    this.securityDocument = files;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (item.name == "Checker") {
        this.role_name = "Checker";

      } else {
        this.role_name = "Maker";
      }
    }
    if (this.role_name == "Maker" && this.licence_id != null) {
      this.getLicenceById();
    }

    if (this.role_name == "Checker" && this.licence_id != null) {
      this.getTempLicenceById();
      this.getCurrentLicence();
    }
    // this.getContract();

    this.getVendors();

    // this.getDirectorates();
    // this.getIssuerBanks();
    this.getAllProductCategory();

  }

  getCurrentLicence() {
    this.dtOptions_currentLicence = {
      serverSide: false,
      scrollX: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.makerService.getLicenceById(this.licence_id).subscribe(
          async (resp: any) => {

            if (resp != null) {
              // console.log('........id.......>' + that.idd)
              console.log(
                'response forr table: ' + JSON.stringify(resp, null, 2)
              );


              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [resp],
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
                        .getLicenceById(this.licence_id).subscribe(
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
        // { title: 'ID', data: 'id' },
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
    };
  }
  getLicenceById() {
    this.makerService.getLicenceById(this.licence_id).subscribe(
      (data: any) => {
        this.status = data.status;
        this.selectedVendorId = data.vendor_id
        this.getContract();
        const num = data.total_cost.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts = num.split('.'); // Split the number into parts before and after decimal
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.total_cost = parts.join('.');

        if (data.start_date === 'NaN-aN-aN') {
        }
        else {
          const [year, month, day] = data.start_date.split('-'); // Extract year, month, and day
          data.start_date = `${month}/${day}/${year}`; // Convert to MM/DD/YY format
        }
        if (data.expiry_date === 'NaN-aN-aN') { }
        else {
          const [year, month, day] = data.expiry_date.split('-'); // Extract year, month, and day
          data.expiry_date = `${month}/${day}/${year}`; // Convert to MM/DD/YY format
        }
        if (data.renewal_date === 'NaN-aN-aN') { }
        else {
          const [year, month, day] = data.renewal_date.split('-'); // Extract year, month, and day
          data.renewal_date = `${month}/${day}/${year}`; // Convert to MM/DD/YY format
        }


        if (data.support_period === 'NaN-aN-aN') { }
        else {

          const dateRangeString = data.support_period;
          const [startDateString, endDateString] = dateRangeString.split(" to "); // Split into start & end date
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);

          // Patch the date range into the form control
          data.support_period = [startDate, endDate]  // Date range picker requires an array of Date objects

        }

        this.registerForm.patchValue(data);

        // this.onVendorSelectionChange()
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'some error found',
          text: 'can not get licence by licence id',
        });
      }
    );
  }
  getTempLicenceById() {
    this.makerService.getTempLicenceById(this.licence_id).subscribe(
      (data: any) => {
        this.requested_by = data.requested_by;
        this.request_date = data.request_date;
        this.status = data.status;
        this.selectedVendorId = data.vendor_id
        this.getContract();
        const num = data.total_cost.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts = num.split('.'); // Split the number into parts before and after decimal
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.total_cost = parts.join('.');

        if (data.start_date === 'NaN-aN-aN') {
        }
        else {
          const [year, month, day] = data.start_date.split('-'); // Extract year, month, and day
          data.start_date = `${month}/${day}/${year}`; // Convert to MM/DD/YY format
        }
        if (data.expiry_date === 'NaN-aN-aN') { }
        else {
          const [year, month, day] = data.expiry_date.split('-'); // Extract year, month, and day
          data.expiry_date = `${month}/${day}/${year}`; // Convert to MM/DD/YY format
        }
        if (data.renewal_date === 'NaN-aN-aN') { }
        else {
          const [year, month, day] = data.renewal_date.split('-'); // Extract year, month, and day
          data.renewal_date = `${month}/${day}/${year}`; // Convert to MM/DD/YY format
        }


        if (data.support_period === 'NaN-aN-aN') { }
        else {

          const dateRangeString = data.support_period;
          const [startDateString, endDateString] = dateRangeString.split(" to "); // Split into start & end date
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);

          // Patch the date range into the form control
          data.support_period = [startDate, endDate]  // Date range picker requires an array of Date objects

        }

        this.registerForm.patchValue(data);

        // this.onVendorSelectionChange()
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'some error found',
          text: 'can not get licence by licence id',
        });
      }
    );
  }
  getAllProductCategory() {
    this.makerService.getAllService().subscribe(
      (data: any) => {
        if (data != null) {
          this.productCategory = data
        }
      },
      (error: any) => {
        console.log('here is the error')
      }
    );

  }

  getVendors() {
    this.vendor = [];
    this.makerService.getAllVendors().subscribe(
      (vendors: Array<Vendors>) => {
        if (vendors != null) {
          for (var i = 0; i < vendors.length; i++)
            if (vendors[i].status == '2') {
              this.vendor.push(vendors[i])
            }


          // this.dropdownList = vendors.filter(vendor => vendor.status !== '0').map(vendor => ({ id: vendor.id, name: vendor.name }));
        }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }

  onVendorSelectionChange() {
    this.selectedVendorId = this.registerForm.get('vendor_id')?.value;
    this.getContract();
    console.log('here is the contract id you choice ' + this.registerForm.get('contract_id')?.value)
  }
  fetchServicesForVendor(vendorId: string) {
    console.log('here is vendor id---------for service fetch ' + vendorId)
    let tmp: any[] = []
    this.makerService.getServiceByVendorId(vendorId).subscribe(
      (services: Array<services>) => {
        if (services != null) {
          for (let i = 0; i < services.length; i++) {
            tmp.push({ id: services[i].id, name: services[i].name })
          }
          this.serviceList = tmp
          // this.service = services;
          // this.serviceList = services.map(service => ({ id: service.id, name: service.name }));
        }
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  fetchProductsForVendor(vendorId: string) {
    this.makerService.getProductByVendorId(vendorId).subscribe(
      (products: Array<Product>) => {
        if (products != null) {
          // this.product = products;
          this.productList = products.map(product => ({ id: product.id, name: product.name }));
        }
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  formatDate(date: string) {
    if (!date || date.includes('NaN')) {
      return null; // Handle NaN dates gracefully
    }

    const parsedDate = new Date(date);

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return null; // or return 'Invalid Date' if you prefer
    }
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
  }
  getContract() {
    this.makerService.getContractByVendorId(this.selectedVendorId).subscribe(
      (data: any) => {
        if (data != null) {
          this.contract = data
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
                  this.makerService.getContractByVendorId(this.selectedVendorId).subscribe(
                    (data: any) => {
                      if (data != null) {
                        this.contract = data
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

  onContractFileSelect(event: any) {
    this.files = event.addedFiles;
    this.onChange(this.files);
    this.onTouched();
    console.log('here is the file ' + this.files.at(0)!.name)
  }
  onRemoveContractDocument(event: any) {
    console.log(event);
    this.securityDocument.splice(this.securityDocument.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }
  convertDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onSubmit() {
    const formData = new FormData();
    console.log('here is the contract id you choice ' + this.registerForm.get('contract_id')?.value)
    console.log('submit clicked: ')
    if (
      this.registerForm.valid
      // this.emailChecked &&
      // this.componentMultiProducts.ProductselectedItems.length > 0
    ) {

      if (this.licence_id != null)
        formData.append('id', this.licence_id);

      formData.append('vendor_id', this.registerForm.get('vendor_id')?.value)
      formData.append('contract_id', this.registerForm.get('contract_id')?.value)
      formData.append('product_service_name', this.registerForm.get('product_service_name')?.value);
      formData.append('licence_quantity', this.registerForm.get('licence_quantity')?.value)
      formData.append('product_category', this.registerForm.get('product_category')?.value)
      formData.append('licence_type', this.registerForm.get('licence_type')?.value)
      formData.append('start_date', this.convertDate(this.registerForm.get('start_date')?.value) ?? '');
      formData.append('expiry_date', this.convertDate(this.registerForm.get('expiry_date')?.value) ?? '');
      formData.append('renewal_date', this.convertDate(this.registerForm.get('renewal_date')?.value) ?? '');
      if (this.registerForm.get('total_cost')?.value)
        formData.append('total_cost', parseFloat(this.registerForm.get('total_cost')?.value.replace(/,/g, '')).toString());

      const supportPeriod = this.registerForm.get('support_period')?.value;
      const formatted = `${this.convertDate(supportPeriod[0])} to ${this.convertDate(supportPeriod[1])}`;
      formData.append('support_period', formatted);


      formData.append('additional_info', this.registerForm.get('additional_info')?.value)
      if (this.files.at(0)! != null)
        formData.append('licence_document', this.files.at(0)!);

      this.registerLicence(formData);
      console.log('Data from frontend prepared for backend:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });


    } else this.submitted = true;
  }

  registerLicence(formData: any) {
    this.makerService.registerLicence(formData).subscribe(
      async (data) => {
        if (data == true) {
          this.SuccessSwalRegisterVendor.fire();

          if (this.licence_id != null) {
            this.SuccessSwalUpdateVendor.fire();
            if (this.role_name == "Maker") {
              this.router.navigateByUrl('/view-licence');
            }
            else {
              this.router.navigateByUrl('/view-licence');
            }
            // console.log('update success: ' + data);
          } else {
            this.SuccessSwalRegisterVendor.fire();
            this.router.navigateByUrl('/view-licence');
            this.registerForm.reset();
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
        Swal.fire({
          icon: 'error',
          title: 'There is exception',
          text: 'you have got exception on licence registration',
        });
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
  ngAfterViewInit(): void {
    var that = this;

  }



  openPreviewInNewTab() {
    window.open(this.file_to_preview, '_blank');
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
