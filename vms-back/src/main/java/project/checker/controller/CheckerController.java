package project.checker.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.checker.service.CheckerService;
import project.maker.model.Remarks;
import project.response.APIResponse;

@RestController
@RequestMapping("/api/checker/")
public class CheckerController {
	@Autowired
	private CheckerService checkerService;

	@RequestMapping(value = "get_all_vendors", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAllVendors(HttpServletRequest request) {
		return APIResponse.response(checkerService.getAllVendors(request));
	}

	@RequestMapping(value = "approve_vendor/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> approve_vendor(@PathVariable("vendor_id") String vendor_id,
			HttpServletRequest request) {
		return APIResponse.response(checkerService.approveVendor(vendor_id, request));
	}

	@RequestMapping(value = "reject_vendor/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> reject_vendor(@PathVariable("vendor_id") Long vendor_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(checkerService.reject_vendor(vendor_id, remark, request));
	}

	@RequestMapping(value = "vendor_remark/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> vendor_remark(HttpServletRequest request, @Validated @RequestBody Remarks remark,
			@PathVariable("vendor_id") long vendor_id) {
		return APIResponse.response(checkerService.vendor_remark(request, vendor_id, remark));
	}

	@RequestMapping(value = "get-remark/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_remark(HttpServletRequest request, @PathVariable("vendor_id") String vendor_id) {
		return APIResponse.response(checkerService.getRemarksByVendorId(vendor_id, request));
	}

	@RequestMapping(value = "get_remark_byId/{remark_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getRemarkByID(HttpServletRequest request, @PathVariable("remark_id") long id) {
		return APIResponse.response(checkerService.getRemarkByID(request, id));

	}

	@RequestMapping(value = "delete_remark/{remark_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> delete_remark(@PathVariable("remark_id") String request_id,
			HttpServletRequest request) {
		return APIResponse.response(checkerService.deleteRemark(request_id, request));
	}

	@RequestMapping(value = "update_your_remark/{remark_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> update_remark(HttpServletRequest request, @Validated @RequestBody Remarks remark,
			@PathVariable("remark_id") long remark_id) {
		return APIResponse.response(checkerService.update_remark(request, remark_id, remark));
	}

	@RequestMapping(value = "get_reason/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_reason(HttpServletRequest request, @PathVariable("id") String id,
			@RequestParam("type") String type) {
		return APIResponse.response(checkerService.get_reason(id, type, request));
	}

	@RequestMapping(value = "accept_request/{id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> accept_request_after_approved(@PathVariable("id") Long id,
			@Validated @RequestBody Remarks remark, @RequestParam("type") String type, HttpServletRequest request) {
		return APIResponse.response(checkerService.accept_request_after_approved(id, remark, type, request));
	}

	@RequestMapping(value = "reject_request/{vendor_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> reject_request_after_approved(@PathVariable("vendor_id") Long vendor_id,
			@Validated @RequestBody Remarks remark, HttpServletRequest request) {
		return APIResponse.response(checkerService.reject_request_after_approved(vendor_id, remark, request));
	}

	@RequestMapping(value = "get_vendor_id/{vendor_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_vendor_id(@PathVariable("vendor_id") Long request_id,
			HttpServletRequest request) {
		return APIResponse.response(checkerService.get_vendor_id(request_id, request));
	}

	@RequestMapping(value = "approve_contract/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> approve_contract(@PathVariable("contract_id") String contract_id,
			HttpServletRequest request) {
		return APIResponse.response(checkerService.approveContract(contract_id, request));
	}

	@RequestMapping(value = "reject_contract/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> reject_contract(@PathVariable("contract_id") Long contract_id,
			@Validated @RequestBody Remarks remark, @RequestParam("reason") String reason, HttpServletRequest request) {
		System.out.println("==========================" + reason);
		return APIResponse.response(checkerService.reject_contract(contract_id, remark, reason, request));
	}

	@RequestMapping(value = "contract_remark/{contract_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> contract_remark(HttpServletRequest request, @Validated @RequestBody Remarks remark,
			@PathVariable("contract_id") long contract_id) {
		return APIResponse.response(checkerService.contract_remark(request, contract_id, remark));
	}

	@RequestMapping(value = "get-contract-remark/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_contract_remark(HttpServletRequest request,
			@PathVariable("contract_id") String contract_id) {
		return APIResponse.response(checkerService.getRemarksByContractId(contract_id, request));
	}

	@RequestMapping(value = "get_extend_or_renew_contract/{contract_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_extend_renew_for_approve(HttpServletRequest request,
			@PathVariable("contract_id") long contract_id) {
		System.out.println("here  is contrat id " + contract_id);
		return APIResponse.response(checkerService.get_extend_renew_for_approve(request, contract_id));
	}

	@RequestMapping(value = "approve_payment/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> approve_payment(@PathVariable("payment_id") Long request_id,
			HttpServletRequest request) {
		return APIResponse.response(checkerService.approve_payment(request_id, request));
	}

	@RequestMapping(value = "get-notification", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> get_notification(HttpServletRequest request) {
		return APIResponse.response(checkerService.getCheckerNotification(request));
	}
}
