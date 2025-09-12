package project.admin.model;

import java.util.List;

import project.model.Roles;

public class Logs {
	private Long id;
	private String activity;
	private String browser_type;
	private String browser_version;
	private String ip;
	private String date_all;
	private String date;
	private String time;
	private String status;
	private String availability;
	
	private String firstname;
	private String middlename;
	private String lastname;
	private String gender;
	private String email;
	private String role;
	private List<Roles> roles;
	
	private String user;
	
	public Logs() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Logs(Long id, String activity, String browser_type, String browser_version, String ip, String date_all,
			String date, String time, String status, String availability, String firstname, String middlename,
			String lastname, String gender, String email, String role, List<Roles> roles, String user) {
		super();
		this.id = id;
		this.activity = activity;
		this.browser_type = browser_type;
		this.browser_version = browser_version;
		this.ip = ip;
		this.date_all = date_all;
		this.date = date;
		this.time = time;
		this.status = status;
		this.availability = availability;
		this.firstname = firstname;
		this.middlename = middlename;
		this.lastname = lastname;
		this.gender = gender;
		this.email = email;
		this.role = role;
		this.roles = roles;
		this.user = user;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	public String getBrowser_type() {
		return browser_type;
	}

	public void setBrowser_type(String browser_type) {
		this.browser_type = browser_type;
	}

	public String getBrowser_version() {
		return browser_version;
	}

	public void setBrowser_version(String browser_version) {
		this.browser_version = browser_version;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getDate_all() {
		return date_all;
	}

	public void setDate_all(String date_all) {
		this.date_all = date_all;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAvailability() {
		return availability;
	}

	public void setAvailability(String availability) {
		this.availability = availability;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getMiddlename() {
		return middlename;
	}

	public void setMiddlename(String middlename) {
		this.middlename = middlename;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public List<Roles> getRoles() {
		return roles;
	}

	public void setRoles(List<Roles> roles) {
		this.roles = roles;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

}
