import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Location } from 'ngx-bootstrap/utils/facade/browser';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription, fromEvent, merge, switchMap, timer, interval } from 'rxjs';
import { ChangePasswordPayload } from 'src/app/Admin/payloads/change_password_payload';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { CheckerViewVendorsComponent } from 'src/app/Checker/Component/checker-view-vendors/checker-view-vendors.component';
import { CheckerService } from 'src/app/Checker/Services/checker.service';
import { Remark } from 'src/app/Maker/Payloads/remark';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { ManagerService } from 'src/app/Manager/Services/manager.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { createPasswordMatchValidator } from 'src/app/utils_/validators/password_match_validator';
import { createPasswordStrengthValidator } from 'src/app/utils_/validators/validator_password_strength';
import Swal from 'sweetalert2';

var executeOnIdle = (that: any, idleThreshold: number) => {
  console.log('final idle============' + idleThreshold)
  const userActivity$ = merge(
    fromEvent(window, 'mousemove'),
    fromEvent(window, 'keydown'),
    fromEvent(window, 'click')
  );
  const idleTimer$ = timer(idleThreshold);
  const idle$ = userActivity$.pipe(
    switchMap(() => idleTimer$),
    // startWith(idleTimer$)
  );
  idle$.subscribe(() => that.logout());
  idle$.subscribe(() => that.SwalSessionExpired.fire());

};

declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  private notificationSound: HTMLAudioElement;
  @ViewChild(CheckerViewVendorsComponent, { static: false })
  checkerViewVendorsComponent!: CheckerViewVendorsComponent;
  nightMode: Boolean = false;
  isMakerNotification: Boolean = false;
  isManagerNotification: Boolean = false;
  isCheckerNotification: Boolean = false;
  full_name: any = '';
  daysLeft: any;
  role: any = '';
  password_change_modal: any;
  session_time_modal: any;
  password_expiration_time_modal: any;
  login_trial_modal: any;
  url: any;
  // current_reconciliation_type: string = "RTGS 103";
  selected_account: any;
  selected_account_formatted!: any[];
  selected_account_full: any;
  //modal
  setAccountModal: any;
  passwordChangeForm!: FormGroup;
  SessionForm!: FormGroup;
  passwordExpirationForm!: FormGroup;
  loginTrialForm!: FormGroup;
  submitted: Boolean = false;
  showImage: Boolean = false;

  Notification: any[] = [];
  makerNotification: any[] = [];
  managerNotification: any[] = [];
  user_name = '';
  changePasswordPayload!: ChangePasswordPayload;

  idleThreshold: any = 0;
  passwordExpiration: any = 0;
  loginTrial: any = 0

  roles: any[] = [];
  private pollSubscription!: Subscription;
  constructor(
    public authService: AuthService,
    private checkerService: CheckerService,
    private makerService: MakerService,
    private managerService: ManagerService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private utilService: UtilService,
    private adminService: AdminService,
    private formBuilder: FormBuilder // private breakpointObserver: BreakpointObserver
  ) {

    this.notificationSound = new Audio('assets/notification_sound.wav');
    this.changePasswordPayload = {
      user_id: '',
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
    };
    this.passwordChangeForm = this.formBuilder.group(
      {
        oldpassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
        newpassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          createPasswordStrengthValidator(),
        ]),
        confirmpassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      },
      { validators: createPasswordMatchValidator.MatchValidator }
    );

    this.SessionForm = this.formBuilder.group(
      {
        time: new FormControl('', [
          Validators.required,
        ])
      },

    );
    this.passwordExpirationForm = this.formBuilder.group(
      {
        passwordExpirations: new FormControl('', [
          Validators.required,
        ])
      },

    );

    this.loginTrialForm = this.formBuilder.group(
      {
        loginTrials: new FormControl('', [
          Validators.required,
        ])
      },

    );
  }

  ngAfterViewInit() {
    if (!this.checkerViewVendorsComponent) {
      console.error('checkerViewVendorsComponent is not initialized');
    } else {
      console.log('checkerViewVendorsComponent is initialized');
      // You can perform further initialization or operations here
      // For example, access properties or call methods of checkerViewVendorsComponent
      console.log('Input value2:', this.checkerViewVendorsComponent);
    }
  }
  isAdmin(item: any) {
    return item.name.toLowerCase() === 'admin';
  }

  isApprover(item: any) {
    return item.name.toLowerCase() === 'approver';
  }
  idleTime(): void {
    this.adminService.getIdleTime().subscribe(
      (data: any) => {
        if (data != null)
          console.log('idleeeeeeeeeeeeeeeeeeeeeeeeeeeee time ============' + data.idle_time)
        this.idleThreshold = data.idle_time;
        this.passwordExpiration = data.password_expiration;
        this.loginTrial = data.login_trial;
        executeOnIdle(this, this.idleThreshold * 60 * 1000);
      },
      (error) => {
        console.log('error is...: ' + JSON.stringify(error, null, 3));
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
                  this.adminService.getIdleTime().subscribe(
                    (data: any) => {
                      if (data != null)
                        this.idleThreshold = data;

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
  ngOnInit(): void {
    this.getphoto();
    // this.timerSubscription = timer(0, 1000).subscribe(() => {
    // });
    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (!this.isAdmin(item) && !this.isApprover(item)) {
        this.roles.push(item)
      }
    }
    // if(this.localStorageService.retrieve('user') != null)
    // this.breakpointObserver
    //   .observe(['(min-width: 400px)'])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       this.showContainer = true;
    //     } else {
    //       this.showContainer = false;
    //     }
    //   });
    if (this.authService.isMaker()) {
      this.populateAccount();
    }
    // this.setAccountModal = new window.bootstrap.Modal(
    //   document.getElementById('setAccountModal')
    // );

    this.password_change_modal = new window.bootstrap.Modal(
      document.getElementById('modal-change-password')
    );

    this.session_time_modal = new window.bootstrap.Modal(
      document.getElementById('modal-session-time')
    );
    this.password_expiration_time_modal = new window.bootstrap.Modal(
      document.getElementById('password-expiration-time')
    );
    this.login_trial_modal = new window.bootstrap.Modal(
      document.getElementById('login-trial')
    );
    for (const item of this.roles) {
      if (!this.isAdmin(item) && !this.isApprover(item)) {
        console.log(item);
      }
    }
    if (
      this.localStorageService.retrieve('theme') == null ||
      this.localStorageService.retrieve('theme').trim() == 'light'.trim()
    )
      this.nightMode = true;
    else this.nightMode = false;
    this.toggleNightMode();
    this.adminService.getUserName().subscribe(
      (data: any) => {
        console.log('username...: ' + JSON.stringify(data, null, 3));
        if (data != null) this.full_name = data.name;
        this.daysLeft = data.passwordExpiration - data.days;
      },
      (error) => {
        console.log('error is...: ' + JSON.stringify(error, null, 3));
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
                  this.adminService.getUserName().subscribe(
                    (data: any) => {
                      console.log(
                        'username...: ' + JSON.stringify(data, null, 3)
                      );
                      if (data != null) this.full_name = data.name;
                      this.daysLeft = data.passwordExpiration - data.days;
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
    if (
      JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
      ).length > 1
    ) {
      console.log('it is true');
      for (let result of JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
      ))
        if (this.role == '') {
          this.role = (result.name == 'User' ? 'PAS' : result.name);
        } else {
          this.role =
            this.role + ', ' + (result.name == 'User' ? 'PAS' : result.name);
        }
    } else {
      console.log('it is not true');
      this.role = JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'))
      )[0].name;
    }
    this.idleTime()
    this.startPolling();
  }
  ngOnDestroy(): void {
    this.stopPolling();
  }
  startPolling() {
    const pollInterval = 120000; // Example: polling every 60 seconds
    const pollTimer = interval(pollInterval);
    this.pollSubscription = pollTimer.subscribe(() => {
      for (var i = 0; i < JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
      ).length; i++) {
        if (JSON.parse(JSON.stringify(this.localStorageService.retrieve('roles'))
        )[i].name == 'Checker') {
          this.getCheckerNotification();
        }
        if (JSON.parse(JSON.stringify(this.localStorageService.retrieve('roles'))
        )[i].name == 'Maker') {
          this.getMakerNotification();
        }
        // if (JSON.parse(JSON.stringify(this.localStorageService.retrieve('roles'))
        // )[i].name == 'Manager') {
        //   this.getManagerNotification();
        // }
      }
      // if (this.isMakerNotification || this.isCheckerNotification) {
      //   this.notificationSound.play();
      // }
    });
  }

  stopPolling() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }
  getCheckerNotification() {
    this.Notification = [];
    this.checkerService.getCheckerNotification().subscribe(
      (Notification: Array<Remark>) => {
        if (Notification != null) {
          this.isCheckerNotification = true;
          for (let i = 0; i < Notification.length; i++) {
            if (Notification[i].created_by == "Vendor") {
              Notification[i].id = "Vend" + Notification[i].id;
            } else if (Notification[i].created_by == "Contract") {
              Notification[i].id = "Cont" + Notification[i].id;
            }
            this.Notification.push(Notification[i]);
            this.notificationSound.play();
          }
        } else { this.isCheckerNotification = false; }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }


  getMakerNotification() {
    this.makerNotification = [];
    this.makerService.getMakerNotification().subscribe(
      (Notification: Array<Remark>) => {
        if (Notification != null) {
          this.isMakerNotification = true;
          for (let i = 0; i < Notification.length; i++) {
            if (Notification[i].created_by == "Vendor") {
              Notification[i].id = "Vend" + Notification[i].id;
            } else if (Notification[i].created_by == "Contract") {
              Notification[i].id = "Cont" + Notification[i].id;
            }
            this.makerNotification.push(Notification[i]);
            this.notificationSound.play();
          }
        } else { this.isMakerNotification = false }
      },
      (error) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }

   populateAccount() {
    // this.accountService.getAllAccounts().subscribe(
    //   (data: any) => {
    //     console.log('SUCCESS DATA Accounts: ' + JSON.stringify(data, null, 8));
    //     this.accounts = data;
    //     this.populateSelectedAccount();
    //   },
    //   (error) => {
    //     if (error.error.text === 'access-token-expired') {
    //       console.log('Access-token-expired requesting refresh token...');
    //       if (
    //         this.localStorageService.retrieve('refresh_token_requested') == null
    //       ) {
    //         this.utilService.refreshToken().subscribe(
    //           (data) => {
    //             if (data === true) {
    //               console.log(
    //                 'refresh token success re-requesting the actual request'
    //               );
    //               this.localStorageService.clear('refresh_token_requested');
    //               //================================================================================
    //               this.accountService.getAllAccounts().subscribe(
    //                 (data: any) => {
    //                   console.log(
    //                     'SUCCESS DATA Accounts: ' +
    //                     JSON.stringify(data, null, 8)
    //                   );
    //                   this.accounts = data;
    //                   this.populateSelectedAccount();
    //                 },
    //                 (error) => {
    //                   if (error.error.text === 'access-token-expired') {
    //                     console.log('refresh token expired.');
    //                     this.SwalSessionExpired.fire();
    //                     this._refreshTokenExpired();
    //                   } else {
    //                     Swal.fire({
    //                       icon: 'error',
    //                       title: 'Oops...',
    //                       text: 'Something went wrong!',
    //                     });
    //                     console.log(
    //                       JSON.stringify(error.error.apierror, null, 2)
    //                     );
    //                   }
    //                 }
    //               );
    //               //================================================================================
    //             } else {
    //               console.log('refresh token expired.');
    //               this.SwalSessionExpired.fire();
    //               this._refreshTokenExpired();
    //             }
    //           },
    //           (error: any) => {
    //             console.log('error refreshing access token');
    //             Swal.fire({
    //               icon: 'error',
    //               title: 'Oops...',
    //               text: 'Something went wrong!',
    //             });
    //             console.log(JSON.stringify(error.error.apierror, null, 2));
    //           }
    //         );
    //         this.localStorageService.store('refresh_token_requested', true);
    //       }
    //     } else {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'Something went wrong!',
    //       });
    //       console.log(JSON.stringify(error.error.apierror, null, 2));
    //     }
    //   }
    // );
  }



  // lockScreen(){
  //   this.router.navigateByUrl('lockScreen')
  // }
  // changeAccount() {
  // this.openModal()
  // Swal.fire({
  //   title: 'Change the account of the workspace.',
  //   text: 'If you change the account for the workspace all the activities you perform will be performed on the account you selected.',
  //   icon: 'info',
  //   showCancelButton: true,
  //   confirmButtonColor: '#d33',
  //   cancelButtonColor: '#3085d6',
  //   confirmButtonText: 'Delete',
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //   }
  // });
  // }
  getphoto() {
    this.authService.photo().subscribe(
      async (data: any) => {
        if (data == null) {
          this.showImage = false
        }

        this.url = data.photo;
        this.showImage = true

      },
      (error) => {
      }
    );

  }
  logout() {
    this.authService.logout().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
          window.location.reload();
        }
        // this.router.navigateByUrl('/register-success');
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
                  this.authService.logout().subscribe(
                    (data) => {
                      if (data) {
                        console.log(data);
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                      } else {
                        // Swal.fire({
                        //   icon: 'error',
                        //   title: 'Permission',
                        //   text: 'You are not permitted to perform this action!',
                        // });
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                        window.location.reload();

                      }
                    },
                    (error) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.logout_refreshTokenExpired();
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                      } else {
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                      // console.log(
                      //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
                      // )
                      // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
                    }
                  );
                  //================================================================================
                } else {
                  console.log('refresh token expired.');
                  this.logout_refreshTokenExpired();
                  this.router.navigateByUrl('/login');
                  this.localStorageService.clear('user');
                  this.localStorageService.clear('roles');
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                this.router.navigateByUrl('/login');
                this.localStorageService.clear('user');
                this.localStorageService.clear('roles');
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
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
          console.log(JSON.stringify(error.error.apierror, null, 2));
        }
        // if (error.error.apierror.message == 'bad credentials') {
        //   this.logout_refreshTokenExpired();
        // } else {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //   });
        // }

        // console.log(
        //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
        // )
        // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
      }
    );
  }

  myFunction() {
    this.router.navigateByUrl('profile');
    console.log("change my profile photo")
  }
  changeMyPassword() {
    this.password_change_modal.show();
  }
  notificationSetting() {
    Swal.fire({
      title: 'your setting has the following ',
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
                            <label for="bank-name">Contract expiry date</label>
                            <input type="number" id="bank-name" class="form-control" value="" placeholder="notify before xyz day">
                          </div>
                          <div class="form-group">
                            <label for="account-number">Payment due date</label>
                            <input type="number" id="account-number" class="form-control" value=""  placeholder="notify before xyz day">
                          </div>
                          <div class="form-group">
                            <label for="branch-name">Branch Name</label>
                            <input type="text" id="branch-name" class="form-control" value="">
                          </div>
                          <div class="form-group">
                            <label for="account-name">Account Name</label>
                            <input type="text" id="account-name" class="form-control" value="">
                          </div>
                          <div class="form-group">
                            <label for="swift-code">Swift Code</label>
                            <input type="text" id="swift-code" class="form-control" value="">
                          </div>
                          <div class="form-group">
                            <label for="IBAN">IBAN</label>
                            <input type="text" id="IBAN" class="form-control" value="">
                          </div>
                          <br>
                          <div class="">
                            <label for="beneficiary-address">Beneficiary Address</label>
                            <div id="quill-container-beneficiary-address"></div>
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
        // formData.append('id', that.vendor_id);
        formData.append('bank_name', (document.getElementById('bank-name') as HTMLInputElement).value);
        formData.append('account_number', (document.getElementById('account-number') as HTMLInputElement).value);
        formData.append('branch_name', (document.getElementById('branch-name') as HTMLInputElement).value);
        formData.append('account_name', (document.getElementById('account-name') as HTMLInputElement).value);
        formData.append('swift_code', (document.getElementById('swift-code') as HTMLInputElement).value);
        formData.append('iban', (document.getElementById('IBAN') as HTMLInputElement).value);
        // formData.append('beneficiary_address', quillBeneficiaryAddress.root.innerHTML);
        return formData; // Return the updated data
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) { // Check if `result.value` is defined
        // that.service.updateBankDetail(result.value).subscribe(
        //   (response) => {
        //     if (response == true) {
        //       Swal.fire({
        //         icon: 'success',
        //         title: 'Success',
        //         text: 'Bank detail updated successfully!',
        //       });
        //     }
        //     else {
        //       Swal.fire({
        //         icon: 'warning',
        //         title: 'error',
        //         text: 'Bank details not updated!',
        //       });
        //     }
        //   },
        //   (error) => {
        //     Swal.fire({
        //       icon: 'error',
        //       title: 'Error',
        //       text: 'Failed to update bank details!',
        //     });
        //     console.error('Error updating bank details:', error);
        //   }
        // );
      }
    });
  }

  makererNotify(type: any, id: any) {
    console.log("change my profile photo" + id.replace("Vend", "").replace("Cont", ""))
    console.log("change my profile photo one" + type);
    this.makerService.ViewNotification(id.replace("Vend", "").replace("Cont", ""), type)
      .subscribe(
        (data: any) => {
          if (data == true) {
            this.getMakerNotification();

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
                    this.makerService.ViewNotification(id.replace("Vend", "").replace("Cont", ""), type)
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            this.getMakerNotification();
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
    if (type === "Vendor") {
      this.router.navigateByUrl('maker/view-vendors');
      console.log('Input value:', id);
      // Check if CheckerViewVendorsComponent is initialized
      if (this.checkerViewVendorsComponent) {
        this.checkerViewVendorsComponent.input_0 = id;

        // Access DataTables API instance
        if (this.checkerViewVendorsComponent.datatableElement) {
          this.checkerViewVendorsComponent.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (dtInstance) {
              console.log('DataTables instance:', dtInstance);
              dtInstance.column(1)
                .search(id.toString()) // Convert id to string if necessary
                .draw();
            } else {
              console.error('DataTables API instance is not available');
            }
          });
        } else {
          console.error('datatableElement is not initialized');
        }
      } else {
        console.error('checkerViewVendorsComponent is not initialized');
      }
    } else if (type === "Contract") {
      this.router.navigateByUrl('maker/view-contracts');
    }

  }

  checkerNotify(type: any, id: any) {
    if (type === "Vendor") {
      this.router.navigateByUrl('checker/view-vendors');
      console.log('Input value:', id);
      console.log('Input value2:', this.checkerViewVendorsComponent);
      // Check if CheckerViewVendorsComponent is initialized
      if (this.checkerViewVendorsComponent) {
        this.checkerViewVendorsComponent.input_0 = id;

        // Access DataTables API instance
        if (this.checkerViewVendorsComponent.datatableElement) {
          this.checkerViewVendorsComponent.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (dtInstance) {
              console.log('DataTables instance:', dtInstance);
              dtInstance.column(1)
                .search(id.toString()) // Convert id to string if necessary
                .draw();
            } else {
              console.error('DataTables API instance is not available');
            }
          });
        } else {
          console.error('datatableElement is not initialized');
        }
      } else {
        console.error('checkerViewVendorsComponent is not initialized');
      }
    } else if (type === "Contract") {
      this.router.navigateByUrl('checker/view-contracts');
    }
  }

  changeTime() {
    this.session_time_modal.show();
  }
  passwordExpirationTime() {
    this.password_expiration_time_modal.show();
  }
  LoginTrial() {
    this.login_trial_modal.show();
  }

  changePassword() {
    if (this.passwordChangeForm.valid) {
      this.changePasswordPayload = this.passwordChangeForm.value;
      this.changePasswordPayload.user_id =
        this.localStorageService.retrieve('password-change');
      this.adminService.changePassword(this.changePasswordPayload).subscribe(
        (data: any) => {
          if (data == true) {
            // console.log(JSON.stringify(data, null, 3));
            // this.router.navigateByUrl('login')
            this.password_change_modal.hide();
            Swal.fire({
              icon: 'success',
              title: 'Password Change',
              text: 'Changed your password successfully.',
            });
          }
        },
        (error: any) => {
          if (error.error.text == 'incorrect-old-password') {
            Swal.fire({
              icon: 'error',
              title: 'Incorrect old Password...',
              text: 'Please enter correct old password !',
            });
          } else if (error.error.text == 'password-mismatch') {
            Swal.fire({
              icon: 'error',
              title: ' Mismatch...',
              text: 'Please enter the correct confirmation !',
            });
          } else if (error.error.text === 'access-token-expired') {
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
                    this.adminService
                      .changePassword(this.changePasswordPayload)
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            console.log(JSON.stringify(data, null, 3));
                            this.router.navigateByUrl('login');
                            this.password_change_modal.hide();
                            Swal.fire({
                              icon: 'success',
                              title: 'Password Change',
                              text: 'Changed your password successfully.',
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
            console.log('error3: ' + JSON.stringify(error.error.text, null, 4));
          }
        }
      );
      console.log('submit clicked:valid');
    } else {
      this.submitted = true;
      console.log('not valid');
    }
  }

  changeSessionTime() {
    if (this.SessionForm.valid) {
      this.idleThreshold = this.SessionForm.get('time')?.value;
      this.adminService.changeTime(this.idleThreshold).subscribe(
        (data: any) => {
          if (data == true) {
            this.session_time_modal.hide();
            Swal.fire({
              icon: 'success',
              title: 'Time Change',
              text: 'Session time changed successfully.',
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
                    this.adminService
                      .changeTime(this.idleThreshold)
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            console.log(JSON.stringify(data, null, 3));
                            this.session_time_modal.hide();
                            Swal.fire({
                              icon: 'success',
                              title: 'Time Change',
                              text: 'Session Time Changed successfully.',
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
            console.log('error3: ' + JSON.stringify(error.error.text, null, 4));
          }
        }
      );
      console.log('submit clicked:valid');
    } else {
      this.submitted = true;
      console.log('not valid');
    }
  }
  changePasswordExpirationTime() {
    if (this.passwordExpirationForm.valid) {
      this.passwordExpiration = this.passwordExpirationForm.get('passwordExpirations')?.value;
      this.adminService.changePasswordExpirationTime(this.passwordExpiration).subscribe(
        (data: any) => {
          if (data == true) {
            this.password_expiration_time_modal.hide();
            Swal.fire({
              icon: 'success',
              title: 'Time Change',
              text: 'password expiration day changed successfully.',
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
                    this.adminService
                      .changePasswordExpirationTime(this.passwordExpiration)
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            console.log(JSON.stringify(data, null, 3));
                            this.password_expiration_time_modal.hide();
                            Swal.fire({
                              icon: 'success',
                              title: 'Time Change',
                              text: 'password expiration day Changed successfully.',
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
            console.log('error3: ' + JSON.stringify(error.error.text, null, 4));
          }
        }
      );
      console.log('submit clicked:valid');
    } else {
      this.submitted = true;
      console.log('not valid');
    }
  }

  changeLoginTrial() {
    if (this.loginTrialForm.valid) {
      this.loginTrial = this.loginTrialForm.get('loginTrials')?.value;
      this.adminService.changeLoginTrial(this.loginTrial).subscribe(
        (data: any) => {
          if (data == true) {
            this.login_trial_modal.hide();
            Swal.fire({
              icon: 'success',
              title: 'Time Change',
              text: 'Login trial changed successfully.',
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
                    this.adminService
                      .changeLoginTrial(this.loginTrial)
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            console.log(JSON.stringify(data, null, 3));
                            this.login_trial_modal.hide();
                            Swal.fire({
                              icon: 'success',
                              title: 'Time Change',
                              text: 'Login trial Changed successfully.',
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
            console.log('error3: ' + JSON.stringify(error.error.text, null, 4));
          }
        }
      );
      console.log('submit clicked:valid');
    } else {
      this.submitted = true;
      console.log('not valid');
    }
  }
  logoutAll() {
    this.authService.logoutAll().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Permission',
            text: 'You are not permitted to perform this action!',
          });
        }
        // this.router.navigateByUrl('/register-success');
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
                  this.authService.logoutAll().subscribe(
                    (data) => {
                      if (data) {
                        console.log(data);
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
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
                        this.logout_refreshTokenExpired();
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
                      // console.log(
                      //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
                      // )
                      // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
                    }
                  );
                  //================================================================================
                } else {
                  console.log('refresh token expired.');
                  this.logout_refreshTokenExpired();
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
        // if (error.error.apierror.message == 'bad credentials') {
        //   this.logout_refreshTokenExpired();
        // } else {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //   });
        // }

        // console.log(
        //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
        // )
        // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
      }
    );
  }

  changeOverflow() {
    const body_all = document.body;
    const left_side_menu_container = document.getElementById(
      'leftside-menu-container'
    );
    const c_container = document.getElementById('c_container');

    if (!body_all.hasAttribute('data-leftbar-compact-mode')) {
      console.log('it is condensed.');
      left_side_menu_container?.classList.remove('overflow_x');
      c_container?.classList.add('d-none');
      c_container?.classList.remove('d-block');
    } else {
      left_side_menu_container?.classList.add('overflow_x');
      c_container?.classList.add('d-block');
      c_container?.classList.remove('d-none');
      console.log('it is expanded.');
    }
  }
  // w: number = 0
  toggleNightMode() {
    const tumbler = document.getElementById('tumbler');

    if (this.nightMode) {
      tumbler?.classList.remove('tumbler_transform');
      this.nightMode = false;

      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      // link.id   = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/template_assets/css/app.min.css';
      link.media = 'all';
      head.appendChild(link);
      if (this.localStorageService.retrieve('theme') != null)
        this.localStorageService.clear('theme');
      this.localStorageService.store('theme', 'light');
    } else {
      tumbler?.classList.add('tumbler_transform');
      console.log('it is false');
      this.nightMode = true;

      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      // link.id   = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/template_assets/css/app-dark.min.css';
      link.media = 'all';
      head.appendChild(link);
      if (this.localStorageService.retrieve('theme') != null)
        this.localStorageService.clear('theme');
      this.localStorageService.store('theme', 'dark');
    }

    // if (this.w === 0) {
    // var head = document.getElementsByTagName('head')[0]
    // var link = document.createElement('link')
    // // link.id   = cssId;
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = 'assets/template_assets/css/app-dark.min.css'
    // link.media = 'all'
    // head.appendChild(link)
    // this.w = 1

    // var linkNode = document.getElementsByTagName('link')[1]
    // linkNode.parentNode?.removeChild(linkNode)
    // console.log('done!!01')
    // } else {
    // var head = document.getElementsByTagName('head')[0]
    // var link = document.createElement('link')
    // // link.id   = cssId;
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = 'assets/template_assets/css/app.min.css'
    // link.media = 'all'
    // head.appendChild(link)
    // this.w = 0
    // console.log('done!!02')
    // }
  }

  logout_refreshTokenExpired() {
    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        this.router.navigateByUrl('/login');
        this.localStorageService.clear('user');
      }
    );
  }
  goToPage(pageName: string) {
    // this.router.navigate([{ outlets: { inner_outlet: [`${pageName}`] } }])
    this.router.navigate([`${pageName}`]);
  }

  openSetAccountModal() {
    this.setAccountModal.show();

    // this.setAccountForm.controls['account'].setValue(this.selected_account.name, {
    //   onlySelf: true,
    // });
  }

  closeSetAccountModal() {
    this.setAccountModal.hide();
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
