import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { services } from '../../Payloads/services';
import { MakerService } from '../../Services/maker.service';

@Component({
  selector: 'app-add-issuer-bank',
  templateUrl: './add-issuer-bank.component.html',
  styleUrls: ['./add-issuer-bank.component.css']
})
export class AddIssuerBankComponent implements OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  // refresh_token_requested = false
  // @ViewChild('SwalSessionExpired')
  // public readonly SwalSessionExpired!: SwalComponent

  submitBankForm!: FormGroup;
  submitted: boolean = false;
  servicePayload!: services;
  bank_id: any;

  constructor(
    private service: MakerService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.bank_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.servicePayload = {
      created_date: '',
      id: '',
      name: '',
      created_by: '',
      description: '',
      availability: '',
      status: '',


      // files: [],
    };
    this.submitBankForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(500),
        // Validators.pattern('[a-zA-Z]*'),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),]),
    });
  }

  ngOnInit(): void {
    if (this.bank_id != null) {
      this.getIssuerBank();
    }

    // this.dropdownSettings:IDropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
  }
  getIssuerBank() {
    this.service.getIssuerBank(this.bank_id).subscribe(
      (data: any) => {
        this.servicePayload = data;
        console.log('Result user: ' + JSON.stringify(data, null, 3));
        this.submitBankForm.patchValue(data);

        // this.componentMultiRoles.dropdownList
        // this.role_selected = '2';
        // console.log('selected: ' + data.role);
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
                  //================================================================================
                  this.service.getIssuerBank(this.bank_id).subscribe(
                    (data: any) => {
                      this.submitBankForm.patchValue(data);
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
  }
  submitBank() {
    if (!this.submitBankForm.valid) {
      this.submitted = true;
      return; // Exit early if the form is invalid
    }

    // Prepare the service payload
    const { name, description } = this.submitBankForm.value;
    this.servicePayload = {
      id: this.bank_id || null,
      name,
      description,
      created_by: '',
      created_date: '',
      availability: '',
      status: ''
    };

    console.log('Account payload data:', this.servicePayload);

    // Optimize check by only querying if bank_id is null
    if (this.bank_id == null) {
      this.service.checkIssuerBankExist(name).subscribe((exists: Boolean) => {
        if (exists) {
          Swal.fire({
            icon: 'warning',
            title: 'Duplication not permitted',
            text: 'issuer bank already exists!',
          });
        } else {
          this.AddIssuerBank(this.servicePayload);
        }
      });
    } else {
      // Directly proceed to add/update for existing entries
      this.AddIssuerBank(this.servicePayload);
    }
  }

  // this.service.postCurrencyRequest(currencyPayload).subscribe((data) => {
  //   console.log(data);
  //   this.router.navigate(['/currency-list']);
  // });

  AddIssuerBank(servicePayload: services) {
    this.service.addIssuerBank(servicePayload).subscribe(
      (data) => {
        if (data == true) {
          if (this.bank_id != null) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Issuer bank updated successfully!',
            });
            this.router.navigateByUrl('/maker/view-issuer-bank');
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Issuer bank saved successfully!',
            });
            this.submitBankForm.reset();
            this.submitted = false;
            // console.log('register success: ' + data);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Permission Denied',
            text: 'User does not have permission to  add issuer bank!',
          });
        }

        // this.router.navigate(['/currency-list']);
      }, (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (this.localStorageService.retrieve('refresh_token_requested') ==
            null) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.service.addIssuerBank(servicePayload).subscribe(
                    (data) => {
                      if (data == true) {
                        if (this.bank_id != null) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Directorate updated successfully!',
                          });
                          this.router.navigateByUrl('/maker/view-directorate');
                        } else {
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Directorate saved successfully!',
                          });
                          this.submitBankForm.reset();
                          this.submitted = false;
                          // console.log('register success: ' + data);
                        }
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Permission Denied',
                          text: 'User does not have permission to  add directorate!',
                        });
                      }
                      // this.router.navigate(['/currency-list']);
                    }, (error: any) => {
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


                    });
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
          if (error.error.text === 'currency already registered') {

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'currency already exist!',
            });
          }
          console.log(JSON.stringify(error.error.apierror, null, 2));
        }
      })

  }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data: any) => {
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
      (error: any) => {
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
