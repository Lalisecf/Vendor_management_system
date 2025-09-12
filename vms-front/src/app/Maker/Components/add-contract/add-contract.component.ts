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

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddContractComponent),
      multi: true
    },
    DatePipe
  ]
})
export class AddContractComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  authservice(): any {
    throw new Error('Method not implemented.');
  }
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor')
  public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor')
  public readonly SuccessSwalUpdateVendor!: SwalComponent;
  contract_id: any;
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
  dtOptions_currentContract: any
  vendor: any[] = [];
  ContractTypes: any[] = [];
  Directorates: any[] = [];
  IssuerBanks: any[] = [];
  PaymentStatus: any[] = [];
  contractType: any;
  directorate: any;
  issuerBank: any;
  files: File[] = [];
  paymentConfirmation: File[] = [];
  securityDocument: File[] = [];
  SLADocument: File[] = [];
  onChange: any = () => { };
  onTouched: any = () => { };
  start_date: any;
  end_date: any;
  maxDate!: Date;
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
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private makerService: MakerService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.contract_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.request_type = this.activatedRoute.snapshot.queryParams['requestType']

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.checkEmailExistPayload = {
      email: '',
    };
    this.serviceDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true
    };

    this.ProductDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true
    };

    this.registerForm = this.formBuilder.group(
      {
        contract_title: new FormControl('', [
          Validators.required,
        ]),
        vendor_name: new FormControl('', [
          Validators.required,
        ]),
        contract_type: new FormControl('', [
          Validators.required
        ]),
        // service: [[]
        // Validators.required
        // ],
        // product: [[]
        // Validators.required
        // ],
        directorate: new FormControl('', [
          Validators.required
        ]),
        start_date: new FormControl('', [
          Validators.required
        ]),
        end_date: new FormControl('', [
          Validators.required
        ]),
        total_amount: new FormControl('', [
          Validators.required
        ]),
        vat: new FormControl('No'),
        sla: new FormControl('No'),

        bond_amount: new FormControl('', [
        ]),
        bond_expiry_date: new FormControl('', [
        ]),
        issuer_bank: new FormControl('', [

        ]),
        security_document: new FormControl(null, [
          // Validators.required
        ]),
        // renewal_termination_option: new FormControl('', [
        //   // Validators.required
        // ]),
        // security_document_descreption: new FormControl('', [
        //   // Validators.required
        // ]),
        payment_method: new FormControl('', [
          Validators.required
        ]),
        // payment_frequency: new FormControl('', [
        //   Validators.required
        // ]),
        currency: new FormControl('', [
          Validators.required
        ]),
        // amount_per_frequency: new FormControl('', [
        //   Validators.required
        // ]),
        // late_penality_fee: new FormControl('', [
        //   // Validators.required
        // ]),
        // payment_status: new FormControl('', [
        //   Validators.required
        // ]),
        // payment_term_condition: new FormControl('', [
        //   // Validators.required
        // ]),
        // payment_start_date: new FormControl('', [
        //   // Validators.required
        // ]),
        // payment_end_date: new FormControl('', [
        //   // Validators.required
        // ]),
        // payment_condition: new FormControl('', [
        //   Validators.required
        // ]),
        // date: new FormControl('', [
        //   // Validators.required
        // ]),
        // paid_amount: new FormControl('', [
        //   // Validators.required
        // ]),
        // sla_description: new FormControl('', [
        //   // Validators.required
        // ]),
        // phase1: new FormControl('', [
        //   Validators.required
        // ]),
        // phase2: new FormControl('', [
        //   Validators.required
        // ]),
        // phase3: new FormControl('', [
        //   Validators.required
        // ]),
        // phase4: new FormControl('', [
        //   Validators.required
        // ]),
        // phase5: new FormControl('', [
        //   Validators.required
        // ]),
        payments: this.formBuilder.array([this.createPaymentGroup()]) // FormArray for phased payments
      },
      { validators: phoneNumberValidator.MatchValidator },

    );
  }

  // createPaymentGroup(paymentTerm: string = 'Payment 1'): FormGroup {
  //   return this.formBuilder.group({
  //     paymentTerm: [paymentTerm, Validators.required],
  //     amount: ['', [Validators.required, Validators.min(1)]],
  //     dueDate: ['', Validators.required],
  //     paymentDescription:[''],
  //   });
  // }

  createPaymentGroup(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      paymentTerm: [`Payment ${this.payments?.length ? this.payments.length + 1 : 1}`],
      amount: ['', [Validators.min(1)]],
      dueDate: [''],
      paymentDescription: ['']
    });
  }
  // Getter for payments FormArray
  get payments(): FormArray {
    return this.registerForm?.get('payments') as FormArray;
  }

  // addPayment(): void {
  //   const paymentGroup = this.formBuilder.group({
  //     paymentTerm: [`Payment ${this.payments.length + 1}`, Validators.required],
  //     amount: ['', [Validators.required, Validators.min(1)]],
  //     dueDate: ['', Validators.required],
  //     paymentDescription:[''],
  //   });
  //   this.payments.push(paymentGroup);
  // }

  addPayment(): void {
    const paymentGroup = this.createPaymentGroup();
    this.payments.push(paymentGroup);
  }

  // Method to remove a payment
  removePayment(index: number): void {
    if (this.payments.length === 1) {
      console.log('Cannot remove the last payment.');
      return; // Prevent removal if only one payment exists
    }
    this.payments.removeAt(index);
    console.log(`Payment removed. Remaining payments: ${this.payments.length}`);
  }

  fetchPaymentsByContractId(contractId: number): void {
    this.makerService.getPaymentsByContractId(contractId).subscribe(
      (data: payments[]) => {
        // Patch the fetched payment data into the form
        if (data != null) {
          console.log('gdfgfd' + data[0].paymentTerm)
          this.patchPayments(data);
        }
      },
      (error) => {
        console.error('Error fetching payments:', error);
      }
    );
  }
  fetchTempPaymentsByContractId(contractId: number): void {
    this.makerService.getTempPaymentsByContractId(contractId).subscribe(
      (data: payments[]) => {
        // Patch the fetched payment data into the form
        if (data != null) {
          console.log('gdfgfd' + data[0].paymentTerm)
          this.patchPayments(data);
        }
      },
      (error) => {
        console.error('Error fetching payments:', error);
      }
    );
  }
  patchPayments(paymentData: payments[]): void {
    // Clear the existing form array
    this.payments.clear();

    // Add each payment to the form array
    paymentData.forEach((payments) => {
      const paymentGroup = this.createPaymentGroup();
      paymentGroup.patchValue(payments); // Patch the fetched data into the form group
      if (this.contract_id != null) {
        // If it's an update, include the ID in the form control, but don't allow it to be edited
        paymentGroup.addControl('id', new FormControl(payments.id));
      }
      this.payments.push(paymentGroup);
    });
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
    this.registerForm.get('total_amount')?.valueChanges.subscribe((value) => {
      // this.calculateTax(value);

      const totalAmount = parseFloat(this.registerForm.get('total_amount')?.value.replace(/,/g, '')) * 0.1
      this.registerForm.get('bond_amount')?.setValue(totalAmount.toFixed(2))
    });

    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (item.name == "Checker") {
        this.role_name = "Checker";

      } else {
        this.role_name = "Maker";
      }
    }
    if (this.contract_id != null && this.authService.isMaker()) {
      this.getContract();
      this.fetchPaymentsByContractId(this.contract_id);

    }

    if (this.contract_id != null && this.request_type != undefined && this.authService.isChecker()) {
      this.getOldContract();
      this.getTempOrAddendumContract();
      this.fetchTempPaymentsByContractId(this.contract_id);
      // this.registerForm.disable();
    }
    this.getVendors();
    this.getContractType();
    this.getPaymentStatus();
    this.getDirectorates();
    this.getIssuerBanks();

  }
  getOldContract() {
    this.dtOptions_currentContract = {
      serverSide: false,
      scrollX: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.makerService.getContractById(this.contract_id).subscribe(
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
                        .getContractById(this.contract_id).subscribe(
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
        { title: 'Contract Title', data: 'contract_title' },
        { title: 'Vendor Name', data: 'name_vendor' },
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
              // this.save_as = "Contract_Document";
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
          this.toggleCurrentPaymentDetails(row, data);
        });
      },
    };
  }
  toggleCurrentPaymentDetails(row: any, data: any) {
    const table = $('#current_contract').DataTable();
    const tr = $(row).closest('tr');
    const rowData = table.row(tr);

    if (rowData.child.isShown()) {
      rowData.child.hide();
      tr.removeClass('shown');
    } else {
      // Fetch payment details from the API
      this.makerService.getPaymentDetail(data.id).subscribe((paymentData: any) => {
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

  getIssuerBanks() {
    this.IssuerBanks = [];
    this.makerService.getAllIssuerBanks().subscribe(
      (IssuerBanks: Array<Product>) => {
        if (IssuerBanks != null) {
          for (var i = 0; i < IssuerBanks.length; i++) {
            if (IssuerBanks[i].status == '1') {
              this.IssuerBanks.push(IssuerBanks[i])
            }
            console.log(
              'Contract type data: ' + JSON.stringify(this.IssuerBanks, null, 2)
            );
          }

          // this.dropdownList = vendors.filter(vendor => vendor.status !== '0').map(vendor => ({ id: vendor.id, name: vendor.name }));
        }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }

  getDirectorates() {
    this.Directorates = [];
    this.makerService.getAllDirectorates().subscribe(
      (Directorates: Array<Product>) => {
        if (Directorates != null) {
          for (var i = 0; i < Directorates.length; i++) {
            if (Directorates[i].status == '1') {
              this.Directorates.push(Directorates[i])
            }
            console.log(
              'Contract type data: ' + JSON.stringify(this.Directorates, null, 2)
            );
          }

          // this.dropdownList = vendors.filter(vendor => vendor.status !== '0').map(vendor => ({ id: vendor.id, name: vendor.name }));
        }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }

  getContractType() {
    this.ContractTypes = [];
    this.makerService.getAllContractTypes().subscribe(
      (ContractTypes: Array<Product>) => {
        if (ContractTypes != null) {
          for (var i = 0; i < ContractTypes.length; i++) {
            if (ContractTypes[i].status == '1') {
              this.ContractTypes.push(ContractTypes[i])
            }
            console.log(
              'Contract type data: ' + JSON.stringify(this.ContractTypes, null, 2)
            );
          }

          // this.dropdownList = vendors.filter(vendor => vendor.status !== '0').map(vendor => ({ id: vendor.id, name: vendor.name }));
        }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }

  getPaymentStatus() {
    this.PaymentStatus = [];
    this.makerService.getAllPaymentstatus().subscribe(
      (PaymentStatus: Array<Product>) => {
        if (PaymentStatus != null) {
          for (var i = 0; i < PaymentStatus.length; i++) {
            if (PaymentStatus[i].status == '1') {
              this.PaymentStatus.push(PaymentStatus[i])
            }
            console.log(
              'Contract type data: ' + JSON.stringify(this.ContractTypes, null, 2)
            );
          }

          // this.dropdownList = vendors.filter(vendor => vendor.status !== '0').map(vendor => ({ id: vendor.id, name: vendor.name }));
        }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
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
  contracttypeChange(event: any) {
    console.log('gfhjhggggggggggg ' + event.target.value)
    this.contractType = event.target.value
  }
  changeDirectorate(event: any) {
    console.log('directorate ' + event.target.value)
    this.directorate = event.target.value
  }
  changeIssuerBank(event: any) {
    console.log('issuer bank ' + event.target.value)
    this.issuerBank = event.target.value
  }
  onVendorSelectionChange() {
    this.selectedVendorId = this.registerForm.get('vendor_name')?.value;
    // this.fetchServicesForVendor(this.selectedVendorId)
    // this.fetchProductsForVendor(this.selectedVendorId)
    console.log('vendor id-----' + this.selectedVendorId)
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

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
    this.onVendorSelectionChange();
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
    this.makerService.getContractById(this.contract_id).subscribe(
      (data: any) => {
        this.status = data.status;

        const num = data.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts = num.split('.'); // Split the number into parts before and after decimal
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.total_amount = parts.join('.');


        const num2 = data.bond_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts2 = num2.split('.'); // Split the number into parts before and after decimal
        parts2[0] = parts2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.bond_amount = parts2.join('.');

        // const kk = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        // const partss = kk.split('.'); // Split the number into parts before and after decimal
        // partss[0] = partss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        // data.paid_amount=partss.join('.');

        // const kkk = data.late_penality_fee.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        // const partsss = kkk.split('.'); // Split the number into parts before and after decimal
        // partsss[0] = partsss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        // data.late_penality_fee=partsss.join('.');
        console.log('vendor--------------------vendor--------------------------------- ' + data.vendor_name);
        console.log('Result Vendor: ' + JSON.stringify(data, null, 3));
        if (data.start_date === 'NaN-aN-aN') {
        }
        else
          data.start_date = this.formatDate(data.start_date);
        if (data.end_date === 'NaN-aN-aN') { }
        else
          data.end_date = this.formatDate(data.end_date);

        if (data.bond_expiry_date === 'NaN-aN-aN') { }
        else
          data.bond_expiry_date = this.formatDate(data.bond_expiry_date);
        // if (data.payment_start_date === 'NaN-aN-aN') { }
        // else
        //   data.payment_start_date = this.formatDate(data.payment_start_date);
        console.log('here iiss info ' + JSON.stringify(data))
        data.date = this.formatDate(data.date);
        this.registerForm.patchValue(data);
        // this.registerForm.get('vendor_name')?.patchValue(data.vendor_name);
        // console.log('the length of products: ' + data.products.length);
        // let tmp1: any[] = [];
        // for (let i = 0; i < data.products.length; i++) {
        //   if (data.products[i].status != null)
        //     tmp1.push({ id: data.products[i].id, name: data.products[i].name });
        // }
        // this.selectedProducts = tmp1;
        // let tmp2: any[] = [];
        // for (let i = 0; i < data.services.length; i++) {
        //   if (data.services[i].status != null)
        //     tmp2.push({ id: data.services[i].id, name: data.services[i].name });
        // }
        // this.selectedServices = tmp2;
        this.onVendorSelectionChange()
        // console.log(
        //   'selected items: ' +
        //   JSON.stringify(this.componentMultiProducts.ProductselectedItems)
        // );
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

                      const kk = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      const partss = kk.split('.'); // Split the number into parts before and after decimal
                      partss[0] = partss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      data.paid_amount = partss.join('.');

                      const kkk = data.late_penality_fee.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      const partsss = kkk.split('.'); // Split the number into parts before and after decimal
                      partsss[0] = partsss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      data.late_penality_fee = partsss.join('.');


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

  getTempOrAddendumContract() {
    this.makerService.getTempContractById(this.contract_id).subscribe(
      (data: any) => {
        this.status = data.status;

        const num = data.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts = num.split('.'); // Split the number into parts before and after decimal
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.total_amount = parts.join('.');


        const num2 = data.bond_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
        const parts2 = num2.split('.'); // Split the number into parts before and after decimal
        parts2[0] = parts2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

        data.bond_amount = parts2.join('.');
        console.log('vendor--------------------vendor--------------------------------- ' + data.vendor_name);
        console.log('Result Vendor: ' + JSON.stringify(data, null, 3));
        if (data.start_date === 'NaN-aN-aN') {
        }
        else
          data.start_date = this.formatDate(data.start_date);
        if (data.end_date === 'NaN-aN-aN') { }
        else
          data.end_date = this.formatDate(data.end_date);
        if (data.bond_expiry_date === 'NaN-aN-aN') { }
        else
          data.bond_expiry_date = this.formatDate(data.bond_expiry_date);
        console.log('here iiss info ' + JSON.stringify(data))
        data.date = this.formatDate(data.date);
        this.registerForm.patchValue(data);
        this.onVendorSelectionChange()
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
                  this.makerService.getTempContractById(this.contract_id).subscribe(
                    (data: any) => {
                      const num = data.total_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      const parts = num.split('.'); // Split the number into parts before and after decimal
                      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      data.total_amount = parts.join('.');

                      const kk = data.paid_amount.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      const partss = kk.split('.'); // Split the number into parts before and after decimal
                      partss[0] = partss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      data.paid_amount = partss.join('.');

                      const kkk = data.late_penality_fee.toString().replace(/,/g, ''); // Convert to string and remove existing commas
                      const partsss = kkk.split('.'); // Split the number into parts before and after decimal
                      partsss[0] = partsss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part

                      data.late_penality_fee = partsss.join('.');


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

  onSecurityFileSelect(event: any) {
    this.securityDocument = event.addedFiles;
    this.onChange(this.securityDocument);
    this.onTouched();
    console.log('here is the file ' + this.securityDocument.at(0)!.name)

  }

  onSLAFileSelect(event: any) {
    this.SLADocument = event.addedFiles;
    this.onChange(this.SLADocument);
    this.onTouched();
    console.log('here is the file ' + this.SLADocument.at(0)!.name)

  }

  onRemoveSLADocument(event: any) {
    console.log(event);
    this.SLADocument.splice(this.SLADocument.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }
  onPaymentConfirmationFileSelect(event: any) {
    this.paymentConfirmation = event.addedFiles;
    this.onChange(this.paymentConfirmation);
    this.onTouched();
    console.log('here is the file ' + this.paymentConfirmation.at(0)!.name)
  }
  onContractFileSelect(event: any) {
    this.files = event.addedFiles;
    this.onChange(this.files);
    this.onTouched();
    console.log('here is the file ' + this.files.at(0)!.name)
  }
  onRemoveSecurityDocument(event: any) {
    console.log(event);
    this.securityDocument.splice(this.securityDocument.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }

  onRemovePaymentConfirmationDocument(event: any) {
    console.log(event);
    this.paymentConfirmation.splice(this.paymentConfirmation.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }
  onRemoveContractDocument(event: any) {
    console.log(event);
    this.securityDocument.splice(this.securityDocument.indexOf(event), 1);
    this.onChange(event);
    this.onTouched();
  }
  convertDate(str: string) {
    var date = new Date(str);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join('-');
  }
  onSubmit() {
    const formData = new FormData();

    console.log('submit clicked: ')
    if (

      this.registerForm.valid
      // this.emailChecked &&
      // this.componentMultiProducts.ProductselectedItems.length > 0
    ) {
      // var service: any[] = [];
      // var product: any[] = [];
      // for (var i = 0; i < this.selectedServices.length; i++) {
      //   console.log('selected service item: ' + this.selectedServices[i].id);
      //   service.push(this.selectedServices[i].id.toLocaleString().replace(',', ''));
      // }

      // for (var i = 0; i < this.selectedProducts.length; i++) {
      //   console.log('selected product item: ' + this.selectedProducts[i].id);
      //   product.push(this.selectedProducts[i].id.toLocaleString().replace(',', ''));
      // }

      if (this.contract_id != null)
        formData.append('id', this.contract_id);

      formData.append('contract_title', this.registerForm.get('contract_title')?.value)
      formData.append('vendor_id', this.selectedVendorId);
      formData.append('contract_type', this.registerForm.get('contract_type')?.value);
      // formData.append('product_id', product.toLocaleString());
      // formData.append('service_id', service.toLocaleString());
      formData.append('directorate', this.registerForm.get('directorate')?.value)
      formData.append('start_date', this.convertDate(this.registerForm.get('start_date')?.value));
      formData.append('end_date', this.convertDate(this.registerForm.get('end_date')?.value));
      if (this.registerForm.get('total_amount')?.value)
        formData.append('total_amount', parseFloat(this.registerForm.get('total_amount')?.value.replace(/,/g, '')).toString());
      formData.append('currency', this.registerForm.get('currency')?.value);
      formData.append('vat', this.registerForm.get('vat')?.value);
      formData.append('sla', this.registerForm.get('sla')?.value);
      if (this.files.at(0)! != null)
        formData.append('contract_document_document', this.files.at(0)!);
      // if (this.registerForm.get('renewal_termination_option')?.value)
      //   formData.append('renewal_termination_option', this.registerForm.get('renewal_termination_option')?.value);
      formData.append('bond_amount', parseFloat(this.registerForm.get('bond_amount')?.value.replace(/,/g, '')).toString());
      formData.append('bond_expiry_date', this.convertDate(this.registerForm.get('bond_expiry_date')?.value));
      formData.append('issuer_bank', this.registerForm.get('issuer_bank')?.value)
      if (this.securityDocument.at(0)! != null)
        formData.append('security_document', this.securityDocument.at(0)!);
      // if (this.registerForm.get('security_document_descreption')?.value)
      //   formData.append('security_document_descreption', this.registerForm.get('security_document_descreption')?.value);
      formData.append('payment_method', this.registerForm.get('payment_method')?.value);
      // formData.append('payment_frequency', this.registerForm.get('payment_frequency')?.value);

      if (this.request_type != undefined) {
        formData.append('request_type', this.request_type);
        formData.append('requested_by', this.localStorageService.retrieve('user'))
      }
      // if (this.registerForm.get('amount_per_frequency')?.value)
      //   formData.append('amount_per_frequency', parseFloat(this.registerForm.get('amount_per_frequency')?.value.replace(/,/g, '')).toString());
      // if (this.registerForm.get('late_penality_fee')?.value)
      //   formData.append('late_penality_fee', parseFloat(this.registerForm.get('late_penality_fee')?.value.replace(/,/g, '')).toString());
      // formData.append('payment_status', this.registerForm.get('payment_status')?.value);
      // if (this.registerForm.get('payment_term_condition')?.value)
      // formData.append('payment_term_condition', this.registerForm.get('payment_term_condition')?.value);
      // formData.append('payment_start_date', this.convertDate(this.registerForm.get('payment_start_date')?.value));
      // formData.append('payment_end_date', this.convertDate(this.registerForm.get('payment_end_date')?.value));
      // formData.append('payment_condition', this.registerForm.get('payment_condition')?.value);
      // if (this.paymentConfirmation.at(0)! != null)
      //   formData.append('payment_confirmation_document', this.paymentConfirmation.at(0)!);
      // formData.append('date', this.convertDate(this.registerForm.get('date')?.value));
      // if (this.registerForm.get('paid_amount')?.value)
      //   formData.append('paid_amount', parseFloat(this.registerForm.get('paid_amount')?.value.replace(/,/g, '')).toString());
      // if (this.registerForm.get('phase1')?.value)
      //   formData.append('phase1', parseFloat(this.registerForm.get('phase1')?.value.replace(/,/g, '')).toString());
      // if (this.registerForm.get('phase2')?.value)
      //   formData.append('phase2', parseFloat(this.registerForm.get('phase2')?.value.replace(/,/g, '')).toString());
      // if (this.registerForm.get('phase3')?.value)
      //   formData.append('phase3', parseFloat(this.registerForm.get('phase3')?.value.replace(/,/g, '')).toString());
      // if (this.registerForm.get('phase4')?.value)
      //   formData.append('phase4', parseFloat(this.registerForm.get('phase4')?.value.replace(/,/g, '')).toString());
      // if (this.registerForm.get('phase5')?.value)
      //   formData.append('phase5', parseFloat(this.registerForm.get('phase5')?.value.replace(/,/g, '')).toString());
      // formData.append('SLA_description', this.registerForm.get('sla_description')?.value);
      // if (this.SLADocument.at(0)! != null)
      //   formData.append('SLA_document', this.SLADocument.at(0)!);


      if (this.contract_id != null)
        formData.append('status', this.status);

      // Loop through payments and send them as a JSON string

      // console.log(`Payment ${index + 1}:`, payment.value);

      const paymentsArray = this.payments.controls.map(payment => ({
        paymentTerm: payment.get('paymentTerm')?.value,
        amount: payment.get('amount')?.value,
        dueDate: this.convertDate(payment.get('dueDate')?.value),
        paymentDescription: payment.get('paymentDescription')?.value,
        id: payment.get('id')?.value // Include the ID for update

      }));

      // Append the payment data as a JSON string
      formData.append(`payment`, JSON.stringify(paymentsArray));
      // console.log('here is payment data '+JSON.stringify(paymentData));

      console.log('here is payment data ' + JSON.stringify(formData));
      this.registerContract(formData);
      console.log('Data from frontend prepared for backend:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      // console.log('payment prepared for backend:');
      // this.payments.controls.forEach((payment, index) => {
      //   console.log(`Payment ${index + 1}:`, payment.value);
      // });

    } else this.submitted = true;
  }

  registerContract(formData: any) {
    console.log(
      'Payload: ' + JSON.stringify(this.registerVendorPayload, null, 2)
    );
    this.makerService.registerContract(formData).subscribe(
      async (data) => {
        if (data == true) {
          this.SuccessSwalRegisterVendor.fire();

          if (this.contract_id != null) {
            this.SuccessSwalUpdateVendor.fire();
            if (this.role_name == "Maker") {
              this.router.navigateByUrl('/maker/view-contracts');
            }
            else {
              this.router.navigateByUrl('/checker/view-contracts');
            }
            // console.log('update success: ' + data);
          } else {
            this.SuccessSwalRegisterVendor.fire();
            this.router.navigateByUrl('/maker/view-contracts');
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
                        if (this.contract_id != null) {
                          this.router.navigateByUrl('/maker/view-vendors');
                          // console.log('update success: ' + data);
                        } else {
                          this.SuccessSwalRegisterVendor.fire();
                          this.router.navigateByUrl('/maker/view-vendors');
                          this.registerForm.reset();
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
  ngAfterViewInit(): void {
    var that = this;
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('download-file-contract')) {
        that.save_as = 'contract-document'
        var addendum_contract_id = event.target.getAttribute('download-file-contract')
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
        this.makerService.downloadContractFiles(addendum_contract_id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      } else if (event.target.hasAttribute('preview-contract-document')) {
        var contract_id = event.target.getAttribute('preview-contract-document')
        this.makerService.downloadContractFiles(contract_id).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

      } else if (event.target.hasAttribute('download-file')) {
        var contract_id = event.target.getAttribute('download-file')
        that.save_as = 'bond-document';
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
        this.makerService.downloadSecuritytFiles(contract_id).subscribe((event: any) => {
          this.preview = false;
          this.downloadProgress(event);
        });

      }

      else if (event.target.hasAttribute('preview-security-document')) {
        var contract_id = event.target.getAttribute('preview-security-document')
        this.makerService.downloadSecuritytFiles(contract_id).subscribe((event: any) => {
          this.preview = true;
          this.downloadProgress(event);
        });

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
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
