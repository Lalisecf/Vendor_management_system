package project.maker.controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.MediaType;

import project.Exception.ExceptionsList;
import project.maker.mapper.MakerMapper;
import project.maker.model.*;
import project.maker.service.MakerService;
import project.response.APIResponse;

@RestController
@RequestMapping("/api/maker/")
public class MakerController {

	@Autowired
	private MakerService makerService;

	// @Autowired
	// private MakerMapper makerMapper;

	@RequestMapping(value = "register_product", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> register_product(HttpServletRequest request,
			@Validated @RequestBody Product ProductModel) {
		System.out.println("we are here to clarify the code" + ProductModel.getId());
		if (ProductModel.getId() != null)
			return APIResponse.response(makerService.update_product(ProductModel, request));
		else
			return APIResponse.response(makerService.register_product(ProductModel, request));
	}

	@RequestMapping(value = "add-service", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> Add_service(HttpServletRequest request,
			@Validated @RequestBody ServiceModel addServiceModel) {
		System.out.println("we are here to clarify the code" + addServiceModel.getId());
		if (addServiceModel.getId() != null)
			return APIResponse.response(makerService.update_service(addServiceModel, request));
		else
			return APIResponse.response(makerService.register_service(addServiceModel, request));
	}

	@RequestMapping(value = "add-directorate", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> Add_directorate(HttpServletRequest request,
			@Validated @RequestBody ServiceModel addServiceModel) {
		System.out.println("we are here to clarify the code" + addServiceModel.getId());
		if (addServiceModel.getId() != null)
			return APIResponse.response(makerService.update_directorate(addServiceModel, request));
		else
			return APIResponse.response(makerService.register_directorate(addServiceModel, request));
	}

	@RequestMapping(value = "add-issuer-bank", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> Add_issuer_bank(HttpServletRequest request,
			@Validated @RequestBody ServiceModel addServiceModel) {
		System.out.println("we are here to clarify the code" + addServiceModel.getId());
		if (addServiceModel.getId() != null)
			return APIResponse.response(makerService.update_issuer_bank(addServiceModel, request));
		else
			return APIResponse.response(makerService.register_issuer_bank(addServiceModel, request));
	}

	@RequestMapping(value = "check_vendor_name/{VendorName}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> check_vendor(HttpServletRequest request,
			@PathVariable("VendorName") String VendorName) {
		Boolean result = makerService.checkVendoName(VendorName, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "check_directorate_exists/{DirectorateName}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> check_directorate_exists(HttpServletRequest request,
			@PathVariable("DirectorateName") String DirectorateName) {
		Boolean result = makerService.checkDirectorateExists(DirectorateName, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "check_issuer_bank_exists/{BankName}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> check_bank_exists(HttpServletRequest request,
			@PathVariable("BankName") String BankName) {
		Boolean result = makerService.checkBankExists(BankName, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "get-all-services", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllUserUsers(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllServices(request));
	}

	@RequestMapping(value = "get-all-directorates", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllDirectorates(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllDirectorates(request));
	}

	@RequestMapping(value = "get-all-issuer-banks", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllIssuerBanks(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllIssuerBanks(request));
	}

	@RequestMapping(value = "get_service/{service_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_service(HttpServletRequest request,
			@PathVariable("service_id") String service_id) {
		return APIResponse.response(makerService.getService(service_id, request));
	}

	@RequestMapping(value = "get_directorate/{directorate_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_directorate(HttpServletRequest request,
			@PathVariable("directorate_id") String directorate_id) {
		return APIResponse.response(makerService.getDirectorate(directorate_id, request));
	}

	@RequestMapping(value = "get_issuer_bank/{bank_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_issuer_bank(HttpServletRequest request,
			@PathVariable("bank_id") String bank_id) {
		return APIResponse.response(makerService.getIssuerBank(bank_id, request));
	}

	@RequestMapping(value = "deactivate_service/{service_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_user(@PathVariable("service_id") String service_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deactivateService(service_id, request));
	}

	@RequestMapping(value = "deactivate_directorate/{directorate_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_directorate(@PathVariable("directorate_id") String directorate_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deactivateDirectorate(directorate_id, request));
	}

	@RequestMapping(value = "deactivate_issuer_bank/{bank_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_issuer_bank(@PathVariable("bank_id") String bank_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deactivateIssuerBank(bank_id, request));
	}

	@RequestMapping(value = "activate_service/{service_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> activate_user(@PathVariable("service_id") String service_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.activateService(service_id, request));
	}

	@RequestMapping(value = "activate_directorate/{directorate_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> activate_directorate(@PathVariable("directorate_id") String directorate_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.activateDirectorate(directorate_id, request));
	}

	@RequestMapping(value = "activate_issuer_bank/{bank_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> activate_issuer_bank(@PathVariable("bank_id") String bank_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.activateIssuerBank(bank_id, request));
	}

	@RequestMapping(value = "delete_servicer/{service_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_user(HttpServletRequest request,
			@PathVariable("service_id") String service_id) {
		Boolean result = makerService.deleteService(service_id, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "delete_directorate/{directorate_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_directorate(HttpServletRequest request,
			@PathVariable("directorate_id") String directorate_id) {
		Boolean result = makerService.deleteDirectorate(directorate_id, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "delete_issuer_bank/{bank_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_issuer_bank(HttpServletRequest request,
			@PathVariable("bank_id") String bank_id) {
		Boolean result = makerService.deleteIssuerBank(bank_id, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "get_all_products", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllProducts(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllProducts(request));
	}

	@RequestMapping(value = "deactivate_product/{product_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_product(@PathVariable("product_id") Long product_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deactivate_product(product_id, request));
	}

	@RequestMapping(value = "activate_product/{product_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> activate_product(@PathVariable("product_id") Long product_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.activate_product(product_id, request));
	}

	@RequestMapping(value = "delete_product/{product_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_product(@PathVariable("product_id") Long product_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.delete_product(product_id, request));
	}

	@RequestMapping(value = "get_product/{product_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_product(HttpServletRequest request,
			@PathVariable("product_id") String product_id) {
		return APIResponse.response(makerService.getProduct(product_id, request));
	}

	@PostMapping("register_vendor")
	public ResponseEntity<Boolean> register_vendor(@ModelAttribute Vendors vendorModel, HttpServletRequest request)
			throws IOException {
		if (vendorModel.getId() != null)
			return APIResponse.response(makerService.update_vendor(vendorModel, request));
		else
			return APIResponse.response(makerService.register_vendor(vendorModel, request));
	}

	@RequestMapping("update_bank_detail")
	public ResponseEntity<Boolean> updateBankDetal(@ModelAttribute Vendors vendorModel, HttpServletRequest request)
			throws IOException {
		System.out.println("vendor name from controller **********" + vendorModel.getBank_name());
		System.out.println("vendor id from controller **********" + vendorModel.getId());
		return APIResponse.response(makerService.update_bank_detail(vendorModel, request));

	}

	@RequestMapping(value = "get_all_vendors", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllVendors(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllVendors(request));
	}

	@RequestMapping(value = "get_all_licences", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllLicences(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllLicences(request));
	}

	@RequestMapping(value = "approve_licence/{licence_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> approve_licence(@PathVariable("licence_id") String licence_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.approveLicences(licence_id, request));
	}

	@RequestMapping(value = "get_vendor/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getVendor(HttpServletRequest request, @PathVariable("vendor_id") Long vendor_id) {
		return APIResponse.response(makerService.getVendor(request, vendor_id));
	}

	@RequestMapping(value = "deactivate_vendor/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_vendor(@PathVariable("vendor_id") Long vendor_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.deactivate_vendor(vendor_id, remark, request));
	}

	@RequestMapping(value = "activate_vendor/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> activate_vendor(@PathVariable("vendor_id") Long vendor_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.activate_vendor(vendor_id, remark, request));
	}

	@RequestMapping(value = "delete_vendor/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> delete_vendor(@PathVariable("vendor_id") Long vendor_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.delete_vendor(vendor_id, remark, request));
	}

	@RequestMapping(value = "reject_update/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> reject_update(@PathVariable("vendor_id") Long vendor_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.reject_update(vendor_id, remark, request));
	}

	@RequestMapping(value = "get-remark/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_remark(HttpServletRequest request, @PathVariable("vendor_id") String vendor_id) {
		return APIResponse.response(makerService.getRemarksByVendorId(vendor_id, request));
	}

	@RequestMapping(value = "vendor_remark/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> vendor_remark(HttpServletRequest request, @Validated @RequestBody Remarks remark,
			@PathVariable("vendor_id") long vendor_id) {
		return APIResponse.response(makerService.vendor_remark(request, vendor_id, remark));
	}

	@RequestMapping(value = "get_remark_byId/{remark_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getRemarkByID(HttpServletRequest request, @PathVariable("remark_id") long id) {
		return APIResponse.response(makerService.getRemarkByID(request, id));

	}

	@RequestMapping(value = "delete_remark/{remark_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_remark(@PathVariable("remark_id") String request_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deleteRemark(request_id, request));
	}

	@RequestMapping(value = "update_your_remark/{remark_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> update_remark(HttpServletRequest request, @Validated @RequestBody Remarks remark,
			@PathVariable("remark_id") long remark_id) {
		return APIResponse.response(makerService.update_remark(request, remark_id, remark));
	}
	// @RequestMapping(value = "get_vendor/{vendor_id}", method = RequestMethod.GET,
	// produces = "application/json")
	// public ResponseEntity<Object> get_vendor(HttpServletRequest request,
	// @PathVariable("vendor_id") String vendor_id) {
	// return APIResponse.response(makerService.getVendorById(vendor_id, request));
	// }

	@RequestMapping(value = "get_vendor", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Object> get_vendor(HttpServletRequest request, @RequestBody() String datas) {
		return APIResponse.response(makerService.getVendorById(request, datas));
	}

	//
	// @RequestMapping(value = "download/{id}", method = RequestMethod.GET, produces
	// = "application/json")
	// public ResponseEntity<Resource> downloadFiles(HttpServletRequest request,
	// @PathVariable Long id)
	// throws ParseException {
	// System.out.println("this is controller class...");
	// return makerService.downloadFiles(request, id);
	// }
	@RequestMapping(value = "download/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> downloadFiles(HttpServletRequest request, @PathVariable Long id,
			@RequestParam("document_type") String document_type)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.downloadFiles(request, id, document_type);
	}

	@RequestMapping(value = "download-updated/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> downloadFilesupdated(HttpServletRequest request, @PathVariable Long id,
			@RequestParam("document_type") String document_type)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.downloadFilesupdated(request, id, document_type);
	}

	@RequestMapping(value = "get_service_with_in_vendor/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getServicesByVendorId(HttpServletRequest request, @PathVariable Long vendor_id) {
		return APIResponse.response(makerService.getServicesByVendorId(request, vendor_id));
	}

	@RequestMapping(value = "get_product_with_in_vendor/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getProductsByVendorId(HttpServletRequest request, @PathVariable Long vendor_id) {
		return APIResponse.response(makerService.getProductsByVendorId(request, vendor_id));
	}

	// mebrat start

	@RequestMapping(value = "get_all_contracts", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllcontracts(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllContracts(request));
	}

	// new
	@RequestMapping(value = "get_payments_by_contractId/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentsByContract(HttpServletRequest request,
			@PathVariable("contract_id") long id) {
		System.out.println("id:" + id);
		return APIResponse.response(makerService.getPaymentsByContract(request, id));
	}

	@RequestMapping(value = "get_temp_payments_by_contractId/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getTempPaymentsByContract(HttpServletRequest request,
			@PathVariable("contract_id") Long id) {
		return APIResponse.response(makerService.getTempPaymentsByContract(request, id));
	}

	@RequestMapping(value = "get_payment_detail/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentDetailByContractId(HttpServletRequest request,
			@PathVariable("contract_id") long id) {
		return APIResponse.response(makerService.getPaymentDetailByContractId(request, id));

	}

	@PostMapping("register_contract")
	public ResponseEntity<Boolean> register_contract(@ModelAttribute Contract contractModel,
			@RequestParam("payment") String paymentsJson, HttpServletRequest request)
			throws IOException {
		try {
			request.getParameterMap().forEach((key, value) -> System.out.println(key + ":  " + Arrays.toString(value)));
			System.out.println("here is the contract type " + contractModel.getContract_type());

			// Parse each payment JSON string into a Payment object
			ObjectMapper objectMapper = new ObjectMapper();
			List<Payment> payments = objectMapper.readValue(paymentsJson, new TypeReference<List<Payment>>() {
			});

			if (contractModel.getId() != null)
				return APIResponse.response(makerService.update_contract(contractModel, payments, request));
			else
				return APIResponse.response(makerService.register_contract(contractModel, payments, request));
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	@PostMapping("register_licence")
	public ResponseEntity<Boolean> register_licence(@ModelAttribute Licence licenceModel, HttpServletRequest request)
			throws IOException {
		try {
			if (licenceModel.getId() != null)
				return APIResponse.response(makerService.update_licence(licenceModel, request));
			else
				return APIResponse.response(makerService.register_licence(licenceModel, request));
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	@RequestMapping(value = "get_contract/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_contract(HttpServletRequest request,
			@PathVariable("contract_id") String contract_id) {
		return APIResponse.response(makerService.getContractById(contract_id, request));
	}

	@RequestMapping(value = "get_licence/{licence_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_licence(HttpServletRequest request,
			@PathVariable("licence_id") String licence_id) {
		return APIResponse.response(makerService.getLicenceById(licence_id, request));
	}

	@RequestMapping(value = "get_temp_licence/{licence_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_temp_licence(HttpServletRequest request,
			@PathVariable("licence_id") String licence_id) {
		return APIResponse.response(makerService.getTempLicenceById(licence_id, request));
	}

	@RequestMapping(value = "get_temp_contract/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_temp_contract(HttpServletRequest request,
			@PathVariable("contract_id") String contract_id) {
		return APIResponse.response(makerService.getTempContractById(contract_id, request));
	}

	@RequestMapping(value = "get_bank_detail/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getBankDetail(HttpServletRequest request,
			@PathVariable("vendor_id") String vendor_id) {
		return APIResponse.response(makerService.getBankDetail(vendor_id, request));
	}

	@RequestMapping(value = "delete_contract/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> DeleteContractRequestById(HttpServletRequest request,
			@PathVariable("contract_id") long id) {
		return APIResponse.response(makerService.DeleteContractRequest(request, id));

	}

	// mebrat start
	@RequestMapping(value = "deactivate_contract/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_contr(@PathVariable("contract_id") Long contract_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.deactivate_contract(contract_id, remark, request));
	}

	@RequestMapping(value = "activate_contract/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> activate_contract(@PathVariable("contract_id") Long contract_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.activate_contract(contract_id, remark, request));
	}

	@RequestMapping(value = "complete_contract/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> complete_contract(@PathVariable("contract_id") Long contract_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.complete_contract(contract_id, remark, request));
	}

	@RequestMapping(value = "terminate_contract/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> terminate_contract(@PathVariable("contract_id") Long contract_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(makerService.Terminate_contract(contract_id, remark, request));
	}

	@RequestMapping(value = "get-contract-remark/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_contract_remark(HttpServletRequest request,
			@PathVariable("contract_id") String contract_id) {
		return APIResponse.response(makerService.getRemarksByContractId(contract_id, request));
	}

	@RequestMapping(value = "contract_remark/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> contract_remark(HttpServletRequest request, @Validated @RequestBody Remarks remark,
			@PathVariable("contract_id") long contract_id) {
		return APIResponse.response(makerService.contract_remark(request, contract_id, remark));
	}

	@RequestMapping(value = "download-security/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> security_downloadFiles(HttpServletRequest request, @PathVariable Long id)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.security_downloadFiles(request, id);
	}

	@RequestMapping(value = "download-contract/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> contract_downloadFiles(HttpServletRequest request, @PathVariable Long id)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.contract_downloadFiles(request, id);
	}

	@RequestMapping(value = "download-addendum-file/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> addendum_downloadFiles(HttpServletRequest request, @PathVariable Long id)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.addendum_downloadFiles(request, id);
	}

	@RequestMapping(value = "download-payment-confirmation/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> contract_payment_confirmation_downloadFiles(HttpServletRequest request,
			@PathVariable Long id) throws ParseException {
		System.out.println("this is controller class...");
		return makerService.payment_confirmation_downloadFiles(request, id);
	}

	@RequestMapping(value = "download-contract-renew/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> contract_document_renew_downloadFiles(HttpServletRequest request,
			@PathVariable Long id) throws ParseException {
		System.out.println("this is controller class...");
		return makerService.contract_document_renew_downloadFiles(request, id);
	}

	@RequestMapping(value = "getMakerData", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAdminDashboardData(HttpServletRequest request) {
		return APIResponse.response(makerService.getMakerDashboardData(request));
	}

	// mebrat start

	@RequestMapping(value = "register_contract_type", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> register_ContractType(HttpServletRequest request,
			@Validated @RequestBody Product ProductModel) {
		System.out.println("we are here to clarify the code" + ProductModel.getId());
		if (ProductModel.getId() != null)
			return APIResponse.response(makerService.update_contract_type(ProductModel, request));
		else
			return APIResponse.response(makerService.register_Contract_Type(ProductModel, request));
	}

	@RequestMapping(value = "register_payment_status", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> PaymentStatus(HttpServletRequest request,
			@Validated @RequestBody Product ProductModel) {
		System.out.println("we are here to clarify the code" + ProductModel.getId());
		if (ProductModel.getId() != null)
			return APIResponse.response(makerService.update_PaymentStatus(ProductModel, request));
		else
			return APIResponse.response(makerService.register_PaymentStatus(ProductModel, request));
	}

	@RequestMapping(value = "get_all_payment_status", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllPaymentStatuss(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllPaymentStatus(request));
	}

	@RequestMapping(value = "get_payment_status/{payment_ststus_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_payment_status(HttpServletRequest request,
			@PathVariable("payment_ststus_id") String service_id) {
		return APIResponse.response(makerService.getPaymentStatus(service_id, request));
	}

	@RequestMapping(value = "deactivate_payment_status/{payment_ststus_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_payment_status(@PathVariable("payment_ststus_id") Long service_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deactivate_PaymentStatus(service_id, request));
	}

	@RequestMapping(value = "activate_payment_status/{payment_ststus_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> activate_payment_status(@PathVariable("payment_ststus_id") Long service_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.activate_PaymentStatus(service_id, request));
	}

	@RequestMapping(value = "delete_payment_status/{payment_ststus_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_payment_status(HttpServletRequest request,
			@PathVariable("payment_ststus_id") Long service_id) {
		Boolean result = makerService.delete_PaymentStatus(service_id, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "get_all_contract_types", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllcontract_type(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllContractTypes(request));
	}

	@RequestMapping(value = "get_vendors_for_report", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_vendors_for_report(HttpServletRequest request) {
		return APIResponse.response(makerService.getAllVendorsForReport(request));
	}

	@RequestMapping(value = "deactivate_contract_type/{contract_type_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> deactivate_contract_type(@PathVariable("contract_type_id") Long product_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.deactivate_ContractType(product_id, request));
	}

	@RequestMapping(value = "activate_contract_type/{contract_type_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> activate_contract_type(@PathVariable("contract_type_id") Long product_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.activate_ContractType(product_id, request));
	}

	@RequestMapping(value = "delete_contract_type/{contract_type_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_contract_type(@PathVariable("contract_type_id") Long product_id,
			HttpServletRequest request) {
		return APIResponse.response(makerService.delete_ContractType(product_id, request));
	}

	@RequestMapping(value = "get_contract_type/{contract_type_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_contract_type(HttpServletRequest request,
			@PathVariable("contract_type_id") String contract_type_id) {
		return APIResponse.response(makerService.getContractType(contract_type_id, request));
	}

	@RequestMapping(value = "get-payment/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentByContractId(HttpServletRequest request,
			@PathVariable("contract_id") long id) {
		return APIResponse.response(makerService.getPaymentByContractId(request, id));

	}

	@RequestMapping(value = "delete_payment/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_payment(HttpServletRequest request,
			@PathVariable("payment_id") Long service_id) {
		Boolean result = makerService.delete_Payment(service_id, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "get-payments/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentById(HttpServletRequest request,
			@PathVariable("payment_id") long id) {
		return APIResponse.response(makerService.getPaymentById(request, id));

	}

	@RequestMapping(value = "get-old-payments/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getOldPaymentById(HttpServletRequest request,
			@PathVariable("payment_id") long id) {
		return APIResponse.response(makerService.getOldPaymentById(request, id));

	}

	@RequestMapping(value = "get-addendum-payments/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAddendumPaymentById(HttpServletRequest request,
			@PathVariable("payment_id") long id) {
		return APIResponse.response(makerService.getAddendumPaymentById(request, id));

	}

	@PostMapping("payment_request")
	public ResponseEntity<Boolean> payment_request(@ModelAttribute Contract contractModel, HttpServletRequest request)
			throws IOException {
		System.out.println("here is the contract type " + contractModel.getContract_type());
		return APIResponse.response(makerService.contract_request(contractModel, request));

	}

	@RequestMapping(value = "get_contract_history/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_detail_history(HttpServletRequest request,
			@PathVariable("contract_id") long id) {
		return APIResponse.response(makerService.getDetailHistory(request, id));

	}

	@RequestMapping(value = "get_contract_addendum/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_contract_addendum(HttpServletRequest request,
			@PathVariable("contract_id") long id) {
		return APIResponse.response(makerService.getContractAddendum(request, id));

	}

	@RequestMapping(value = "download-contract-renew_extend/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> contract_downloadFiles_renew(HttpServletRequest request, @PathVariable Long id)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.contract_downloadFiles_renew_extend(request, id);
	}

	@RequestMapping(value = "get_vendor_history/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_vendor_history(HttpServletRequest request,
			@PathVariable("vendor_id") long id) {
		return APIResponse.response(makerService.getVendorDetailHistory(request, id));

	}

	@RequestMapping(value = "get_licence_history/{licence_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_licence_history(HttpServletRequest request,
			@PathVariable("licence_id") long id) {
		return APIResponse.response(makerService.getLicenceDetailHistory(request, id));

	}

	@RequestMapping(value = "get-notification", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_notification(HttpServletRequest request) {
		return APIResponse.response(makerService.getMakerNotification(request));
	}

	@RequestMapping(value = "view_notification/{id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> view_notification(@PathVariable("id") Long id,
			@RequestParam("type") String type, HttpServletRequest request) {
		System.out.println("==========================" + id);
		return APIResponse.response(makerService.ViewNotification(request, id, type));
	}

	@RequestMapping(value = "downloadReportFiles", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Resource> downloadReportFiles(HttpServletRequest request,
			@Validated @RequestBody Reports report) throws ParseException {
		System.out.println("this is the file download controllerrrrrrrrrrrrr");
		return makerService.downloadReportFiles(request, report);
	}

	@RequestMapping(value = "get_Contracts_by_vendorId/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_Contracts_by_vendorId(HttpServletRequest request,
			@PathVariable("vendor_id") Long vendor_id) {
		System.out.println("vendorideeee:" + vendor_id);
		return APIResponse.response(makerService.get_Contracts_by_vendorId(request, vendor_id));
	}

	@RequestMapping(value = "get_payment_by_itsId/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentByPaymentId(
			HttpServletRequest request,
			@PathVariable("id") Long id,
			@RequestParam(value = "contract_id", required = false) Long contract_id) {

		System.out.println("Payment ID: " + id);
		System.out.println("Type: " + contract_id); // Log the type parameter

		// Call the service method and pass the type parameter if needed
		return APIResponse.response(makerService.getPaymentByPaymentId(request, id, contract_id));
	}

	// Mebrat end
	@PostMapping("payment_process")
	public ResponseEntity<Boolean> payment_process(@RequestParam("id") Long paymentId,
			@RequestParam("amount") Double amount,
			@RequestParam("dueDate") String dueDate,
			@RequestParam("paidAmount") Double paidAmount,
			@RequestParam("reason") String reason,
			@RequestParam("addendum") String addendum,
			@RequestParam("files") List<MultipartFile> files,
			@RequestParam("file_labels") List<String> fileLabels,
			HttpServletRequest request) {
		return APIResponse
				.response(makerService.processPayment(paymentId, amount, paidAmount, dueDate, reason, addendum, files,
						fileLabels, request));
	}

	@RequestMapping(value = "get-payment-files/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentFiles(HttpServletRequest request, @PathVariable Long id) {
		System.out.println("Downloading payment files for ID: " + id);
		return APIResponse.response(makerService.getPaymentFiles(request, id));
	}

	@RequestMapping(value = "delete_file/{file_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_file(HttpServletRequest request,
			@PathVariable("file_id") Long file_id) {
		Boolean result = makerService.delete_file(file_id, request);
		if (result != null)
			if (result == true)
				return APIResponse.response(true);
		return APIResponse.response(false);
	}

	@RequestMapping(value = "download-files/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> download_files(HttpServletRequest request, @PathVariable Long id)
			throws ParseException {
		System.out.println("this is controller class...");
		return makerService.download_files(request, id);
	}

	@RequestMapping(value = "remove_pending_payment/{id}/{addendum}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> remove_payments(HttpServletRequest request,
			@PathVariable("id") Long id,
			@PathVariable("addendum") String addendum) {

		Boolean result = makerService.remove_payments(id, addendum, request);

		return APIResponse.response(result != null && result);
	}

	@RequestMapping(value = "get-payment-reason/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_payment_reason(HttpServletRequest request,
			@PathVariable("payment_id") String payment_id) {
		return APIResponse.response(makerService.get_payment_reason(payment_id, request));
	}
}
