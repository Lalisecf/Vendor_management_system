import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Product } from '../../Payloads/product';
import { MakerService } from '../../Services/maker.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-contract-type',
  templateUrl: './add-contract-type.component.html',
  styleUrls: ['./add-contract-type.component.css']
})
export class AddContractTypeComponent implements OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterContractType')
  public readonly SuccessSwalRegisterContractType!: SwalComponent;
  @ViewChild('SuccessSwalUpdateContractType')
  public readonly SuccessSwalUpdateContractType!: SwalComponent;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  contract_type_id: any;
  user_role: any;
  slect_role: boolean = false;

  //form and other
  registerForm!: FormGroup;
  submitted: boolean = false;
  emailChecked: boolean = false;
  registerContractTypePayload!: Product;
  // checkEmailExistPayload!: CheckEmailExistPayload;
  // roles!: Roles[];
  role_selected!: string;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private makerService: MakerService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.contract_type_id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.user_role = this.activatedRoute.snapshot.paramMap.get('role');
    // this.checkEmailExistPayload = {
    //   email: '',
    // };
    this.registerContractTypePayload = {
      id: null,
      name: '',
      description: '',
      status: '',
      availability: ''
    };
    // this.role_selected = '1';

    this.registerForm = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required,
        ]),
        description: new FormControl('', [
          Validators.required,
        ]),
      },
      // { validators: phoneNumberValidator.MatchValidator }
    );
  }
  ngOnInit(): void {
    if (this.contract_type_id != null) {
      this.getContractType();
    }
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  rrr: any;
  getContractType() {
    this.makerService.getContractType(this.contract_type_id).subscribe(
      (data: any) => {
        this.user = data;
        console.log('Result user: ' + JSON.stringify(data, null, 3));
        this.registerForm.patchValue(data);
        console.log('the length of roles: ' + data.roles.length);
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
                  this.makerService.getContractType(this.contract_type_id).subscribe(
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



  onSubmit() {
    if (
      this.registerForm.valid
    ) {
      this.registerContractTypePayload = this.registerForm.value;
      if (this.contract_type_id != null) this.registerContractTypePayload.id = this.contract_type_id;
      console.log('==================dsdfdsf')
      this.registerContractType(this.registerContractTypePayload);
    } else this.submitted = true;
  }

  registerContractType(registerActorPayload: Product) {
    console.log(
      'Payload: ' + JSON.stringify(this.registerContractTypePayload, null, 2)
    );
    this.makerService.registerContractType(registerActorPayload).subscribe(
      async (data) => {
        if (data == true) {
          this.SuccessSwalRegisterContractType.fire();

          if (this.contract_type_id != null) {
            this.SuccessSwalUpdateContractType.fire();
            this.router.navigateByUrl('/maker/view-contract-type');
            // console.log('update success: ' + data);
          } else {
            this.SuccessSwalRegisterContractType.fire();
            this.registerForm.reset();
            this.router.navigateByUrl('/maker/view-contract-type');
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
                  this.makerService.registerContractType(registerActorPayload).subscribe(
                    async (data) => {
                      if (data == true) {
                        this.SuccessSwalUpdateContractType.fire();
                        if (this.contract_type_id != null) {
                          this.router.navigateByUrl('/maker/add-contract-type');
                          // console.log('update success: ' + data);
                        } else {
                          this.SuccessSwalRegisterContractType.fire();
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
          if (error.error.text == 'cannot-send-password-to-the-user') {
            Swal.fire({
              icon: 'warning',
              title: 'failed to send the password to the user!',
              text: 'The system could not send the password to the user. Please resend the password from users page by clicking on reset password button.',
            });
            this.registerForm.reset();
            this.registerForm.controls['gender'].setValue('Male');
            this.submitted = false;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            console.log('it is here 1' + JSON.stringify(error, null, 2));
          }
          console.log(JSON.stringify(error, null, 2));
        }
      }
    );
  }

  // checkEmailExist(email: string) {
  //   this.emailChecked = true;
  //   this.checkEmailExistPayload.email = email;
  //   if (
  //     this.checkEmailExistPayload.email !== null &&
  //     this.checkEmailExistPayload.email !== ''
  //   ) {
  //     this.adminService.checkEmailExist(this.checkEmailExistPayload).subscribe(
  //       (data: Boolean) => {
  //         document.getElementById('valid-email')?.classList.remove('d-none');
  //         document.getElementById('invalid-email')?.classList.remove('d-none');
  //         if (
  //           data === false ||
  //           (this.contract_type_id != null &&
  //             this.registerForm.controls['email'].value == this.user.email)
  //         ) {
  //           document.getElementById('valid-email')?.classList.remove('d-block');
  //           document.getElementById('valid-email')?.classList.add('d-none');
  //           document.getElementById('invalid-email')?.classList.add('d-block');
  //           document
  //             .getElementById('invalid-email')
  //             ?.classList.remove('d-none');
  //           this.emailChecked = true;
  //         } else {
  //           document.getElementById('valid-email')?.classList.remove('d-none');
  //           document.getElementById('valid-email')?.classList.add('d-block');
  //           document.getElementById('invalid-email')?.classList.add('d-none');
  //           document
  //             .getElementById('invalid-email')
  //             ?.classList.remove('d-block');
  //           this.emailChecked = false;
  //         }
  //         console.log('check email exist response: ' + data);
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
  //                   if (
  //                     this.checkEmailExistPayload.email !== null &&
  //                     this.checkEmailExistPayload.email !== ''
  //                   ) {
  //                     this.adminService
  //                       .checkEmailExist(this.checkEmailExistPayload)
  //                       .subscribe(
  //                         (data: Boolean) => {
  //                           document
  //                             .getElementById('valid-email')
  //                             ?.classList.remove('d-none');
  //                           document
  //                             .getElementById('invalid-email')
  //                             ?.classList.remove('d-none');
  //                           if (data === false) {
  //                             document
  //                               .getElementById('valid-email')
  //                               ?.classList.remove('d-block');
  //                             document
  //                               .getElementById('valid-email')
  //                               ?.classList.add('d-none');
  //                             document
  //                               .getElementById('invalid-email')
  //                               ?.classList.add('d-block');
  //                             document
  //                               .getElementById('invalid-email')
  //                               ?.classList.remove('d-none');
  //                             this.emailChecked = true;
  //                           } else {
  //                             document
  //                               .getElementById('valid-email')
  //                               ?.classList.remove('d-none');
  //                             document
  //                               .getElementById('valid-email')
  //                               ?.classList.add('d-block');
  //                             document
  //                               .getElementById('invalid-email')
  //                               ?.classList.add('d-none');
  //                             document
  //                               .getElementById('invalid-email')
  //                               ?.classList.remove('d-block');
  //                             this.emailChecked = false;
  //                           }
  //                           console.log('check email exist response: ' + data);
  //                         },
  //                         (error: any) => {
  //                           if (error.error.text === 'access-token-expired') {
  //                             console.log('refresh token expired.');
  //                             this.SwalSessionExpired.fire();
  //                             this._refreshTokenExpired();
  //                           } else {
  //                             Swal.fire({
  //                               icon: 'error',
  //                               title: 'Oops...',
  //                               text: 'Something went wrong!',
  //                             });
  //                             console.log(
  //                               JSON.stringify(error.error.apierror, null, 2)
  //                             );
  //                           }
  //                         }
  //                       );
  //                   } else {
  //                     document
  //                       .getElementById('invalid-email')
  //                       ?.classList.add('d-none');
  //                     document
  //                       .getElementById('valid-email')
  //                       ?.classList.add('d-none');
  //                     this.emailChecked = false;
  //                     console.log('email is empty:::::::::::::::::::::');
  //                   }
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
  //   } else {
  //     document.getElementById('invalid-email')?.classList.add('d-none');
  //     document.getElementById('valid-email')?.classList.add('d-none');
  //     this.emailChecked = false;
  //   }
  // }
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