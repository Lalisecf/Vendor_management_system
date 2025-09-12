import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './Auth/signup/signup.component';
import { AuthGuard } from './Auth/guards/auth.guard';
import { LoginAuthGuard } from './Auth/guards/login/login-auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './Auth/login/login.component';
import { TermsAndConditionsComponent } from './utils_/terms-and-conditions/terms-and-conditions.component';
import { PageNotFoundComponent } from './utils_/page-not-found/page-not-found.component';
import { HomeComponent } from './c/components/home/home.component';

import { RoleAdminGuard } from './c/guards/roles_guard/role-admin.guard';
import { UsersComponent } from './Admin/c/users/users.component';
import { UserActivitiesComponent } from './Admin/c/user-activities/user-activities.component';
import { LoginsComponent } from './Admin/c/logins/logins.component';
import { RolesComponent } from './Admin/c/roles/roles.component';
import { RegisterActorComponent } from './Admin/c/register-actor/register-actor.component';

import { FunctionalitiesRoleComponent } from './Admin/c/functionalities_role_based/functionalities_role.component';
import { MmComponent } from './Admin/c/mm/mm.component';
import { ChangePasswordComponent } from './Admin/c/change-password/change-password.component';
import { FirstTimeGuard } from './Admin/guards/first-time.guard';
import { FunctionalitiesComponent } from './Admin/c/functionalities/functionalities.component';
import { PendingUserComponent } from './Admin/c/pending-user/pending-user.component';
import { ApprovePendingUserComponent } from './Admin/c/approve-pending-user/approve-pending-user.component';
import { ProfileComponent } from './c/components/profile/profile.component';
import { RoleApproverGuard } from './c/guards/roles_guard/role-approver.guard';
import { UpdateRoleApproverComponent } from './Admin/c/update-role-approver/update-role-approver.component';
import { ViewProductsComponent } from './Maker/Components/view-products/view-products.component';
import { RoleMakerGuard } from './c/guards/roles_guard/role-maker.guard';
import { ViewServicesComponent } from './Maker/Components/view-services/view-services.component';
import { AddServiceComponent } from './Maker/Components/add-service/add-service.component';
import { AddProductComponent } from './Maker/Components/add-product/add-product.component';
import { AddVendorComponent } from './Maker/Components/add-vendor/add-vendor.component';
import { ViewVendorsComponent } from './Maker/Components/view-vendors/view-vendors.component';
import { AddContractComponent } from './Maker/Components/add-contract/add-contract.component';
import { ViewContractsComponent } from './Maker/Components/view-contracts/view-contracts.component';
import { RoleCheckerGuard } from './c/guards/roles_guard/role-checker.guard';
import { CheckerViewVendorsComponent } from './Checker/Component/checker-view-vendors/checker-view-vendors.component';
import { CheckerViewContractsComponent } from './Checker/Component/checker-view-contracts/checker-view-contracts.component';
import { AddContractTypeComponent } from './Maker/Components/add-contract-type/add-contract-type.component';
import { ViewContractTypeComponent } from './Maker/Components/view-contract-type/view-contract-type.component';
import { AddPaymentStatusComponent } from './Maker/Components/add-payment-status/add-payment-status.component';
import { ViewPaymentStatusComponent } from './Maker/Components/view-payment-status/view-payment-status.component';
import { PaymentReportComponent } from './Report/payment-report/payment-report.component';
import { RoleShareGuard } from './c/guards/roles_guard/role-share.guard';
import { VendorContractReportComponent } from './Maker/Components/vendor-contract-report/vendor-contract-report.component';
import { AddDirectorateComponent } from './Maker/Components/add-directorate/add-directorate.component';
import { ViewDirectorateComponent } from './Maker/Components/view-directorate/view-directorate.component';
import { ContrateDetailComponent } from './Maker/Components/contrate-detail/contrate-detail.component';
import { AddIssuerBankComponent } from './Maker/Components/add-issuer-bank/add-issuer-bank.component';
import { ViewIssuerBankComponent } from './Maker/Components/view-issuer-bank/view-issuer-bank.component';
import { PaymentProcessComponent } from './Maker/Components/payment-process/payment-process.component';
import { ViewPaymentComponent } from './Manager/Components/view-payment/view-payment.component';
import { RoleManagerGuard } from './c/guards/roles_guard/role-manager.guard';
import { RequestedPaymentsComponent } from './Manager/Components/requested-payments/requested-payments.component';
import { PaymentDetailComponent } from './Manager/Components/payment-detail/payment-detail.component';
import { RoleDirectorGuard } from './c/guards/roles_guard/role-director.guard';
import { RequestedAddendumPaymentsComponent } from './Manager/Components/requested-addendum-payments/requested-addendum-payments.component';
import { AddedumPaymentDetailComponent } from './Manager/Components/addedum-payment-detail/addedum-payment-detail.component';
import { AddLicenceComponent } from './Maker/Components/add-licence/add-licence.component';
import { ViewLicenceComponent } from './Maker/Components/view-licence/view-licence.component';
import { RoleFinanceGuard } from './c/guards/roles_guard/role-finance.guard';
import { RoleChiefGuard } from './c/guards/roles_guard/role-chief.guard';
import { PaymentTemplateComponent } from './Manager/Components/payment-template/payment-template.component';
import { PaymentWorkFlowComponent } from './Manager/Components/payment-work-flow/payment-work-flow.component';



const routes: Routes = [
  //fixed asset routes start========================================
  //fixed asset routes end==========================================
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // ================s======================================================
  // routings for recon project
  //ADMIN
  { path: 'admin', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleAdminGuard],
  },

  {
    path: 'Approver/Approve-pending-users/:id',
    component: ApprovePendingUserComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },
  {
    path: 'Approver/Approve-pending-users',
    component: PendingUserComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },
  {
    path: 'Approver/approved-user/:id',
    component: UpdateRoleApproverComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },
  {
    path: 'admin/users/add',
    component: RegisterActorComponent,
    canActivate: [AuthGuard],
  },


  {
    path: 'admin/roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/logins',
    component: LoginsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/user-activities',
    component: UserActivitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/roles/functionalities/:id',
    component: FunctionalitiesRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/users/edit/:id',
    component: RegisterActorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/mm',
    component: MmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/functionalities',
    component: FunctionalitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [FirstTimeGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  // end of admin routes

  // ========================================================================

  //=========Approver routes start======
  { path: 'Approver', redirectTo: '/home', pathMatch: 'full' },
  {

    path: 'Approver/pending-users',
    component: PendingUserComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  // maker routing
  {
    path: 'maker/view-products',
    component: ViewProductsComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/add-product',
    component: AddProductComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-products/edit/:id',
    component: AddProductComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-services',
    component: ViewServicesComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },

  {
    path: 'maker/add-service',
    component: AddServiceComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/add-directorate',
    component: AddDirectorateComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/add-issuer-bank',
    component: AddIssuerBankComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-directorate/edit/:id',
    component: AddDirectorateComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-issuerBank/edit/:id',
    component: AddIssuerBankComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/contract-detail/:id',
    component: ContrateDetailComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },
  {
    path: 'Manager/payment-detail/:id',
    component: PaymentDetailComponent,
    canActivate: [AuthGuard, RoleManagerGuard],
  },
  {
    path: 'Director/payment-detail/:id',
    component: PaymentDetailComponent,
    canActivate: [AuthGuard, RoleDirectorGuard],
  },
  {
    path: 'Finance/payment-detail/:id',
    component: PaymentDetailComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },

  {
    path: 'Manager/addedum-payment-detail/:id',
    component: AddedumPaymentDetailComponent,
    canActivate: [AuthGuard, RoleManagerGuard],
  },
  {
    path: 'Director/addedum-payment-detail/:id',
    component: AddedumPaymentDetailComponent,
    canActivate: [AuthGuard, RoleDirectorGuard],
  },
  {
    path: 'Finance/addedum-payment-detail/:id',
    component: AddedumPaymentDetailComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },

  {
    path: 'Finance/View-payment',
    component: ViewPaymentComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },
  {
    path: 'Finance/View-Requested-payment',
    component: RequestedPaymentsComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },
  {
    path: 'Finance/View-Requested-Addendum-payment',
    component: RequestedAddendumPaymentsComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },
  {
    path: 'Finance/payment-detail/:id',
    component: PaymentDetailComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },
  {
    path: 'Finance/addedum-payment-detail/:id',
    component: AddedumPaymentDetailComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },

  {
    path: 'maker/view-directorates',
    component: ViewDirectorateComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },

  {
    path: 'maker/view-issuer-bank',
    component: ViewIssuerBankComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/add-vendor',
    component: AddVendorComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-vendors',
    component: ViewVendorsComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },

  {
    path: 'maker/add-contract',
    component: AddContractComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-contracts',
    component: ViewContractsComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-services/edit/:id',
    component: AddServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'maker/view-vendors/edit/:id',
    component: AddVendorComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'checker/view-vendors',
    component: CheckerViewVendorsComponent,
    canActivate: [AuthGuard, RoleCheckerGuard],
  },
  {
    path: 'checker/view-contracts',
    component: CheckerViewContractsComponent,
    canActivate: [AuthGuard, RoleCheckerGuard],
  },
  {
    path: 'maker/view-contracts/edit/:id',
    component: AddContractComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },

  {
    path: 'maker/view-licences/edit/:id',
    component: AddLicenceComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },
  {
    path: 'add-licence',
    component: AddLicenceComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },

  {
    path: 'view-licence',
    component: ViewLicenceComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },

  {
    path: 'maker/add-contract-type',
    component: AddContractTypeComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },

  {
    path: 'maker/view-contract-type',
    component: ViewContractTypeComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-contract-type/edit/:id',
    component: AddContractTypeComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/add-payment-status',
    component: AddPaymentStatusComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-payment-status',
    component: ViewPaymentStatusComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'maker/view-payment-status/edit/:id',
    component: AddPaymentStatusComponent,
    canActivate: [AuthGuard, RoleMakerGuard],
  },
  {
    path: 'report/payment-report',
    component: PaymentReportComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },

  {
    path: 'Report/:type',
    component: VendorContractReportComponent,
    canActivate: [AuthGuard, RoleShareGuard],
  },
  {
    path: 'Manager/View-payment',
    component: ViewPaymentComponent,
    canActivate: [AuthGuard, RoleManagerGuard],
  },
  {
    path: 'Manager/View-Requested-payment',
    component: RequestedPaymentsComponent,
    canActivate: [AuthGuard, RoleManagerGuard],
  },

  {
    path: 'Manager/View-Requested-Addendum-payment',
    component: RequestedAddendumPaymentsComponent,
    canActivate: [AuthGuard, RoleManagerGuard],
  },

  { path: 'Manager', redirectTo: '/home', pathMatch: 'full' },


  {
    path: 'Director/View-payment',
    component: ViewPaymentComponent,
    canActivate: [AuthGuard, RoleDirectorGuard],
  },
  {
    path: 'Director/View-Requested-payment',
    component: RequestedPaymentsComponent,
    canActivate: [AuthGuard, RoleDirectorGuard],
  },
  {
    path: 'Director/View-Requested-Addendum-payment',
    component: RequestedAddendumPaymentsComponent,
    canActivate: [AuthGuard, RoleDirectorGuard],
  },
  { path: 'Director', redirectTo: '/home', pathMatch: 'full' },

  { path: 'Home', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'Home/:Payment-Processes',
    component: PaymentProcessComponent,
    canActivate: [AuthGuard],
  },


  {
    path: 'Chief/View-payment',
    component: ViewPaymentComponent,
    canActivate: [AuthGuard, RoleChiefGuard],
  },
  {
    path: 'Chief/View-Requested-payment',
    component: RequestedPaymentsComponent,
    canActivate: [AuthGuard, RoleChiefGuard],
  },
  {
    path: 'Chief/View-Requested-Addendum-payment',
    component: RequestedAddendumPaymentsComponent,
    canActivate: [AuthGuard, RoleChiefGuard],
  },
  {
    path: 'Chief/payment-detail/:id',
    component: PaymentDetailComponent,
    canActivate: [AuthGuard, RoleChiefGuard],
  },
  {
    path: 'Chief/addedum-payment-detail/:id',
    component: AddedumPaymentDetailComponent,
    canActivate: [AuthGuard, RoleChiefGuard],
  },
  {
    path: 'Manager/payment-template/:id',
    component: PaymentTemplateComponent,
    canActivate: [AuthGuard, RoleManagerGuard],
  },
  {
    path: 'Director/payment-template/:id',
    component: PaymentTemplateComponent,
    canActivate: [AuthGuard, RoleDirectorGuard],
  },
  {
    path: 'Chief/payment-template/:id',
    component: PaymentTemplateComponent,
    canActivate: [AuthGuard, RoleChiefGuard],
  },
  {
    path: 'Finance/payment-template/:id',
    component: PaymentTemplateComponent,
    canActivate: [AuthGuard, RoleFinanceGuard],
  },
  {
    path: 'Payment-History',
    component: PaymentWorkFlowComponent,
    canActivate: [AuthGuard],
  },
  //===================================================================
  //issue account starts here



  //issue account ends here
  //===================================================================

  //===================================================================
  //User

  { path: 'maker', redirectTo: '/home', pathMatch: 'full' },
  { path: 'checker', redirectTo: '/home', pathMatch: 'full' },

  //end of user
  //=========================================================
  {
    path: 'landing-page',
    component: LandingPageComponent,
    canActivate: [LoginAuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoginAuthGuard],
    // outlet: 'outer',
    // data: { animation: 'HomePage' },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginAuthGuard],
    // outlet: 'outer',
    // data: { animation: 'HomePage' },
  },

  {
    path: 'land',
    component: LandingPageComponent,

  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    // outlet: 'outer',
  },
  {
    path: 'pageNotFound',
    component: PageNotFoundComponent,
    // outlet: 'outer'
  },

  {
    path: '**',
    component: PageNotFoundComponent,
    // outlet: 'outer'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
