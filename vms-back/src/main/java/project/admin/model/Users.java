package project.admin.model;

public class Users {

	private Long id;
	private String firstname;
	private String middlename;
	private String lastname;
	private String gender;
	private String email;
	private byte[] photo;
	private String phonenumber;
	private String reg_date;
	 private String action_date;
	private String role;
	private String status;
	private String availability;
	public Users() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Users(Long id, String firstname, String middlename, String lastname, String gender, String email,
			byte[] photo, String phonenumber, String reg_date, String action_date, String role, String status,
			String availability) {
		super();
		this.id = id;
		this.firstname = firstname;
		this.middlename = middlename;
		this.lastname = lastname;
		this.gender = gender;
		this.email = email;
		this.photo = photo;
		this.phonenumber = phonenumber;
		this.reg_date = reg_date;
		this.action_date = action_date;
		this.role = role;
		this.status = status;
		this.availability = availability;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public byte[] getPhoto() {
		return photo;
	}
	public void setPhoto(byte[] photo) {
		this.photo = photo;
	}
	public String getPhonenumber() {
		return phonenumber;
	}
	public void setPhonenumber(String phonenumber) {
		this.phonenumber = phonenumber;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
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

	public String getAction_date() {
		return action_date;
	}

	public void setAction_date(String action_date) {
		this.action_date = action_date;
	}


}

/*
 * 
 * role!: string; status!: string; availability!: string;
 */