package project.Manager.controller;

import java.text.ParseException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.Manager.service.ManagerService;
import project.maker.model.Remarks;
import project.response.APIResponse;

@RestController
@RequestMapping("/api/manager/")
public class ManagerController {
	@Autowired
	private ManagerService managerService;

	@RequestMapping(value = "get-requested-payments", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getRequestedPayments(HttpServletRequest request) {
		return APIResponse.response(managerService.getRequestedPayments(request));
	}

	@RequestMapping(value = "get-payments-history", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentHistory(HttpServletRequest request) {
		return APIResponse.response(managerService.getPaymentHistory(request));
	}

	@RequestMapping(value = "get-requested-addendum-payments", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getRequestedAddendumPayments(HttpServletRequest request) {
		return APIResponse.response(managerService.getRequestedAddendumPayments(request));
	}

	@RequestMapping(value = "get-payments/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentById(HttpServletRequest request,
			@PathVariable("payment_id") long payment_id) {
		System.out.println("=payments" + payment_id);
		return APIResponse.response(managerService.getPaymentById(request, payment_id));

	}

	@RequestMapping(value = "get-addendum-payments/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getAddendumPaymentById(HttpServletRequest request,
			@PathVariable("payment_id") long payment_id) {
		System.out.println("=payments" + payment_id);
		return APIResponse.response(managerService.getAddendumPaymentById(request, payment_id));

	}

	@RequestMapping(value = "reject_payment/{payment_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> reject_payment(@PathVariable("payment_id") Long payment_id,
			@Validated @RequestBody Remarks remark, @RequestParam("reason") String reason, HttpServletRequest request) {
		System.out.println("==========================" + remark);
		return APIResponse.response(managerService.reject_payment(payment_id, remark, reason, request));
	}

	@RequestMapping(value = "get-payments-Doc/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getPaymentDoc(HttpServletRequest request,
			@PathVariable("payment_id") long payment_id) {
		return APIResponse.response(managerService.getPaymentDoc(request, payment_id));

	}

	@RequestMapping(value = "download-payment-file/{id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Resource> security_downloadFiles(HttpServletRequest request, @PathVariable String id)
			throws ParseException {
		System.out.println("this is controller class...");
		System.out.println("=payments" + id);
		return managerService.payment_downloadFiles(request, id);
	}

	@RequestMapping(value = "approve_payment/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> approve_payment(@PathVariable("payment_id") Long request_id,
			HttpServletRequest request) {
		return APIResponse.response(managerService.approve_payment(request_id, request));
	}

	@RequestMapping(value = "approve_addendum_payment/{payment_id}", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Boolean> approve_Addendum_payment(@PathVariable("payment_id") Long request_id,
			HttpServletRequest request) {
		return APIResponse.response(managerService.approve_Addendum_payment(request_id, request));
	}

	@RequestMapping(value = "reject_Addendum_payment/{payment_id}", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<Boolean> reject_Addendum_payment(@PathVariable("payment_id") Long payment_id,
			@Validated @RequestBody Remarks remark, @RequestParam("reason") String reason, HttpServletRequest request) {
		System.out.println("==========================" + remark);
		return APIResponse.response(managerService.reject_Addendum_payment(payment_id, remark, reason, request));
	}

	@RequestMapping(value = "getManagerData", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getManagerDashboardData(HttpServletRequest request) {
		System.out.println("==========================dashboard" + request);
		return APIResponse.response(managerService.getManagerDashboardData(request));
	}

	@RequestMapping(value = "getManagerDetailData", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> getManagerDetailDashboardData(HttpServletRequest request,
			@RequestParam("id") long id) {
		System.out.println("==========================dashboard" + request);
		Map<String, Object> responseData = managerService.getManagerDetailDashboardData(request, id);
		return APIResponse.response(responseData);
	}

	// @RequestMapping(value = "get-notification", method = RequestMethod.GET,
	// produces = "application/json")
	// public ResponseEntity<Object> get_notification(HttpServletRequest request) {
	// return APIResponse.response(makerService.getMakerNotification(request));
	// }

}
