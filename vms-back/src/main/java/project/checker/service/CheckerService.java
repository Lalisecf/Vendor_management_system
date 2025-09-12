package project.checker.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.Exception.ExceptionsList;
import project.checker.mapper.CheckerMapper;
import project.maker.mapper.MakerMapper;
import project.maker.model.ContractView;
import project.maker.model.Reasons;
import project.maker.model.Remarks;
import project.maker.model.Vendor;
import project.model.Remark;
import project.utils.Utils;

@Service
public class CheckerService {
	@Autowired
	private CheckerMapper checkerMapper;
	@Autowired
	private MakerMapper MakerMapper;
	@Autowired
	private Utils util;

	public List<Vendor> getAllVendors(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "View_vendors")) {
				List<Vendor> vendor = MakerMapper.getAllVendors();

				util.registerActivity(request, "View Vendors", "Views all Vendors list");
				return vendor;
			} else {
				System.out.println("No user does not have permission. get_all_products");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean approveVendor(String vendor_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "approve_vendor")) {
				System.out.println("Yes user has permission.");
				System.out.println("id=" + vendor_id);
				checkerMapper.ApproveVendor(Long.parseLong(vendor_id));
				checkerMapper.updateUserVendor(util.get_user_id(request), Long.parseLong(vendor_id));
				MakerMapper.Delete_vendor_notification(Long.parseLong(vendor_id));
				Remark remark = new Remark();
				remark.setTitle("Approved vendor Request");
				remark.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				remark.setDescription("Vendor");
				Long notification_id = MakerMapper.addNotification(remark);
				MakerMapper.Vendor_Notification(notification_id, Long.parseLong(vendor_id));
				List<Long> roleId = MakerMapper.roleId();
				for (int i = 0; i < roleId.size(); i++) {
					MakerMapper.user_Notification(notification_id, roleId.get(i));
				}
				util.registerActivity(request, "Approve Vendor", "Approve vendor  at id =" + vendor_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean reject_vendor(Long vendor_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Checker", "Reject_vendor")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = MakerMapper.Reason(reason);
				MakerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
				checkerMapper.reject_vendor(vendor_id);
				MakerMapper.Delete_vendor_notification(vendor_id);
				Remark remarkks = new Remark();
				remarkks.setTitle("Reject vendor Creation Request");
				remarkks.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				remarkks.setDescription("Vendor");
				Long notification_id = MakerMapper.addNotification(remarkks);
				MakerMapper.Vendor_Notification(notification_id, vendor_id);
				List<Long> roleId = MakerMapper.roleId();
				for (int i = 0; i < roleId.size(); i++) {
					MakerMapper.user_Notification(notification_id, roleId.get(i));
				}
				util.registerActivity(request, "Reject", "Reject a vendor id = " + vendor_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean vendor_remark(HttpServletRequest request, long vendor_id, Remarks remark) {

		try {
			try {
				if (util.isPermitted(request, "Checker", "vendor_remark")) {
					Long reciver_id = MakerMapper.getReciverId(remark.getId());
					Remarks remarkk = new Remarks();
					remarkk.setTitle(remark.getTitle());
					remarkk.setDescription(remark.getDescription());
					remarkk.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					long remark_id = MakerMapper.send_remark(remarkk);
					MakerMapper.addUserRemark(remark_id, util.get_user_id(request), reciver_id, vendor_id);
					util.registerActivity(request, "send remark ", "send vendor request remark");
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

	public List<Remarks> getRemarksByVendorId(String vendor_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "View_Remark")) {
				List<Remarks> remarkss = new ArrayList<>(); // Initialize the list
				// List<Remarks> remarkss = null; // Initialize the list

				List<Remarks> remarks = MakerMapper.getRemarksByVendorId(vendor_id);
				for (int i = 0; i < remarks.size(); i++) {
					Remarks newRemark = new Remarks(); // Assuming Remarks has a default constructor
					newRemark.setId(remarks.get(i).getId());
					newRemark.setTitle(remarks.get(i).getTitle());
					newRemark.setDescription(remarks.get(i).getDescription());
					newRemark.setCreated_date(remarks.get(i).getCreated_date());
					newRemark.setCreated_by(MakerMapper.getFullName(Long.parseLong(remarks.get(i).getCreated_by())));
					newRemark.setEmail(MakerMapper.getEmail(Long.parseLong(remarks.get(i).getCreated_by())));
					newRemark.setAvailability(remarks.get(i).getAvailability());
					newRemark.setStatus(remarks.get(i).getStatus());
					System.out.println("Email=" + newRemark.getEmail());
					remarkss.add(newRemark);
				}

				return remarkss;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Remarks getRemarkByID(HttpServletRequest request, long id) {
		try {
			return MakerMapper.getRemarkById(id);

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deleteRemark(String remark_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "delete_remark")) {
				System.out.println("Yes user has permission.");
				System.out.println("id=" + remark_id);

				util.registerActivity(request, "Delete your comment", "delete  remark");
				MakerMapper.deleteRemark(remark_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean update_remark(HttpServletRequest request, long remark_id, Remarks remark) {
		try {
			try {
				if (util.isPermitted(request, "Checker", "update_remark")) {
					Remarks remarkk = new Remarks();
					remarkk.setTitle(remark.getTitle());
					remarkk.setDescription(remark.getDescription());
					remarkk.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					remarkk.setId(remark_id);
					MakerMapper.update_remark(remarkk);
					util.registerActivity(request, "update  remark ", "update your remark ");
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

	public Remarks get_reason(String id, String type, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Checker", "get_reason")) {
				List<Reasons> reason = new ArrayList<>();
				Remarks remark = new Remarks();

				if (type.equalsIgnoreCase("vendor")) {
					String vendor_id = id;
					reason = checkerMapper.get_reason(Long.parseLong(vendor_id));
				}
				if (type.equalsIgnoreCase("contract")) {
					String contract_id = id;
					reason = checkerMapper.get_reason_contract(Long.parseLong(contract_id));
				}
				for (int i = 0; i < reason.size(); i++) {
					if (checkerMapper.rolename(Long.parseLong(reason.get(i).getCreated_by()))
							.equalsIgnoreCase("Maker")) {
						remark.setCreated_date(reason.get(i).getDate());
						remark.setDescription(reason.get(i).getReason());
						remark.setCreated_by(MakerMapper.getFullName(Long.parseLong(reason.get(i).getCreated_by())));
					}
				}

				return remark;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean accept_request_after_approved(Long id, Remarks remark, String type, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Checker", "Accept_activate_delete_deactivate_requests")) {
				List<Reasons> previousreason = new ArrayList<>();
				Long vendor_id = null;
				Long contract_id = null;
				if (type.equalsIgnoreCase("vendor")) {
					vendor_id = id;
					MakerMapper.Delete_vendor_notification(vendor_id);
					previousreason = checkerMapper.get_reason(vendor_id);
				}
				if (type.equalsIgnoreCase("contract")) {
					contract_id = id;
					MakerMapper.Delete_contract_notification(contract_id);
					previousreason = checkerMapper.get_reason_contract(contract_id);
				}

				for (int i = 0; i < previousreason.size(); i++) {
					if (checkerMapper.rolename(Long.parseLong(previousreason.get(i).getCreated_by()))
							.equalsIgnoreCase("Maker")) {

						if (remark.getTitle().equalsIgnoreCase("Delete Vendor Request")) {
							checkerMapper.accept_vendor_delete(vendor_id);
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Delete vendor Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Vendor");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Vendor_Notification(notification_id, vendor_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract delete request",
									"Delete vendor, id= " + vendor_id);
						} else if (remark.getTitle().equalsIgnoreCase("Deactivate Vendor Request")) {
							checkerMapper.accept_vendor_deactivate(vendor_id);
							checkerMapper.deleteUserReason(previousreason.get(i).getId());

							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Deactivate vendor Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Vendor");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Vendor_Notification(notification_id, vendor_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract deactivate request",
									"Deactivate vendor, id= " + vendor_id);
						} else if (remark.getTitle().equalsIgnoreCase("Activate Vendor Request")) {
							checkerMapper.accept_vendor_activate(vendor_id);
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Activate vendor Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Vendor");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Vendor_Notification(notification_id, vendor_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract activate request",
									"Activate vendor, id= " + vendor_id);
						} else if (remark.getTitle().equalsIgnoreCase("Hold Contract Request")) {
							checkerMapper.accept_contract_hold(contract_id);
							checkerMapper.add_hold_date(contract_id,
									DateTimeFormatter.ofPattern("yyyy-MM-dd").format(LocalDateTime.now()));
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Hold Contract Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Contract");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Contract_Notification(notification_id, contract_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract hold request",
									" hold contract, id= " + contract_id);
						} else if (remark.getTitle().equalsIgnoreCase("Unhold Contract Request")) {
							checkerMapper.accept_contract_unhold(contract_id);
							checkerMapper.add_unhold_date(contract_id,
									DateTimeFormatter.ofPattern("yyyy-MM-dd").format(LocalDateTime.now()));
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Unhold Contract Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Contract");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Contract_Notification(notification_id, contract_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract unhold request",
									" Unhold contract, id= " + contract_id);
						} else if (remark.getTitle().equalsIgnoreCase("Terminate Contract Request")) {
							checkerMapper.accept_terminate_request(contract_id);
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Terminate Contract Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Contract");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Contract_Notification(notification_id, contract_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract terminate request",
									" Terminate contract, id= " + contract_id);
						} else if (remark.getTitle().equalsIgnoreCase("Complete Contract Request")) {
							checkerMapper.accept_complete_request(contract_id);
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							Remark remarkks = new Remark();
							remarkks.setTitle(" Accepted Complete Contract Request");
							remarkks.setCreate_date(
									DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
							remarkks.setDescription("Contract");
							Long notification_id = MakerMapper.addNotification(remarkks);
							MakerMapper.Contract_Notification(notification_id, contract_id);
							List<Long> roleId = MakerMapper.roleId();
							for (int ii = 0; ii < roleId.size(); ii++) {
								MakerMapper.user_Notification(notification_id, roleId.get(ii));
							}
							util.registerActivity(request, "accept contract complete requst",
									" completed contract, id= " + contract_id);
						}

					}
				}
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean reject_request_after_approved(Long vendor_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Checker", "Reject_activate_delete_deactivate_requests")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");

				long reason_id = MakerMapper.Reason(reason);
				if (checkerMapper.GetVendorStatus(vendor_id).equalsIgnoreCase("1")) {

					MakerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
					checkerMapper.vendor_request_type(vendor_id);

					checkerMapper.reject_vendor(vendor_id);

					MakerMapper.Delete_vendor_notification(vendor_id);
					Remark remarkks = new Remark();
					remarkks.setTitle("Rejected vendor Creation Request");
					remarkks.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					remarkks.setDescription("Vendor");
					Long notification_id = MakerMapper.addNotification(remarkks);
					MakerMapper.Vendor_Notification(notification_id, vendor_id);
					List<Long> roleId = MakerMapper.roleId();
					for (int ii = 0; ii < roleId.size(); ii++) {
						MakerMapper.user_Notification(notification_id, roleId.get(ii));
					}
					util.registerActivity(request, "Reject vendor request",
							"Reject vendor request vender id : " + vendor_id);

				} else {
					List<Reasons> previousreason = checkerMapper.get_reason(vendor_id);
					for (int i = 0; i < previousreason.size(); i++) {
						if (checkerMapper.rolename(Long.parseLong(previousreason.get(i).getCreated_by()))
								.equalsIgnoreCase("Maker")) {
							checkerMapper.deleteUserReason(previousreason.get(i).getId());
							MakerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
							checkerMapper.vendor_request_type(vendor_id);
						}
					}

					MakerMapper.Delete_vendor_notification(vendor_id);
					Remark remarkks = new Remark();
					remarkks.setTitle("Vendor Request Rejected");
					remarkks.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					remarkks.setDescription("Vendor");
					Long notification_id = MakerMapper.addNotification(remarkks);
					MakerMapper.Vendor_Notification(notification_id, vendor_id);
					List<Long> roleId = MakerMapper.roleId();
					for (int ii = 0; ii < roleId.size(); ii++) {
						MakerMapper.user_Notification(notification_id, roleId.get(ii));
					}
					util.registerActivity(request, "Reject vendor request",
							"Reject vendor request vender id = " + vendor_id);
				}

				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Vendor get_vendor_id(Long vendor_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "login")) {
				// util.registerActivity(request, "Delete your comment", "delete remark");
				return checkerMapper.get_vendor_id_new(vendor_id);
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean approveContract(String contractt_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "approve_vendor")) {

				Long contract_id = Long.valueOf(contractt_id);
				String approved_by = MakerMapper.getFullName(util.get_user_id(request));
				String approved_date = DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now());

				checkerMapper.ApproveContract(contract_id, approved_by, approved_date);

				checkerMapper.updateUserContrtact(util.get_user_id(request), contract_id);
				MakerMapper.Delete_contract_notification(contract_id);
				Remark remarkks = new Remark();
				remarkks.setTitle(" Approveed Contract Creation Request");
				remarkks.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				remarkks.setDescription("Contract");
				Long notification_id = MakerMapper.addNotification(remarkks);
				MakerMapper.Contract_Notification(notification_id, contract_id);
				List<Long> roleId = MakerMapper.roleId();
				for (int ii = 0; ii < roleId.size(); ii++) {
					MakerMapper.user_Notification(notification_id, roleId.get(ii));
				}
				util.registerActivity(request, "Approve Contract", "Approve contract of id =" + contract_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean reject_contract(Long contract_id, Remarks remark, String reasons, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "Reject_vendor")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = MakerMapper.Reason(reason);

				if (reasons.equalsIgnoreCase("Reject contract")) {
					checkerMapper.reject_contract(contract_id);
					checkerMapper.addUserReason(reason_id, util.get_user_id(request), contract_id);
					MakerMapper.Delete_contract_notification(contract_id);

					Remark remarkks = new Remark();
					remarkks.setTitle(" Rejected  Contract creation Request");
					remarkks.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					remarkks.setDescription("Contract");
					Long notification_id = MakerMapper.addNotification(remarkks);
					MakerMapper.Contract_Notification(notification_id, contract_id);
					List<Long> roleId = MakerMapper.roleId();
					for (int ii = 0; ii < roleId.size(); ii++) {
						MakerMapper.user_Notification(notification_id, roleId.get(ii));
					}
					util.registerActivity(request, "Reject contract creation request", "contract id=" + contract_id);
				}
				// else {
				// System.out.println("==========================2===");
				// List<Reasons> previousreason =
				// checkerMapper.get_reason_contract(contract_id);
				// for (int i = 0; i < previousreason.size(); i++) {
				// if
				// (checkerMapper.rolename(Long.parseLong(previousreason.get(i).getCreated_by()))
				// .equalsIgnoreCase("Maker")) {
				// checkerMapper.deleteUserReason(previousreason.get(i).getId());
				// checkerMapper.addUserReason(reason_id, util.get_user_id(request),
				// contract_id);
				// checkerMapper.contract_request_type(contract_id);

				// MakerMapper.Delete_contract_notification(contract_id);
				// Remark remarkks = new Remark();
				// remarkks.setTitle("Contract Request Rejected");
				// remarkks.setCreate_date(
				// DateTimeFormatter.ofPattern("yyyy/MM/dd
				// HH:mm:ss").format(LocalDateTime.now()));
				// remarkks.setDescription("Contract");
				// Long notification_id = MakerMapper.addNotification(remarkks);
				// MakerMapper.Contract_Notification(notification_id, contract_id);
				// List<Long> roleId = MakerMapper.roleId();
				// for (int ii = 0; ii < roleId.size(); ii++) {
				// MakerMapper.user_Notification(notification_id, roleId.get(ii));
				// }

				// }
				// }
				// if (reasons.equalsIgnoreCase("Reject Extend") ||
				// reasons.equalsIgnoreCase("Reject Renewal")) {
				// checkerMapper.addUserReason(reason_id, util.get_user_id(request),
				// contract_id);
				// checkerMapper.contract_request_type(contract_id);
				// MakerMapper.deletExtendRenew(contract_id,
				// MakerMapper.extend_and_renew_id(contract_id));
				// if (reasons.equalsIgnoreCase("Reject Extend")) {
				// MakerMapper.Delete_contract_notification(contract_id);
				// Remark remarkks = new Remark();
				// remarkks.setTitle(" Rejected Extend Contract Request");
				// remarkks.setCreate_date(
				// DateTimeFormatter.ofPattern("yyyy/MM/dd
				// HH:mm:ss").format(LocalDateTime.now()));
				// remarkks.setDescription("Contract");
				// Long notification_id = MakerMapper.addNotification(remarkks);
				// MakerMapper.Contract_Notification(notification_id, contract_id);
				// List<Long> roleId = MakerMapper.roleId();
				// for (int ii = 0; ii < roleId.size(); ii++) {
				// MakerMapper.user_Notification(notification_id, roleId.get(ii));
				// }
				// util.registerActivity(request, "Reject contract extend request", "contract
				// id=" + contract_id);
				// }
				// if (reasons.equalsIgnoreCase("Reject Renewal")) {
				// MakerMapper.Delete_contract_notification(contract_id);

				// Remark remarkks = new Remark();
				// remarkks.setTitle(" Rejected Renewal Contract Request");
				// remarkks.setCreate_date(
				// DateTimeFormatter.ofPattern("yyyy/MM/dd
				// HH:mm:ss").format(LocalDateTime.now()));
				// remarkks.setDescription("Contract");
				// Long notification_id = MakerMapper.addNotification(remarkks);
				// MakerMapper.Contract_Notification(notification_id, contract_id);
				// List<Long> roleId = MakerMapper.roleId();
				// for (int ii = 0; ii < roleId.size(); ii++) {
				// MakerMapper.user_Notification(notification_id, roleId.get(ii));
				// }
				// }
				// util.registerActivity(request, "Reject contract renewal request", "contract
				// id=" + contract_id);
				// }
				// if (reasons.equalsIgnoreCase("Reject Payment Request")) {
				// checkerMapper.addUserReason(reason_id, util.get_user_id(request),
				// MakerMapper.contract_id(contract_id));
				// MakerMapper.rejectPaymentRequest(contract_id);
				// MakerMapper.ApprovePaymentWithnContract(MakerMapper.getContractIdByPaymentId(contract_id));
				// MakerMapper.Delete_contract_notification(contract_id);

				// Remark nitify = new Remark();
				// nitify.setTitle("Rejected PaymentId: Payment" + contract_id);
				// nitify.setCreate_date(
				// DateTimeFormatter.ofPattern("yyyy/MM/dd
				// HH:mm:ss").format(LocalDateTime.now()));
				// nitify.setDescription("Contract");
				// Long notification_id = MakerMapper.addNotification(nitify);
				// MakerMapper.Contract_Notification(notification_id,
				// MakerMapper.contract_id(contract_id));
				// List<Long> roleId = MakerMapper.roleId();
				// for (int ii = 0; ii < roleId.size(); ii++) {
				// MakerMapper.user_Notification(notification_id, roleId.get(ii));
				// }
				// util.registerActivity(request, "Reject payment request", "contract id = " +
				// contract_id);

				// }
				// }

				return true;
			} else {
				System.out.println("No user does not have permission to reject a contract.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean contract_remark(HttpServletRequest request, long contract_id, Remarks remark) {

		try {
			try {
				if (util.isPermitted(request, "Checker", "vendor_remark")) {
					Long reciver_id = MakerMapper.getReciverId(remark.getId());
					Remarks remarkk = new Remarks();
					remarkk.setTitle(remark.getTitle());
					remarkk.setDescription(remark.getDescription());
					remarkk.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					long remark_id = MakerMapper.send_remark(remarkk);
					checkerMapper.addUserRemark(remark_id, util.get_user_id(request), reciver_id, contract_id);
					util.registerActivity(request, "send remark ", "send remark for contract id = " + contract_id);
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

	public List<Remarks> getRemarksByContractId(String contract_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "View_Remark")) {
				List<Remarks> remarkss = new ArrayList<>(); // Initialize the list
				// List<Remarks> remarkss = null; // Initialize the list

				List<Remarks> remarks = checkerMapper.getRemarksByContractId(contract_id);
				for (int i = 0; i < remarks.size(); i++) {
					Remarks newRemark = new Remarks(); // Assuming Remarks has a default constructor
					newRemark.setId(remarks.get(i).getId());
					newRemark.setTitle(remarks.get(i).getTitle());
					newRemark.setDescription(remarks.get(i).getDescription());
					newRemark.setCreated_date(remarks.get(i).getCreated_date());
					newRemark.setCreated_by(MakerMapper.getFullName(Long.parseLong(remarks.get(i).getCreated_by())));
					newRemark.setEmail(MakerMapper.getEmail(Long.parseLong(remarks.get(i).getCreated_by())));
					newRemark.setAvailability(remarks.get(i).getAvailability());
					newRemark.setStatus(remarks.get(i).getStatus());
					System.out.println("Email=" + newRemark.getEmail());
					remarkss.add(newRemark);
				}
				return remarkss;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ContractView> get_extend_renew_for_approve(HttpServletRequest request, Long contract_id) {
		try {
			if (util.isPermitted(request, "Checker", "View_Remark")) {
				// List<ContractView> contract = new ArrayList<>(); // Initialize the list

				List<ContractView> contracts = checkerMapper.getcontractsId(contract_id);
				System.out.println(" extend-renew Amount" + contracts.get(0).getPayment_start_date());

				return contracts;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean approve_payment(long request_id, HttpServletRequest request) {
		try {
			try {
				if (util.isPermitted(request, "Checker", "update_remark")) {

					MakerMapper.ApprovePayment(request_id);
					MakerMapper.ApprovePaymentWithnContract(MakerMapper.getContractIdByPaymentId(request_id));

					MakerMapper.Delete_contract_notification(MakerMapper.getContractIdByPaymentId(request_id));
					Remark nitify = new Remark();
					nitify.setTitle("Approve PaymentId: Payment" + request_id);
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Contract");
					Long notification_id = MakerMapper.addNotification(nitify);
					MakerMapper.Contract_Notification(notification_id,
							MakerMapper.getContractIdByPaymentId(request_id));
					List<Long> roleId = MakerMapper.roleId();
					for (int ii = 0; ii < roleId.size(); ii++) {
						MakerMapper.user_Notification(notification_id, roleId.get(ii));
					}

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

	public List<Remarks> getCheckerNotification(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "update_remark")) {
				List<Remarks> remarkss = new ArrayList<>(); // Initialize the list

				List<Remarks> reason = checkerMapper.getCheckerNotification();
				for (int i = 0; i < reason.size(); i++) {
					Remarks reasonss = new Remarks(); // Assuming Remarks has a default constructor
					reasonss.setId(reason.get(i).getId());
					reasonss.setTitle(reason.get(i).getTitle());
					reasonss.setCreated_by(reason.get(i).getCreated_by());

					reasonss.setCreated_date(reason.get(i).getCreated_date());

					reasonss.setAvailability(reason.get(i).getAvailability());
					reasonss.setStatus(reason.get(i).getStatus());
					remarkss.add(reasonss);
				}

				// util.registerActivity(request, "Checker Get Notification", "View List of
				// notification");
				return remarkss;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

}
