package project.dto;

import java.util.Collection;

import lombok.Data;
import project.model.Rights;
import project.model.Roles;

@Data
public class RegisterRequest {


	private Long id;
	private String fullname;
	private String username;
	private String password;
	private String type;
	private String class_level;
	private String gender;
	private Long profile;
	private int status;
	
	private Collection<Roles> roles;

	private Collection<Rights> rights;

	public RegisterRequest() {
	}

	public RegisterRequest(Long id, String fullname, String username, String password, String type, String class_level,
			String gender, Long profile, int status, Collection<Roles> roles,
			Collection<Rights> rights) {
		super();
		this.id = id;
		this.fullname = fullname;
		this.username = username;
		this.password = password;
		this.type = type;
		this.class_level = class_level;
		this.gender = gender;
		this.profile = profile;
		this.status = status;
		this.roles = roles;
		this.rights = rights;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getClass_level() {
		return class_level;
	}

	public void setClass_level(String class_level) {
		this.class_level = class_level;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Long getProfile() {
		return profile;
	}

	public void setProfile(Long profile) {
		this.profile = profile;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}


	public Collection<Roles> getRoles() {
		return roles;
	}

	public void setRoles(Collection<Roles> roles) {
		this.roles = roles;
	}

	public Collection<Rights> getRights() {
		return rights;
	}

	public void setRights(Collection<Rights> rights) {
		this.rights = rights;
	}


}
