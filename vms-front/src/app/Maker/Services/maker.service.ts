import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../Payloads/product';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { services } from '../Payloads/services';
import { Vendors } from '../Payloads/vendors';
import { Remark } from '../Payloads/remark';
import { contract } from '../Payloads/contract';
import { Reports } from '../Payloads/report';
import { payments } from '../Payloads/payments';
import { FileTable } from '../Payloads/file-table';
import { Reason } from '../Payloads/reason';

@Injectable({
  providedIn: 'root'
})
export class MakerService {

  private SearchSource = new BehaviorSubject<string>(""); // Initial value for abc
  Search$ = this.SearchSource.asObservable();


  private abcSource = new BehaviorSubject<string>("Select-Type"); // Initial value for abc
  abc$ = this.abcSource.asObservable();


  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/maker/';
  public downloadUrl: string = '';
  constructor(private httpClient: HttpClient) { }

  setVendorSearch(value: string) {
    this.SearchSource.next(value);
    console.log('jjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkffffffffffffffffffff ' + value)
  }

  setAbc(value: string) {
    this.abcSource.next(value);
  }

  getAbc() {
    return this.abcSource.getValue();
  }
  register(registerProductPayload: Product): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(
        this.url + 'register_product',
        registerProductPayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  addService(servicesPayload: services): Observable<Object> {
    console.log(servicesPayload + "of service")
    return this.httpClient.post(`${this.url + 'add-service'}`, servicesPayload);
  }
  addDirectorate(servicesPayload: services): Observable<Object> {
    console.log(servicesPayload + "of directorate")
    return this.httpClient.post(`${this.url + 'add-directorate'}`, servicesPayload);
  }
  addIssuerBank(servicesPayload: services): Observable<Object> {
    console.log(servicesPayload + "of issuer bank")
    return this.httpClient.post(`${this.url + 'add-issuer-bank'}`, servicesPayload);
  }
  getAllService(): Observable<Array<services>> {
    return this.httpClient.get<Array<services>>(this.url + 'get-all-services');
  }
  getAllDirectorates(): Observable<Array<services>> {
    return this.httpClient.get<Array<services>>(this.url + 'get-all-directorates');
  }
  getAllIssuerBanks(): Observable<Array<services>> {
    return this.httpClient.get<Array<services>>(this.url + 'get-all-issuer-banks');
  }
  deleteService(service_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_servicer/' + service_id);
  }
  deleteDirectorate(directorate_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_directorate/' + directorate_id);
  }

  deleteIssuerBank(bank_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_issuer_bank/' + bank_id);
  }
  deactivateService(Service_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'deactivate_service/' + Service_id
    );
  }
  deactivateDirectorate(directorate_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'deactivate_directorate/' + directorate_id
    );
  }
  deactivateIssuerBank(bank_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'deactivate_issuer_bank/' + bank_id
    );
  }
  activateService(Service_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_service/' + Service_id);
  }
  activateDirectorate(directoratee_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_directorate/' + directoratee_id);
  }

  activateIssuerBank(bank_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_issuer_bank/' + bank_id);
  }
  getService(service_id: any): Observable<services> {
    return this.httpClient.get<services>(
      this.url + 'get_service/' + service_id
    );
  }
  getDirectorate(directorate_id: any): Observable<services> {
    return this.httpClient.get<services>(
      this.url + 'get_directorate/' + directorate_id
    );
  }
  getIssuerBank(bank_id: any): Observable<services> {
    return this.httpClient.get<services>(
      this.url + 'get_issuer_bank/' + bank_id
    );
  }
  getAllProducts(): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(this.url + 'get_all_products');
  }

  deactivateProduct(product_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'deactivate_product/' + product_id);
  }

  activateProduct(product_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_product/' + product_id);
  }

  deleteProduct(product_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_product/' + product_id);
  }


  getProduct(product_id: any): Observable<Product> {
    return this.httpClient.get<Product>(this.url + 'get_product/' + product_id);
  }

  registerVendor(formData: FormData): Observable<any> {

    console.log('at Service here ' + formData)
    return this.httpClient.post(`${this.url + 'register_vendor'}`, formData);
  }

  getAllVendors(): Observable<Array<Vendors>> {
    return this.httpClient.get<Array<Vendors>>(this.url + 'get_all_vendors');
  }

  getAllLicences(): Observable<Array<Object>> {
    return this.httpClient.get<Array<Object>>(this.url + 'get_all_licences');
  }
  ApproveLicence(licence_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'approve_licence/' + licence_id
    );
  }

  getAllVendor(edit_vendor_id: any): Observable<Array<Vendors>> {
    return this.httpClient.get<Array<Vendors>>(this.url + 'get_vendor/' + edit_vendor_id);
  }
  deactivateVendor(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'deactivate_vendor/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  activateVendor(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'activate_vendor/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  deleteVendor(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'delete_vendor/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  getRemark(id: number): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(
      this.url + 'get-remark/' + id
    );
  }
  VendorRemark(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'vendor_remark/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  updateRemark(remark_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'update_your_remark/' + remark_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  deleteRemark(remark_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'delete_remark/' + remark_id
    );
  }
  getRemarkById(id: any) {
    return this.httpClient.get<Remark>(
      this.url + 'get_remark_byId/' + id
    );
  }

  // getVendorById(vendor_id: any): Observable<Vendors> {
  //   return this.httpClient.get<Vendors>(this.url + 'get_vendor/' + vendor_id);
  // }


  getVendorById(vendor_id: any, role: string): Observable<Vendors> {
    var out = {
      vendor_id: vendor_id,
      role: role,
    };
    return this.httpClient.post<Vendors>(this.url + 'get_vendor/', out);
  }


  // downloadVendorFiles(id: any): Observable<HttpEvent<Blob>> {
  //   this.downloadUrl = `${this.url}download/`;
  //   const headers = new HttpHeaders({
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   }).set('Content-Type', 'application/json');
  //   return this.httpClient.get(`${this.downloadUrl}${id}`, {
  //     headers: headers,
  //     reportProgress: true,
  //     observe: 'events',
  //     responseType: 'blob',
  //   });
  // }
  downloadVendorFiles(id: any, fileName: string): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}?document_type=${fileName}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  downloadVendorFilesUpdated(id: any, fileName: string): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-updated/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}?document_type=${fileName}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
  getServiceByVendorId(vendor_id: any): Observable<Array<services>> {
    return this.httpClient.get<Array<services>>(
      this.url + 'get_service_with_in_vendor/' + vendor_id
    );
  }

  getProductByVendorId(vendor_id: any): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(
      this.url + 'get_product_with_in_vendor/' + vendor_id
    );
  }

  registerContract(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.url + 'register_contract'}`, formData);
  }

  registerLicence(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.url + 'register_licence'}`, formData);
  }

  getAllContracts(): Observable<Array<object>> {
    return this.httpClient.get<Array<object>>(this.url + 'get_all_contracts');
  }

  getPaymentDetailByContractId(contract_id: any): Observable<Array<object>> {
    return this.httpClient.get<Array<object>>(this.url + 'get_payment_detail/' + contract_id);
  }
  // Mebrat start
  deleteContract(vendor_id: any): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .get<Boolean>(this.url + 'delete_contract/' + vendor_id, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  // mebrat end 

  //demeke start
  getContractById(contract_id: any): Observable<contract> {
    return this.httpClient.get<contract>(this.url + 'get_contract/' + contract_id);
  }
  getLicenceById(licence_id: any): Observable<Object> {
    return this.httpClient.get<Object>(this.url + 'get_licence/' + licence_id);
  }

  getTempLicenceById(licence_id: any): Observable<Object> {
    return this.httpClient.get<Object>(this.url + 'get_temp_licence/' + licence_id);
  }
  getTempContractById(contract_id: any): Observable<contract> {
    return this.httpClient.get<contract>(this.url + 'get_temp_contract/' + contract_id);
  }
  getPaymentsByContractId(contractId: number): Observable<any[]> {
    console.log(
      'contid: ' + contractId
    );
    return this.httpClient.get<payments[]>(`${this.url}get_payments_by_contractId/${contractId}`);
  }

  getTempPaymentsByContractId(contractId: number): Observable<any[]> {
    return this.httpClient.get<payments[]>(`${this.url}get_temp_payments_by_contractId/${contractId}`);
  }

  getBankDetail(vendor_id: any): Observable<Vendors> {
    return this.httpClient.get<Vendors>(this.url + 'get_bank_detail/' + vendor_id);
  }

  updateBankDetail(formData: FormData): Observable<any> {
    // console.log('here is bank '+formData.bank_name)
    // console.log('here is id '+updatedData.id)
    return this.httpClient.post(`${this.url + 'update_bank_detail'}`, formData);
  }
  //demeke end

  // start mebrat

  deactivateContract(contract_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'deactivate_contract/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  activateContract(contract_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'activate_contract/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  completeContract(contract_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'complete_contract/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  terminateContract(contract_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'terminate_contract/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  getContractRemark(id: number): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(
      this.url + 'get-contract-remark/' + id
    );
  }

  contractRemark(contract_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'contract_remark/' + contract_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  downloadContractFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-contract/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }


  downloadContractFilesHistory(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-contract-renew_extend/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }


  downloadAddendumFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-addendum-file/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
  downloadSecuritytFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-security/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  downloadContracConfirmationPaymenttFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-payment-confirmation/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  rejectUpdat(vendor_id: any, remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'reject_update/' + vendor_id, remark, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  checkVendorExist(VendorName: any
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'check_vendor_name/' + VendorName
    );
  }

  checkDirectorateExist(DirectorateName: any
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'check_directorate_exists/' + DirectorateName
    );
  }

  checkIssuerBankExist(BankName: any
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'check_issuer_bank_exists/' + BankName
    );
  }

  downloadContractFilesForRenew(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-contract-renew/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }


  getMakerDashboardData(): Observable<any> {
    return this.httpClient.get<Observable<any>>(this.url + 'getMakerData');
  }

  registerContractType(registerContractTypePayload: Product): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(
        this.url + 'register_contract_type',
        registerContractTypePayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  getContractType(contract_type_id: any): Observable<Product> {
    return this.httpClient.get<Product>(this.url + 'get_contract_type/' + contract_type_id);
  }

  getAllContractTypes(): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(this.url + 'get_all_contract_types');
  }

  deactivateContractType(contract_type_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'deactivate_contract_type/' + contract_type_id);
  }

  activateContractType(contract_type_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_contract_type/' + contract_type_id);
  }

  deleteContractType(contract_type_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_contract_type/' + contract_type_id);
  }

  getAllPaymentstatus(): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(this.url + 'get_all_payment_status');
  }
  registerPaymentStatus(registerContractTypePayload: Product): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(
        this.url + 'register_payment_status',
        registerContractTypePayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  getPaymentStatus(payment_status_id: any): Observable<Product> {
    return this.httpClient.get<Product>(this.url + 'get_payment_status/' + payment_status_id);
  }

  deactivatePaymentStatus(payment_status_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'deactivate_payment_status/' + payment_status_id);
  }

  activatePaymentStatus(payment_status_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_payment_status/' + payment_status_id);
  }

  deleteContractPaymentStatus(payment_status_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_payment_status/' + payment_status_id);
  }

  getPayment(id: number): Observable<contract> {
    return this.httpClient.get<contract>(
      this.url + 'get-payment/' + id
    );
  }
  deletePayment(payment_id: any): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .get<Boolean>(this.url + 'delete_payment/' + payment_id, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  getPaymentDetail(id: number): Observable<payments> {
    console.log('id: ' + id);
    return this.httpClient.get<payments>(
      this.url + 'get-payments/' + id
    );
  }


  getOldPaymentDetail(id: number): Observable<payments> {
    return this.httpClient.get<payments>(
      this.url + 'get-old-payments/' + id
    );
  }

  getAddendumPaymentDetail(id: number): Observable<payments> {
    return this.httpClient.get<payments>(
      this.url + 'get-addendum-payments/' + id
    );
  }

  getContractHistory(contract_id: number): Observable<contract> {
    return this.httpClient.get<contract>(
      this.url + 'get_contract_history/' + contract_id
    );
  }

  getContractAddendum(contract_id: number): Observable<contract> {
    return this.httpClient.get<contract>(
      this.url + 'get_contract_addendum/' + contract_id
    );
  }

  PaymentRequest(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.url + 'payment_request'}`, formData);
  }

  // getDetailHistory(contract_id: any): Observable<Array<object>> {
  //   return this.httpClient.get<Array<object>>(this.url + 'get_detail_history/' + contract_id);
  // }

  getHistory(vendor_id: any): Observable<Array<Vendors>> {
    return this.httpClient.get<Array<Vendors>>(this.url + 'get_vendor_history/' + vendor_id);
  }


  getLicenceHistory(licence_id: any): Observable<Array<Object>> {
    return this.httpClient.get<Array<Object>>(this.url + 'get_licence_history/' + licence_id);
  }

  getMakerNotification(): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(
      this.url + 'get-notification'
    );
  }

  ViewNotification(id: any, type: any): Observable<Boolean> {
    console.log('response1: ' + id);
    console.log('response2: ' + type);
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      params: { type: type },
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'view_notification/' + id, null, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  downloadReportFiles(report: Reports): Observable<HttpEvent<Blob>> {

    this.downloadUrl = `${this.url}downloadReportFiles`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.downloadUrl}`, report, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  getVendor(): Observable<Array<Vendors>> {
    return this.httpClient.get<Array<Vendors>>(this.url + 'get_vendors_for_report');
  }
  getContractByVendorId(vendor_id: any): Observable<Array<contract>> {
    return this.httpClient.get<Array<contract>>(this.url + 'get_Contracts_by_vendorId/' + vendor_id);
  }
  get_payment_by_itsId(id: any, contract_id: any): Observable<Array<payments>> {
    return this.httpClient.get<Array<payments>>(this.url + 'get_payment_by_itsId/' + id + '?contract_id=' + encodeURIComponent(contract_id));
  }

  PaymentProcess(formData: FormData): Observable<any> {
    console.log(
      JSON.stringify("==" + formData, null, 2)
    );
    return this.httpClient.post(`${this.url + 'payment_process'}`, formData);
  }
  payment_files_by_payment_id(payment_id: any): Observable<Array<FileTable>> {
    return this.httpClient.get<Array<FileTable>>(this.url + 'get-payment-files/' + payment_id);
  }
  deleteFile(file_id: any): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .get<Boolean>(this.url + 'delete_file/' + file_id, requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  downloadFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download-files/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
  remove_pending_payment(id: any, addendum: any): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .get<Boolean>(`${this.url}remove_pending_payment/${id}/${addendum}`, requestOptions)
      .pipe(
        map((data) => {
          console.log('Response:', JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  getReasonByPaymentId(id: any): Observable<Array<Reason>> {
    return this.httpClient.get<Array<Reason>>(this.url + 'get-payment-reason/' + id);
  }

}
