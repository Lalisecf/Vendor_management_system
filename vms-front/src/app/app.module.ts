import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageHeaderComponent } from './landing-page/landing-page-header/landing-page-header.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { PageNotFoundComponent } from './utils_/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsAndConditionsComponent } from './utils_/terms-and-conditions/terms-and-conditions.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientInterceptor } from './utils_/interceptors/http-client-interceptor';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './c/components/home/home.component';
import { LeftsideMenuComponent } from './c/components/home/leftside-menu/leftside-menu.component';
import { FooterComponent } from './c/components/home/footer/footer.component';
import { HeaderComponent } from './c/components/home/header/header.component';

import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { QuillModule } from 'ngx-quill';
import { NgToastModule } from 'ng-angular-popup';
import { NavigatorUpperComponent } from './c/components/navigator-upper/navigator-upper.component';
import { DataTablesModule } from 'angular-datatables';
import { UsersComponent } from './Admin/c/users/users.component';
import { UserActivitiesComponent } from './Admin/c/user-activities/user-activities.component';
import { RolesComponent } from './Admin/c/roles/roles.component';
import { LoginsComponent } from './Admin/c/logins/logins.component';

import { FunctionalitiesRoleComponent } from './Admin/c/functionalities_role_based/functionalities_role.component';

import { FunctionalitiesComponent } from './Admin/c/functionalities/functionalities.component';
import { CustomErrorHandler } from './ErrorHandling/custom-error-handler.service';
import { MmComponent } from './Admin/c/mm/mm.component';
import { ChangePasswordComponent } from './Admin/c/change-password/change-password.component';
Import: [TabsModule.forRoot()];
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PendingUserComponent } from './Admin/c/pending-user/pending-user.component';
import { ApprovePendingUserComponent } from './Admin/c/approve-pending-user/approve-pending-user.component';
import { MultiDropdownRolesComponent } from './Admin/c/approve-pending-user/multi-dropdown-role/multi-dropdown-roles.component';
import { MultiDropdownRoleComponent } from './Admin/c/register-actor/multi-dropdown-role/multi-dropdown-role.component';
import { RegisterActorComponent } from './Admin/c/register-actor/register-actor.component';
import { WebcamModule } from 'ngx-webcam';
import { ProfileComponent } from './c/components/profile/profile.component';
import { UpdateRoleApproverComponent } from './Admin/c/update-role-approver/update-role-approver.component';
import { ViewProductsComponent } from './Maker/Components/view-products/view-products.component';
import { ViewServicesComponent } from './Maker/Components/view-services/view-services.component';
import { AddProductComponent } from './Maker/Components/add-product/add-product.component';
import { AddServiceComponent } from './Maker/Components/add-service/add-service.component';
import { AddVendorComponent } from './Maker/Components/add-vendor/add-vendor.component';
import { AddContractComponent } from './Maker/Components/add-contract/add-contract.component';
import { ViewVendorsComponent } from './Maker/Components/view-vendors/view-vendors.component';
import { ViewContractsComponent } from './Maker/Components/view-contracts/view-contracts.component';
import { CheckerViewVendorsComponent } from './Checker/Component/checker-view-vendors/checker-view-vendors.component';
import { CheckerViewContractsComponent } from './Checker/Component/checker-view-contracts/checker-view-contracts.component';
import { MultiDropdownProductComponent } from './Maker/Components/add-vendor/multi-dropdown-product/multi-dropdown-product.component';
import { MultiDropdownServiceComponent } from './Maker/Components/add-vendor/multi-dropdown-service/multi-dropdown-service.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AddContractTypeComponent } from './Maker/Components/add-contract-type/add-contract-type.component';
import { AddPaymentStatusComponent } from './Maker/Components/add-payment-status/add-payment-status.component';
import { ViewContractTypeComponent } from './Maker/Components/view-contract-type/view-contract-type.component';
import { ViewPaymentStatusComponent } from './Maker/Components/view-payment-status/view-payment-status.component';
import { NumberFormatDirectiveComponent } from './Maker/Components/number-format-directive/number-format-directive.component';
import { PaymentReportComponent } from './Report/payment-report/payment-report.component';
import { VendorContractReportComponent } from './Maker/Components/vendor-contract-report/vendor-contract-report.component';
import { CommonModule } from '@angular/common';
import { AddDirectorateComponent } from './Maker/Components/add-directorate/add-directorate.component';
import { ViewDirectorateComponent } from './Maker/Components/view-directorate/view-directorate.component';
import { ContrateDetailComponent } from './Maker/Components/contrate-detail/contrate-detail.component';
import { AddIssuerBankComponent } from './Maker/Components/add-issuer-bank/add-issuer-bank.component';
import { ViewIssuerBankComponent } from './Maker/Components/view-issuer-bank/view-issuer-bank.component';
import { PaymentProcessComponent } from './Maker/Components/payment-process/payment-process.component';
import { ViewPaymentComponent } from './Manager/Components/view-payment/view-payment.component';
import { RequestedPaymentsComponent } from './Manager/Components/requested-payments/requested-payments.component';
import { PaymentDetailComponent } from './Manager/Components/payment-detail/payment-detail.component';
import { RequestedAddendumPaymentsComponent } from './Manager/Components/requested-addendum-payments/requested-addendum-payments.component';
import { AddedumPaymentDetailComponent } from './Manager/Components/addedum-payment-detail/addedum-payment-detail.component';
import { AddLicenceComponent } from './Maker/Components/add-licence/add-licence.component';
import { ViewLicenceComponent } from './Maker/Components/view-licence/view-licence.component';
import { PaymentTemplateComponent } from './Manager/Components/payment-template/payment-template.component';
import { PaymentWorkFlowComponent } from './Manager/Components/payment-work-flow/payment-work-flow.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingPageHeaderComponent,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    TermsAndConditionsComponent,
    MultiDropdownRoleComponent,
    MultiDropdownRolesComponent,
    HomeComponent,
    LeftsideMenuComponent,
    FooterComponent,
    HeaderComponent,

    NavigatorUpperComponent,
    RegisterActorComponent,
    // declarations for Admin actor start
    RegisterActorComponent,
    UsersComponent,
    UserActivitiesComponent,
    RolesComponent,
    LoginsComponent,
    FunctionalitiesComponent,
    FunctionalitiesRoleComponent,
    MmComponent,
    ChangePasswordComponent,
    FunctionalitiesComponent,

    PendingUserComponent,
    ApprovePendingUserComponent,
    ProfileComponent,
    UpdateRoleApproverComponent,
    ViewProductsComponent,
    ViewServicesComponent,
    AddProductComponent,
    AddServiceComponent,
    AddVendorComponent,
    AddContractComponent,
    ViewVendorsComponent,
    ViewContractsComponent,
    CheckerViewVendorsComponent,
    CheckerViewContractsComponent,
    MultiDropdownProductComponent,
    MultiDropdownServiceComponent,
    AddContractTypeComponent,
    AddPaymentStatusComponent,
    ViewContractTypeComponent,
    ViewPaymentStatusComponent,
    NumberFormatDirectiveComponent,
    PaymentReportComponent,
    VendorContractReportComponent,
    AddDirectorateComponent,
    ViewDirectorateComponent,
    ContrateDetailComponent,
    AddIssuerBankComponent,
    ViewIssuerBankComponent,
    PaymentProcessComponent,
    ViewPaymentComponent,
    RequestedPaymentsComponent,
    PaymentDetailComponent,
    RequestedAddendumPaymentsComponent,
    AddedumPaymentDetailComponent,
    AddLicenceComponent,
    ViewLicenceComponent,
    PaymentTemplateComponent,
    PaymentWorkFlowComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    SweetAlert2Module.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    BrowserModule,
    FormsModule,
    EditorModule,
    WebcamModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    QuillModule,
    NgxDropzoneModule,
    NgToastModule,
    DataTablesModule,
    TabsModule.forRoot(),
    TabsModule,
    PdfViewerModule,
    NgxIntlTelInputModule,
    // NgSelectModule,
    // CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
    },
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 5 } },

    TabsetConfig,

    // { provide: ErrorHandler, useClass: CustomErrorHandler },
    // { provide: ErrorHandler, useClass: CustomErrorHandler },
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
