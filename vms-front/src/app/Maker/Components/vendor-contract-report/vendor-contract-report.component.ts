import { Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
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
import { phoneNumberValidator } from 'src/app/Admin/validators/phone_number_validator';
import { Vendors } from '../../Payloads/vendors';
import { MakerService } from '../../Services/maker.service';
import { Product } from '../../Payloads/product';
import { services } from '../../Payloads/services';
import { Remark } from '../../Payloads/remark';
// import intlTelInput from 'intl-tel-input';
// import 'intl-tel-input/build/js/utils';

import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import saveAs from 'file-saver';
import { contract } from '../../Payloads/contract';
import { formatDate } from '@angular/common';
import { Reports } from '../../Payloads/report';


declare var window: any;
@Component({
  selector: 'app-vendor-contract-report',
  templateUrl: './vendor-contract-report.component.html',
  styleUrls: ['./vendor-contract-report.component.css']
})
export class VendorContractReportComponent implements OnInit {
  [x: string]: any;
  // @ViewChild(MultiDropdownProductComponent)
  // componentMultiProducts!: MultiDropdownProductComponent;
  // @ViewChild(MultiDropdownServiceComponent)
  // componentMultiService!: MultiDropdownServiceComponent;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterVendor')
  public readonly SuccessSwalRegisterVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdateVendor')
  public readonly SuccessSwalUpdateVendor!: SwalComponent;
  @ViewChild('SuccessSwalUpdatedVendor')
  public readonly SuccessSwalUpdatedVendor!: SwalComponent;

  @Input() reload: boolean = false;
  @Output() reloadComplete = new EventEmitter<boolean>();
  type!: any;

  abcValue: string = '';
  report!: Reports;
  payment_method: any;
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
  // emailChecked: boolean = false;
  registerVendorPayload!: Vendors;
  checkEmailExistPayload!: CheckEmailExistPayload;
  products!: Product[];
  services!: services[];
  vendor!: Vendors[];
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
  ninth_column_title = 'Industry';
  tenth_column_title = 'Posta Number';
  eleventh_column_title = 'Fax Number';
  twelfth_column_title = 'Document';
  thirteenth_column_title = 'General Document Discription';
  fourteenth_column_title = 'status';
  fiveteenth_column_title = 'Change Status';
  sixteenth_column_title = 'Action';



  filteredVendors!: Vendors[];
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
    private activatedRoute: ActivatedRoute
  ) {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    // this.vendor_product = this.activatedRoute.snapshot.paramMap.get('product');
    // this.vendor_service = this.activatedRoute.snapshot.paramMap.get('service');

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
    this.report = {
      id: null,
      contract_start_date_min: '',
      contract_start_date_max: '',
      contract_end_date_min: '',
      contract_end_date_max: '',
      contract_payment_frequency: '',
      contract_payment_date_min: '',
      contract_payment_date_max: '',
      type: ''
    }

    this.registerForm = this.formBuilder.group(
      {
        id: new FormControl('', [
        ]),
        start_date: new FormControl('', [
        ]),
        end_date: new FormControl('', [
        ]),
        payment_date: new FormControl('', [
        ]),
        payment_frequency: new FormControl('', [
        ]),
        searchIn: new FormControl('', [
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

  }
  contractStartDateValueChange(event: any) {
    if (event != undefined) {
      if (event[0] != null) {
        var a = new Date(event[0]);
        this.report.contract_start_date_min = formatDate(a, 'yyyy-MM-dd', 'en-US')
      } else {
        this.report.contract_start_date_min = ''

      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.report.contract_start_date_max = formatDate(b, 'yyyy-MM-dd', 'en-US')
      } else {
        this.report.contract_start_date_max = ''
      }
    } else {
      this.report.contract_start_date_min = ''
      this.report.contract_start_date_max = ''
    }
  }

  contractEndDateValueChange(event: any) {
    if (event != undefined) {
      if (event[0] != null) {
        var a = new Date(event[0]);
        this.report.contract_end_date_min = formatDate(a, 'yyyy-MM-dd', 'en-US')
      } else {
        this.report.contract_end_date_min = ''

      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.report.contract_end_date_max = formatDate(b, 'yyyy-MM-dd', 'en-US')
      } else {
        this.report.contract_end_date_max = ''
      }
    } else {
      this.report.contract_end_date_min = ''
      this.report.contract_end_date_max = ''
    }
  }


  contractPaymentDateValueChange(event: any) {
    if (event != undefined) {
      if (event[0] != null) {
        var a = new Date(event[0]);
        this.report.contract_payment_date_min = formatDate(a, 'yyyy-MM-dd', 'en-US')
      } else {
        this.report.contract_payment_date_min = ''

      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.report.contract_payment_date_max = formatDate(b, 'yyyy-MM-dd', 'en-US')
      } else {
        this.report.contract_payment_date_max = ''
      }
    } else {
      this.report.contract_payment_date_min = ''
      this.report.contract_payment_date_max = ''
    }
  }

  onChange(value: any) {
    this.report.contract_payment_frequency = value.target.value;
  }


  ngOnInit(): void {
    this.makerService.abc$.subscribe(value => {
      this.type = value;
    });
    this.getVendors()

  }

  filterVendors(searchTerm: any) {
    const searchText = searchTerm.target.value.trim().toLowerCase();

    if (searchText !== '') {
      this.filteredVendors = this.vendor.filter(vendor =>
        vendor.name.toLowerCase().includes(searchText)
      );

      if (this.filteredVendors.length > 0) {
        // Assuming you want to take the ID of the first filtered vendor
        const selectedVendorId = this.filteredVendors[0].id;
        console.log("Selected Vendor ID:", selectedVendorId);
        // Assign the selected vendor ID to your report or form control
        this.registerForm.get("id")?.patchValue(this.filteredVendors[0].id);
        this.report.id = selectedVendorId;
      } else if (this.filteredVendors.length > 1) {
        this.registerForm.get("id")?.patchValue(this.filteredVendors[0].id);
      } else {
        // Handle case where no vendors match the search term
        console.log("No vendors found for the search term:", searchText);
        // Optionally reset this.report.id or handle the absence of a selection
        //this.report.id = null; // Example: Reset the selected ID
      }
    } else {
      // Reset to show all vendors if search term is empty
      this.filteredVendors = [...this.vendor];
      this.report.id = null; // Reset the selected ID if search term is cleared
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

  onSubmit() {
  }
  rejectUpdateRequests() {
    this.reason_modal.show();
  }
  onSubmitReason() {
    if (this.reasonForm.valid) {
      this.remark = this.reasonForm.value;

    } else this.submitted = true;
    return true;
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
  timerInterval: any;
  private downloadReportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress:
        // this.uploadStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
        this.progress_download = Math.round(
          (100 * httpEvent.loaded) / httpEvent.total!
        );
        break;
      case HttpEventType.ResponseHeader:
        // console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          for (const filename of httpEvent.body) {
          }
        } else {
          if (!this.preview) {
            console.log('the response is: ' + JSON.stringify(httpEvent));
            saveAs(
              new File(
                [httpEvent.body!],
                'VMS' + this.type,
                {
                  type: `${httpEvent.headers.get(
                    'Content-Type'
                  )};charset=utf-8`,
                }
              )
            );
            Swal.hideLoading();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File downloaded successfully!',
            });
            clearInterval(this.timerInterval);
          } else {
            this.file_to_preview = URL.createObjectURL(httpEvent.body!);
            Swal.hideLoading();
            Swal.close();
          }
        }
        break;
      default:
        console.log('the default' + httpEvent);
    }
  }
  resetAll() {
    this.registerForm.reset();
    this.filteredVendors = this.vendor;
    this.report.contract_payment_frequency = '';

  }
  resetvendor() {
    this.registerForm.get("id")?.patchValue('');
    this.registerForm.get("searchIn")?.patchValue('');
    this.filteredVendors = this.vendor;
  }
  resetStartDate() {
    this.registerForm.get("start_date")?.patchValue('');
    this.report.contract_start_date_min = ''
    this.report.contract_start_date_max = ''
  }
  resetEndDate() {
    this.registerForm.get("end_date")?.patchValue('');
    this.report.contract_end_date_min = ''
    this.report.contract_end_date_max = ''
  }
  resetPaymentDate() {
    this.registerForm.get("payment_date")?.patchValue('');
    this.report.contract_payment_date_min = ''
    this.report.contract_payment_date_max = ''
  }
  resetFrequency() {
    this.registerForm.get("payment_frequency")?.patchValue('');
    this.report.contract_payment_frequency = '';
  }

  previewPdf() {

    //  console.log('Form submitted with vendor ID:', this.registerForm.value.id)
    //   console.log('Form submitted with vendor Name:', this.registerForm.value.name)
    var report_type = 'pdf';
    this.report.id = this.registerForm.get("id")?.value;
    this.report.type = report_type;
    console.log(
      'values' + JSON.stringify(this.report, null, 2)
    );
    if (this.type != undefined) {
      this.preview = true;
      this.progress_download = 0;

      if (this.report.id != '' || this.report.contract_start_date_min != '' || this.report.contract_end_date_min != '' || this.report.contract_payment_date_min != '' || this.report.contract_payment_frequency != '') {
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
        this.makerService
          .downloadReportFiles(
            this.report
          )
          .subscribe(
            (event: any) => {
              console.log('the body: ' + JSON.stringify(event, null, 4));
              this.downloadReportProgress(event);
            },
            (error: HttpErrorResponse) => {
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
              });
              console.log(JSON.stringify(error, null, 4));
              // console.log();
            }
          );
        const date_error = document.getElementById('date_error');
        date_error!.classList.remove('d-block');
        date_error!.classList.add('d-none');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Required',
          text: 'Please select at list one crateria!',
        });
      }
    } else {
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-none');
      date_error!.classList.add('d-block');
    }
  }

  downloadExcel() {
    var report_type = 'excel';
    this.report.id = this.registerForm.get("id")?.value;
    this.report.type = report_type;
    console.log(
      'values' + JSON.stringify(this.report, null, 2)
    );

    if (this.type != undefined) {
      this.preview = false;
      this.progress_download = 0;
     
      if (this.report.id != '' || this.report.contract_start_date_min != '' || this.report.contract_end_date_min != '' || this.report.contract_payment_date_min != '' || this.report.contract_payment_frequency != '') {
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
        this.makerService
          .downloadReportFiles(
            this.report
          )
          .subscribe(
            (event: any) => {
              console.log('the body: ' + JSON.stringify(event, null, 4));
              this.downloadReportProgress(event);
            },
            (error: HttpErrorResponse) => {
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
              });
              console.log(JSON.stringify(error, null, 4));
              // console.log();
            }
          );
        const date_error = document.getElementById('date_error');
        date_error!.classList.remove('d-block');
        date_error!.classList.add('d-none');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Required',
          text: 'Please select at list one crateria!',
        });
      }
    } else {
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-none');
      date_error!.classList.add('d-block');
    }
  }

  downloadPdf() {
    var report_type = 'pdf';
    this.report.id = this.registerForm.get("id")?.value;
    this.report.type = report_type;
    console.log(
      'values' + JSON.stringify(this.report, null, 2)
    );

    if (this.type != undefined) {
      this.preview = false;
    
      if (this.report.id != '' || this.report.contract_start_date_min != '' || this.report.contract_end_date_min != '' || this.report.contract_payment_date_min != '' || this.report.contract_payment_frequency != '') {
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
        this.makerService
          .downloadReportFiles(
            this.report
          )
          .subscribe(
            (event: any) => {
              console.log('the body: ' + JSON.stringify(event, null, 4));
              this.downloadReportProgress(event);
            },
            (error: HttpErrorResponse) => {
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
              });
              console.log(JSON.stringify(error, null, 4));
              // console.log();
            }
          );
        const date_error = document.getElementById('date_error');
        date_error!.classList.remove('d-block');
        date_error!.classList.add('d-none');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Required',
          text: 'Please select at list one crateria!',
        });
      }
    } else {
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-none');
      date_error!.classList.add('d-block');
    }
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
