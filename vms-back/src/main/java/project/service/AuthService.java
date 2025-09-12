package project.service;

import java.net.InetAddress;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.naming.NamingEnumeration;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import project.Exception.CustomAllException;
import project.Exception.ExceptionsList;
import project.admin.dto.RegisterActorDto;
import project.admin.mapper.AdminMapper;
import project.admin.model.Users;
import project.config.CookieUtil;
import project.dto.LoginRequest;
import project.dto.LogoutRequest;
import project.dto.TokenDto;
import project.jwt.JwtHelper;
import project.mapper.MapperAuth;
import project.model.RefreshToken;
import project.model.User;
import project.utils.Utils;

@Service
public class AuthService {

	@Value("${jwt.access.token.cookie.name}")
	private String cookieName_access;

	@Value("${jwt.refresh.token.cookie.name}")
	private String cookieName_refresh;

	@Value("${jwt.refresh.token.expiration.in.ms}")
	private String refreshTokenExpiration;

	@Autowired
	private MapperAuth mapper;

	@Autowired
	private LdapTemplate ldapTemplate;

	@Autowired
	private AdminMapper adminMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtHelper jwtHelper;

	@Autowired
	private Utils util;

	@Autowired
	private JavaMailSender mailSender;

	@Value("${error.outlook.message.failed}")
	private String outlookException;

	String from = "VMS.com";

	public String get_login_trial(String email) {
		try {
			Map<String, Integer> settings = new HashMap<>();
			settings = mapper.getLoginTrialsSettings();

			int loginTrials = mapper.getLoginTrials(email);
			System.out.println("fifth date: " + mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"), email));
			System.out.println("login trialss: " + loginTrials);
			LocalDateTime DateObj = LocalDateTime.now();
			DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			return loginTrials + "$"
					+ (loginTrials >= (int) settings.get("input_1")
							? mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"), email)
							: "null")
					+ "$" + settings.get("input_1") + "$" + settings.get("input_2") + "$"
					+ mapper.loginGetTimeToPunish() + "$" + "thisismymessagetotheworld" + "$"
					+ DateObj.format(myFormatObj);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean login_other_device_browser(String email) {
		return mapper.check_refreshTokenExistByEmail(email);

	}

	// // This functionality is login
	// @SuppressWarnings("deprecation")
	// public Map<String, Object> login(LoginRequest loginRequest,
	// HttpServletResponse httpServletResponse,
	// HttpServletRequest request) {
	//
	// try {
	// String current_date =
	// LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
	// String password_change_date =
	// mapper.getPasswordChangeDate(loginRequest.getEmail());
	//
	// // Parse dates as LocalDate
	// LocalDate currentDate = LocalDate.parse(current_date,
	// DateTimeFormatter.ofPattern("yyyy/MM/dd"));
	// if(password_change_date !=null) {
	// LocalDate passwordChangeDate = LocalDate.parse(password_change_date,
	// DateTimeFormatter.ofPattern("yyyy/MM/dd"));
	//
	// // Calculate the difference in days
	// long diff = java.time.temporal.ChronoUnit.DAYS.between(passwordChangeDate,
	// currentDate);
	// System.out.println("here is the date difference " + diff);
	// if (diff > adminMapper.getPasswordExpiration()) {
	// //Means password expired after adminMapper.getPasswordExpiration() days
	// mapper.update_firsttime_status(loginRequest.getEmail());
	// }
	// }
	// if (util.isPermitted_outside("login")) {
	// System.out.println("isPermitted_outside: true");
	// String user_ip = request.getRemoteAddr();
	// System.out.println("user_ipppppppppppppppp first =" + user_ip);
	// if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
	// user_ip = InetAddress.getLocalHost().getHostAddress().toString();
	// System.out.println("user_ipppppppppppppppp second =" + user_ip);
	// System.out.println("before token generated");
	// Authentication authenticate = authenticationManager.authenticate(
	// new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
	// loginRequest.getPassword()));
	// SecurityContextHolder.getContext().setAuthentication(authenticate);
	// System.out.println("after token generated");
	// User user = mapper.findByUserName2(loginRequest.getEmail());
	// RefreshToken refreshToken = new RefreshToken();
	// refreshToken.setEmail(user.getEmail());
	// Long refresh_token_id = mapper.addRefreshToken(refreshToken);
	//
	// String accessToken = jwtHelper.generateAccessToken(user);
	// String refreshTokenString = jwtHelper.generateRefreshToken(user,
	// refresh_token_id);
	// System.out.println("Token generated: " + refreshTokenString);
	// user.setPassword(null);
	// Map<String, Object> json_response = new HashMap<String, Object>();
	//// json_response.put("accessToken", accessToken);
	//// json_response.put("refreshToken", refreshTokenString);
	// json_response.put("user", user);
	//
	// CookieUtil.create(httpServletResponse, cookieName_access, accessToken, true,
	// refreshTokenExpiration,
	// "localhost");
	//
	// CookieUtil.create(httpServletResponse, cookieName_refresh,
	// refreshTokenString, true,
	// refreshTokenExpiration, "localhost");
	// String[] roles = mapper.getRoleByUserId(user.getId());
	//// System.out.println("here is the role === " + a);
	// for (int i = 0; i < roles.length; i++) {
	// if (util.isPermitted_outside_second(request, roles[i], "login",
	// user.getEmail())) {
	// System.out.println("isPermitted: true");
	// util.registerLog(user.getId(), user_ip, loginRequest.getBrowser_type(),
	// loginRequest.getBrowser_version(), "Login", "1", "1");
	// mapper.clearLoginTrials(loginRequest.getEmail());
	// return json_response;
	// } else {
	// System.out.println("isPermitted: false");
	// return null;
	// }
	// }
	// return null;
	//
	// } else {
	// System.out.println("isPermitted_outside: false");
	// return null;
	// }
	// } catch (Exception ex) {
	// ex.printStackTrace();
	// try {
	// if (util.doesUserExistByEmail(loginRequest.getEmail())) {
	// String user_ip = request.getRemoteAddr();
	// if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
	// user_ip = InetAddress.getLocalHost().getHostAddress().toString();
	//
	// LocalDateTime DateObj = LocalDateTime.now();
	// DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyy-MM-dd
	// HH:mm:ss");
	//
	// int loginTrials = mapper.getLoginTrials(loginRequest.getEmail());
	// Map<String, Integer> settings = new HashMap<>();
	// settings = mapper.getLoginTrialsSettings();
	//
	// if (loginTrials == (int) settings.get("input_1")) {
	//
	// String the_whole_date =
	// mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"),
	// loginRequest.getEmail());
	// DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
	// Date the_actual_date = format.parse(the_whole_date.split(" ")[0]);
	//
	// the_actual_date.setHours(Integer.parseInt(the_whole_date.split("
	// ")[1].split(":")[0]));
	// the_actual_date.setMinutes(Integer.parseInt(the_whole_date.split("
	// ")[1].split(":")[1]));
	// the_actual_date.setSeconds(Integer.parseInt(the_whole_date.split("
	// ")[1].split(":")[2]));
	//
	// if (!((mapper.loginGetTimeToPunish() - calcTimeDiff(new Date(),
	// the_actual_date)) >= 0))
	// mapper.addLoginTrial(DateObj.format(myFormatObj), loginRequest.getEmail(),
	// user_ip, "1",
	// "1");
	//
	// } else if (loginTrials >= ((int) settings.get("input_1") + (int)
	// settings.get("input_2"))) {
	// mapper.disableUserLoginTrialExceeded(loginRequest.getEmail());
	// throw new CustomAllException("login-trial-exceeded");
	// } else {
	// mapper.addLoginTrial(DateObj.format(myFormatObj), loginRequest.getEmail(),
	// user_ip, "1", "1");
	// if (loginTrials + 1 >= ((int) settings.get("input_1") + (int)
	// settings.get("input_2"))) {
	// mapper.disableUserLoginTrialExceeded(loginRequest.getEmail());
	// mapper.clearLoginTrials(loginRequest.getEmail());
	// throw new CustomAllException("login-trial-exceeded");
	// }
	// }
	//
	// settings = mapper.getLoginTrialsSettings();
	//
	// System.out.println("settings: " + settings);
	//
	// loginTrials = mapper.getLoginTrials(loginRequest.getEmail());
	// System.out.println("fifth date: "
	// + mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"),
	// loginRequest.getEmail()));
	// System.out.println("login trials: " + loginTrials);
	//
	// throw new CustomAllException(loginTrials + "$"
	// + (loginTrials >= (int) settings.get("input_1") ?
	// mapper.getDateOfTheFifthLoginTrial(
	// settings.get("input_1"), loginRequest.getEmail()) : "null")
	// + "$" + settings.get("input_1") + "$" + settings.get("input_2") + "$"
	// + mapper.loginGetTimeToPunish() + "$" + "thisismymessagetotheworld" + "$"
	// + DateObj.format(myFormatObj));
	//
	// } else {
	// if (util.isUserDisabled(loginRequest.getEmail())) {
	// System.out.println("is user disabled.");
	// throw new CustomAllException("user_disabled");
	// } else
	// throw new CustomAllException("custom-bad-credentials");
	// }
	// } catch (Exception e) {
	// throw new ExceptionsList(e);
	// }
	// }
	//
	// }
	// This functionality is login
	@SuppressWarnings("deprecation")
	public Map<String, Object> login(LoginRequest loginRequest, HttpServletResponse httpServletResponse,
			HttpServletRequest request) {

		try {
			System.out.println("user name== " + loginRequest.getEmail().split("@")[0]);
			// authenticate from AD
			// List<Attributes> adUserDetails =
			// getADUserDetails(loginRequest.getEmail().split("@")[0],
			// loginRequest.getPassword());
			// System.out.println("here is ad user details " + adUserDetails);

			if (util.isPermitted_outside("login")) {
				System.out.println("isPermitted_outside: true");
				String user_ip = request.getRemoteAddr();
				System.out.println("user_ipppppppppppppppp first =" + user_ip);
				if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
					user_ip = InetAddress.getLocalHost().getHostAddress().toString();
				System.out.println("user_ipppppppppppppppp second =" + user_ip);
				System.out.println("before token generated");
				// Authentication authenticate = authenticationManager.authenticate(
				// new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
				// loginRequest.getPassword()));
				// SecurityContextHolder.getContext().setAuthentication(authenticate);
				System.out.println("after token generated");
				User user = mapper.findByUserName2(loginRequest.getEmail());
				RefreshToken refreshToken = new RefreshToken();
				refreshToken.setEmail(user.getEmail());
				Long refresh_token_id = mapper.addRefreshToken(refreshToken);

				String accessToken = jwtHelper.generateAccessToken(user);
				String refreshTokenString = jwtHelper.generateRefreshToken(user, refresh_token_id);
				System.out.println("Token generated: " + refreshTokenString);
				user.setPassword(null);
				Map<String, Object> json_response = new HashMap<String, Object>();
				// json_response.put("accessToken", accessToken);
				// json_response.put("refreshToken", refreshTokenString);
				json_response.put("user", user);

				CookieUtil.create(httpServletResponse, cookieName_access, accessToken, true, refreshTokenExpiration,
						"localhost");

				CookieUtil.create(httpServletResponse, cookieName_refresh, refreshTokenString, true,
						refreshTokenExpiration, "localhost");
				String[] roles = mapper.getRoleByUserId(user.getId());
				// System.out.println("here is the role === " + a);
				for (int i = 0; i < roles.length; i++) {
					if (util.isPermitted_outside_second(request, roles[i], "login", user.getEmail())) {
						System.out.println("isPermitted: true");
						util.registerLog(user.getId(), user_ip, loginRequest.getBrowser_type(),
								loginRequest.getBrowser_version(), "Login", "1", "1");
						mapper.clearLoginTrials(loginRequest.getEmail());
						return json_response;
					} else {
						System.out.println("isPermitted: false");
						return null;
					}
				}
				return null;

			} else {
				System.out.println("isPermitted_outside: false");
				return null;
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			try {
				if (util.doesUserExistByEmail(loginRequest.getEmail())) {
					String user_ip = request.getRemoteAddr();
					if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
						user_ip = InetAddress.getLocalHost().getHostAddress().toString();

					LocalDateTime DateObj = LocalDateTime.now();
					DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

					int loginTrials = mapper.getLoginTrials(loginRequest.getEmail());
					Map<String, Integer> settings = new HashMap<>();
					settings = mapper.getLoginTrialsSettings();

					if (loginTrials == (int) settings.get("input_1")) {

						String the_whole_date = mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"),
								loginRequest.getEmail());
						DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
						Date the_actual_date = format.parse(the_whole_date.split(" ")[0]);

						the_actual_date.setHours(Integer.parseInt(the_whole_date.split(" ")[1].split(":")[0]));
						the_actual_date.setMinutes(Integer.parseInt(the_whole_date.split(" ")[1].split(":")[1]));
						the_actual_date.setSeconds(Integer.parseInt(the_whole_date.split(" ")[1].split(":")[2]));

						if (!((mapper.loginGetTimeToPunish() - calcTimeDiff(new Date(), the_actual_date)) >= 0))
							mapper.addLoginTrial(DateObj.format(myFormatObj), loginRequest.getEmail(), user_ip, "1",
									"1");

					} else if (loginTrials >= ((int) settings.get("input_1") + (int) settings.get("input_2"))) {
						mapper.disableUserLoginTrialExceeded(loginRequest.getEmail());
						throw new CustomAllException("login-trial-exceeded");
					} else {
						mapper.addLoginTrial(DateObj.format(myFormatObj), loginRequest.getEmail(), user_ip, "1", "1");
						if (loginTrials + 1 >= ((int) settings.get("input_1") + (int) settings.get("input_2"))) {
							mapper.disableUserLoginTrialExceeded(loginRequest.getEmail());
							mapper.clearLoginTrials(loginRequest.getEmail());
							throw new CustomAllException("login-trial-exceeded");
						}
					}

					settings = mapper.getLoginTrialsSettings();

					System.out.println("settings: " + settings);

					loginTrials = mapper.getLoginTrials(loginRequest.getEmail());
					System.out.println("fifth date: "
							+ mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"), loginRequest.getEmail()));
					System.out.println("login trials: " + loginTrials);

					throw new CustomAllException(loginTrials + "$"
							+ (loginTrials >= (int) settings.get("input_1") ? mapper.getDateOfTheFifthLoginTrial(
									settings.get("input_1"), loginRequest.getEmail()) : "null")
							+ "$" + settings.get("input_1") + "$" + settings.get("input_2") + "$"
							+ mapper.loginGetTimeToPunish() + "$" + "thisismymessagetotheworld" + "$"
							+ DateObj.format(myFormatObj));

				} else {
					if (util.isUserDisabled(loginRequest.getEmail())) {
						System.out.println("is user disabled.");
						throw new CustomAllException("user_disabled");
					} else
						throw new CustomAllException("custom-bad-credentials");
				}
			} catch (Exception e) {
				throw new ExceptionsList(e);
			}
		}

	}

	public List<Attributes> getADUserDetails(String username, String password) {

		// Configure LDAP context source
		ldapTemplate.setContextSource(contextSource(username, password));

		// Define search controls
		SearchControls searchControls = new SearchControls();
		searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);

		List<Attributes> results = ldapTemplate.search("", "(samaccountname=" + username + ")",
				searchControls, (AttributesMapper<Attributes>) attrs -> attrs);

		return results;
	}

	private LdapContextSource contextSource(String username, String password) {
		LdapContextSource contextSource = new LdapContextSource();

		contextSource.setUrl("ldap");
		contextSource.setBase("dc=test,dc=local");
		contextSource.setUserDn(username + "@test.local");

		contextSource.setPassword(password);
		contextSource.setReferral("follow"); // Enable referral following
		contextSource.afterPropertiesSet(); // required
		return contextSource;
	}

	@SuppressWarnings("deprecation")
	public Map<String, Object> login_(LoginRequest loginRequest, HttpServletResponse httpServletResponse,
			HttpServletRequest request) {

		try {
			// String current_date =
			// LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
			// String password_change_date =
			// mapper.getPasswordChangeDate(loginRequest.getEmail());
			// LocalDate currentDate = LocalDate.parse(current_date,
			// DateTimeFormatter.ofPattern("yyyy/MM/dd"));
			// if(password_change_date != null) {
			// LocalDate passwordChangeDate = LocalDate.parse(password_change_date,
			// DateTimeFormatter.ofPattern("yyyy/MM/dd"));
			//
			// long diff = java.time.temporal.ChronoUnit.DAYS.between(passwordChangeDate,
			// currentDate);
			// System.out.println("here is the date difference " + diff);
			// if (diff > adminMapper.getPasswordExpiration()) {
			// mapper.update_firsttime_status(loginRequest.getEmail());
			// }
			// }
			// System.out.println("before authentication");
			// Authentication authenticate = authenticationManager.authenticate(
			// new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
			// loginRequest.getPassword()));
			// SecurityContextHolder.getContext().setAuthentication(authenticate);
			// List<Attributes> adUserDetails =
			// getADUserDetails(loginRequest.getEmail().split("@")[0],
			// loginRequest.getPassword());
			// List<Attributes> adUserDetails =
			// getADUserDetails(loginRequest.getEmail().split("@")[0],
			// loginRequest.getPassword());
			System.out.println("after authentication");
			User user = mapper.findByUserName2(loginRequest.getEmail());
			if (util.isPermitted_outside("login")) {

				System.out.println("isPermitted_outside: true");
				String user_ip = request.getRemoteAddr();
				if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
					user_ip = InetAddress.getLocalHost().getHostAddress().toString();
				RefreshToken refreshToken = new RefreshToken();
				refreshToken.setEmail(user.getEmail());
				mapper.logdoutfromOtherDevice(loginRequest.getEmail());
				Long refresh_token_id = mapper.addRefreshToken(refreshToken);

				String accessToken = jwtHelper.generateAccessToken(user);
				String refreshTokenString = jwtHelper.generateRefreshToken(user, refresh_token_id);
				System.out.println("Token generated: " + refreshTokenString);
				user.setPassword(null);
				Map<String, Object> json_response = new HashMap<String, Object>();
				// json_response.put("accessToken", accessToken);
				// json_response.put("refreshToken", refreshTokenString);
				json_response.put("user", user);

				CookieUtil.create(httpServletResponse, cookieName_access, accessToken, true, refreshTokenExpiration,
						"localhost");

				CookieUtil.create(httpServletResponse, cookieName_refresh, refreshTokenString, true,
						refreshTokenExpiration, "localhost");
				String[] roles = mapper.getRoleByUserId(user.getId());
				System.out.println("here is the role === ");
				for (int i = 0; i < roles.length; i++) {
					if (util.isPermitted_outside_second(request, roles[i], "login", user.getEmail())) {
						System.out.println("isPermitted: true");
						util.registerLog(user.getId(), user_ip, loginRequest.getBrowser_type(),
								loginRequest.getBrowser_version(), "Login", "1", "1");
						mapper.clearLoginTrials(loginRequest.getEmail());
						return json_response;
					} else {
						System.out.println("isPermitted: false");
						return null;
					}
				}
				return null;

			} else {
				System.out.println("isPermitted_outside: true");
				return null;
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			try {
				if (util.doesUserExistByEmail(loginRequest.getEmail())) {
					String user_ip = request.getRemoteAddr();
					if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
						user_ip = InetAddress.getLocalHost().getHostAddress().toString();

					LocalDateTime DateObj = LocalDateTime.now();
					DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

					int loginTrials = mapper.getLoginTrials(loginRequest.getEmail());
					Map<String, Integer> settings = new HashMap<>();
					settings = mapper.getLoginTrialsSettings();

					if (loginTrials == (int) settings.get("input_1")) {

						String the_whole_date = mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"),
								loginRequest.getEmail());
						DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
						Date the_actual_date = format.parse(the_whole_date.split(" ")[0]);

						the_actual_date.setHours(Integer.parseInt(the_whole_date.split(" ")[1].split(":")[0]));
						the_actual_date.setMinutes(Integer.parseInt(the_whole_date.split(" ")[1].split(":")[1]));
						the_actual_date.setSeconds(Integer.parseInt(the_whole_date.split(" ")[1].split(":")[2]));

						if (!((mapper.loginGetTimeToPunish() - calcTimeDiff(new Date(), the_actual_date)) >= 0))
							mapper.addLoginTrial(DateObj.format(myFormatObj), loginRequest.getEmail(), user_ip, "1",
									"1");

					} else if (loginTrials >= ((int) settings.get("input_1") + (int) settings.get("input_2"))) {
						mapper.disableUserLoginTrialExceeded(loginRequest.getEmail());
						throw new CustomAllException("login-trial-exceeded");
					} else {
						mapper.addLoginTrial(DateObj.format(myFormatObj), loginRequest.getEmail(), user_ip, "1", "1");
						if (loginTrials + 1 >= ((int) settings.get("input_1") + (int) settings.get("input_2"))) {
							mapper.disableUserLoginTrialExceeded(loginRequest.getEmail());
							mapper.clearLoginTrials(loginRequest.getEmail());
							throw new CustomAllException("login-trial-exceeded");
						}
					}

					settings = mapper.getLoginTrialsSettings();

					System.out.println("settings: " + settings);

					loginTrials = mapper.getLoginTrials(loginRequest.getEmail());
					System.out.println("fifth date: "
							+ mapper.getDateOfTheFifthLoginTrial(settings.get("input_1"), loginRequest.getEmail()));
					System.out.println("login trials: " + loginTrials);

					throw new CustomAllException(loginTrials + "$"
							+ (loginTrials >= (int) settings.get("input_1") ? mapper.getDateOfTheFifthLoginTrial(
									settings.get("input_1"), loginRequest.getEmail()) : "null")
							+ "$" + settings.get("input_1") + "$" + settings.get("input_2") + "$"
							+ mapper.loginGetTimeToPunish() + "$" + "thisismymessagetotheworld" + "$"
							+ DateObj.format(myFormatObj));

				} else {
					if (util.isUserDisabled(loginRequest.getEmail())) {
						System.out.println("is user disabled.");
						throw new CustomAllException("user_disabled");
					} else
						throw new CustomAllException("custom-bad-credentials");
				}
			} catch (Exception e) {
				throw new ExceptionsList(e);
			}
		}

	}

	public long calcTimeDiff(Date d1, Date d2) {
		return Math.abs(d1.getTime() - d2.getTime());
	}

	// This functionality is logout
	public boolean logout(HttpServletResponse httpServletResponse, HttpServletRequest request,
			LogoutRequest logoutRequest) {
		try {
			if (util.isPermitted_no_role(request, "logout")) {
				String user_ip = request.getRemoteAddr();
				if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
					user_ip = InetAddress.getLocalHost().getHostAddress().toString();
				String refreshTokenString = getRefreshToken(request);
				if (jwtHelper.validateRefreshToken(refreshTokenString)) {
					System.out
							.println("The id from token: " + jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
					if (null != mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString))) {
						mapper.deleteRefreshToken(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
						CookieUtil.clear(httpServletResponse, cookieName_access);
						CookieUtil.clear(httpServletResponse, cookieName_refresh);
						System.out.println("Logged out successfully!!!");
						util.registerLog(
								mapper.getUserIdByEmail(jwtHelper.getEmailFromAccessToken(getAccessToken(request))),
								user_ip, logoutRequest.getBrowser_type(), logoutRequest.getBrowser_version(), "Logout",
								"1", "1");
						return true;
					} else {
						System.out.println("refresh token does not exist in the database!!!");
					}
				} else {
					System.out.println("Validation of refresh token failed!!!");
				}
				throw new ExceptionsList(new BadCredentialsException("bad credentials"));
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean checkAccessTokenDoesNotExpired(HttpServletRequest request) {
		try {
			if (util.isPermitted_no_role(request, "login")) {
				return true;

			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);

		}
	}

	// This functionality is logout_all
	public boolean logoutAll(HttpServletResponse httpServletResponse, HttpServletRequest request,
			LogoutRequest logoutRequest) {
		try {
			if (util.isPermitted_no_role(request, "logout_all")) {
				String user_ip = request.getRemoteAddr();
				if (user_ip.equalsIgnoreCase("0:0:0:0:0:0:0:1"))
					user_ip = InetAddress.getLocalHost().getHostAddress().toString();
				String refreshTokenString = getRefreshToken(request);
				if (jwtHelper.validateRefreshToken(refreshTokenString)) {
					System.out
							.println("The id from token: " + jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
					if (null != mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString))) {
						String token_username = mapper
								.getEmailFromTokenId(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
						mapper.deleteRefreshTokenAll(token_username);
						CookieUtil.clear(httpServletResponse, cookieName_access);
						CookieUtil.clear(httpServletResponse, cookieName_refresh);
						System.out.println("Logged out of all sessions successfully!!!");
						util.registerLog(
								mapper.getUserIdByEmail(jwtHelper.getEmailFromAccessToken(getAccessToken(request))),
								user_ip, logoutRequest.getBrowser_type(), logoutRequest.getBrowser_version(),
								"Logout-all-sessions", "1", "1");
						return true;
					} else {
						System.out.println("refresh token does not exist in the database!!!");
					}
				} else {
					System.out.println("Validation of refresh token failed!!!");
				}
				throw new ExceptionsList(new BadCredentialsException("bad credentials"));
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	// ================================================================================

	public Boolean check_email(String email) {
		return mapper.check_email(email);
	}

	public boolean signup(RegisterActorDto registerRequest) {

		try {
			if (util.isPermitted_outside("signup")) {

				registerRequest.setStatus("1");
				registerRequest.setAvailability("1");
				registerRequest.setReg_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				return mapper.signup_(registerRequest);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception ex) {
			throw new ExceptionsList(ex);
		}
	}

	public Boolean check_username(String username) {
		return mapper.check_username(username);
	}

	public Boolean clearCookies(HttpServletResponse response, HttpServletRequest request) {
		String refreshTokenString = getRefreshToken(request);
		if (refreshTokenString != null) {
			// System.out.println("The id from token: " +
			// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
			// if (null !=
			// mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString)))
			// {
			// mapper.deleteRefreshToken(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
			CookieUtil.clear(response, cookieName_access);
			CookieUtil.clear(response, cookieName_refresh);
			System.out.println("Logged out successfully!!!");
			return true;
			// } else {
			// System.out.println("refresh token does not exist in the database!!!");
			// }
		} else {
			System.out.println("refresh token does not exist!!!");
		}
		throw new ExceptionsList(new BadCredentialsException("bad credentials"));
	}

	public Boolean refreshToken(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
		// String refreshTokenString = dto.getRefreshToken();
		try {
			System.out.println("refreshToken: in try{");
			String refreshTokenString = getRefreshToken(httpServletRequest);
			if (refreshTokenString != null && jwtHelper.validateRefreshToken(refreshTokenString)) {
				System.out.println("refreshToken: valid");
				if (null != mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString))) {
					// System.out.println("The id from token: " +
					// jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
					mapper.deleteRefreshToken(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));

					User user = mapper.findByUserName2(jwtHelper.getEmailFromRefreshToken(refreshTokenString));

					RefreshToken refreshToken = new RefreshToken();
					refreshToken.setEmail(user.getEmail());
					Long refresh_token_id = mapper.addRefreshToken(refreshToken);

					String accessToken = jwtHelper.generateAccessToken(user);
					String newRefreshTokenString = jwtHelper.generateRefreshToken(user, refresh_token_id);

					// user.setPassword(null);
					// Map<String, Object> json_response = new HashMap<String, Object>();
					//// json_response.put("accessToken", accessToken);
					//// json_response.put("refreshToken", refreshTokenString);
					// json_response.put("user", user);

					CookieUtil.clear(httpServletResponse, cookieName_access);
					CookieUtil.clear(httpServletResponse, cookieName_refresh);
					System.out.println("Path: " + httpServletRequest.getServletPath());
					CookieUtil.create(httpServletResponse, cookieName_access, accessToken, false,
							refreshTokenExpiration, "localhost");
					CookieUtil.create(httpServletResponse, cookieName_refresh, newRefreshTokenString, false,
							refreshTokenExpiration, "localhost");

					return true;
				} else {
					System.out.println("refresh token does not exist in the database!!!");
				}
			} else {
				System.out.println("Validation of refresh token failed!!!");
				return false;
			}
		} catch (Exception ex) {
			// throw new ExceptionsList(new BadCredentialsException("bad credentials"));
			throw new ExceptionsList(ex);
		}
		return false;
	}

	private String getAccessToken(HttpServletRequest request) {
		Cookie cookie = WebUtils.getCookie(request, cookieName_access);
		return cookie != null ? cookie.getValue() : null;
	}

	private String getRefreshToken(HttpServletRequest request) {
		Cookie cookie = WebUtils.getCookie(request, cookieName_refresh);
		return cookie != null ? cookie.getValue() : null;
	}

	public Optional<org.springframework.security.core.userdetails.User> getCurrentUser() {
		org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder
				.getContext().getAuthentication().getPrincipal();
		return Optional.of(principal);
	}

	public Map<String, Object> accessToken(TokenDto dto) {
		String refreshTokenString = dto.getRefreshToken();
		if (jwtHelper.validateRefreshToken(refreshTokenString)) {
			System.out.println("The id from token: " + jwtHelper.getTokenIdFromRefreshToken(refreshTokenString));
			if (null != mapper.tokenExists(jwtHelper.getTokenIdFromRefreshToken(refreshTokenString))) {
				Map<String, Object> tokenResponse = new HashMap<>();
				tokenResponse.put("username", jwtHelper.getEmailFromAccessToken(refreshTokenString));
				tokenResponse.put("accessToken", jwtHelper.generateAccessToken(
						mapper.findByUserName2(jwtHelper.getEmailFromAccessToken(refreshTokenString))));
				tokenResponse.put("refreshToken", refreshTokenString);
				return tokenResponse;

			} else {
				System.out.println("refresh token does not exist in the database!!!");
			}
		} else {
			System.out.println("Validation of refresh token failed!!!");
		}
		throw new ExceptionsList(new BadCredentialsException("bad credentials"));
	}

	@SuppressWarnings("unlikely-arg-type")
	public Boolean forgot_password(String email, HttpServletRequest request) {
		try {
			if (mapper.check_UserExistByEmail(email).isPresent()) {
				System.out.println("user exist with email=======> " + email);
				String password = generatePassword();
				if (util.isPermitted_outside("forget_password")) {
					mapper.update_firsttime_status(email);
					mapper.reset_password_on_forget_password(passwordEncoder.encode(password), email);
					sendemail_forgetPassword(email, password,
							DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					return true;
				} else {
					return false;
				}
			} else {
				throw new CustomAllException("email-does-not-exist");
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			throw new ExceptionsList(ex);
		}
	}

	String generatePassword() {
		return RandomStringUtils.randomAlphanumeric(11);
	}

	public void sendemail_forgetPassword(String email, String password, String reg_date) {

		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
			helper.setFrom(from);
			helper.setTo(email);
			helper.setSubject("AWASH BANK VENDOR MANAGEMENT SYSTEM Password");
			boolean html = true;
			if (html) {
				helper.setText(
						"<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='x-apple-disable-message-reformatting'><!--[if !mso]><!--><meta http-equiv='X-UA-Compatible' content='IE=edge'><!--<![endif]--><title></title><style type='text/css'>@media only screen and (min-width: 620px) {.u-row {width: 600px !important;}.u-row .u-col {vertical-align: top;}.u-row .u-col-100 {width: 600px !important;}}@media (max-width: 620px) {.u-row-container {max-width: 100% !important;padding-left: 0px !important;padding-right: 0px !important;}.u-row .u-col {min-width: 320px !important;max-width: 100% !important;display: block !important;}.u-row {width: 100% !important;}.u-col {width: 100% !important;}.u-col > div {margin: 0 auto;}}body {margin: 0;padding: 0;}table,tr,td {vertical-align: top;border-collapse: collapse;}p {margin: 0;}.ie-container table,.mso-container table {table-layout: fixed;}* {line-height: inherit;}a[x-apple-data-detectors='true'] {color: inherit !important;text-decoration: none !important;}table, td { color: #000000; } @media (max-width: 480px) { #u_content_image_2 .v-container-padding-padding { padding: 0px 0px 0px 0px !important; } #u_content_image_2 .v-src-width { width: auto !important; } #u_content_image_2 .v-src-max-width { max-width: 100% !important; } #u_content_heading_4 .v-font-size { font-size: 45px !important; } #u_content_heading_3 .v-container-padding-padding { padding: 0px 0px 0px !important; } #u_content_heading_3 .v-font-size { font-size: 26px !important; } #u_content_text_2 .v-container-padding-padding { padding: 20px 10px 40px !important; } }</style><!--[if !mso]><!--><link href='https://fonts.googleapis.com/css2?family=Federo&display=swap' rel='stylesheet' type='text/css'><!--<![endif]--></head><body class='clean-body u_body' style='margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000'><!--[if IE]><div class='ie-container'><![endif]--><!--[if mso]><div class='mso-container'><![endif]--><table style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%' cellpadding='0' cellspacing='0'><tbody><tr style='vertical-align: top'><td style='word-break: break-word;border-collapse: collapse !important;vertical-align: top'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='background-color: #ffffff;'><![endif]--><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='background-color: #273896;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='background-color: #273896;height: 100%;width: 100% !important;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;'><!--<![endif]--><table id='u_content_image_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:0px 0px 0px 0px;font-family:helvetica,sans-serif;' align='left'><table width='100%' cellpadding='0' cellspacing='0' border='0'></table></td></tr></tbody></table><table id='u_content_heading_4' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #ffffff; line-height: 100%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 40px; '><strong>AWASH BANK VENDOR MANAGeMENT SYSTEM</strong></h1></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--<![endif]--><table id='u_content_heading_3' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #fe9a37; line-height: 140%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 33px; '><strong>"
								+ reg_date
								+ "</strong></h1></td></tr></tbody></table><table id='u_content_text_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:20px 60px 60px;font-family:helvetica,sans-serif;' align='left'><div class='v-font-size' style='line-height: 140%; text-align: center; word-wrap: break-word;'><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'> Your password has been reset successfully!, and your password is</span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>PASSWORD:<strong> "
								+ password
								+ "</strong></span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>Please use your awash outlook address and this password to login into AWASH BANK VENDOR MANAGEMENT SYSTEM.</span></p></div></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if mso]></div><![endif]--><!--[if IE]></div><![endif]--></body></html>",
						true);
			} else {
				helper.setText(password);
			}
			mailSender.send(mimeMessage);
			System.out.println("Email sending complete.");
		} catch (MailSendException | MessagingException e) {
			throw new CustomAllException(outlookException);
		}
	}

	public boolean capture(HttpServletRequest request, byte[] photo) {
		mapper.photo(util.get_user_id(request), photo);
		return true;
	}

	public boolean update_user_detail(HttpServletRequest request, Users user) {
		mapper.update_user_detail(user);
		return true;
	}

	public RefreshToken getEmail(HttpServletRequest request) {
		try {
			return mapper.getRemark(util.get_user_id(request));
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}

	}

	public int numberOfDay(HttpServletRequest request) {
		String current_date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
		String password_change_date = mapper.getPasswordChangeDate(util.getUserEmail(request));
		// Parse dates as LocalDate
		long diff = 0;
		LocalDate currentDate = LocalDate.parse(current_date, DateTimeFormatter.ofPattern("yyyy/MM/dd"));
		if (password_change_date != null) {
			LocalDate passwordChangeDate = LocalDate.parse(password_change_date,
					DateTimeFormatter.ofPattern("yyyy/MM/dd"));
			// Calculate the difference in days
			diff = java.time.temporal.ChronoUnit.DAYS.between(passwordChangeDate, currentDate);
		}
		return (int) diff;
	}

}
