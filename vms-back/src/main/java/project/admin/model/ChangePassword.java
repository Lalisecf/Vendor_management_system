package project.admin.model;

public class ChangePassword {
	
	private Long user_id;
	private String oldpassword;
	private String newpassword;
	private String confirmpassword;
	
	public ChangePassword() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ChangePassword(Long user_id, String oldpassword, String newpassword, String confirmpassword) {
		super();
		this.user_id = user_id;
		this.oldpassword = oldpassword;
		this.newpassword = newpassword;
		this.confirmpassword = confirmpassword;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public String getOldpassword() {
		return oldpassword;
	}

	public void setOldpassword(String oldpassword) {
		this.oldpassword = oldpassword;
	}

	public String getNewpassword() {
		return newpassword;
	}

	public void setNewpassword(String newpassword) {
		this.newpassword = newpassword;
	}

	public String getConfirmpassword() {
		return confirmpassword;
	}

	public void setConfirmpassword(String confirmpassword) {
		this.confirmpassword = confirmpassword;
	}
	
	
}
