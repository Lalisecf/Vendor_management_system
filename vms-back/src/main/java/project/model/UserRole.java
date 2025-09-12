package project.model;

public class UserRole {
	private Long user_id;
	private Long role_id;

	public UserRole() {
	}

	public UserRole(Long id, Long user_id, Long role_id) {
		this.user_id = user_id;
		this.role_id = role_id;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public Long getRole_id() {
		return role_id;
	}

	public void setRole_id(Long role_id) {
		this.role_id = role_id;
	}

}
