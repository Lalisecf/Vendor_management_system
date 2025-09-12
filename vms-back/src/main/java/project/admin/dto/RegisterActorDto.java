package project.admin.dto;

import lombok.Data;

@Data
public class RegisterActorDto {

	private Long id;
	private String firstname;
	private String middlename;
	private String password;
	private String lastname;
	private String email;
	private String gender;
	private String phonenumber;
	private String role;
	private String status;
	private String availability;
	private String reg_date;

	public RegisterActorDto() {
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

	public RegisterActorDto(Long id, String firstname, String middlename, String password, String lastname,
			String email, String gender, String phonenumber, String role, String status, String availability,
			String reg_date) {
		super();
		this.id = id;
		this.firstname = firstname;
		this.middlename = middlename;
		this.password = password;
		this.lastname = lastname;
		this.email = email;
		this.gender = gender;
		this.phonenumber = phonenumber;
		this.role = role;
		this.status = status;
		this.availability = availability;
		this.reg_date = reg_date;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getPhonenumber() {
		return phonenumber;
	}

	public void setPhonenumber(String phonenumber) {
		this.phonenumber = phonenumber;
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



	public String getReg_date() {
		return reg_date;
	}



	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	

}
