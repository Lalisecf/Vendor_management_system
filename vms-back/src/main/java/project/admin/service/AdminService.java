package project.admin.service;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import project.Exception.CustomAllException;
import project.Exception.CustomPasswordErrorHandler;
import project.Exception.ExceptionsList;
import project.admin.dto.RegisterActorDto;
import project.admin.dto.RoleDto;
import project.admin.mapper.AdminDashboardMapper;
import project.admin.mapper.AdminMapper;
import project.admin.model.ChangePassword;
import project.admin.model.Functionality;
import project.admin.model.Logs;
import project.admin.model.Role;
import project.admin.model.TimeManagement;
import project.admin.model.UserActivity;
import project.admin.model.UserName;
import project.admin.model.Users;
import project.jwt.JwtHelper;
import project.maker.mapper.ReportMapper;
import project.maker.model.ReportPayment;
import project.mapper.MapperAuth;
import project.model.User;
import project.service.AuthService;
import project.utils.Utils;

@Service
public class AdminService {
	@Autowired
	private MapperAuth mapper;

	@Autowired
	private AdminDashboardMapper mapperDashboard;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtHelper jwtHelper;

	@Autowired
	private AdminMapper adminMapper;

	@Autowired
	private ReportMapper reportMapper;

	@Autowired
	private MapperAuth mapperAuth;

	@Value("${jwt.access.token.cookie.name}")
	private String cookieName;

	@Value("${error.password.mismatch}")
	private String passwordMismatch;

	@Value("${error.incorrect.old.password}")
	private String incorrectOldPassword;

	@Value("${error.outlook.message.failed}")
	private String outlookException;

	@Autowired
	private AuthService authservice;
	@Autowired
	private Utils util;

	@Autowired
	private JavaMailSender mailSender;

	String from = "VMS";
	String to = "de";
	String password_change_date = DateTimeFormatter.ofPattern("yyyy/MM/dd").format(LocalDateTime.now());

	String generatePassword() {
		return RandomStringUtils.randomAlphanumeric(11);
	}

	// This functionality is
	// update_functionality_status_for_all=========================

	public Boolean updateFunctionalityStatus_no_role(String functionality_status_string, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "update_functionality_status_for_all")) {
				JSONObject functionality_status = new JSONObject(functionality_status_string);
				for (int i = 0; i < functionality_status.names().length(); i++) {
					adminMapper.updateFunctionalityStatus_no_role(functionality_status.names().getString(i),
							((Boolean) functionality_status.get(functionality_status.names().getString(i)) == true)
									? "1"
									: "0");
				}
				util.registerActivity(request, "Update Functionality", "Update a specific functionality");
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// get_functionalities_of_all========================================
	public List<Functionality> getFunctionality_no_role(HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "get_functionalities_of_all")) {
				List<Functionality> functionalities = adminMapper.getFunctionality_no_role();
				util.registerActivity(request, "View Functionalities",
						"View all functionalities of maker, checker, approver and admin");
				return functionalities;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// reset_password_by_admin=========================================
	public Boolean reset_password_by_admin(String user_id, HttpServletRequest request) {

		try {
			String password = generatePassword();

			if (util.isPermitted(request, "Admin", "reset_password_by_admin")) {
				util.registerActivity(request, "Reset Password",
						"Reset password of " + adminMapper.getUserName(Long.parseLong(user_id)));
				sendemail_byAdmin(password, DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()),
						adminMapper.getEmailFromId(Long.parseLong(user_id)));
				return adminMapper.reset_password_by_admin(passwordEncoder.encode(password), user_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}

		} catch (Exception e) {
			if (e instanceof CustomAllException)
				throw new CustomAllException(outlookException);
			else
				throw new ExceptionsList(e);
		}
	}

	// This functionality is reset_password=========================================
	public Boolean resetPassword(ChangePassword changePassword, HttpServletRequest request) {
		// changePassword.setConfirmpassword("lsjdf");

		try {// util.isPermitted_no_role(request, "get_user_name")
			if (util.isPermitted_outside("reset_password")) {
				if (changePassword.getNewpassword().equals(changePassword.getConfirmpassword())) {
					System.out.println("Yes user has permission.");
					if (passwordEncoder.matches(changePassword.getOldpassword(),
							adminMapper.get_password(changePassword.getUser_id()))) {
						adminMapper.updatePassword(passwordEncoder.encode(changePassword.getConfirmpassword()),
								changePassword.getUser_id(), password_change_date);
						adminMapper.changeFirstTimeStatus(changePassword.getUser_id());
						util.registerActivity(request, "Change password",
								" User changes his password.");
						return true;
					} else
						throw new CustomPasswordErrorHandler(incorrectOldPassword);

				} else {
					System.out.println("they are not equal");
					throw new CustomPasswordErrorHandler(passwordMismatch);
				}

			} else {
				System.out.println("No user does not have permission. resetPassword");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is get_user_name=========================================

	public UserName get_user_name(HttpServletRequest request) {

		try {
			if (util.isPermitted_no_role(request, "login")) {
				// util.registerActivity(request, "Get User Name", "-");
				UserName user;
				user = adminMapper.get_user_name(util.get_user_id(request));
				user.setDays(authservice.numberOfDay(request));
				user.setPasswordExpiration(adminMapper.getPasswordExpiration());
				return user;

			} else {
				System.out.println("No user does not have permission. in get_user_name");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public UserName get_users_name(HttpServletRequest request, String name) {

		try {
			if (util.isPermitted_no_role(request, "login")) {
				// util.registerActivity(request, "Get User Name", "-");
				UserName user;
				user = adminMapper.get_users_name(name);
				return user;

			} else {
				System.out.println("No user does not have permission. in get_user_name");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public TimeManagement get_idle_time(HttpServletRequest request) {

		try {
			if (util.isPermitted_no_role(request, "get_user_name")) {
				// util.registerActivity(request, "Get User Name", "-");
				TimeManagement time;

				time = adminMapper.get_time();
				time.setLogin_trial(adminMapper.getLoginTrial());
				System.out.println("here is the idle time---" + time.getIdle_time());
				System.out.println("here is the idle time---" + time.getPassword_expiration());
				return time;

			} else {
				System.out.println("No user does not have permission. in get_idle_time");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is activate_user=========================================
	public Boolean activate_user(String user_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "activate_user")) {
				System.out.println("Yes user has permission.");
				adminMapper.activate_user(user_id);
				util.registerActivity(request, "Activate User",
						"Ativate " + adminMapper.getUserName(Long.parseLong(user_id)) + " account");
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// deactivate_user=========================================
	public Boolean deactivate_user(String user_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "deactivate_user")) {
				System.out.println("Yes user has permission.");
				adminMapper.deactivate_user(user_id);
				util.registerActivity(request, "Deactivate User",
						"Deactivate " + adminMapper.getUserName(Long.parseLong(user_id)) + " account");
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// delete_user========================================
	public Boolean deleteUser(String user_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "delete_user")) {
				util.registerActivity(request, "Delete User",
						"Delete " + adminMapper.getUserName(Long.parseLong(user_id)));
				return adminMapper.delete_user(user_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// update_user========================================
	public boolean update_user(RegisterActorDto registerActorDto, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "update_user")
					|| util.isPermitted(request, "Approver", "update_user")) {
				if (util.isPermitted(request, "Approver", "update_user")) {
					registerActorDto.setId(Long.parseLong(adminMapper.id(adminMapper.Email(registerActorDto.getId()))));
				}
				if (!util.isUserLoggedInAndisEmailBeingUpdated(registerActorDto.getId(), registerActorDto.getEmail())) {
					System.out.println("user is not logged in");
					User user = new User();
					String password = generatePassword();
					user.setFirstname(registerActorDto.getFirstname());
					user.setMiddlename(registerActorDto.getMiddlename());
					user.setLastname(registerActorDto.getLastname());
					user.setPassword(passwordEncoder.encode(password));
					user.setPassword(passwordEncoder.encode("a"));
					user.setEmail(registerActorDto.getEmail());
					user.setGender(registerActorDto.getGender());
					user.setPhonenumber(registerActorDto.getPhonenumber());
					user.setStatus("1");
					user.setAvailability("1");
					user.setId(registerActorDto.getId());

					String[] id_s = registerActorDto.getRole().split(",");
					// String Role_Id_Size=registerActorDto.getRole().replace(",", "");
					Long[] role_id = new Long[id_s.length];
					for (int i = 0; i < id_s.length; i++) {
						role_id[i] = Long.parseLong(id_s[i]);
					}

					// String role_name = "";
					// for (int i = 0; i < role_id.length; i++) {
					// if (i == 0)
					// role_name = adminMapper.getRole(role_id[i]);
					// else
					// role_name = role_name + ", " + adminMapper.getRole(role_id[i]);
					// }

					// String[] role_id = Long.parseLong(registerActorDto.getRole());
					System.out.println("Update user start");
					System.out.println("firstname: " + user.getFirstname());
					System.out.println("middlename: " + user.getMiddlename());
					System.out.println("lastname: " + user.getLastname());
					System.out.println("gender: " + user.getGender());
					System.out.println("email: " + user.getEmail());
					System.out.println("phonenumber: " + user.getPhonenumber());
					adminMapper.update_user(user);

					adminMapper.deleteUserRoles(registerActorDto.getId());

					for (int i = 0; i < id_s.length; i++) {
						// role_id[i] = Long.parseLong(id_s[i]);

						adminMapper.addUserRole(registerActorDto.getId(), role_id[i], "1", "1");
						// adminMapper.addUserRole(user_id, role_id[i], "1", "1");
					}

					util.registerActivity(request, "Update User",
							"Update user information of ID " + registerActorDto.getId());
					// sendemail(password);
				} else {
					System.out.println("user is logged in");
					throw new CustomAllException("user-is-logged-in");
				}

				return true;
			} else {
				System.out.println("No user does not have permission To update_user");
				return false;
			}
		} catch (Exception ex) {
			throw new ExceptionsList(ex);
		}
	}

	// This functionality is
	// get_user========================================
	public User getUser(String user_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "get_user") || util.isPermitted(request, "Approver", "get_user")) {
				User user = null;
				if (util.isPermitted(request, "Approver", "get_user")) {
					user = adminMapper.getUserByEmail(adminMapper.Email(Long.parseLong(user_id)));
				} else {
					user = adminMapper.getUser(user_id);
				}
				util.registerActivity(request, "View user",
						"Views " + adminMapper.getUserName(Long.parseLong(user_id)) + " information for updating");
				return user;
			} else {
				System.out.println("No user does not have permission to get specific user information for updating.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// update_functionality_status_of_roles=========================
	public Boolean updateFunctionalityStatus(String role_id, String functionality_status_string,
			HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "update_functionality_status_of_roles")) {
				JSONObject functionality_status = new JSONObject(functionality_status_string);
				for (int i = 0; i < functionality_status.names().length(); i++) {
					adminMapper.updateFunctionalityStatus(role_id, functionality_status.names().getString(i),
							((Boolean) functionality_status.get(functionality_status.names().getString(i)) == true)
									? "1"
									: "0");
				}
				util.registerActivity(request, "Update Functionality",
						"Update functionality of " + adminMapper.getRole(Long.parseLong(role_id)) + " role");
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// get_functionalities_of_roles========================================
	public List<Functionality> getFunctionality(String role_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "get_functionalities_of_roles")) {
				List<Functionality> functionalities = adminMapper.getFunctionality(role_id);
				util.registerActivity(request, "View Functionalities",
						"Admin views functionality of " + adminMapper.getRole(Long.parseLong(role_id)) + " role");
				return functionalities;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is get_all_logs
	public List<Logs> getAllLogs(HttpServletRequest request, String act_date) {
		try {
			if (util.isPermitted(request, "Admin", "get_all_logs")) {
				List<Logs> logs = adminMapper.getAllLogs(act_date.replace("-", "/"));
				// System.out.println("=============="+logs);
				for (int i = 0; i < logs.size(); i++) {
					logs.get(i).setUser(logs.get(i).getFirstname() + " " + logs.get(i).getMiddlename() + " "
							+ logs.get(i).getLastname());
					logs.get(i).setDate(logs.get(i).getDate_all().substring(0, 10));
					logs.get(i).setTime(logs.get(i).getDate_all().substring(10, 21));
				}
				util.registerActivity(request, "View Logs", "Views users login and logouts time");
				return logs;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is get_all_users
	public List<User> getAllUserUsers(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "get_all_users")) {
				List<User> users = adminMapper.getAllUserUsers();
				for (User user : users) {
					String email = user.getEmail();
					if (mapperAuth.check_refreshTokenExistByEmail(email)) {
						user.setOnline("yes");
					} else
						user.setOnline("no");
				}

				util.registerActivity(request, "View Users", "Views all users list");
				return users;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is get_all_user_activities
	public List<UserActivity> getAllUserActivities(HttpServletRequest request, String act_date) {
		try {
			if (util.isPermitted(request, "Admin", "get_all_user_activities")) {
				System.out.println("this isssssssssssssssssssssss" + act_date);
				List<UserActivity> activities = adminMapper.getAllUserActivities(act_date.replace("-", "/"));
				System.out.println("this isssssssssssssssssssssss: " + act_date.replace("-", "/"));
				System.out.println("this isssssssssssssssssssssss: " + activities.size());

				for (int i = 0; i < activities.size(); i++) {
					activities.get(i).setUser(activities.get(i).getFirstname() + " " + activities.get(i).getMiddlename()
							+ " " + activities.get(i).getLastname());
					activities.get(i).setDate(activities.get(i).getDate_all().substring(0, 10));
					activities.get(i).setTime(activities.get(i).getDate_all().substring(10, 21));

				}

				util.registerActivity(request, "View user activities", "views all users activity");
				return activities;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is activate_role=========================================
	public Boolean activate_role(String role_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "activate_role")) {
				System.out.println("Yes user has permission.");
				adminMapper.activate_role(role_id);
				util.registerActivity(request, "Activate Role",
						"Activate role " + adminMapper.getRole(Long.parseLong(role_id)));
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is
	// deactivate_role=========================================
	public Boolean deactivate_role(String role_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "deactivate_role")) {
				System.out.println("Yes user has permission.");
				adminMapper.deactivate_role(role_id);
				util.registerActivity(request, "Deactivate Role",
						"Deactivate role " + adminMapper.getRole(Long.parseLong(role_id)));
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is get_all_roles========================================
	public List<RoleDto> getAllRoles(HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "get_all_roles")) {
				List<Role> roles = adminMapper.getAllRoles();
				util.registerActivity(request, "View Roles", "Views all roles");
				return roles.stream().map(this::mapFromRoleToDto).collect(Collectors.toList());
			} else if (util.isPermitted(request, "Approver", "get_all_roles")) {
				List<Role> roles = adminMapper.getAllRolesExceptAdmin();
				util.registerActivity(request, "View Roles", "Views all roles");
				return roles.stream().map(this::mapFromRoleToDto).collect(Collectors.toList());
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// This functionality is register_user====================================
	public boolean register_user(RegisterActorDto registerActorDto, HttpServletRequest request) {

		try {
			System.out.println("**********" + registerActorDto.getFirstname());
			System.out.println("**********" + registerActorDto.getEmail());
			System.out.println("**********" + registerActorDto.getRole());
			if (util.isPermitted(request, "Approver", "register_user")
					|| util.isPermitted(request, "Admin", "register_user")) {
				User user = new User();
				String password = generatePassword();
				user.setFirstname(registerActorDto.getFirstname());
				user.setMiddlename(registerActorDto.getMiddlename());
				user.setLastname(registerActorDto.getLastname());
				user.setPassword(passwordEncoder.encode(password));
				// user.setPassword(passwordEncoder.encode("a"));
				user.setEmail(registerActorDto.getEmail());
				user.setGender(registerActorDto.getGender());
				user.setPhonenumber(registerActorDto.getPhonenumber());
				user.setStatus("1");
				user.setAvailability("1");
				user.setFirsttime("0");
				user.setReg_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				String[] id_s = registerActorDto.getRole().split(",");
				Long[] role_id = new Long[registerActorDto.getRole().split(",").length];
				for (int i = 0; i < id_s.length; i++) {
					role_id[i] = Long.parseLong(id_s[i]);
				}

				String role_name = "";
				for (int i = 0; i < role_id.length; i++) {
					if (i == 0)
						role_name = adminMapper.getRole(role_id[i]);
					else
						role_name = role_name + ", " + adminMapper.getRole(role_id[i]);
				}
				System.out.println("length=" + role_id.length);
				// sendemail(password,
				// DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()),
				// role_name,
				// user.getEmail());
				Long user_id = adminMapper.register_user(user);
				for (int i = 0; i < role_id.length; i++) {
					adminMapper.addUserRole(user_id, role_id[i], "1", "1");
				}
				util.registerActivity(request, "Register User", "Register " + registerActorDto.getFirstname() + " "
						+ registerActorDto.getMiddlename() + " wthe role of " + role_name);

				return true;
			} else {
				System.out.println("No user does not have permission to register a user.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean isUserHasRole_User(Long[] role_id) {
		for (int i = 0; i < role_id.length; i++) {
			if ("User".equalsIgnoreCase(adminMapper.getRole(role_id[i])))
				return true;
		}
		return false;
	}

	// "User".equalsIgnoreCase(adminMapper.getRole(role_id))

	@Scheduled(cron = "0 44 9 * * *")
	public void sendEmailForPayments() {
		try {
			System.out.println("schedule executed");
			LocalDate expectedDate = LocalDate.now();
			long diff = 7896;
			String current_date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
			LocalDate currentDate = LocalDate.parse(current_date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
			List<ReportPayment> payments = reportMapper.getUnpaidContracts();
			List<User> toList = adminMapper.getAllActiveMakers();
			String expected_date;
			String payment_end_date;
			int checker = 0;
			System.out.println("going well------");
			for (User to : toList) {
				int x = 0;

				MimeMessage mimeMessage = mailSender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
				helper.setFrom(from);
				helper.setTo(to.getEmail());
				helper.setSubject("Alert from Vendor Management System!!");
				StringBuilder emailContent = new StringBuilder();
				emailContent.append("Dear, ").append(to.getFirstname()).append("\n\n");
				emailContent.append("Please perform payment for following contracts:\n\n");
				for (ReportPayment payment : payments) {
					expected_date = payment.getExpected_date();
					payment_end_date = payment.getPayment_end_date();
					if (!payment.getPayment_frequency().equalsIgnoreCase("phased")) {
						expectedDate = LocalDate.parse(expected_date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
						diff = ChronoUnit.DAYS.between(currentDate, expectedDate);
					} else {
						expectedDate = LocalDate.parse(payment_end_date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
						diff = ChronoUnit.DAYS.between(currentDate, expectedDate);
					}

					System.out.println("payment of contract " + payment.getContract_id() + " date "
							+ payment.getExpected_date() + " diff with now " + diff);

					if ((payment.getPayment_frequency().equalsIgnoreCase("monthly") && diff <= 2) ||
							(payment.getPayment_frequency().equalsIgnoreCase("quarterly") && diff <= 5) ||
							(payment.getPayment_frequency().equalsIgnoreCase("semi_anualy") && diff <= 10) ||
							(payment.getPayment_frequency().equalsIgnoreCase("anualy") && diff <= 15)) {
						checker++;
						emailContent.append("=> Contract id Cont").append(payment.getContract_id())
								.append(", payment end date ").append(payment.getExpected_date())
								.append(", payment frequency ").append(payment.getPayment_frequency())
								.append("").append("\n");

					}
					if ((payment.getPayment_frequency().equalsIgnoreCase("phased") && diff <= 20)) {
						checker++;
						emailContent.append("=> Contract id Cont").append(payment.getContract_id())
								.append(", payment end date ").append(payment.getPayment_end_date())
								.append(", payment frequency ").append(payment.getPayment_frequency())
								.append("").append("\n");
					}
				}

				if (checker != 0) {
					helper.setText(emailContent.toString());
					mailSender.send(mimeMessage);
					System.out.println("Email sent to: " + to.getEmail());
				}
			}
			System.out.println("Email sending complete.");
		} catch (MailSendException | MessagingException e) {
			e.printStackTrace();
			StringWriter sw = new StringWriter();
			e.printStackTrace(new PrintWriter(sw));
			throw new CustomAllException(sw.toString());
		} catch (Exception e) {
			e.printStackTrace();
			throw new ExceptionsList(e);
		}
	}

	public void sendemail(String password, String reg_date, String role, String to) {
		try {

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
			helper.setFrom(from);
			helper.setTo(to);
			helper.setSubject("VENDOR MANAGEMENT");
			boolean html = true;
			if (html) {
				helper.setText(
						"<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.'><html xmlns='http://www.w3.' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='x-apple-disable-message-reformatting'><!--[if !mso]><!--><meta http-equiv='X-UA-Compatible' content='IE=edge'><!--<![endif]--><title></title><style type='text/css'>@media only screen and (min-width: 620px) {.u-row {width: 600px !important;}.u-row .u-col {vertical-align: top;}.u-row .u-col-100 {width: 600px !important;}}@media (max-width: 620px) {.u-row-container {max-width: 100% !important;padding-left: 0px !important;padding-right: 0px !important;}.u-row .u-col {min-width: 320px !important;max-width: 100% !important;display: block !important;}.u-row {width: 100% !important;}.u-col {width: 100% !important;}.u-col > div {margin: 0 auto;}}body {margin: 0;padding: 0;}table,tr,td {vertical-align: top;border-collapse: collapse;}p {margin: 0;}.ie-container table,.mso-container table {table-layout: fixed;}* {line-height: inherit;}a[x-apple-data-detectors='true'] {color: inherit !important;text-decoration: none !important;}table, td { color: #000000; } @media (max-width: 480px) { #u_content_image_2 .v-container-padding-padding { padding: 0px 0px 0px 0px !important; } #u_content_image_2 .v-src-width { width: auto !important; } #u_content_image_2 .v-src-max-width { max-width: 100% !important; } #u_content_heading_4 .v-font-size { font-size: 45px !important; } #u_content_heading_3 .v-container-padding-padding { padding: 0px 0px 0px !important; } #u_content_heading_3 .v-font-size { font-size: 26px !important; } #u_content_text_2 .v-container-padding-padding { padding: 20px 10px 40px !important; } }</style><!--[if !mso]><!--><link href='https://fonts.googleapis.com/css2?family=Federo&display=swap' rel='stylesheet' type='text/css'><!--<![endif]--></head><body class='clean-body u_body' style='margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000'><!--[if IE]><div class='ie-container'><![endif]--><!--[if mso]><div class='mso-container'><![endif]--><table style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%' cellpadding='0' cellspacing='0'><tbody><tr style='vertical-align: top'><td style='word-break: break-word;border-collapse: collapse !important;vertical-align: top'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='background-color: #ffffff;'><![endif]--><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='background-color: #273896;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='background-color: #273896;height: 100%;width: 100% !important;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;'><!--<![endif]--><table id='u_content_image_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:0px 0px 0px 0px;font-family:helvetica,sans-serif;' align='left'><table width='100%' cellpadding='0' cellspacing='0' border='0'></table></td></tr></tbody></table><table id='u_content_heading_4' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #ffffff; line-height: 100%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 40px; '><strong>AWASH BANK VENDOR MANAGEMENT SYSTEM</strong></h1></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--<![endif]--><table id='u_content_heading_3' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #fe9a37; line-height: 140%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 33px; '><strong>"
								+ reg_date
								+ "</strong></h1></td></tr></tbody></table><table id='u_content_text_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:20px 60px 60px;font-family:helvetica,sans-serif;' align='left'><div class='v-font-size' style='line-height: 140%; text-align: center; word-wrap: break-word;'><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>You have been registered as a "
								+ role
								+ ", and your password is</span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>PASSWORD:<strong> "
								+ password
								+ "</strong></span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>Please use your awash outlook address and this password to login into AWASH BANK VENDOR MANAGEMENT SYSTEM.</span></p></div></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if mso]></div><![endif]--><!--[if IE]></div><![endif]--></body></html>",
						true);
			} else {
				helper.setText(password);
			}
			mailSender.send(mimeMessage);
			System.out.println("Email sending complete.");
		} catch (MailSendException | MessagingException e) {
			e.printStackTrace();
			StringWriter sw = new StringWriter();
			e.printStackTrace(new PrintWriter(sw));
			throw new CustomAllException(sw.toString());
		} catch (Exception e) {
			e.printStackTrace();
			throw new ExceptionsList(e);
		}
	}

	public void sendemail_byAdmin(String password, String reg_date, String to) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
			helper.setFrom(from);
			helper.setTo(to);
			helper.setSubject(" VENDOR MANAGEMENT SYSTEM Password");
			boolean html = true;
			if (html) {
				helper.setText(
						"<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='x-apple-disable-message-reformatting'><!--[if !mso]><!--><meta http-equiv='X-UA-Compatible' content='IE=edge'><!--<![endif]--><title></title><style type='text/css'>@media only screen and (min-width: 620px) {.u-row {width: 600px !important;}.u-row .u-col {vertical-align: top;}.u-row .u-col-100 {width: 600px !important;}}@media (max-width: 620px) {.u-row-container {max-width: 100% !important;padding-left: 0px !important;padding-right: 0px !important;}.u-row .u-col {min-width: 320px !important;max-width: 100% !important;display: block !important;}.u-row {width: 100% !important;}.u-col {width: 100% !important;}.u-col > div {margin: 0 auto;}}body {margin: 0;padding: 0;}table,tr,td {vertical-align: top;border-collapse: collapse;}p {margin: 0;}.ie-container table,.mso-container table {table-layout: fixed;}* {line-height: inherit;}a[x-apple-data-detectors='true'] {color: inherit !important;text-decoration: none !important;}table, td { color: #000000; } @media (max-width: 480px) { #u_content_image_2 .v-container-padding-padding { padding: 0px 0px 0px 0px !important; } #u_content_image_2 .v-src-width { width: auto !important; } #u_content_image_2 .v-src-max-width { max-width: 100% !important; } #u_content_heading_4 .v-font-size { font-size: 45px !important; } #u_content_heading_3 .v-container-padding-padding { padding: 0px 0px 0px !important; } #u_content_heading_3 .v-font-size { font-size: 26px !important; } #u_content_text_2 .v-container-padding-padding { padding: 20px 10px 40px !important; } }</style><!--[if !mso]><!--><link href='https://fonts.googleapis.com/css2?family=Federo&display=swap' rel='stylesheet' type='text/css'><!--<![endif]--></head><body class='clean-body u_body' style='margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000'><!--[if IE]><div class='ie-container'><![endif]--><!--[if mso]><div class='mso-container'><![endif]--><table style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%' cellpadding='0' cellspacing='0'><tbody><tr style='vertical-align: top'><td style='word-break: break-word;border-collapse: collapse !important;vertical-align: top'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='background-color: #ffffff;'><![endif]--><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='background-color: #273896;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='background-color: #273896;height: 100%;width: 100% !important;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;'><!--<![endif]--><table id='u_content_image_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:0px 0px 0px 0px;font-family:helvetica,sans-serif;' align='left'><table width='100%' cellpadding='0' cellspacing='0' border='0'></table></td></tr></tbody></table><table id='u_content_heading_4' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #ffffff; line-height: 100%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 40px; '><strong>AWASH BANK VENDOR MANAGEMENT SYSTEM</strong></h1></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--<![endif]--><table id='u_content_heading_3' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #fe9a37; line-height: 140%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 33px; '><strong>"
								+ reg_date
								+ "</strong></h1></td></tr></tbody></table><table id='u_content_text_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:20px 60px 60px;font-family:helvetica,sans-serif;' align='left'><div class='v-font-size' style='line-height: 140%; text-align: center; word-wrap: break-word;'><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'> Your password has been reset successfully!, and your password is</span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>PASSWORD:<strong> "
								+ password
								+ "</strong></span></p><p style='font-size: 14px; line-height: 140%;'><span .</span></p></div></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if mso]></div><![endif]--><!--[if IE]></div><![endif]--></body></html>",
						true);
			} else {
				helper.setText(password);
			}
			mailSender.send(mimeMessage);
			System.out.println("Email sending complete.");
		} catch (MailSendException | MessagingException e) {
			throw new CustomAllException(outlookException);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	private RoleDto mapFromRoleToDto(Role role) {
		RoleDto roleDto = new RoleDto();
		roleDto.setId(role.getId());
		roleDto.setName(role.getName());
		roleDto.setDescription(role.getDescription());
		roleDto.setStatus(role.getStatus());
		roleDto.setAvailability(role.getAvailability());
		return roleDto;
	}

	public Boolean check_email(String email, HttpServletRequest request) {
		try {
			return adminMapper.check_email(email);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean check_phone(String phone, HttpServletRequest request) {
		try {
			return adminMapper.check_phone(phone);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	{
		// public Map<String, Object> signup(RegisterRequest registerRequest,
		// HttpServletResponse httpServletResponse) {
		// try {
		// User user = new User();
		// user.setUsername(registerRequest.getUsername());
		// user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
		// user.setFullname(registerRequest.getFullname());
		// System.out.println("Class level is: " + registerRequest.getClass_level());
		// user.setClass_level(registerRequest.getClass_level());
		// user.setGender(registerRequest.getGender());
		// user.setProfile(registerRequest.getProfile());
		//
		// user.setType(registerRequest.getType());
		// user.setStatus(1);
		//
		// Long role_id = 2l;
		// List<Roles> all_roles = new ArrayList<>();
		// if (user.getType() != null && user.getType().equalsIgnoreCase("student")) {
		// user.setClass_level(null);
		// role_id = mapper.getRoleId("Student");
		// Roles roles = new Roles();
		// roles.setName("Student");
		// all_roles.add(roles);
		// } else {
		// role_id = mapper.getRoleId("Teacher");
		// Roles roles = new Roles();
		// roles.setName("Student");
		// all_roles.add(roles);
		// }
		// Long user_id = mapper.signup(user);
		//
		// UserRole userRole = new UserRole();
		// userRole.setRole_id(role_id);
		// userRole.setUser_id(user_id);
		// user.setRoles(all_roles);
		//
		// mapper.addUserRole(userRole);
		//
		// if (registerRequest.getSubject() != null &&
		// !registerRequest.getSubject().isEmpty()) {
		// for (int i = 0; i < registerRequest.getSubject().size(); i++) {
		// UserSubject user_subject = new UserSubject();
		// user_subject.setUser_id(user_id);
		// user_subject.setsubject_id(registerRequest.getSubject().get(i).getId());
		// mapper.addUserSubject(user_subject);
		// }
		// }
		//
		// RefreshToken refreshToken = new RefreshToken();
		// refreshToken.setUsername(user.getUsername());
		// Long refresh_token_id = mapper.addRefreshToken(refreshToken);
		//
		// String accessToken = jwtHelper.generateAccessToken(user);
		// String refreshTokenString = jwtHelper.generateRefreshToken(user,
		// refresh_token_id);
		//
		// user.setPassword(null);
		// Map<String, Object> json_response = new HashMap<String, Object>();
		//// json_response.put("accessToken", accessToken);
		//// json_response.put("refreshToken", refreshTokenString);
		// json_response.put("user", user);
		//
		// CookieUtil.create(httpServletResponse, cookieName_access, accessToken, false,
		// refreshTokenExpiration, "localhost");
		// CookieUtil.create(httpServletResponse, cookieName_refresh,
		// refreshTokenString, false, refreshTokenExpiration, "localhost");
		// return json_response;
		// } catch (Exception ex) {
		// throw new ExceptionsList(ex);
		// }
		// }
		//
		// public Long registerSubject(SubjectDto subject_dto) {
		// Subject subject = new Subject();
		// subject.setName(subject_dto.getName());
		// subject.setDescription(subject_dto.getDescription());
		// return mapper.registerSubject(subject);
		// }
		//
		// public Map<String, Object> login(LoginRequest loginRequest,
		// HttpServletResponse httpServletResponse) {
		// try {
		// Authentication authenticate = authenticationManager.authenticate(
		// new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
		// loginRequest.getPassword()));
		// SecurityContextHolder.getContext().setAuthentication(authenticate);
		//
		// User user = mapper.findByUserName2(loginRequest.getUsername());
		//
		// RefreshToken refreshToken = new RefreshToken();
		// refreshToken.setUsername(user.getUsername());
		// Long refresh_token_id = mapper.addRefreshToken(refreshToken);
		//
		// String accessToken = jwtHelper.generateAccessToken(user);
		// String refreshTokenString = jwtHelper.generateRefreshToken(user,
		// refresh_token_id);
		//
		// user.setPassword(null);
		// Map<String, Object> json_response = new HashMap<String, Object>();
		//// json_response.put("accessToken", accessToken);
		//// json_response.put("refreshToken", refreshTokenString);
		// json_response.put("user", user);
		//
		// CookieUtil.create(httpServletResponse, cookieName_access, accessToken, false,
		// refreshTokenExpiration, "localhost");
		// CookieUtil.create(httpServletResponse, cookieName_refresh,
		// refreshTokenString, false, refreshTokenExpiration, "localhost");
		//
		// return json_response;
		// } catch (Exception ex) {
		// System.out.println("Exception type: " + ex.getClass().getName());
		// throw new ExceptionsList(ex);
		// }
		//
		// }
		//
		// public Boolean check_username(String username) {
		// return mapper.check_username(username);
		// }
		//
		// public Boolean check_subject(String subject_name) {
		// return mapper.check_subject(subject_name);
		// }
		//
		//
		// public void logout(HttpServletResponse httpServletResponse,
		// HttpServletRequest request) {
		// String refreshTokenString = getRefreshToken(request);
		// if (jwtHelper.validateRefreshToken(refreshTokenString)) {
		// System.out.println("The id from token: " +
		// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// if (null !=
		// mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString)))
		// {
		// mapper.deleteRefreshToken(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// CookieUtil.clear(httpServletResponse, cookieName_access);
		// CookieUtil.clear(httpServletResponse, cookieName_refresh);
		// System.out.println("Logged out successfully!!!");
		// return;
		// } else {
		// System.out.println("refresh token does not exist in the database!!!");
		// }
		// } else {
		// System.out.println("Validation of refresh token failed!!!");
		// }
		// throw new ExceptionsList(new BadCredentialsException("bad credentials"));
		// }
		//
		// public Boolean clearCookies(HttpServletResponse response, HttpServletRequest
		// request) {
		// String refreshTokenString = getRefreshToken(request);
		// if (refreshTokenString != null) {
		//// System.out.println("The id from token: " +
		// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		//// if (null !=
		// mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString)))
		// {
		//// mapper.deleteRefreshToken(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// CookieUtil.clear(response, cookieName_access);
		// CookieUtil.clear(response, cookieName_refresh);
		// System.out.println("Logged out successfully!!!");
		// return true;
		//// } else {
		//// System.out.println("refresh token does not exist in the database!!!");
		//// }
		// } else {
		// System.out.println("refresh token does not exist!!!");
		// }
		// throw new ExceptionsList(new BadCredentialsException("bad credentials"));
		// }
		//
		// public void logoutAll(HttpServletResponse httpServletResponse,
		// HttpServletRequest request) {
		// String refreshTokenString = getRefreshToken(request);
		// if (jwtHelper.validateRefreshToken(refreshTokenString)) {
		// System.out.println("The id from token: " +
		// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// if (null !=
		// mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString)))
		// {
		// String token_username = mapper
		// .getUsernameFromTokenId(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// mapper.deleteRefreshTokenAll(token_username);
		// CookieUtil.clear(httpServletResponse, cookieName_access);
		// CookieUtil.clear(httpServletResponse, cookieName_refresh);
		// System.out.println("Logged out of all sessions successfully!!!");
		// return;
		// } else {
		// System.out.println("refresh token does not exist in the database!!!");
		// }
		// } else {
		// System.out.println("Validation of refresh token failed!!!");
		// }
		// throw new ExceptionsList(new BadCredentialsException("bad credentials"));
		// }
		//
		// public Boolean refreshToken(HttpServletRequest httpServletRequest,
		// HttpServletResponse httpServletResponse) {
		//// String refreshTokenString = dto.getRefreshToken();
		// String refreshTokenString = getRefreshToken(httpServletRequest);
		// if (refreshTokenString != null &&
		// jwtHelper.validateRefreshToken(refreshTokenString)) {
		// System.out.println("The id from token: " +
		// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// if (null !=
		// mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString)))
		// {
		//
		// mapper.deleteRefreshToken(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		//
		// User user =
		// mapper.findByUserName2(jwtHelper.getUsernameFromAccessToken(refreshTokenString));
		//
		// RefreshToken refreshToken = new RefreshToken();
		// refreshToken.setUsername(user.getUsername());
		// Long refresh_token_id = mapper.addRefreshToken(refreshToken);
		//
		// String accessToken = jwtHelper.generateAccessToken(user);
		// String newRefreshTokenString = jwtHelper.generateRefreshToken(user,
		// refresh_token_id);
		//
		//// user.setPassword(null);
		//// Map<String, Object> json_response = new HashMap<String, Object>();
		////// json_response.put("accessToken", accessToken);
		////// json_response.put("refreshToken", refreshTokenString);
		//// json_response.put("user", user);
		//
		// CookieUtil.clear(httpServletResponse, cookieName_access);
		// CookieUtil.clear(httpServletResponse, cookieName_refresh);
		// System.out.println("Path: " + httpServletRequest.getServletPath());
		// CookieUtil.create(httpServletResponse, cookieName_access, accessToken, false,
		// refreshTokenExpiration, "localhost");
		// CookieUtil.create(httpServletResponse, cookieName_refresh,
		// newRefreshTokenString, false, refreshTokenExpiration, "localhost");
		//
		// return true;
		// } else {
		// System.out.println("refresh token does not exist in the database!!!");
		// }
		// } else {
		// System.out.println("Validation of refresh token failed!!!");
		// return false;
		// }
		// throw new ExceptionsList(new BadCredentialsException("bad credentials"));
		// }
		//
		// private String getAccessToken(HttpServletRequest request){
		// Cookie cookie = WebUtils.getCookie(request, cookieName_access);
		// return cookie != null ? cookie.getValue():null;
		// }
		//
		// private String getRefreshToken(HttpServletRequest request){
		// Cookie cookie = WebUtils.getCookie(request, cookieName_refresh);
		// return cookie != null ? cookie.getValue():null;
		// }
		//
		// public Optional<org.springframework.security.core.userdetails.User>
		// getCurrentUser() {
		// org.springframework.security.core.userdetails.User principal =
		// (org.springframework.security.core.userdetails.User) SecurityContextHolder
		// .getContext().getAuthentication().getPrincipal();
		// return Optional.of(principal);
		// }
		//
		// public Map<String, Object> accessToken(TokenDto dto) {
		// String refreshTokenString = dto.getRefreshToken();
		// if (jwtHelper.validateRefreshToken(refreshTokenString)) {
		// System.out.println("The id from token: " +
		// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
		// if (null !=
		// mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString)))
		// {
		// Map<String, Object> tokenResponse = new HashMap<>();
		// tokenResponse.put("username",
		// jwtHelper.getUsernameFromAccessToken(refreshTokenString));
		// tokenResponse.put("accessToken", jwtHelper.generateAccessToken(
		// mapper.findByUserName2(jwtHelper.getUsernameFromAccessToken(refreshTokenString))));
		// tokenResponse.put("refreshToken", refreshTokenString);
		// return tokenResponse;
		//
		// } else {
		// System.out.println("refresh token does not exist in the database!!!");
		// }
		// } else {
		// System.out.println("Validation of refresh token failed!!!");
		// }
		// throw new ExceptionsList(new BadCredentialsException("bad credentials"));
		// }
	}

	public Boolean changePassword(ChangePassword changePassword, HttpServletRequest request) {
		// TODO Auto-generated method stub
		try {// util.isPermitted_no_role(request, "get_user_name")
			if (util.isPermitted_outside("change_password")) {
				if (changePassword.getNewpassword().equals(changePassword.getConfirmpassword())) {
					System.out.println("Yes user has permission.");

					if (passwordEncoder.matches(changePassword.getOldpassword(),
							adminMapper.get_password(util.get_user_id(request)))) {
						System.out.println("new password=" + changePassword.getConfirmpassword());
						adminMapper.updatePassword(passwordEncoder.encode(changePassword.getConfirmpassword()),
								util.get_user_id(request), password_change_date);
						// adminMapper.changeFirstTimeStatus(changePassword.getUser_id());
						util.registerActivity(request, "Change password", " User changes his password.");
						return true;
					} else
						throw new CustomAllException("incorrect-old-password");

				} else {
					System.out.println("they are not equal");
					throw new CustomAllException("password-mismatch");
				}

			} else {
				System.out.println("No user does not have permission. changePassword");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean changeTime(int time, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "deactivate_role")) {

				adminMapper.changeTime(time);
				util.registerActivity(request, "Change time", " Admin changes session time.");
				return true;

			} else {
				System.out.println("No user does not have permission. change time");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean changePasswordExpirationTime(int time, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "deactivate_role")) {

				adminMapper.changePasswordExpirationTime(time);
				util.registerActivity(request, "Change time", " admin changes password expiration time.");
				return true;

			} else {
				System.out.println("No user does not have permission. change time");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean changeLoginTrial(int trial, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Admin", "deactivate_role")) {

				adminMapper.changeLoginTrial(trial);
				util.registerActivity(request, "Change time", " admin changes login trial length.");
				return true;

			} else {
				System.out.println("No user does not have permission. change time");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}
	// public boolean register_role(Currency role, HttpServletRequest request) {
	// try {
	// if (util.isPermitted(request, "Admin", "add_role")) {
	// if (util.check_Role_Exist(role.getName())) {
	// adminMapper.addUserCurrency(role);
	// util.registerActivity(request, "Register role", "-");
	// util.registerActivity(request, "Send request",
	// "Send create role reques with role name " + role.getName());
	//
	// return true;
	// } else {
	// throw new CustomAllException("role already registered");
	// }
	// } else
	// return false;
	//
	// } catch (Exception e) {
	// throw new ExceptionsList(e);
	// }
	// }

	public List<Users> getPendingUsers(HttpServletRequest request) {
		try {
			System.out.println("---------" + request.getAuthType());
			if (util.isPermitted(request, "Approver", "get_pending_users")) {
				List<Users> users = adminMapper.getPendingUsers();
				util.registerActivity(request, "View pending Users", "Views  pending users list");
				return users;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			System.out.println(e);
			return null;
			// throw new ExceptionsList(e);
		}
	}

	public Boolean reject_pending_user(String user_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Approver", "reject_pending_user")) {
				util.registerActivity(request, "Reject pending  User",
						"Reject " + adminMapper.getPendingUser(Long.parseLong(user_id)));
				return adminMapper.reject_pending_user(user_id,
						new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new Date()) + " " + "by" + " "
								+ adminMapper.user(util.get_user_id(request)));
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean approve_pending_user(String user_id, HttpServletRequest request) {
		try {

			return adminMapper.reject_approve_user(user_id,
					new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new Date()) + " " + "by" + " "
							+ adminMapper.user(util.get_user_id(request)));

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public User get_pending_userById(String user_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Approver", "get_pending_userById")) {
				User user = adminMapper.getUser_pending_byId(user_id);
				util.registerActivity(request, "Vie Pending  user for  approve",
						"Views " + adminMapper.getPendingUser(Long.parseLong(user_id)) + " information for updating");
				return user;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Map<String, Object> getAdminDashboardData(HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Admin", "get_dashboard_data")) {
				Map<String, Object> response = new HashMap<>();
				response.put("total_number_of_Users", mapperDashboard.getTotalNumberOfUsers());
				response.put("total_number_active_users", mapperDashboard.getTotalNumberOfActiveUsers());
				response.put("total_number_inactive_users", mapperDashboard.getTotalNumberOfInActiveUsers());
				response.put("total_number_of_admin_functionalities",
						mapperDashboard.getTotalNumberOfAdminFunctionalities());
				response.put("total_number_of_maker_functionalities",
						mapperDashboard.getTotalNumberOfMakerFunctionalities());
				response.put("total_number_of_checker_functionalities",
						mapperDashboard.getTotalNumberOfCheckerFunctionalities());
				response.put("total_number_of_approver_functionalities",
						mapperDashboard.getTotalNumberOfApproverFunctionalities());
				response.put("total_number_of_functionalities", mapperDashboard.getTotalNumberOfFunctionalities());
				response.put("total_logins", mapperDashboard.getTotalLogins());
				response.put("total_number_of_user_activity", mapperDashboard.getTotalUserActivity());
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

	public Map<String, Object> getApproverDashboardData(HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Approver", "get_dashboard_data")) {
				Map<String, Object> response = new HashMap<>();
				response.put("total_pending_user", mapperDashboard.getTotalNumberOfPendingUsers());
				response.put("total_approved_user", mapperDashboard.getTotalNumberOfApprovedUsers());
				response.put("total_rejected_user", mapperDashboard.getTotalNumberOfRejectedUsers());
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

}
