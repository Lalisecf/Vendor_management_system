package project.admin.model;

public class UserName {
	private String name;
	private int days;
	private int passwordExpiration;
	public UserName() {
		super();
		// TODO Auto-generated constructor stub
	}
	public UserName(String name, int days, int passwordExpiration) {
		super();
		this.name = name;
		this.days = days;
		this.passwordExpiration=passwordExpiration;
		
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getDays() {
		return days;
	}
	public void setDays(int days) {
		this.days = days;
	}
	public int getPasswordExpiration() {
		return passwordExpiration;
	}
	public void setPasswordExpiration(int passwordExpiration) {
		this.passwordExpiration = passwordExpiration;
	}	
	
}
