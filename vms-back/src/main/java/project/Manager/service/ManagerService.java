package project.Manager.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.maker.mapper.MakerCheckerDashboardMapper;
import project.maker.mapper.MakerMapper;
import project.maker.model.FileTable;
import project.maker.model.Payment;
import project.maker.model.Payments;
import project.maker.model.Reasons;
import project.maker.model.Remarks;
import project.maker.model.ServiceModel;
import project.maker.model.Vendors;
import project.model.Remark;
import project.Exception.CustomAllException;
import project.Exception.ExceptionsList;
import project.Manager.mapper.ManagerCheckerDashboardMapper;
import project.Manager.mapper.ManagerMapper;
import project.Manager.model.PaymentDetailsDTO;
import project.Manager.model.RequestedPaymentsModel;
import project.Manager.model.file_table;
import project.utils.Utils;

@Service
public class ManagerService {
	@Autowired
	ManagerCheckerDashboardMapper managerCheckerDashboard;
	@Autowired
	private ManagerMapper managerMapper;
	@Autowired
	private MakerMapper makerMapper;
	@Autowired
	private Utils util;

	public List<RequestedPaymentsModel> getRequestedPayments(HttpServletRequest request) {
		try {
			System.out.println("login");
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {

				long status = 0;
				if (util.isPermitted(request, "Manager", "Process_Requested_payment")) {
					status = 2;
				} else if (util.isPermitted(request, "Director", "Process_Requested_payment")) {
					status = 4;
				} else if (util.isPermitted(request, "Finance", "Process_Requested_payment")) {
					status = 6;
				} else if (util.isPermitted(request, "Chief", "login")) {
					status = 5;
				} else {
					status = 1;
				}
				System.out.println("user_status : " + status);

				List<RequestedPaymentsModel> payments = managerMapper.getPaymentByContractIdForRequest(status);
				System.out.println("Fetched Payments: " + payments);

				if (payments.isEmpty()) {
					System.out.println("No payments found.");
				}

				util.registerActivity(request, "Process Requested payment", "Views all Requested payment");

				return payments;
			} else {
				System.out.println("User does not have permission.");
				return new ArrayList<>();
			}

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("An error occurred while fetching requested payments", e);
		}
	}

	public List<RequestedPaymentsModel> getRequestedAddendumPayments(HttpServletRequest request) {
		try {
			System.out.println("login");
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {

				long status = 0;
				if (util.isPermitted(request, "Manager", "Process_Requested_payment")) {
					status = 2;
				} else if (util.isPermitted(request, "Director", "Process_Requested_payment")) {
					status = 4;
				} else if (util.isPermitted(request, "Finance", "Process_Requested_payment")) {
					status = 6;
				} else if (util.isPermitted(request, "Chief", "login")) {
					status = 5;
				} else {
					status = 1;
				}
				System.out.println("user_status : " + status);

				List<RequestedPaymentsModel> payments = managerMapper.getPaymentByContractIdForAddendumRequest(status);
				System.out.println("Fetched Payments: " + payments);

				if (payments.isEmpty()) {
					System.out.println("No payments found.");
				}

				util.registerActivity(request, "Process Requested payment", "Views all Requested payment");

				return payments;
			} else {
				System.out.println("User does not have permission.");
				return new ArrayList<>();
			}

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("An error occurred while fetching requested payments", e);
		}
	}

	public Payment getPaymentById(HttpServletRequest request, long id) {
		try {
			Payment fetchedDetail = managerMapper.getPaymentByPaymentIdForPaymenttDetail(id);
			System.out.println("=payment_id" + id);
			return fetchedDetail;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Payment getAddendumPaymentById(HttpServletRequest request, long id) {
		try {
			Payment fetchedDetail = managerMapper.getPaymentByPaymentIdForAddendumPaymenttDetail(id);
			System.out.println("=payment_id" + id);
			return fetchedDetail;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<file_table> getPaymentDoc(HttpServletRequest request, long id) {
		try {
			List<file_table> fetchedDetail = managerMapper.getPaymentsDocForPaymenttDetail(id);
			return fetchedDetail;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<PaymentDetailsDTO> getPaymentHistory(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "login")
					|| util.isPermitted(request, "Checker", "login")
					|| util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				List<PaymentDetailsDTO> fetchedDetail = managerMapper.getPaymentHistory();
				return fetchedDetail;
			} else {
				System.out.println("No user does not have permission9999.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> payment_downloadFiles(HttpServletRequest request, String id) {
		try {
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {

				util.registerActivity(request, "download files", "download payment document");
				String path1 = managerMapper.downloadFiles_payment(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean approve_payment(long request_id, HttpServletRequest request) {
		try {
			try {
				if (util.isPermitted(request, "Manager", "login")
						|| util.isPermitted(request, "Director", "login")
						|| util.isPermitted(request, "Chief", "login")
						|| util.isPermitted(request, "Finance", "login")) {
					String approved_by = "";
					String approved_action_date = "";
					String paiddate = "";
					long status = 0;
					if (util.isPermitted(request, "Manager", "login")) {
						status = 4;
						approved_by = "approved_by";
						approved_action_date = "manager_action_date";
					} else if (util.isPermitted(request, "Director", "login")) {
						status = 5;
						approved_by = "director";
						approved_action_date = "director_action_date";
					} else if (util.isPermitted(request, "Finance", "login")) {
						status = 7;
						approved_by = "finance";
						approved_action_date = "finance_action_date";
						paiddate = DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now());

					} else if (util.isPermitted(request, "Chief", "login")) {
						status = 6;
						approved_by = "chief";
						approved_action_date = "chief_action_date";

					} else {
						status = 0;
					}
					System.out.println("Approve_status : " + status);

					makerMapper.getFullName(util.get_user_id(request));
					System.out.println("user_name : " + makerMapper.getFullName(util.get_user_id(request)));
					managerMapper.ApprovePayment(request_id, makerMapper.getFullName(util.get_user_id(request)),
							approved_by, approved_action_date,
							DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()),

							paiddate,status);

					// MakerMapper.ApprovePaymentWithnContract(MakerMapper.getContractIdByPaymentId(request_id));

					// MakerMapper.Delete_contract_notification(MakerMapper.getContractIdByPaymentId(request_id));
					Remark nitify = new Remark();
					nitify.setTitle("Approve PaymentId: Payment" + request_id);
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Payment");
					// Long notification_id = makerMapper.addNotification(nitify);
					// makerMapper.Contract_Notification(notification_id,
					// makerMapper.getContractIdByPaymentId(request_id));
					// List<Long> roleId = makerMapper.roleId();
					// for (int ii = 0; ii < roleId.size(); ii++) {
					// makerMapper.user_Notification(notification_id, roleId.get(ii));
					// }

					util.registerActivity(request, "Approve  Payment ", "Approve Payment id: " + request_id);
					return true;
				} else {
					System.out.println("No user does not have permission.");
					return false;
				}
			} catch (Exception e) {
				throw new ExceptionsList(e);
			}
		} catch (Exception ex) {
			throw new ExceptionsList(ex);
		}
	}

	public boolean approve_Addendum_payment(long request_id, HttpServletRequest request) {
		try {
			try {
				if (util.isPermitted(request, "Manager", "login")
						|| util.isPermitted(request, "Director", "login")
						|| util.isPermitted(request, "Finance", "login")
						|| util.isPermitted(request, "Chief", "login")) {

					String approved_by = "";
					String approved_action_date = "";
					String paiddate = "";
					long status = 0;
					if (util.isPermitted(request, "Manager", "login")) {
						status = 4;
						approved_by = "approved_by";
						approved_action_date = "manager_action_date";
					} else if (util.isPermitted(request, "Director", "login")) {
						status = 5;
						approved_by = "director";
						approved_action_date = "director_action_date";
					} else if (util.isPermitted(request, "Finance", "login")) {
						status = 7;
						approved_by = "finance";
						approved_action_date = "finance_action_date";
						paiddate = DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now());

					} else if (util.isPermitted(request, "Chief", "login")) {
						status = 6;
						approved_by = "chief";
						approved_action_date = "chief_action_date";

					} else {
						status = 0;
					}
					System.out.println("Approve_status : " + status);

					makerMapper.getFullName(util.get_user_id(request));
					System.out.println("user_name : " + makerMapper.getFullName(util.get_user_id(request)));
					managerMapper.ApproveAddendumPayment(request_id, makerMapper.getFullName(util.get_user_id(request)),
							approved_by, approved_action_date,
							DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()),
							paiddate,status);

					// MakerMapper.ApprovePaymentWithnContract(MakerMapper.getContractIdByPaymentId(request_id));

					// MakerMapper.Delete_contract_notification(MakerMapper.getContractIdByPaymentId(request_id));
					Remark nitify = new Remark();
					nitify.setTitle("Approve PaymentId: Payment" + request_id);
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Payment");
					// Long notification_id = makerMapper.addNotification(nitify);
					// makerMapper.Contract_Notification(notification_id,
					// makerMapper.getContractIdByPaymentId(request_id));
					// List<Long> roleId = makerMapper.roleId();
					// for (int ii = 0; ii < roleId.size(); ii++) {
					// makerMapper.user_Notification(notification_id, roleId.get(ii));
					// }

					util.registerActivity(request, "Approve  Payment ", "Approve Payment id: " + request_id);
					return true;
				} else {
					System.out.println("No user does not have permission.");
					return false;
				}
			} catch (Exception e) {
				throw new ExceptionsList(e);
			}
		} catch (Exception ex) {
			throw new ExceptionsList(ex);
		}
	}

	public Boolean reject_payment(Long payment_id, Remarks remark, String reasons, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Finance", "login")) {

				long status = 3;
				String rejected_by = "";
				String rejected_action_date = "";

				if (util.isPermitted(request, "Manager", "login")) {
					rejected_by = "approved_by";
					rejected_action_date = "manager_action_date";
				} else if (util.isPermitted(request, "Director", "login")) {
					rejected_by = "director";
					rejected_action_date = "director_action_date";
				} else if (util.isPermitted(request, "Finance", "login")) {
					rejected_by = "finance";
					rejected_action_date = "finance_action_date";
				} else if (util.isPermitted(request, "Chief", "login")) {
					rejected_by = "chief";
					rejected_action_date = "chief_action_date";
				} else {
					status = 0;
				}

				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);

				if (reasons.equalsIgnoreCase("Reject payment")) {
					managerMapper.reject_payment(payment_id, makerMapper.getFullName(util.get_user_id(request)),
							rejected_by, rejected_action_date,
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()),
							status);
					managerMapper.addUserReason(reason_id, util.get_user_id(request), payment_id);
					// ManagerMapper.Delete_contract_notification(contract_id);

					Remark remarkks = new Remark();
					remarkks.setTitle(" Rejected  payment creation Request");
					remarkks.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					remarkks.setDescription("payment");
					// Long notification_id = ManagerMapper.addNotification(remarkks);
					// ManagerMapper.Contract_Notification(notification_id, contract_id);
					// List<Long> roleId = ManagerMapper.roleId();
					// for (int ii = 0; ii < roleId.size(); ii++) {
					// //ManagerMapper.user_Notification(notification_id, roleId.get(ii));
					// }
					util.registerActivity(request, "Reject payment creation request", "payment id=" + payment_id);
				}
				return true;
			} else {
				System.out.println("No user does not have permission to reject a payment.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean reject_Addendum_payment(Long payment_id, Remarks remark, String reasons,
			HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				// long status = 0;
				// if (util.isPermitted(request, "Manager", "login")) {
				// status =3;
				// }else if(util.isPermitted(request, "Director", "login")){
				// status = 5;
				// } else {
				// status = 1;
				// }

				long status = 3;
				String rejected_by = "";
				String rejected_action_date = "";

				if (util.isPermitted(request, "Manager", "login")) {
					rejected_by = "approved_by";
					rejected_action_date = "manager_action_date";
				} else if (util.isPermitted(request, "Director", "login")) {
					rejected_by = "director";
					rejected_action_date = "director_action_date";
				} else if (util.isPermitted(request, "Finance", "login")) {
					rejected_by = "finance";
					rejected_action_date = "finance_action_date";
				} else if (util.isPermitted(request, "Chief", "login")) {
					rejected_by = "chief";
					rejected_action_date = "chief_action_date";
				} else {
					status = 0;
				}

				System.out.println("Reject_status : " + status);
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);

				if (reasons.equalsIgnoreCase("Reject payment")) {
					managerMapper.reject_Addendum_payment(payment_id,
							makerMapper.getFullName(util.get_user_id(request)), rejected_by, rejected_action_date,
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()), status);
					managerMapper.addUserReason(reason_id, util.get_user_id(request), payment_id);
					// ManagerMapper.Delete_contract_notification(contract_id);

					Remark remarkks = new Remark();
					remarkks.setTitle(" Rejected  payment creation Request");
					remarkks.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					remarkks.setDescription("payment");
					// Long notification_id = ManagerMapper.addNotification(remarkks);
					// ManagerMapper.Contract_Notification(notification_id, contract_id);
					// List<Long> roleId = ManagerMapper.roleId();
					// for (int ii = 0; ii < roleId.size(); ii++) {
					// //ManagerMapper.user_Notification(notification_id, roleId.get(ii));
					// }
					util.registerActivity(request, "Reject payment creation request", "payment id=" + payment_id);
				}
				return true;
			} else {
				System.out.println("No user does not have permission to reject a payment.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Map<String, Object> getManagerDashboardData(HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				Map<String, Object> response = new HashMap<>();
				response.put("Initiated_payments", managerCheckerDashboard.getInitiatedpayment());
				response.put("NotInitiated_payments", managerCheckerDashboard.getnotInitiatedpayment());
				// response.put("active_vendors", makerCheckerDashboard.getActiveVendor());
				response.put("total_payments", managerCheckerDashboard.getTotalPayment());
				response.put("total_payments_amount", managerCheckerDashboard.getTotalPaymentAmount());
				response.put("total_payments_paid", managerCheckerDashboard.total_payments_paid());
				response.put("reject_payments", managerCheckerDashboard.getRejectPayment());
				response.put("reject_payments_amount", managerCheckerDashboard.getRejectPaymentAmount());
				response.put("ExcessedDueDate_payments", managerCheckerDashboard.getExcessedDueDate_payments());
				// response.put("Has_no_Payments",
				// managerCheckerDashboard.getVendorNoContract());

				response.put("Initiated_Addedumpayments", managerCheckerDashboard.getAddedumInitiatedpayment());
				response.put("NotInitiated_Addedumpayments", managerCheckerDashboard.getnotInitiatedAddedumpayment());
				response.put("total_Addedumpayments", managerCheckerDashboard.getAddedumTotalPayment());
				response.put("total_Addedumpayments_amount", managerCheckerDashboard.getAddedumTotalPaymentAmount());
				response.put("total_Addedumpayments_paid", managerCheckerDashboard.total_Addedumpayments_paid());
				response.put("reject_Addedumpayments", managerCheckerDashboard.getAddedumRejectPayment());
				// response.put("reject_Addedumpayments_amount",
				// managerCheckerDashboard.getRejectPaymentAddedumAmount());
				response.put("AddedumExcessedDueDate_payments",
						managerCheckerDashboard.getAddedumExcessedDueDate_payments());
				response.put("under_manager_review", managerCheckerDashboard.getManagerReview());
				response.put("under_director_review", managerCheckerDashboard.getDirectorReview());
				response.put("under_chief_review", managerCheckerDashboard.getChiefReview());
				response.put("under_Finance_review", managerCheckerDashboard.getFinanceReview());

				response.put("Initiated_payments_amount", managerCheckerDashboard.getInitiatedpaymentAmount());
				response.put("NotInitiated_payments_amount", managerCheckerDashboard.getnotInitiatedpaymentAmount());
				response.put("total_payments_paid_amount", managerCheckerDashboard.total_payments_paidAmount());
				response.put("ExcessedDueDate_payments_amount",
						managerCheckerDashboard.getExcessedDueDate_paymentsAmount());

				response.put("Initiated_Addedumpayments_amount",
						managerCheckerDashboard.getAddedumInitiatedpaymentAmount());
				response.put("NotInitiated_Addedumpayments_amount",
						managerCheckerDashboard.getnotInitiatedAddedumpaymentAmount());
				response.put("total_Addedumpayments_paid_amount",
						managerCheckerDashboard.total_Addedumpayments_paidAmount());
				response.put("reject_Addedumpayments_amount", managerCheckerDashboard.getRejectPaymentAddedumAmount());
				response.put("AddedumExcessedDueDate_payments_amount",
						managerCheckerDashboard.getAddedumExcessedDueDate_paymentsAmount());

				System.out.println("Reject_response : " + response.get("reject_payments"));

				System.out.println("response: " + response);
				return response;
			} else {
				System.out.println("User has no permision to get_dashboard_data");
				return null;
			}

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}

	}

	public Map<String, Object> getManagerDetailDashboardData(HttpServletRequest request, long id) {
		try {
			if (util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {


			    Map<String, Object> Detailresponse = new HashMap<>();
				
				Detailresponse.put("total_payments_Detail_amount", managerCheckerDashboard.getTotalPaymentDetailAmount(id));
				Detailresponse.put("total_payments_Detail", managerCheckerDashboard.getTotalPaymentDetail(id));
				Detailresponse.put("Initiated__Detail_payments", managerCheckerDashboard.getInitiatedDetailpayments(id));
				Detailresponse.put("Initiated_payments_Detail_amount", managerCheckerDashboard.getInitiatedPaymentsDetailAmount(id));
				Detailresponse.put("NotInitiated__Detail_payments", managerCheckerDashboard.getNotInitiatedDetailPayments(id));
				Detailresponse.put("NotInitiated_payments_Detail_amount", managerCheckerDashboard.getNotInitiatedPaymentsDetailAmount(id));
				Detailresponse.put("total_Detail_payments_paid", managerCheckerDashboard.getTotalDetailPaymentsPaid(id));
				Detailresponse.put("total_payments_Detail_amount_paid", managerCheckerDashboard.getTotalPaymentsDetailAmountPaid(id));
				Detailresponse.put("reject_payments_Detail", managerCheckerDashboard.getRejectPaymentsDetail(id));
				Detailresponse.put("reject_payments_Detail_amount", managerCheckerDashboard.getRejectPaymentsDetailAmount(id));
				Detailresponse.put("ExcessedDueDate_payments_Detail", managerCheckerDashboard.getExcessedDueDatePaymentsDetail(id));
				Detailresponse.put("ExcessedDueDate_payments_Detail_amount", managerCheckerDashboard.getExcessedDueDatePaymentsDetailAmount(id));
				
				System.out.println("Detailresponse: " + Detailresponse);
				return Detailresponse;
			} else {
				System.out.println("No user does not have permission. detail");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}
}
