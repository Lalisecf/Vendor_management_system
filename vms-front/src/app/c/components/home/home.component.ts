import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
// import { fadeAnimation2 } from '../../../utils_/animations2'
// import { loadDatatableScripts } from '../../loadScripts';
import Chart from 'chart.js/auto';

import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { EMPTY } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { ManagerService } from 'src/app/Manager/Services/manager.service';
import { Vendors } from 'src/app/Maker/Payloads/vendors';
import { FormGroup } from '@angular/forms';
import { contract } from 'src/app/Maker/Payloads/contract';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // animations: [fadeAnimation2],
})


export class HomeComponent implements AfterViewChecked, OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('UnauthorizedSwal')
  public readonly UnauthorizedSwal!: SwalComponent;
 
 dtOptions: any;
  registerForm!: FormGroup;
  submitted: boolean = false;

  public chart1: any;
  public chart2: any;
  public chart3: any;
  public chart4: any;
  public chart5: any;
  public chart6: any;
  public chart7: any;
  public chart8: any;
  public chart9: any;
  public chart10: any;
  public chart11: any;
  public chart12: any;
  public chart13: any;
  public chart14: any;
  data_is_ready: boolean = false;
  admin_data_is_ready: boolean = false;
  maker_data_is_ready: boolean = false;
  manager_data_is_ready: boolean = false;
  manager_detail_data_is_ready: boolean = false;
  approver_data_is_ready: boolean = false;
  
  readyToDrawChart14: boolean = false;

  
  filteredVendors!: Vendors[];
  vendor!: Vendors[];
  contract!: contract[];
  cont: any = {};
  vendorSelected: boolean = false;
  contractSelected: boolean = false;
  contract_id: number = 0;

  chart2_no_data: boolean = false;
  chart4_no_data: boolean = false;
  chart1_no_data: boolean = false;
  chart3_no_data: boolean = false;
  chart5_no_data: boolean = false;
  chart6_no_data: boolean = false;
  chart7_no_data: boolean = false;
  chart8_no_data: boolean = false;
  chart9_no_data: boolean = false;
  chart10_no_data: boolean = false;
  chart11_no_data: boolean = false;
  chart12_no_data: boolean = false;
  chart13_no_data: boolean = false;
  chart14_no_data: boolean = false;
  dashboard_data: any;
  adminDashboard_data: any;
  makerDashboard_data: any;
  approverDashboard_data: any;
  managerDashboard_data: any;
  managerDetailDashboard_data: any;
  number_of_pool_remark: string = '0';
  constructor(
    public authService: AuthService,

    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private changeRef: ChangeDetectorRef,
    private adminService: AdminService,
    private makerService: MakerService,
    private managerService: ManagerService
    

  ) { }
  ngAfterViewChecked(): void {
    if (
      this.readyToDrawChart14 && 
      document.getElementById('MyChart14') && 
      !this.chart14
    ) {
      this.chartForteen();
    }
  }
  
  ngOnInit(): void {
    this.populateMakerDashboardData();
    this.populateDashboardData();
    this.populateApproverDashboardData();
    this.populateAdminDashboardData();
    this.populateManagerDashboardData();
    this.getVendors();

  }
  ngAfterViewInit(): void {
    this.populateManagerDetailDashboardData(this.contract_id);
   // this.chart13.destroy(); // Force chart update
  }

  total_number_of_users: string = '';
  total_number_active_users: string = '';
  total_number_inactive_users: string = '';
  total_functionalities: string = '';
  total_logins: string = '';
  total_number_of_user_activity: string = '';

  total_pending_user: string = '';
  total_approved_user: string = '';
  total_rejected_user: string = '';

  outstanding_balance_core_total: string = '';
  outstanding_balance_ats_total: string = '';

  total_beginning_balance_core: string = '';
  total_ending_balance_core: string = '';
  current_adjusted_balance_ats: string = '';
  current_adjusted_balance_core: string = '';
  number_of_Currency_remark: string = '0';
  number_of_account_remark: string = '0';

  //maker and checker
  total_vendors: string='0';
  total_payments: string='0';
  total_payments_amount: string='0';
  total_payments_paid: string='0';
  Initiated_payments: string = '0';
  NotInitiated_payments: string = '0';
  ExcessedDueDate_payments: string = '0';
  total_payments_paid_amount: string='0';
  Initiated_payments_amount: string='0';
  NotInitiated_payments_amount: string = '0';
  ExcessedDueDate_payments_amount: string = '0';
  total_Addedumpayments: string='0';
  total_Addedumpayments_amount: string='0';
  total_Addedumpayments_paid: string='0';
  total_Addedumpayments_paid_amount: string='0';
  Initiated_Addedumpayments: string = '0';
  Initiated_Addedumpayments_amount: string = '0';
  NotInitiated_Addedumpayments: string = '0';
  NotInitiated_Addedumpayments_amount: string = '0';
  ExcessedDueDate_Addedumpayments: string = '0';
  ExcessedDueDate_Addedumpayments_amount: string = '0';
  pending_vendors: string = '0';
  active_vendors: string = '0';
  deactive_vendors: string = '0';
  reject_vendors: string = '0';
  reject_payments: string = '0';
  reject_payments_amount: string = '0';
  reject_Addedumpayments: string = '0';
  reject_Addedumpayments_amount: string = '0';
  total_payments_Detail_amount: string = '0';

  total_payments_Detail: string='0';
  total_Detail_payments_paid: string='0';
  total_payments_Detail_amount_paid: string='0';
  Initiated__Detail_payments: string = '0';
  Initiated_payments_Detail_amount: string = '0';
  NotInitiated__Detail_payments: string = '0';
  NotInitiated_payments_Detail_amount: string = '0';
  reject_payments_Detail: string = '0';
  reject_payments_Detail_amount: string = '0';
  ExcessedDueDate_payments_Detail: string = '0';
  ExcessedDueDate_payments_Detail_amount: string = '0';

  working_vendors: string = '0';
  Has_no_contract:string='0'

  deactive_vendors_requests: string = '0';
  active_vendors_requests: string = '0';
  update_vendors_requests: string = '0';
  delete_vendors_requests: string = '0';

  hold_contracts_requests: string = '0';
  unhold_contracts_requests: string = '0';
  extend_contracts_requests: string = '0';
  renew_contracts_requests: string = '0';
  terminate_contracts_requests: string = '0';

  pending_contracts: string = '0';
  reject_contracts: string = '0';
  active_contracts: string = '0';
  total_contracts: string='0';
  hold_contracts: string = '0';
  terminate_contracts: string = '0';
  extend_contracts: string = '0';
  renew_contracts: string = '0';

  pending_payment: string = '0';
  reject_payment: string = '0';
  under_manager_review: string = '0';
  under_director_review: string='0';
  under_chief_review: string = '0';
  under_Finance_review: string = '0';
  delete_payment_requests: string = '0';




  /*
  */
  populateAdminDashboardData() {
    if (this.authService.isAdmin()) {
      this.utilService.checkAccessTokenDoesNotExpired().subscribe(
        (data: any) => {
          if (data == true) {
            console.log("------------------ token not expired")
            this.adminService.getAdminDashboardData().subscribe(
              (data1: any) => {
                console.log('data: ' + JSON.stringify(data1, null, 4));
                this.total_number_of_users = Number(
                  data1.total_number_of_Users
                ).toLocaleString();
                this.total_number_active_users = Number(
                  data1.total_number_active_users
                ).toLocaleString();
                this.total_number_inactive_users = Number(
                  data1.total_number_inactive_users
                ).toLocaleString();
                this.total_functionalities = Number(
                  data1.total_number_of_functionalities
                ).toLocaleString();
                this.total_logins = Number(data1.total_logins).toLocaleString();
                this.total_number_of_user_activity = Number(
                  data1.total_number_of_user_activity
                ).toLocaleString();
                console.log('ffffffffff======>: ' + this.total_functionalities);
                this.adminDashboard_data = data1;
                this.admin_data_is_ready = true;
                this.chartFive();
              });

          }
        },
        (error: any) => {
          console.log("------------------ token expired")
          if (
            this.localStorageService.retrieve('refresh_token_requested') ==
            null
          ) {

            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual requestttttt'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.adminService.getAdminDashboardData().subscribe(
                    (data1: any) => {
                      this.total_number_of_users = Number(
                        data1.total_number_of_Users
                      ).toLocaleString();
                      this.total_number_active_users = Number(
                        data1.total_number_active_users
                      ).toLocaleString();
                      this.total_number_inactive_users = Number(
                        data1.total_number_inactive_users
                      ).toLocaleString();
                      this.total_functionalities = Number(
                        data1.total_number_of_functionalities
                      ).toLocaleString();
                      this.total_logins = Number(
                        data1.total_logins
                      ).toLocaleString();
                      this.total_number_of_user_activity = Number(
                        data1.total_number_of_user_activity
                      ).toLocaleString();
                      console.log(
                        'ffffffffff======>: ' + this.total_functionalities
                      );
                      this.adminDashboard_data = data1;
                      this.admin_data_is_ready = true;
                      this.chartFive();
                    },
                    (error) => {

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

        });
    }
  }



  //Maker  Dashboard start


  populateMakerDashboardData() {
    if (this.authService.isMaker() || this.authService.isChecker()) {
      this.utilService.checkAccessTokenDoesNotExpired().subscribe(
        (data: any) => {
          if (data == true) {
            console.log("------------------ token not expired")
            this.makerService.getMakerDashboardData().subscribe(
              (data1: any) => {
                console.log('data: ' + JSON.stringify(data1, null, 4));
                 this.total_vendors = Number(data1.total_vendors).toLocaleString();
                this.pending_vendors = Number(data1.pending_vendors).toLocaleString();
                this.active_vendors = Number(data1.active_vendors).toLocaleString();
                this.deactive_vendors = Number(data1.deactive_vendors).toLocaleString();
                this.reject_vendors = Number(data1.reject_vendor).toLocaleString();
                this.working_vendors = Number(data1.working_vendors).toLocaleString();
                this.Has_no_contract = Number(data1.Has_no_contract).toLocaleString();
                this.active_vendors_requests = Number(data1.active_vendors_requests).toLocaleString();
                this.delete_vendors_requests = Number(data1.delete_vendors_requests).toLocaleString();
                this.update_vendors_requests = Number(data1.update_vendors_requests).toLocaleString();
                this.deactive_vendors_requests = Number(
                  data1.deactive_vendors_requests
                ).toLocaleString();

                this.hold_contracts = Number(
                  data1.hold_contracts
                ).toLocaleString();
                this.active_contracts = Number(data1.active_contracts).toLocaleString();
                this.total_contracts= Number(data1.total_contracts).toLocaleString();
                this.pending_contracts = Number(
                  data1.pending_contracts
                ).toLocaleString();
                this.reject_contracts = Number(
                  data1.reject_contracts
                ).toLocaleString();
                this.terminate_contracts = Number(
                  data1.terminate_contracts
                ).toLocaleString();
                this.extend_contracts = Number(
                  data1.extend_contracts
                ).toLocaleString();
                this.renew_contracts = Number(
                  data1.renew_contracts
                ).toLocaleString();

                this.renew_contracts_requests = Number(
                  data1.renew_contracts_requests
                ).toLocaleString()
                this.extend_contracts_requests = Number(
                  data1.extend_contracts_requests
                ).toLocaleString()
                this.hold_contracts_requests = Number(
                  data1.hold_contracts_requests
                ).toLocaleString()
                this.unhold_contracts_requests = Number(
                  data1.unhold_contracts_requests
                ).toLocaleString()
                this.terminate_contracts_requests = Number(
                  data1.terminate_contracts_requests
                ).toLocaleString()


                this.makerDashboard_data = data1;
                this.maker_data_is_ready = true;
                this.chartSix();
                this.chartSeven();
                this.chartEight();
                this.chartNinth();
;              });

          }
        },
        (error: any) => {
          console.log("------------------ token expired")
          if (
            this.localStorageService.retrieve('refresh_token_requested') ==
            null
          ) {

            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual requestttttt'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.makerService.getMakerDashboardData().subscribe(
                    (data1: any) => {
                      this.pending_vendors = Number(
                        data1.pending_vendors
                      ).toLocaleString();
                      this.active_vendors = Number(
                        data1.active_vendors
                      ).toLocaleString();
                      this.deactive_vendors = Number(
                        data1.deactive_vendors
                      ).toLocaleString();
                      this.reject_vendors = Number(
                        data1.reject_vendors
                      ).toLocaleString();
                      this.working_vendors = Number(data1.working_vendors).toLocaleString();
                      this.Has_no_contract = Number(data1.Has_no_contract).toLocaleString();
                      this.active_vendors_requests = Number(
                        data1.active_vendors_requests
                      ).toLocaleString();

                      this.delete_vendors_requests = Number(
                        data1.delete_vendors_requests
                      ).toLocaleString();
                      this.update_vendors_requests = Number(
                        data1.update_vendors_requests
                      ).toLocaleString();
                      this.deactive_vendors_requests = Number(
                        data1.deactive_vendors_requests
                      ).toLocaleString();

                      this.hold_contracts = Number(
                        data1.hold_contracts
                      ).toLocaleString();
                      this.active_contracts = Number(
                        data1.active_contracts
                      ).toLocaleString();
                      this.pending_contracts = Number(
                        data1.pending_contracts
                      ).toLocaleString();
                      this.reject_contracts = Number(
                        data1.reject_contracts
                      ).toLocaleString();
                      this.terminate_contracts = Number(
                        data1.terminate_contracts
                      ).toLocaleString();
                      this.extend_contracts = Number(
                        data1.extend_contracts
                      ).toLocaleString();
                      this.renew_contracts = Number(
                        data1.renew_contracts
                      ).toLocaleString();

                      this.renew_contracts_requests = Number(
                        data1.renew_contracts_requests
                      ).toLocaleString()
                      this.extend_contracts_requests = Number(
                        data1.extend_contracts_requests
                      ).toLocaleString()
                      this.hold_contracts_requests = Number(
                        data1.hold_contracts_requests
                      ).toLocaleString()
                      this.unhold_contracts_requests = Number(
                        data1.unhold_contracts_requests
                      ).toLocaleString()
                      this.terminate_contracts_requests = Number(
                        data1.terminate_contracts_requests
                      ).toLocaleString()

                      this.makerDashboard_data = data1;
                      this.maker_data_is_ready = true;
                      this.chartSix();
                      this.chartSeven();
                       this.chartEight();
                       this.chartNinth();
                    },
                    (error) => {

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

        });
    }
  }



  // Maker Dashboard end


  populateApproverDashboardData() {
    if (this.authService.isApprover()) {
      this.utilService.checkAccessTokenDoesNotExpired().subscribe(
        (data: any) => {
          if (data == true) {
            console.log("------------------ token not expired")
            this.adminService.getApproverDashboardData().subscribe(
              (data1: any) => {
                console.log('data: ' + JSON.stringify(data1, null, 4));
                this.total_pending_user = Number(
                  data1.total_pending_user
                ).toLocaleString();
                this.total_approved_user = Number(
                  data1.total_approved_user
                ).toLocaleString();
                this.total_rejected_user = Number(
                  data1.total_rejected_user
                ).toLocaleString();


                console.log('ffffffffff======>: ' + this.total_approved_user);
                this.approverDashboard_data = data1;
                this.approver_data_is_ready = true;
                this.chartFour();
              });

          }
        },
        (error: any) => {
          console.log("------------------ token expired")
          if (
            this.localStorageService.retrieve('refresh_token_requested') ==
            null
          ) {

            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual requestttttt'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.adminService.getAdminDashboardData().subscribe(
                    (data1: any) => {
                      this.total_pending_user = Number(
                        data1.total_pending_user
                      ).toLocaleString();
                      this.total_approved_user = Number(
                        data1.total_approved_user
                      ).toLocaleString();
                      this.total_rejected_user = Number(
                        data1.total_rejected_user
                      ).toLocaleString();

                      console.log(
                        'ffffffffff======>: ' + this.total_functionalities
                      );
                      this.approverDashboard_data = data1;
                      this.approver_data_is_ready = true;
                      this.chartFour();
                    },
                    (error) => {

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

        });
    }
  }
  populateDashboardData() {
    // if (this.authService.isUser()) {
    //   this.utilService.checkAccessTokenDoesNotExpired().subscribe(
    //     (data: any) => {
    //       if (data == true) {
    //         console.log("------------------ token not expired")
    //         this.dashboardService.getDashboardData().subscribe(
    //           (data: any) => {
    //             //69332711
    //             // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

    //             this.current_adjusted_balance_core = (
    //               Number(data.date_7_ending_balance_conv) +
    //               Number(data.date_7_ending_balance_ifb) +
    //               Number(data.outstanding_balance_on_ats_credit) -
    //               Number(data.outstanding_balance_on_ats_credit)
    //             ).toLocaleString();

    //             this.current_adjusted_balance_ats = (
    //               Number(data.date_7_ending_balance_ats) -
    //               Number(data.outstanding_balance_on_core_debit) +
    //               Number(data.outstanding_balance_on_core_credit)
    //             ).toLocaleString();

    //             data.total_number_of_transactions_core = Number(
    //               data.total_number_of_transactions_core
    //             ).toLocaleString();
    //             data.total_number_of_accounts = Number(
    //               data.total_number_of_accounts
    //             ).toLocaleString();
    //             data.total_number_of_currencies = Number(
    //               data.total_number_of_currencies
    //             ).toLocaleString();
    //             data.total_number_of_transactions_ats = Number(
    //               data.total_number_of_transactions_ats
    //             ).toLocaleString();
    //             data.total_number_of_files = Number(
    //               data.total_number_of_files
    //             ).toLocaleString();

    //             this.outstanding_core_total = (
    //               data.outstanding_transactions_on_core_credit +
    //               data.outstanding_transactions_on_core_debit
    //             ).toLocaleString();
    //             this.outstanding_ats_total = (
    //               data.outstanding_transactions_on_ats_credit +
    //               data.outstanding_transactions_on_ats_debit
    //             ).toLocaleString();

    //             data.beginning_balance_ats = Number(
    //               data.beginning_balance_ats
    //             ).toLocaleString();
    //             data.ending_balance_ats = Number(
    //               data.ending_balance_ats
    //             ).toLocaleString();
    //             // total_beginning_balance_core
    //             this.total_beginning_balance_core = (
    //               data.beginning_balance_core_ifb + data.beginning_balance_core_conv
    //             ).toLocaleString();
    //             data.beginning_balance_core_ifb = Number(
    //               data.beginning_balance_core_ifb
    //             ).toLocaleString();
    //             data.beginning_balance_core_conv = Number(
    //               data.beginning_balance_core_conv
    //             ).toLocaleString();
    //             // total_ending_balance_core
    //             this.total_ending_balance_core = (
    //               data.ending_balance_core_ifb + data.ending_balance_core_conv
    //             ).toLocaleString();
    //             data.ending_balance_core_ifb = Number(
    //               data.ending_balance_core_ifb
    //             ).toLocaleString();
    //             data.ending_balance_core_conv = Number(
    //               data.ending_balance_core_conv
    //             ).toLocaleString();

    //             this.outstanding_balance_core_total = (
    //               data.outstanding_balance_on_core_credit +
    //               data.outstanding_balance_on_core_debit
    //             ).toLocaleString();
    //             this.outstanding_balance_ats_total = (
    //               data.outstanding_balance_on_ats_credit +
    //               data.outstanding_balance_on_ats_debit
    //             ).toLocaleString();

    //             data.outstanding_balance_on_core_credit = Number(
    //               data.outstanding_balance_on_core_credit
    //             ).toLocaleString();
    //             data.outstanding_balance_on_core_debit = Number(
    //               data.outstanding_balance_on_core_debit
    //             ).toLocaleString();
    //             data.outstanding_balance_on_ats_credit = Number(
    //               data.outstanding_balance_on_ats_credit
    //             ).toLocaleString();
    //             data.outstanding_balance_on_ats_debit = Number(
    //               data.outstanding_balance_on_ats_debit
    //             ).toLocaleString();

    //             data.number_of_edited_transactions = Number(
    //               data.number_of_edited_transactions
    //             ).toLocaleString();
    //             data.number_of_deleted_transactions = Number(
    //               data.number_of_deleted_transactions
    //             ).toLocaleString();

    //             // ats_ending_balance + total_core_debit) - total_core_credit

    //             // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

    //             this.dashboard_data = data;
    //             if (this.authService.isUser()) {
    //               this.chartOne();
    //               this.chartTwo();
    //               this.chartThree();
    //             }
    //             this.data_is_ready = true;
    //           });

    //       }
    //     },
    //     (error: any) => {
    //       console.log("------------------ token expired");
    //       if (
    //         this.localStorageService.retrieve('refresh_token_requested') ==
    //         null
    //       ) {
    //         this.utilService.refreshToken().subscribe(
    //           (data) => {
    //             if (data === true) {
    //               console.log(
    //                 'refresh token success re-requesting the actual request'
    //               );
    //               this.localStorageService.clear('refresh_token_requested');
    //               //================================================================================
    //               this.dashboardService.getDashboardData().subscribe(
    //                 (data: any) => {
    //                   console.log(
    //                     'dashboard data: ' + JSON.stringify(data, null, 6)
    //                   );
    //                   console.log(
    //                     'number_of_edited_transactions: ' +
    //                     Number(
    //                       data.total_number_of_transactions_core
    //                     ).toLocaleString()
    //                   );
    //                   //69332711
    //                   // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

    //                   this.current_adjusted_balance_core = (
    //                     Number(data.date_7_ending_balance_conv) +
    //                     Number(data.date_7_ending_balance_ifb) +
    //                     Number(data.outstanding_balance_on_ats_credit) -
    //                     Number(data.outstanding_balance_on_ats_credit)
    //                   ).toLocaleString();

    //                   this.current_adjusted_balance_ats = (
    //                     Number(data.date_7_ending_balance_ats) -
    //                     Number(data.outstanding_balance_on_core_debit) +
    //                     Number(data.outstanding_balance_on_core_credit)
    //                   ).toLocaleString();

    //                   data.total_number_of_transactions_core = Number(
    //                     data.total_number_of_transactions_core
    //                   ).toLocaleString();
    //                   data.total_number_of_accounts = Number(
    //                     data.total_number_of_accounts
    //                   ).toLocaleString();
    //                   data.total_number_of_currencies = Number(
    //                     data.total_number_of_currencies
    //                   ).toLocaleString();
    //                   data.total_number_of_transactions_ats = Number(
    //                     data.total_number_of_transactions_ats
    //                   ).toLocaleString();
    //                   data.total_number_of_files = Number(
    //                     data.total_number_of_files
    //                   ).toLocaleString();

    //                   this.outstanding_core_total = (
    //                     data.outstanding_transactions_on_core_credit +
    //                     data.outstanding_transactions_on_core_debit
    //                   ).toLocaleString();
    //                   this.outstanding_ats_total = (
    //                     data.outstanding_transactions_on_ats_credit +
    //                     data.outstanding_transactions_on_ats_debit
    //                   ).toLocaleString();

    //                   data.beginning_balance_ats = Number(
    //                     data.beginning_balance_ats
    //                   ).toLocaleString();
    //                   data.ending_balance_ats = Number(
    //                     data.ending_balance_ats
    //                   ).toLocaleString();
    //                   // total_beginning_balance_core
    //                   this.total_beginning_balance_core = (
    //                     data.beginning_balance_core_ifb +
    //                     data.beginning_balance_core_conv
    //                   ).toLocaleString();
    //                   data.beginning_balance_core_ifb = Number(
    //                     data.beginning_balance_core_ifb
    //                   ).toLocaleString();
    //                   data.beginning_balance_core_conv = Number(
    //                     data.beginning_balance_core_conv
    //                   ).toLocaleString();
    //                   // total_ending_balance_core
    //                   this.total_ending_balance_core = (
    //                     data.ending_balance_core_ifb +
    //                     data.ending_balance_core_conv
    //                   ).toLocaleString();
    //                   data.ending_balance_core_ifb = Number(
    //                     data.ending_balance_core_ifb
    //                   ).toLocaleString();
    //                   data.ending_balance_core_conv = Number(
    //                     data.ending_balance_core_conv
    //                   ).toLocaleString();

    //                   this.outstanding_balance_core_total = (
    //                     data.outstanding_balance_on_core_credit +
    //                     data.outstanding_balance_on_core_debit
    //                   ).toLocaleString();
    //                   this.outstanding_balance_ats_total = (
    //                     data.outstanding_balance_on_ats_credit +
    //                     data.outstanding_balance_on_ats_debit
    //                   ).toLocaleString();

    //                   data.outstanding_balance_on_core_credit = Number(
    //                     data.outstanding_balance_on_core_credit
    //                   ).toLocaleString();
    //                   data.outstanding_balance_on_core_debit = Number(
    //                     data.outstanding_balance_on_core_debit
    //                   ).toLocaleString();
    //                   data.outstanding_balance_on_ats_credit = Number(
    //                     data.outstanding_balance_on_ats_credit
    //                   ).toLocaleString();
    //                   data.outstanding_balance_on_ats_debit = Number(
    //                     data.outstanding_balance_on_ats_debit
    //                   ).toLocaleString();

    //                   data.number_of_edited_transactions = Number(
    //                     data.number_of_edited_transactions
    //                   ).toLocaleString();
    //                   data.number_of_deleted_transactions = Number(
    //                     data.number_of_deleted_transactions
    //                   ).toLocaleString();

    //                   // ats_ending_balance + total_core_debit) - total_core_credit

    //                   // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

    //                   this.dashboard_data = data;
    //                   if (this.authService.isUser()) {
    //                     this.chartOne();
    //                     this.chartTwo();
    //                     this.chartThree();
    //                   }
    //                   this.data_is_ready = true;
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
    //       ///------------

    //     });
    //   //   this.dashboardService.getDashboardData().subscribe(
    //   //     (data: any) => {
    //   //       //69332711
    //   //       // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

    //   //       this.current_adjusted_balance_core = (
    //   //         Number(data.date_7_ending_balance_conv) +
    //   //         Number(data.date_7_ending_balance_ifb) +
    //   //         Number(data.outstanding_balance_on_ats_credit) -
    //   //         Number(data.outstanding_balance_on_ats_credit)
    //   //       ).toLocaleString();

    //   //       this.current_adjusted_balance_ats = (
    //   //         Number(data.date_7_ending_balance_ats) -
    //   //         Number(data.outstanding_balance_on_core_debit) +
    //   //         Number(data.outstanding_balance_on_core_credit)
    //   //       ).toLocaleString();

    //   //       data.total_number_of_transactions_core = Number(
    //   //         data.total_number_of_transactions_core
    //   //       ).toLocaleString();
    //   //       data.total_number_of_accounts = Number(
    //   //         data.total_number_of_accounts
    //   //       ).toLocaleString();
    //   //       data.total_number_of_currencies = Number(
    //   //         data.total_number_of_currencies
    //   //       ).toLocaleString();
    //   //       data.total_number_of_transactions_ats = Number(
    //   //         data.total_number_of_transactions_ats
    //   //       ).toLocaleString();
    //   //       data.total_number_of_files = Number(
    //   //         data.total_number_of_files
    //   //       ).toLocaleString();

    //   //       this.outstanding_core_total = (
    //   //         data.outstanding_transactions_on_core_credit +
    //   //         data.outstanding_transactions_on_core_debit
    //   //       ).toLocaleString();
    //   //       this.outstanding_ats_total = (
    //   //         data.outstanding_transactions_on_ats_credit +
    //   //         data.outstanding_transactions_on_ats_debit
    //   //       ).toLocaleString();

    //   //       data.beginning_balance_ats = Number(
    //   //         data.beginning_balance_ats
    //   //       ).toLocaleString();
    //   //       data.ending_balance_ats = Number(
    //   //         data.ending_balance_ats
    //   //       ).toLocaleString();
    //   //       // total_beginning_balance_core
    //   //       this.total_beginning_balance_core = (
    //   //         data.beginning_balance_core_ifb + data.beginning_balance_core_conv
    //   //       ).toLocaleString();
    //   //       data.beginning_balance_core_ifb = Number(
    //   //         data.beginning_balance_core_ifb
    //   //       ).toLocaleString();
    //   //       data.beginning_balance_core_conv = Number(
    //   //         data.beginning_balance_core_conv
    //   //       ).toLocaleString();
    //   //       // total_ending_balance_core
    //   //       this.total_ending_balance_core = (
    //   //         data.ending_balance_core_ifb + data.ending_balance_core_conv
    //   //       ).toLocaleString();
    //   //       data.ending_balance_core_ifb = Number(
    //   //         data.ending_balance_core_ifb
    //   //       ).toLocaleString();
    //   //       data.ending_balance_core_conv = Number(
    //   //         data.ending_balance_core_conv
    //   //       ).toLocaleString();

    //   //       this.outstanding_balance_core_total = (
    //   //         data.outstanding_balance_on_core_credit +
    //   //         data.outstanding_balance_on_core_debit
    //   //       ).toLocaleString();
    //   //       this.outstanding_balance_ats_total = (
    //   //         data.outstanding_balance_on_ats_credit +
    //   //         data.outstanding_balance_on_ats_debit
    //   //       ).toLocaleString();

    //   //       data.outstanding_balance_on_core_credit = Number(
    //   //         data.outstanding_balance_on_core_credit
    //   //       ).toLocaleString();
    //   //       data.outstanding_balance_on_core_debit = Number(
    //   //         data.outstanding_balance_on_core_debit
    //   //       ).toLocaleString();
    //   //       data.outstanding_balance_on_ats_credit = Number(
    //   //         data.outstanding_balance_on_ats_credit
    //   //       ).toLocaleString();
    //   //       data.outstanding_balance_on_ats_debit = Number(
    //   //         data.outstanding_balance_on_ats_debit
    //   //       ).toLocaleString();

    //   //       data.number_of_edited_transactions = Number(
    //   //         data.number_of_edited_transactions
    //   //       ).toLocaleString();
    //   //       data.number_of_deleted_transactions = Number(
    //   //         data.number_of_deleted_transactions
    //   //       ).toLocaleString();

    //   //       // ats_ending_balance + total_core_debit) - total_core_credit

    //   //       // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

    //   //       this.dashboard_data = data;
    //   //       if (this.authService.isUser()) {
    //   //         this.chartOne();
    //   //         this.chartTwo();
    //   //         this.chartThree();
    //   //       }
    //   //       this.data_is_ready = true;
    //   //     },
    //   //     (error) => {
    //   //       if (error.error.text === 'access-token-expired') {
    //   //         console.log('Access-token-expired requesting refresh token...');
    //   //         if (
    //   //           this.localStorageService.retrieve('refresh_token_requested') ==
    //   //           null
    //   //         ) {
    //   //           this.utilService.refreshToken().subscribe(
    //   //             (data) => {
    //   //               if (data === true) {
    //   //                 console.log(
    //   //                   'refresh token success re-requesting the actual request'
    //   //                 );
    //   //                 this.localStorageService.clear('refresh_token_requested');
    //   //                 //================================================================================
    //   //                 this.dashboardService.getDashboardData().subscribe(
    //   //                   (data: any) => {
    //   //                     console.log(
    //   //                       'dashboard data: ' + JSON.stringify(data, null, 6)
    //   //                     );
    //   //                     console.log(
    //   //                       'number_of_edited_transactions: ' +
    //   //                         Number(
    //   //                           data.total_number_of_transactions_core
    //   //                         ).toLocaleString()
    //   //                     );
    //   //                     //69332711
    //   //                     // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

    //   //                     this.current_adjusted_balance_core = (
    //   //                       Number(data.date_7_ending_balance_conv) +
    //   //                       Number(data.date_7_ending_balance_ifb) +
    //   //                       Number(data.outstanding_balance_on_ats_credit) -
    //   //                       Number(data.outstanding_balance_on_ats_credit)
    //   //                     ).toLocaleString();

    //   //                     this.current_adjusted_balance_ats = (
    //   //                       Number(data.date_7_ending_balance_ats) -
    //   //                       Number(data.outstanding_balance_on_core_debit) +
    //   //                       Number(data.outstanding_balance_on_core_credit)
    //   //                     ).toLocaleString();

    //   //                     data.total_number_of_transactions_core = Number(
    //   //                       data.total_number_of_transactions_core
    //   //                     ).toLocaleString();
    //   //                     data.total_number_of_accounts = Number(
    //   //                       data.total_number_of_accounts
    //   //                     ).toLocaleString();
    //   //                     data.total_number_of_currencies = Number(
    //   //                       data.total_number_of_currencies
    //   //                     ).toLocaleString();
    //   //                     data.total_number_of_transactions_ats = Number(
    //   //                       data.total_number_of_transactions_ats
    //   //                     ).toLocaleString();
    //   //                     data.total_number_of_files = Number(
    //   //                       data.total_number_of_files
    //   //                     ).toLocaleString();

    //   //                     this.outstanding_core_total = (
    //   //                       data.outstanding_transactions_on_core_credit +
    //   //                       data.outstanding_transactions_on_core_debit
    //   //                     ).toLocaleString();
    //   //                     this.outstanding_ats_total = (
    //   //                       data.outstanding_transactions_on_ats_credit +
    //   //                       data.outstanding_transactions_on_ats_debit
    //   //                     ).toLocaleString();

    //   //                     data.beginning_balance_ats = Number(
    //   //                       data.beginning_balance_ats
    //   //                     ).toLocaleString();
    //   //                     data.ending_balance_ats = Number(
    //   //                       data.ending_balance_ats
    //   //                     ).toLocaleString();
    //   //                     // total_beginning_balance_core
    //   //                     this.total_beginning_balance_core = (
    //   //                       data.beginning_balance_core_ifb +
    //   //                       data.beginning_balance_core_conv
    //   //                     ).toLocaleString();
    //   //                     data.beginning_balance_core_ifb = Number(
    //   //                       data.beginning_balance_core_ifb
    //   //                     ).toLocaleString();
    //   //                     data.beginning_balance_core_conv = Number(
    //   //                       data.beginning_balance_core_conv
    //   //                     ).toLocaleString();
    //   //                     // total_ending_balance_core
    //   //                     this.total_ending_balance_core = (
    //   //                       data.ending_balance_core_ifb +
    //   //                       data.ending_balance_core_conv
    //   //                     ).toLocaleString();
    //   //                     data.ending_balance_core_ifb = Number(
    //   //                       data.ending_balance_core_ifb
    //   //                     ).toLocaleString();
    //   //                     data.ending_balance_core_conv = Number(
    //   //                       data.ending_balance_core_conv
    //   //                     ).toLocaleString();

    //   //                     this.outstanding_balance_core_total = (
    //   //                       data.outstanding_balance_on_core_credit +
    //   //                       data.outstanding_balance_on_core_debit
    //   //                     ).toLocaleString();
    //   //                     this.outstanding_balance_ats_total = (
    //   //                       data.outstanding_balance_on_ats_credit +
    //   //                       data.outstanding_balance_on_ats_debit
    //   //                     ).toLocaleString();

    //   //                     data.outstanding_balance_on_core_credit = Number(
    //   //                       data.outstanding_balance_on_core_credit
    //   //                     ).toLocaleString();
    //   //                     data.outstanding_balance_on_core_debit = Number(
    //   //                       data.outstanding_balance_on_core_debit
    //   //                     ).toLocaleString();
    //   //                     data.outstanding_balance_on_ats_credit = Number(
    //   //                       data.outstanding_balance_on_ats_credit
    //   //                     ).toLocaleString();
    //   //                     data.outstanding_balance_on_ats_debit = Number(
    //   //                       data.outstanding_balance_on_ats_debit
    //   //                     ).toLocaleString();

    //   //                     data.number_of_edited_transactions = Number(
    //   //                       data.number_of_edited_transactions
    //   //                     ).toLocaleString();
    //   //                     data.number_of_deleted_transactions = Number(
    //   //                       data.number_of_deleted_transactions
    //   //                     ).toLocaleString();

    //   //                     // ats_ending_balance + total_core_debit) - total_core_credit

    //   //                     // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

    //   //                     this.dashboard_data = data;
    //   //                     if (this.authService.isUser()) {
    //   //                       this.chartOne();
    //   //                       this.chartTwo();
    //   //                       this.chartThree();
    //   //                     }
    //   //                     this.data_is_ready = true;
    //   //                   },
    //   //                   (error) => {
    //   //                     if (error.error.text === 'access-token-expired') {
    //   //                       console.log('refresh token expired.');
    //   //                       this.SwalSessionExpired.fire();
    //   //                       this._refreshTokenExpired();
    //   //                     } else {
    //   //                       Swal.fire({
    //   //                         icon: 'error',
    //   //                         title: 'Oops...',
    //   //                         text: 'Something went wrong!',
    //   //                       });
    //   //                       console.log(
    //   //                         JSON.stringify(error.error.apierror, null, 2)
    //   //                       );
    //   //                     }
    //   //                   }
    //   //                 );
    //   //                 //================================================================================
    //   //               } else {
    //   //                 console.log('refresh token expired.');
    //   //                 this.SwalSessionExpired.fire();
    //   //                 this._refreshTokenExpired();
    //   //               }
    //   //             },
    //   //             (error: any) => {
    //   //               console.log('error refreshing access token');
    //   //               Swal.fire({
    //   //                 icon: 'error',
    //   //                 title: 'Oops...',
    //   //                 text: 'Something went wrong!',
    //   //               });
    //   //               console.log(JSON.stringify(error.error.apierror, null, 2));
    //   //             }
    //   //           );
    //   //           this.localStorageService.store('refresh_token_requested', true);
    //   //         }
    //   //       }else {
    //   //         Swal.fire({
    //   //           icon: 'error',
    //   //           title: 'Oops...',
    //   //           text: 'Something went wrong!',
    //   //         });
    //   //         console.log(JSON.stringify(error.error.apierror, null, 2));
    //   //       }
    //   //     }


    //   // );
    // }
  }

    //Manager  Dashboard start


  populateManagerDashboardData() {
      if (this.authService.isManager() || this.authService.isDirector()|| this.authService.isChief()|| this.authService.isFinance()) {
        this.utilService.checkAccessTokenDoesNotExpired().subscribe(
          (data: any) => {
            if (data == true) {
              console.log("------------------ token not expired")
              this.managerService.getManagerDashboardData().subscribe(
                (data1: any) => {
                  console.log('data: ' + JSON.stringify(data1, null, 4));
                   this.total_payments = Number(data1.total_payments).toLocaleString();
                   this.total_payments_amount = Number(data1.total_payments_amount).toString();
                   this.Initiated_payments = Number(data1.Initiated_payments).toLocaleString();
                  this.NotInitiated_payments = Number(data1.NotInitiated_payments).toLocaleString();
                  this.total_payments_paid = Number(data1.total_payments_paid).toLocaleString();
                  this.reject_payments = Number(data1.reject_payments).toLocaleString();
                  this.reject_payments_amount = Number(data1.reject_payments_amount).toString();

                  this.total_Addedumpayments = Number(data1.total_Addedumpayments).toLocaleString();
                  this.total_Addedumpayments_amount = Number(data1.total_Addedumpayments_amount).toString();
                  this.Initiated_Addedumpayments = Number(data1.Initiated_Addedumpayments).toLocaleString();
                 this.NotInitiated_Addedumpayments = Number(data1.NotInitiated_Addedumpayments).toLocaleString();
                 this.total_Addedumpayments_paid = Number(data1.total_Addedumpayments_paid).toLocaleString();
                 this.reject_Addedumpayments = Number(data1.reject_Addedumpayments).toLocaleString();
                 this.ExcessedDueDate_Addedumpayments = Number(data1.AddedumExcessedDueDate_payments).toLocaleString();
                 this.ExcessedDueDate_payments = Number(data1.ExcessedDueDate_payments).toLocaleString();
                 this.under_manager_review = Number(data1.under_manager_review).toLocaleString();
                 this.under_director_review = Number(data1.under_director_review).toLocaleString();
                 this.under_chief_review = Number(data1.under_chief_review).toLocaleString();
                 this.under_Finance_review = Number(data1.under_Finance_review).toLocaleString();
                 
                this.Initiated_payments_amount = Number(data1.Initiated_payments_amount).toString();
                this.NotInitiated_payments_amount = Number(data1.NotInitiated_payments_amount).toString();
                this.total_payments_paid_amount = Number(data1.total_payments_paid_amount).toString();

                this.Initiated_Addedumpayments_amount = Number(data1.Initiated_Addedumpayments_amount).toString();
               this.NotInitiated_Addedumpayments_amount = Number(data1.NotInitiated_Addedumpayments_amount).toString();
               this.total_Addedumpayments_paid_amount = Number(data1.total_Addedumpayments_paid_amount).toString();
               this.reject_Addedumpayments_amount = Number(data1.reject_Addedumpayments_amount).toString();
               this.ExcessedDueDate_Addedumpayments_amount = Number(data1.AddedumExcessedDueDate_payments_amount).toString();
               this.ExcessedDueDate_payments_amount = Number(data1.ExcessedDueDate_payments_amount).toString();
               this.total_payments_Detail_amount = Number(data1.total_payments_Detail_amount).toString();
  
                  this.managerDashboard_data = data1;
                  this.manager_data_is_ready = true;
                  this.chartTen();
                  this.chartEleven();
                  this.chartTwelve();
                  
  ;              });
  
            }
          },
          (error: any) => {
            console.log("------------------ token expired")
            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            ) {
  
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual requestttttt'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.managerService.getManagerDashboardData().subscribe(
                      (data1: any) => {
                        this.Initiated_payments = Number(
                          data1.Initiated_payments
                        ).toString();
                        this.NotInitiated_payments = Number(
                          data1.NotInitiated_payments
                        ).toLocaleString();
                        this.total_payments = Number(
                          data1.total_payments
                        ).toLocaleString();
                        this.total_payments_amount = Number(
                          data1.total_payments_amount
                        ).toString();
                        this.reject_payments= Number(
                          data1.reject_payments
                        ).toLocaleString();
                        this.total_payments_paid = Number(data1.total_payments_paid).toLocaleString();
                        this.ExcessedDueDate_payments = Number(data1.ExcessedDueDate_payments).toLocaleString();

                        this.total_Addedumpayments = Number(data1.total_Addedumpayments).toLocaleString();
                        this.Initiated_Addedumpayments = Number(data1.Initiated_pAddedumayments).toLocaleString();
                        this.NotInitiated_Addedumpayments = Number(data1.NotInitiated_Addedumpayments).toLocaleString();
                        this.total_Addedumpayments = Number(data1.total_Addedumpayments).toLocaleString();
                        this.total_Addedumpayments_amount = Number(data1.total_Addedumpayments_amount).toString();
                        this.reject_Addedumpayments= Number(data1.reject_Addedumpayments ).toLocaleString();
                        this.total_Addedumpayments_paid = Number(data1.total_Addedumpayments_paid).toLocaleString();
                        this.ExcessedDueDate_Addedumpayments = Number(data1.AddedumExcessedDueDate_payments).toLocaleString();

                        this.under_manager_review = Number(data1.under_manager_review).toLocaleString();
                        this.under_director_review = Number(data1.under_director_review).toLocaleString();
                        this.under_chief_review = Number(data1.under_chief_review).toLocaleString();
                        this.under_Finance_review = Number(data1.under_Finance_review).toLocaleString();
                      
  
                        this.Initiated_payments_amount = Number(data1.Initiated_payments_amount).toString();
                        this.NotInitiated_payments_amount = Number(data1.NotInitiated_payments_amount).toString();
                        this.total_payments_paid_amount = Number(data1.total_payments_paid_amount).toString();
        
                        this.Initiated_Addedumpayments_amount = Number(data1.Initiated_Addedumpayments_amount).toString();
                       this.NotInitiated_Addedumpayments_amount = Number(data1.NotInitiated_Addedumpayments_amount).toString();
                       this.total_Addedumpayments_paid_amount = Number(data1.total_Addedumpayments_paid_amount).toString();
                       this.reject_Addedumpayments_amount = Number(data1.reject_Addedumpayments_amount).toString();
                       this.ExcessedDueDate_Addedumpayments_amount = Number(data1.AddedumExcessedDueDate_payments_amount).toString();
                       this.ExcessedDueDate_payments_amount = Number(data1.ExcessedDueDate_payments_amount).toString()
          
  
                        this.managerDashboard_data = data1;
                        this.manager_data_is_ready = true;
                        this.chartTen();
                        this.chartEleven();
                        this.chartTwelve();
                      },
                      (error) => {
  
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
  
          });
      }
    }

  populateManagerDetailDashboardData(contract_id: number) {
      if (this.authService.isManager() || this.authService.isDirector() || this.authService.isChief() || this.authService.isFinance()) {
        this.utilService.checkAccessTokenDoesNotExpired().subscribe(
          (data: any) => {
            if (data === true) {
              console.log("Using contract_id: " + contract_id); // Logging passed contract_id
              this.managerService.getManagerDetailDashboardData(contract_id).subscribe(
                (data1: any) => {
                  console.log('dataDetail: ' + JSON.stringify(data1, null, 4));
                  this.total_payments_Detail = Number(data1.total_payments_Detail).toLocaleString();
                  this.total_payments_Detail_amount = Number(data1.total_payments_Detail_amount).toString();
                  this.Initiated__Detail_payments = Number(data1.Initiated__Detail_payments).toString();
                  this.Initiated_payments_Detail_amount = Number(data1.Initiated_payments_Detail_amount).toString();
                  this.NotInitiated__Detail_payments = Number(data1.NotInitiated__Detail_payments).toString();
                  this.NotInitiated_payments_Detail_amount = Number(data1.NotInitiated_payments_Detail_amount).toString();
                  this.total_Detail_payments_paid = Number(data1.total_Detail_payments_paid).toString();
                  this.total_payments_Detail_amount_paid = Number(data1.total_payments_Detail_amount_paid).toString();
                  this.reject_payments_Detail = Number(data1.reject_payments_Detail).toString();
                  this.reject_payments_Detail_amount = Number(data1.reject_payments_Detail_amount).toString();
                  this.ExcessedDueDate_payments_Detail = Number(data1.ExcessedDueDate_payments_Detail).toString();
                  this.ExcessedDueDate_payments_Detail_amount = Number(data1.ExcessedDueDate_payments_Detail_amount).toString();
                  this.managerDetailDashboard_data = data1;
                  this.manager_detail_data_is_ready = true;
                  this.chartForteen();
                  this.chartThriteen();
                  
                },
                (error) => {
                  console.log("Error fetching data:", error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong while fetching the manager dashboard data!',
                  });
                }
              );
            }
          },
          (error: any) => {
            console.log("------------------ token expired");
            if (this.localStorageService.retrieve('refresh_token_requested') === null) {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log('Refresh token success, re-requesting manager data');
                    this.localStorageService.clear('refresh_token_requested');
                    this.managerService.getManagerDetailDashboardData(contract_id).subscribe(
                      (data1: any) => {
                        this.total_payments_Detail = Number(data1.total_payments_Detail).toLocaleString();
                        this.total_payments_Detail_amount = Number(data1.total_payments_Detail_amount).toString();
                        this.Initiated__Detail_payments = Number(data1.Initiated__Detail_payments).toString();
                        this.Initiated_payments_Detail_amount = Number(data1.Initiated_payments_Detail_amount).toString();
                        this.NotInitiated__Detail_payments = Number(data1.NotInitiated__Detail_payments).toString();
                        this.NotInitiated_payments_Detail_amount = Number(data1.NotInitiated_payments_Detail_amount).toString();
                        this.total_Detail_payments_paid = Number(data1.total_Detail_payments_paid).toString();
                        this.total_payments_Detail_amount_paid = Number(data1.total_payments_Detail_amount_paid).toString();
                        this.reject_payments_Detail = Number(data1.reject_payments_Detail).toString();
                        this.reject_payments_Detail_amount = Number(data1.reject_payments_Detail_amount).toString();
                        this.ExcessedDueDate_payments_Detail = Number(data1.ExcessedDueDate_payments_Detail).toString();
                        this.ExcessedDueDate_payments_Detail_amount = Number(data1.ExcessedDueDate_payments_Detail_amount).toString();
                        this.managerDetailDashboard_data = data1;
                        this.manager_detail_data_is_ready = true;
                        this.chartForteen();
                        this.chartThriteen();
                       
                      },
                      (error) => {
                        console.log('Error fetching data after token refresh:', error);
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong after refreshing the token!',
                        });
                      }
                    );
                  } else {
                    console.log('Refresh token expired.');
                    this.SwalSessionExpired.fire();
                    this._refreshTokenExpired();
                  }
                },
                (error: any) => {
                  console.log('Error refreshing access token');
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong while refreshing the access token!',
                  });
                }
              );
              this.localStorageService.store('refresh_token_requested', true);
            }
          }
        );
      }
    }
    
  
  
    // Manager Dashboard end
  chartOne() {
    const data = {
      labels: [
        this.dashboard_data.date_1_1,
        this.dashboard_data.date_2_1,
        this.dashboard_data.date_3_1,
        this.dashboard_data.date_4_1,
        this.dashboard_data.date_5_1,
        this.dashboard_data.date_6_1,
        this.dashboard_data.date_7_1,
      ],
      datasets: [
        {
          label: 'Uploaded-ATS',
          data: [
            this.dashboard_data.date_1_total_upload_ats,
            this.dashboard_data.date_2_total_upload_ats,
            this.dashboard_data.date_3_total_upload_ats,
            this.dashboard_data.date_4_total_upload_ats,
            this.dashboard_data.date_5_total_upload_ats,
            this.dashboard_data.date_6_total_upload_ats,
            this.dashboard_data.date_7_total_upload_ats,
          ],
          backgroundColor: '#FF8066',
          barThickness: 15,
          stack: 'Stack 0',
        },
        {
          label: 'Uploaded-CORE',
          data: [
            this.dashboard_data.date_1_total_upload_core,
            this.dashboard_data.date_2_total_upload_core,
            this.dashboard_data.date_3_total_upload_core,
            this.dashboard_data.date_4_total_upload_core,
            this.dashboard_data.date_5_total_upload_core,
            this.dashboard_data.date_6_total_upload_core,
            this.dashboard_data.date_7_total_upload_core,
          ],
          backgroundColor: '#2C73D2',
          barThickness: 15,
          stack: 'Stack 0',
        },
        {
          label: 'Matched-ATS',
          data: [
            this.dashboard_data.date_1_matched_ats,
            this.dashboard_data.date_2_matched_ats,
            this.dashboard_data.date_3_matched_ats,
            this.dashboard_data.date_4_matched_ats,
            this.dashboard_data.date_5_matched_ats,
            this.dashboard_data.date_6_matched_ats,
            this.dashboard_data.date_7_matched_ats,
          ],
          backgroundColor: '#0089BA',
          barThickness: 15,
          stack: 'Stack 1',
        },
        {
          label: 'Matched-CORE',
          data: [
            this.dashboard_data.date_1_matched_core,
            this.dashboard_data.date_2_matched_core,
            this.dashboard_data.date_3_matched_core,
            this.dashboard_data.date_4_matched_core,
            this.dashboard_data.date_5_matched_core,
            this.dashboard_data.date_6_matched_core,
            this.dashboard_data.date_7_matched_core,
          ],
          backgroundColor: '#008F7A',
          barThickness: 15,
          stack: 'Stack 1',
        },
        {
          label: 'Outstanding-ATS',
          data: [
            this.dashboard_data.date_1_outstanding_core,
            this.dashboard_data.date_2_outstanding_core,
            this.dashboard_data.date_3_outstanding_core,
            this.dashboard_data.date_4_outstanding_core,
            this.dashboard_data.date_5_outstanding_core,
            this.dashboard_data.date_6_outstanding_core,
            this.dashboard_data.date_7_outstanding_core,
          ],
          backgroundColor: '#B39CD0',
          barThickness: 15,
          stack: 'Stack 2',
        },
        {
          label: 'Outstanding-CORE',
          data: [
            this.dashboard_data.date_1_outstanding_core,
            this.dashboard_data.date_2_outstanding_core,
            this.dashboard_data.date_3_outstanding_core,
            this.dashboard_data.date_4_outstanding_core,
            this.dashboard_data.date_5_outstanding_core,
            this.dashboard_data.date_6_outstanding_core,
            this.dashboard_data.date_7_outstanding_core,
          ],
          backgroundColor: '#00C9A7',
          barThickness: 15,
          stack: 'Stack 2',
        },
      ],
    };
    this.chart1 = new Chart('MyChart', {
      type: 'bar',

      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
    if (this.chart1.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart1_no_data = true;
    }
  }
  chartTwo() {
    const data = {
      labels: ['RTGS', 'ERCA', 'SOS', 'B2B'],
      datasets: [
        {
          label: 'CORE',
          data: [
            this.dashboard_data.number_of_matched_transactions_core_rtgs,
            this.dashboard_data.number_of_matched_transactions_core_erca,
            this.dashboard_data.number_of_matched_transactions_core_sos,
            this.dashboard_data.number_of_matched_transactions_core_b2b,
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(45, 59, 144)',
          ],
        },
        {
          label: 'ATS',
          data: [
            this.dashboard_data.number_of_matched_transactions_ats_rtgs,
            this.dashboard_data.number_of_matched_transactions_ats_erca,
            this.dashboard_data.number_of_matched_transactions_ats_sos,
            this.dashboard_data.number_of_matched_transactions_ats_b2b,
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(45, 59, 144)',
          ],
        },
      ],
    };
    this.chart2 = new Chart('MyChart2', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
          // title: {
          //   display: true,
          //   text: 'Chart.js Pie Chart',
          // },
        },
      },
    });
    if (this.chart2.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart2_no_data = true;
    }
  }
  chartThree() {
    console.log('dddd: ' + this.dashboard_data.date_5_beginning_balance_ifb);
    console.log('dddd: ' + this.dashboard_data.date_5_beginning_balance_conv);
    console.log(
      'dddd: ' +
      Number(this.dashboard_data.date_5_beginning_balance_ifb) +
      Number(this.dashboard_data.date_5_beginning_balance_conv)
    );

    const data = {
      labels: [
        this.dashboard_data.date_1_1.slice(3, 5) + '-beg',
        this.dashboard_data.date_1_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_2_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_2_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_3_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_3_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_4_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_4_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_5_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_5_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_6_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_6_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_7_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_7_1.slice(3, 5) + '-end',
      ],
      datasets: [
        {
          label: 'ATS Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_ats,
            this.dashboard_data.date_2_beginning_balance_ats,
            this.dashboard_data.date_3_beginning_balance_ats,
            this.dashboard_data.date_4_beginning_balance_ats,
            this.dashboard_data.date_5_beginning_balance_ats,
            this.dashboard_data.date_6_beginning_balance_ats,
            this.dashboard_data.date_7_beginning_balance_ats,
            this.dashboard_data.date_7_ending_balance_ats,
          ],
          fill: false,
          borderColor: 'limegreen',
          tension: 0.1,
        },
        {
          label: 'CORE Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_ifb +
            this.dashboard_data.date_1_beginning_balance_conv,
            this.dashboard_data.date_2_beginning_balance_ifb +
            this.dashboard_data.date_2_beginning_balance_conv,
            this.dashboard_data.date_3_beginning_balance_ifb +
            this.dashboard_data.date_3_beginning_balance_conv,
            this.dashboard_data.date_4_beginning_balance_ifb +
            this.dashboard_data.date_4_beginning_balance_conv,
            this.dashboard_data.date_5_beginning_balance_ifb +
            this.dashboard_data.date_5_beginning_balance_conv,
            this.dashboard_data.date_6_beginning_balance_ifb +
            this.dashboard_data.date_6_beginning_balance_conv,
            this.dashboard_data.date_7_beginning_balance_ifb +
            this.dashboard_data.date_7_beginning_balance_conv,
            this.dashboard_data.date_7_ending_balance_ifb +
            this.dashboard_data.date_7_ending_balance_conv,
          ],
          fill: false,
          borderColor: 'red',
          tension: 0.1,
        },
        {
          label: 'CORE-IFB Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_ifb,
            this.dashboard_data.date_2_beginning_balance_ifb,
            this.dashboard_data.date_3_beginning_balance_ifb,
            this.dashboard_data.date_4_beginning_balance_ifb,
            this.dashboard_data.date_5_beginning_balance_ifb,
            this.dashboard_data.date_6_beginning_balance_ifb,
            this.dashboard_data.date_7_beginning_balance_ifb,
            this.dashboard_data.date_7_ending_balance_ifb,
          ],
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
        },
        {
          label: 'CORE-CONV Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_conv,
            this.dashboard_data.date_2_beginning_balance_conv,
            this.dashboard_data.date_3_beginning_balance_conv,
            this.dashboard_data.date_4_beginning_balance_conv,
            this.dashboard_data.date_5_beginning_balance_conv,
            this.dashboard_data.date_6_beginning_balance_conv,
            this.dashboard_data.date_7_beginning_balance_conv,
            this.dashboard_data.date_7_ending_balance_conv,
          ],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
    this.chart3 = new Chart('MyChart3', {
      type: 'line',
      data: data,
      options: {
        aspectRatio: 2.5,
      },
    });
    if (this.chart3.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart3_no_data = true;
    }
  }
  ////////////////////////      chart4  begin       //////////////////////////////////
  chartFour() {
    const data = {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [
        {
          label: 'user',
          data: [
            this.approverDashboard_data.total_pending_user,
            this.approverDashboard_data.total_approved_user,
            this.approverDashboard_data.total_rejected_user,
          ],
          backgroundColor: [
            'rgb(210, 210, 129)',
            'rgb(102, 123, 123)',
            'rgb(210, 139, 178)',
          ],
        },
        // {
        //   label: 'pool',
        //   data: [
        //     this.dashboard_data.number_of_pool_approved,
        //     this.dashboard_data.number_of_pool_pending,
        //     this.dashboard_data.number_of_pool_rejected,
        //   ],
        //   backgroundColor: [
        //     'rgb(102, 153, 153)',
        //     'rgb(210, 210, 210)',
        //     'rgb(255, 204, 204)',
        //   ],
        // },
      ],
    };
    this.chart4 = new Chart('MyChart4', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
          // title: {
          //   display: true,
          //   text: 'Chart.js Pie Chart',
          // },
        },
      },
    });
    if (this.chart4.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart4_no_data = true;
    }
  }
  ////////////////////////       chart end        //////////////////////////////////
  chartFive() {
    const data = {
      labels: ['Admin', 'Maker','Checker', 'Approver'],
      datasets: [
        {
          label: 'functionalities',
          data: [
            this.adminDashboard_data.total_number_of_admin_functionalities,
            this.adminDashboard_data.total_number_of_maker_functionalities,
            this.adminDashboard_data.total_number_of_checker_functionalities,
            this.adminDashboard_data.total_number_of_approver_functionalities,
          ],
          backgroundColor: [
            'rgb(0, 99, 132)',
            'rgb(155, 122, 33)',
            'rgb(124, 162, 35)',
            'rgb(155, 205, 226)',
          ],
        },
      ],
    };
    this.chart5 = new Chart('MyChart5', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
          // title: {
          //   display: true,
          //   text: 'Chart.js Pie Chart',
          // },
        },
      },
    });
    if (this.chart5.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart5_no_data = true;
    }
  }

  chartSix() {
    const data = {
      labels: ['Pending='+this.pending_vendors, 
               'Activate='+this.active_vendors_requests, 
               'Deactivate='+this.deactive_vendors_requests, 
               'Update='+ this.update_vendors_requests, 
               'Delete='+this.delete_vendors_requests
              ],
      datasets: [
        {
          label: 'Vendor Requests',
          data: [
            this.pending_vendors,
            this.active_vendors_requests,
            this.deactive_vendors_requests,
            this.update_vendors_requests,
            this.delete_vendors_requests,
          ],
          backgroundColor: [
            'rgb(155, 122, 33)',
            'rgb(0, 128, 0)',
            'rgb(155, 99, 132)',
            'rgb(0, 99, 132)',
            'rgb(255, 99, 132)',
          ],
        },
      ],
    };
    this.chart6 = new Chart('MyChart6', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedElementIndex = elements[0].index;
            const label = data.labels[clickedElementIndex];
            this.handleChartClickVendor(label);
          }
        },
      },
    });
    if (this.chart6.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart6_no_data = true;
    }
  }

  chartSeven() {
    const data = {
      labels: [
        " Vendors :",
      ],
      datasets: [
        {
          label: 'Total= '+this.total_vendors,
          data: [
            this.total_vendors
          ],
          backgroundColor: '#008F7A',
          barThickness: 25,
          stack: 'Stack 0',
        },
        {
          label: 'Has Contract= '+this.working_vendors,
          data: [
            this.working_vendors
          ],
          backgroundColor: 'rgb(0, 99, 132)',
          barThickness: 25,
          stack: 'Stack 1',
        },

        {
          label: 'No Contract= '+this.Has_no_contract,
          data: [
            this.Has_no_contract
          ],
          backgroundColor: 'orange',
          barThickness: 25,
          stack: 'Stack 2',
        },
        {
          label: 'Active= '+this.active_vendors,
          data: [
            this.active_vendors
          ],
          backgroundColor: 'rgb(155, 99, 132)',
          barThickness: 25,
          stack: 'Stack 3',
        },
        {
          label: 'Inactive= '+this.deactive_vendors,
          data: [
            this.deactive_vendors
          ],
          backgroundColor: 'rgb(255, 99, 132)',
          barThickness: 25,
          stack: 'Stack 4',
        },


      ],


    };
    this.chart7 = new Chart('MyChart7', {
      type: 'bar',

      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        onClick: (event, elements) => {
                if (elements.length > 0) {
                    const clickedElementIndex = elements[0].index;
                    const label = data.datasets[elements[0].datasetIndex].label;
                    this.handleChartClickVendor(label);

                }
            }
      },
    });
    if (this.chart7.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart7_no_data = true;
    }
  }



  chartEight() {
    const data = {
      labels: ['Pending='+this.pending_contracts, 
               'Holds='+this.hold_contracts_requests, 
               'Unhold='+this.unhold_contracts_requests, 
               'Extend='+this.extend_contracts_requests,
               'Renewal='+this.renew_contracts_requests,
               'Terminate ='+this.terminate_contracts_requests],
      datasets: [
        {
          label: 'Contract Requests',
          data: [
            this.pending_contracts,
            this.hold_contracts_requests,
            this.unhold_contracts_requests,
            this.extend_contracts_requests,
            this.renew_contracts_requests,
            this.terminate_contracts_requests,
          ],
          backgroundColor: [
            'rgb(155, 122, 33)',
            'rgb(155, 99, 132)',
            '#008F7A',
            'rgb(45, 59, 144)',
            'rgb(0, 128, 0)',,
            'rgb(255, 99, 1)',
          ],
        },

      ],
    };
    this.chart8 = new Chart('MyChart8', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedElementIndex = elements[0].index;
            const label = data.labels[clickedElementIndex];
            this.handleChartClickContract(label);
          }
        },
      },
    });
    if (this.chart8.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart8_no_data = true;
    }
  }


  chartNinth() {
    const data = {
      labels: [
        "Contracts :",
    ],
    
      datasets: [
        {
          label: 'Total='+this.total_contracts,
          data: [
            this.total_contracts
          ],
          backgroundColor: '#008F7A',
          barThickness: 15,
          stack: 'Stack 0',
        },
        {
          label: 'Active='+ this.active_contracts,
          data: [
            this.active_contracts
          ],
          backgroundColor: 'rgb(155, 99, 132)',
          barThickness: 15,
          stack: 'Stack 1',
        },
        {
          label: 'Renew ='+this.renew_contracts,
          data: [
            this.renew_contracts
          ],
          backgroundColor: 'rgb(0, 99, 132)',
          barThickness: 15,
          stack: 'Stack 2',
        },
        {
          label: 'Hold='+this.hold_contracts,
          data: [
            this.hold_contracts
          ],
          backgroundColor: 'orange',
          barThickness: 15,
          stack: 'Stack 3',
        },
        {
          label: 'Terminated ='+this.terminate_contracts,
          data: [
            this.reject_vendors
          ],
          backgroundColor: 'rgb(255, 99, 1)',
          barThickness: 15,
          stack: 'Stack 4',
        },
        {
          label: 'Extended ='+this.extend_contracts,
          data: [
            this.extend_contracts
          ],
          backgroundColor: 'rgb(155, 233, 129)',
          barThickness: 15,
          stack: 'Stack 5',
        },
        // {
        //   label: 'Rejected ',
        //   data: [
        //     this.reject_contracts
        //   ],
        //   backgroundColor: 'rgb(255, 99, 132)',
        //   barThickness: 15,
        //   stack: 'Stack 6',
        // },

      ],


    };
    this.chart9 = new Chart('MyChart9', {
      type: 'bar',

      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
              const clickedElementIndex = elements[0].index;
              const label = data.datasets[elements[0].datasetIndex].label;
              this.handleChartClickContract(label);

          }
      }
      },
    });
    if (this.chart9.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart9_no_data = true;
    }
  }

  chartTen() {
    const toNum = (val: unknown): number => Number(val) || 0;

  
    const data = {
      labels: ["Payments", "Addendum Payments"],
      datasets: [
        // Normal Payments
        {
          label: 'Total = ' + this.total_payments,
          data: [toNum(this.total_payments), null],
          backgroundColor: 'blue',
          barThickness: 25,
          stack: '0',
        },
        {
          label: 'Reject = ' + this.reject_payments,
          data: [toNum(this.reject_payments), null],
          backgroundColor: 'rgb(132, 0, 2)',
          barThickness: 25,
          stack: '1',
        },
        {
          label: 'Paid = ' + this.total_payments_paid,
          data: [toNum(this.total_payments_paid), null],
          backgroundColor: 'green',
          barThickness: 25,
          stack: '2',
        },
        {
          label: 'Not Initiated = ' + this.NotInitiated_payments,
          data: [toNum(this.NotInitiated_payments), null],
          backgroundColor: 'rgb(141, 7, 121)',
          barThickness: 25,
          stack: '3',
        },
        {
          label: 'Initiated = ' + this.Initiated_payments,
          data: [toNum(this.Initiated_payments), null],
          backgroundColor: 'rgb(12, 25, 134)',
          barThickness: 25,
          stack: '4',
        },
        {
          label: 'Expired = ' + this.ExcessedDueDate_payments,
          data: [toNum(this.ExcessedDueDate_payments), null],
          backgroundColor: 'red',
          barThickness: 25,
          stack: '5',
        },
  
        // Addendum Payments
        {
          label: 'Total Addendum = ' + this.total_Addedumpayments,
          data: [null, toNum(this.total_Addedumpayments)],
          backgroundColor: 'blue',
          barThickness: 25,
          stack: '0',
        },
        {
          label: 'Reject Addendum = ' + this.reject_Addedumpayments,
          data: [null, toNum(this.reject_Addedumpayments)],
          backgroundColor: 'rgb(132, 0, 2)',
          barThickness: 25,
          stack: '1',
        },
        {
          label: 'Paid Addendum = ' + this.total_Addedumpayments_paid,
          data: [null, toNum(this.total_Addedumpayments_paid)],
          backgroundColor: 'green',
          barThickness: 25,
          stack: '2',
        },
        {
          label: 'Not Initiated Addendum = ' + this.NotInitiated_Addedumpayments,
          data: [null, toNum(this.NotInitiated_Addedumpayments)],
          backgroundColor: 'rgb(141, 7, 121)',
          barThickness: 25,
          stack: '3',
        },
        {
          label: 'InitiatedAddendum = ' + this.Initiated_Addedumpayments,
          data: [null, toNum(this.Initiated_Addedumpayments)],
          backgroundColor: 'rgb(12, 25, 134)',
          barThickness: 25,
          stack: '4',
        },
        {
          label: 'ExpiredAddendum= ' + this.ExcessedDueDate_Addedumpayments,
          data: [toNum(this.ExcessedDueDate_Addedumpayments), null],
          backgroundColor: 'red',
          barThickness: 25,
          stack: '5',
        },
      ],
    };
  
    this.chart10 = new Chart('MyChart10', {
      type: 'bar',
      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: false,
            ticks: {
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedElementIndex = elements[0].index;
            const label = data.datasets[elements[0].datasetIndex].label;
            this.handleChartClickPayment(label);
          }
          
        },
      },
    });
  
    // Check if everything is 0
    const allZeros = data.datasets.every(ds =>
      ds.data.every(val => val === null || val === 0)
    );
    this.chart10_no_data = allZeros;
  }
  
  chartEleven() {
    const data = {
      labels: ['manager_review='+this.under_manager_review, 
               'director_review='+this.under_director_review, 
               'chief_review='+ this.under_chief_review,
               'Finance_review='+ this.under_Finance_review,  
               'reject_payments='+this.reject_payments,
               'Paid='+this.total_payments_paid

              ],
      datasets: [
        {
          label: 'Payment Requests',
          data: [
            this.under_manager_review,
            this.under_director_review,
            this.under_chief_review,
            this.under_Finance_review,
            this.reject_payments,
            this.total_payments_paid,
          ],
          backgroundColor: [
            'rgb(155, 122, 33)',
            'rgb(54, 16, 38)',
            'rgb(0, 99, 132)',
            'rgb(219, 237, 15)',
            'rgb(113, 4, 4)' ,
            'rgb(25, 173, 47)'
          ],
          
        },
      ],
    };
    console.log('Chart Data:', data);
    this.chart11 = new Chart('MyChart11', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedElementIndex = elements[0].index;
            const label = data.labels[clickedElementIndex];
            this.handleChartClickPayment(label);
          }
        },
      },
    });
    if (this.chart11.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart11_no_data = true;
    }
  }



  chartTwelve() {
    const data = {
      labels: [
        'TotalAmount=' + this.total_payments_amount,
        'RejectAmount=' + this.reject_payments_amount,
        'PaidAmount=' + this.total_payments_paid_amount,
        'NotInitiatedAmount=' + this.NotInitiated_payments_amount,
         'InitiatedAmount=' + this.Initiated_payments_amount,
        'TotalAddedumAmount=' + this.total_Addedumpayments_amount,
        'RejectAddedumAmount=' + this.reject_Addedumpayments_amount,
        'PaidAddedumAmount=' + this.total_Addedumpayments_paid_amount,
        'NotInitiatedAddedumAmount=' + this.NotInitiated_Addedumpayments,
        'InitiatedAddedumAmount=' + this.Initiated_Addedumpayments_amount,
        'ExpiredAddedumAmount=' + this.ExcessedDueDate_Addedumpayments_amount,
        'ExpiredAmount=' + this.ExcessedDueDate_payments_amount,
      ],
      datasets: [
        {
          label: 'Payment Amount',
          data: [
           this.total_payments_amount|| 0,
            this.reject_payments_amount|| 0,
            this.total_payments_paid_amount|| 0,
            this.NotInitiated_payments_amount || 0,
            this.Initiated_payments_amount || 0,
            this.total_Addedumpayments_amount || 0,
            this.reject_Addedumpayments_amount || 0,
            this.total_Addedumpayments_paid_amount || 0,
            this.NotInitiated_Addedumpayments || 0,
            this.Initiated_Addedumpayments_amount || 0,
            this.ExcessedDueDate_Addedumpayments_amount || 0,
            this.ExcessedDueDate_payments_amount || 0,
          ],
          backgroundColor: [
            'rgb(155, 122, 33)',
            'rgb(23, 0, 128)',
            'rgb(54, 16, 38)',
            'rgb(0, 99, 132)',
            'rgb(255, 99, 132)',
            'rgb(99, 132, 255)',
            'rgb(25, 173, 47)',
            'rgb(255, 99, 132)',
            'rgb(0, 0, 0)',
            'rgb(97, 143, 5)',
            'rgb(53, 37, 37)',
            'rgb(24, 98, 61)',
          ],
        },
      ],
    };
  
    console.log('Chart Data_amount:', data);
  
    const canvas = document.getElementById('MyChart12') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element with ID MyChart12 not found!');
      return;
    }
    console.log('Canvas element with ID MyChart12  found!');
   this.chart12 = new Chart(canvas, {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedElementIndex = elements[0].index;
            const label = data.labels[clickedElementIndex];
            this.handleChartClickPayment(label);
          }
        },
      },
    });
  
    // Handle no data case (if all values are 0)
    if (this.chart12.data.datasets[0].data.every((item: number) => item === 0)) {
      this.chart12_no_data = true;
    }
  }

  // chartForteen() {
  //   const toNum = (val: unknown): number => {
  //     const numVal = Number(val);
  //     return isNaN(numVal) ? 0 : numVal;
  //   };
  //   console.log("Chart Data dETail Begin: ");
  //   console.log("Chart Data dETail Beginssssss: "+document.getElementById('MyChart14'));

  //   const data = {
  //     labels: ["Payments"],
  //     datasets: [
  //       {
  //         label: 'TotalDetail = ' + this.total_payments_Detail,
  //         data: [toNum(this.total_payments_Detail), 0], 
  //         backgroundColor: 'black',
  //         barThickness: 25,
  //         stack: '0',
  //       },
  //       {
  //         label: 'Initiated = ' + this.Initiated__Detail_payments,
  //         data: [toNum(this.Initiated__Detail_payments), 0], 
  //         backgroundColor: 'blue',
  //         barThickness: 25,
  //         stack: '1',
  //       },
  //       {
  //         label: 'NotInitiated = ' + this.NotInitiated__Detail_payments,
  //         data: [toNum(this.NotInitiated__Detail_payments), 0],
  //         backgroundColor: 'Blueblack',
  //         barThickness: 25,
  //         stack: '2',
  //       },
  //       {
  //         label: 'Paid= ' + this.total_Detail_payments_paid,
  //         data: [toNum(this.total_Detail_payments_paid), 0], 
  //         backgroundColor: 'Green',
  //         barThickness: 25,
  //         stack: '3',
  //       },
  //       {
  //         label: 'Rejected= ' + this.reject_payments_Detail,
  //         data: [toNum(this.reject_payments_Detail), 0], 
  //         backgroundColor: 'red',
  //         barThickness: 25,
  //         stack: '4',
  //       },
  //       {
  //         label: 'Expired = ' + this.ExcessedDueDate_payments_Detail,
  //         data: [toNum(this.ExcessedDueDate_payments_Detail), 0], 
  //         backgroundColor: 'orange',
  //         barThickness: 25,
  //         stack: '5',
  //       },
  //     ],
  //   };
  
  //   console.log("Chart Data dETail: ", data); 
  //   // if (this.chart14) {
  //   //   this.chart14.destroy(); 
  //   // }
  //   const canvas = document.getElementById('MyChart14') as HTMLCanvasElement;
  //   if (!canvas) {
  //     console.error('Canvas element with ID MyChart14 not found!');
  //     return;
  //   }

  //   console.log('Canvas element with ID MyChart14 found!');
  //   this.chart14 = new Chart('MyChart14', {
  //     type: 'bar',
  //     data: data,
  //     options: {
  //       aspectRatio: 2.5,
  //       scales: {
  //         x: {
  //           stacked: false,
  //           ticks: {
  //             font: {
  //               size: 16,
  //               weight: 'bold',
  //             },
  //           },
  //         },
  //         y: {
  //           stacked: true,
  //           beginAtZero: true,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //         },
  //       },
  //       onClick: (event, elements) => {
  //         if (elements.length > 0) {
  //           const label = data.datasets[elements[0].datasetIndex].label;
  //           this.handleChartClickPayment(label);
  //         }
  //       },
  //     },
  //   });
   
  //   const allZeros = data.datasets.every(ds =>
  //     ds.data.every(val => val === null || val === 0)
  //   );
  //   console.log("No data detail? ", allZeros); // Debug the condition that checks for empty datasets
  //   this.chart14_no_data = true;
    
  // }

  chartForteen() {
    const toNum = (val: unknown): number => {
      const numVal = Number(val);
      return isNaN(numVal) ? 0 : numVal;
    };
    console.log("Chart Data dETail Begin Amount: ");
    console.log("Chart Data dETail Beginssss: "+document.getElementById('MyChart14'));
    const data = {
      labels: ["Payments"],
      datasets: [
        {
          label: 'TotalDetail = ' + this.total_payments_Detail,
          data: [toNum(this.total_payments_Detail), 0], // Replace null with 0 for testing
          backgroundColor: 'black',
          barThickness: 25,
          stack: '0',
        },
        {
          label: 'Initiated = ' + this.Initiated__Detail_payments,
          data: [toNum(this.Initiated__Detail_payments), 0], 
          backgroundColor: 'blue',
          barThickness: 25,
          stack: '1',
        },
        {
          label: 'NotInitiated = ' + this.NotInitiated__Detail_payments,
          data: [toNum(this.NotInitiated__Detail_payments), 0],
          backgroundColor: 'Blueblack',
          barThickness: 25,
          stack: '2',
        },
        {
          label: 'Paid= ' + this.total_Detail_payments_paid,
          data: [toNum(this.total_Detail_payments_paid), 0], 
          backgroundColor: 'Green',
          barThickness: 25,
          stack: '3',
        },
        {
          label: 'Rejected= ' + this.reject_payments_Detail,
          data: [toNum(this.reject_payments_Detail), 0], 
          backgroundColor: 'red',
          barThickness: 25,
          stack: '4',
        },
        {
          label: 'Expired = ' + this.ExcessedDueDate_payments_Detail,
          data: [toNum(this.ExcessedDueDate_payments_Detail), 0], 
          backgroundColor: 'orange',
          barThickness: 25,
          stack: '5',
        },
      
       
      ],
    };
  
    console.log("Chart Data dETail Amount: ", data); // Check the data
    if (this.chart14) {
      this.chart14.destroy(); // Destroy previous chart instance
    }
    this.chart14 = new Chart('MyChart14', {
      type: 'bar',
      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: false,
            ticks: {
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const label = data.datasets[elements[0].datasetIndex].label;
            this.handleChartClickPayment(label);
          }
        },
      },
    });
   
    const allZeros = data.datasets.every(ds =>
      ds.data.every(val => val === null || val === 0)
    );
    console.log("No data? ", allZeros); // Debug the condition that checks for empty datasets
    this.chart14_no_data = true;
    
  }

  chartThriteen() {
    const toNum = (val: unknown): number => {
      const numVal = Number(val);
      return isNaN(numVal) ? 0 : numVal;
    };
    console.log("Chart Data dETail Begin Amount: ");
    console.log("Chart Data dETail Beginaaaaa: "+document.getElementById('MyChart13'));
    const data = {
      labels: ["PaymentsAmount"],
      datasets: [
        // {
        //   label: 'TotalDetail = ' + this.total_payments_Detail,
        //   data: [toNum(this.total_payments_Detail), 0], // Replace null with 0 for testing
        //   backgroundColor: 'blue',
        //   barThickness: 25,
        //   stack: '0',
        // },
        {
          label: 'TotalAmountDetail = ' + this.total_payments_Detail_amount,
          data: [toNum(this.total_payments_Detail_amount), 0], // Replace null with 0 for testing
          backgroundColor: 'black',
          barThickness: 25,
          stack: '0',
        },
        {
          label: 'InitiatedAmount = ' + this.Initiated_payments_Detail_amount,
          data: [toNum(this.Initiated_payments_Detail_amount), 0], // Replace null with 0 for testing
          backgroundColor: 'blue',
          barThickness: 25,
          stack: '1',
        },
        {
          label: 'NotInitiatedAmount = ' + this.NotInitiated_payments_Detail_amount,
          data: [toNum(this.NotInitiated_payments_Detail_amount), 0], // Replace null with 0 for testing
          backgroundColor: 'Blueblack',
          barThickness: 25,
          stack: '2',
        },
        {
          label: 'PaidAmount = ' + this.total_payments_Detail_amount_paid,
          data: [toNum(this.total_payments_Detail_amount_paid), 0], // Replace null with 0 for testing
          backgroundColor: 'Green',
          barThickness: 25,
          stack: '3',
        },
        {
          label: 'RejectedAmount = ' + this.reject_payments_Detail_amount,
          data: [toNum(this.reject_payments_Detail_amount), 0], // Replace null with 0 for testing
          backgroundColor: 'red',
          barThickness: 25,
          stack: '4',
        },
        {
          label: 'ExpiredAmount = ' + this.ExcessedDueDate_payments_Detail_amount,
          data: [toNum(this.ExcessedDueDate_payments_Detail_amount), 0], // Replace null with 0 for testing
          backgroundColor: 'orange',
          barThickness: 25,
          stack: '5',
        },
      ],
    };
  
    console.log("Chart Data dETail Amount: ", data); // Check the data
    if (this.chart13) {
      this.chart13.destroy(); // Destroy previous chart instance
    }
    this.chart13 = new Chart('MyChart13', {
      type: 'bar',
      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: false,
            ticks: {
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const label = data.datasets[elements[0].datasetIndex].label;
            this.handleChartClickPayment(label);
          }
        },
      },
    });
   
    const allZeros = data.datasets.every(ds =>
      ds.data.every(val => val === null || val === 0)
    );
    console.log("No data? ", allZeros); // Debug the condition that checks for empty datasets
    this.chart13_no_data = true;
    
  }

 
  

  onVendorChange(event: any): void {
    const selectedVendorId = event.target.value;
    console.log("vendorId=" + selectedVendorId)
    this.vendorSelected = !!selectedVendorId;
    this.getContracts(selectedVendorId);
    if (this.vendorSelected && this.contractSelected) {
      this.chartForteen();
      this.chartThriteen();
     
    }
    

  }
  onContractChange(event: any): void {
    this.contract_id = event.target.value;
    console.log("contIds=" + this.contract_id )
    this.contractSelected = !!this.contract_id; 
    this.getContractbyId(this.contract_id);
    this.populateManagerDetailDashboardData(this.contract_id);
    if (this.vendorSelected && this.contractSelected) {
      this.chartForteen();
      this.chartThriteen();
     
    }
  
   // $('#MyChart14').DataTable().ajax.reload();
  }

  getContractbyId(contractId: any) {
          this.makerService.getContractById(contractId).subscribe(
            (data: any) => {
              this.cont = data;
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
                        this.makerService.getContractById(contractId).subscribe(
                          (data: any) => {
                            this.cont = data;
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
  getContracts(vendorId: any) {
          console.log("vendorIds=" + vendorId)
          this.makerService.getContractByVendorId(vendorId).subscribe(
            (data: any) => {
              this.contract = data;
              console.log("contractdetail=" + data.total_amount)
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
                        this.makerService.getContractByVendorId(vendorId).subscribe(
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

  filterVendors(searchTerm: any) {
          const searchText = searchTerm.target.value.trim().toLowerCase();
      
          if (searchText !== '') {
            this.filteredVendors = this.vendor.filter(vendor =>
              vendor.name.toLowerCase().includes(searchText)
            );
      
            if (this.filteredVendors.length > 0) {
              const selectedVendorId = this.filteredVendors[0].id;
              console.log("Selected Vendor ID:", selectedVendorId);
            } else if (this.filteredVendors.length > 1) {
            } else {
      
            }
          } else {
            this.filteredVendors = [...this.vendor];
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
    
     

  handleChartClickContract(label: string){
    console.log('ggggggggggghfgh=============jsdfsdhgusihrsught '+label);
    if (label.startsWith('Total')) {
      this.makerService.setVendorSearch('Total');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-contracts']);
      else
      this.router.navigate(['checker/view-contracts']);
    }
    else if(label.startsWith('No Contract')){
      this.makerService.setVendorSearch('No Contract');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-vendors']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    else if(label.startsWith('Hold')){
      this.makerService.setVendorSearch('Hold');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-contracts']);
      else
      this.router.navigate(['checker/view-contracts']);
    }
    else if(label.startsWith('Active')){
      this.makerService.setVendorSearch('Active');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-contracts']);
      else
      this.router.navigate(['checker/view-contracts']);
    }
    else if (label.startsWith('Pending')) {
      this.makerService.setVendorSearch('pending');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-contracts']);
        else
        this.router.navigate(['checker/view-contracts']);
    } 
    else if (label.startsWith('Terminate ')) {
      this.makerService.setVendorSearch('Terminate Request');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-contracts']);
        else
        this.router.navigate(['checker/view-contracts']);
    } 
    else if (label.startsWith('Holds')) {
      this.makerService.setVendorSearch('Hold Request');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-contracts']);
        else
        this.router.navigate(['checker/view-contracts']);
    } 
    else if (label.startsWith('Unhold')) {
      this.makerService.setVendorSearch('Unhold Request');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-contracts']);
        else
        this.router.navigate(['checker/view-contracts']);
    } 
    else if (label.startsWith('Extend')) {
      this.makerService.setVendorSearch('Extend');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-contracts']);
        else
        this.router.navigate(['checker/view-contracts']);
    } 
    else if (label.startsWith('Renewal')) {
      this.makerService.setVendorSearch('Renewal');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-contracts']);
        else
        this.router.navigate(['checker/view-contracts']);
    } 
    else {
      console.log('Unknown label clicked:', label);
    }

  }
  handleChartClickVendor(label: string) {
    console.log('ggggggggggghfgh=============jsdfsdhgusihrsught '+label);
    if (label.startsWith('Total')) {
      this.makerService.setVendorSearch('Total');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-vendors']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    else if(label.startsWith('Has Contract')){
      this.makerService.setVendorSearch('Has Contract');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-vendors']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    else if(label.startsWith('No Contract')){
      this.makerService.setVendorSearch('No Contract');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-vendors']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    else if(label.startsWith('Inactive')){
      this.makerService.setVendorSearch('Inactive');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-vendors']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    else if(label.startsWith('Active')){
      this.makerService.setVendorSearch('Active');
      if (this.authService.isMaker())
      this.router.navigate(['maker/view-vendors']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    else if (label.startsWith('Pending')) {
      this.makerService.setVendorSearch('pending');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-vendors']);
        else
        this.router.navigate(['checker/view-vendors']);
    } 
    else if (label.startsWith('Activate')) {
      this.makerService.setVendorSearch('Activate');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-vendors']);
        else
        this.router.navigate(['checker/view-vendors']);
    } 
    else if (label.startsWith('Deactivate')) {
      this.makerService.setVendorSearch('Deactivate');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-vendors']);
        else
        this.router.navigate(['checker/view-vendors']);
    } 
    else if (label.startsWith('Update')) {
      this.makerService.setVendorSearch('Update');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-vendors']);
        else
        this.router.navigate(['checker/view-vendors']);
    } 
    else if (label.startsWith('Delete')) {
      this.makerService.setVendorSearch('Delete');
      if (this.authService.isMaker())
        this.router.navigate(['maker/view-vendors']);
        else
        this.router.navigate(['checker/view-vendors']);
    } 
    else {
      console.log('Unknown label clicked:', label);
    }
  }
  handleChartClickPayment(label: string) {
    console.log('ggggggggggghfgh=============jsdfsdhgusihrsught '+label);
    if (label.startsWith('Total')) {
      this.managerService.setPaymentSearch('Total');
      if (this.authService.isManager())
      this.router.navigate(['Manager/view-payment']);
      else
      this.router.navigate(['checker/view-vendors']);
    }
    // else if(label.startsWith('Has Payment')){
    //   this.managerService.setPaymentSearch('Has Payment');
    //   if (this.authService.isManager())
    //   this.router.navigate(['Manager/view-payment']);
    //   else
    //   this.router.navigate(['checker/view-vendors']);
    // }
    // else if(label.startsWith('No Payment')){
    //   this.managerService.setPaymentSearch('No Payment');
    //   if (this.authService.isManager())
    //   this.router.navigate(['Manager/view-payment']);
    //   else
    //   this.router.navigate(['checker/view-vendors']);
    // }
    
    else {
      console.log('Unknown label clicked:', label);
    }
  }
  logout() {
    // this.authService.logout()
    // console.log(this.authService.logout())

    this.authService.logout().subscribe(
      (data) => {
        if (data) {
          console.log(data);
        } else {
          console.log('login failed 001');
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
                      } else {
                        console.log('login failed 001');
                      }
                      // this.router.navigateByUrl('/register-success');
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
    this.router.navigateByUrl('/landing-page');
  }
  logoutAll() {
    // this.authService.logout()
    // console.log(this.authService.logout())

    this.authService.logoutAll().subscribe(
      (data) => {
        if (data) {
          console.log(data);
        } else {
          console.log('login failed 001');
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
                      } else {
                        console.log('login failed 001');
                      }
                      // this.router.navigateByUrl('/register-success');
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
    this.router.navigateByUrl('/landing-page');
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

/**
 * 
<div class="row">
    <div class="col-12">
        <div class="page-title-box">
            <app-navigator-upper></app-navigator-upper>
            <h4 class="page-title">Home</h4>
            <div class="row">
                <div class="col-md-6 ">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-book-account float-end'></i>
                                    <h6 class="text-uppercase mt-0">Accounts</h6>
                                    <h2 class="my-2" id="active-users-count">121</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Number of created accounts</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-eur float-end'></i>
                                    <h6 class="text-uppercase mt-0">Currencies</h6>
                                    <h2 class="my-2" id="active-users-count">121</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Number of created currencies</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 ">
                    <div class="row">
                        <div class="col-lg-6 col-xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-bank-transfer float-end'></i>
                                    <h6 class="text-uppercase mt-0">Transactions</h6>
                                    <h4 class="my-0" id="active-users-count">ATS &nbsp;&nbsp;&nbsp;:&nbsp; <span
                                            class="dashboard-number-text">6,784,457</span></h4>
                                    <h4 class="mb-1 mt-0" id="active-users-count">CORE&nbsp; :&nbsp; <span
                                            class="dashboard-number-text">6,545,158</span></h4>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-file-chart float-end'></i>
                                    <h6 class="text-uppercase mt-0">Files</h6>
                                    <h2 class="my-2" id="active-users-count">121</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of uploaded files</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body" style="height: 304px">
                                    <i class='mdi mdi-24px mdi-bank-transfer float-end'></i>
                                    <h6 class="text-uppercase mt-0">Current Transactions</h6>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Core Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784</span></h5>
                                    <h5 class="my-1 mt-3" id="active-users-count">Core Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,78</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Core Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784</span></h5>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Ats Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,78</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Ats Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,78</span></h5>
                                    <h5 class="my-2 " id="active-users-count">Ats Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784</span></h5>
                                    <!-- <h4 class="my-1" id="active-users-count">ATS &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h4> -->
                                    <!-- <h4 class="mb-1 mt-0" id="active-users-count">CORE : <span class="dashboard-number-text">6,545,158</span></h4> -->

                                    <p class="mb-0 text-muted ">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Current outstanding transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">Beginning balance at ats</h6>
                                    <h2 class="my-2" id="active-users-count">6,784,457</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span>
                                            5.27%</span> -->
                                        <span class="text-nowrap">Beginning balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">Ending balance at ats</h6>
                                    <h2 class="my-2" id="active-users-count">6,784,457</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span>
                                            5.27%</span> -->
                                        <span class="text-nowrap">Ending balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body" style="height: 304px !important">
                                    <h6 class="text-uppercase mt-0">Transactions of the last 7 days</h6>
                                    <div class="row" style="    display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100%;
                                padding: 12px;">
                                        <canvas id="MyChart">{{ chart }}</canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body" style="height: 468px !important">
                                    <h6 class="text-uppercase mt-0">total Matched transactions</h6>
                                    <div class="row" style="    display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100%;
                                padding-bottom: 12px;">
                                        <canvas id="MyChart2">{{ chart }}</canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body" style="height: 304px">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">Current Balance</h6>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Core Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-1 mt-3" id="active-users-count">Core Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Core Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Ats Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Ats Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-2 " id="active-users-count">Ats Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <!-- <h4 class="my-1" id="active-users-count">ATS &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h4> -->
                                    <!-- <h4 class="mb-1 mt-0" id="active-users-count">CORE : <span class="dashboard-number-text">6,545,158</span></h4> -->

                                    <p class="mb-0 text-muted ">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Current outstanding balance</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">BEGINNING BALANCE AT core</h6>
                                    <h4 class="my-0" id="active-users-count">IFB &nbsp;&nbsp;&nbsp;:&nbsp; <span
                                            class="dashboard-number-text">6,784,457</span></h4>
                                    <h4 class="mb-1 mt-0" id="active-users-count">CONV&nbsp; :&nbsp; <span
                                            class="dashboard-number-text">6,545,158</span></h4>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Beginning balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">ENDING BALANCE AT core</h6>
                                    <h4 class="my-0" id="active-users-count">IFB &nbsp;&nbsp;&nbsp;:&nbsp; <span
                                            class="dashboard-number-text">6,784,457</span></h4>
                                    <h4 class="mb-1 mt-0" id="active-users-count">CONV&nbsp; :&nbsp; <span
                                            class="dashboard-number-text">6,545,158</span></h4>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Ending balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">total BEGINNING BALANCE AT CORE</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total beginning balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">total ENDING BALANCE AT core</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total Ending balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">adjusted BALANCE AT ats</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total adjusted balance at ats</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-book-edit float-end'></i>
                                    <h6 class="text-uppercase mt-0">edited transactions</h6>
                                    <h2 class="my-2" id="active-users-count">8</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of edited transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">adjusted BALANCE AT core</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total adjusted balance at core</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-delete float-end'></i>
                                    <h6 class="text-uppercase mt-0">deleted transactions</h6>
                                    <h2 class="my-2" id="active-users-count">12</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of deleted transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body" style="height: 304px !important">
                                    <h6 class="text-uppercase mt-0">BEGINNING-ENDING balance of the last 7 days</h6>
                                    <div class="row" style="    display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100%;
                                padding: 12px;">
                                        <canvas id="MyChart3">{{ chart }}</canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
 */

