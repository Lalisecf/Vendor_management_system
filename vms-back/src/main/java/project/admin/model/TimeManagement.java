package project.admin.model;

public class TimeManagement {
	private int idle_time;
	private int password_expiration;
	private int login_trial;
	
	public TimeManagement() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TimeManagement(int idle_time, int password_expiration, int login_trial) {
		super();
		this.idle_time = idle_time;
		this.password_expiration = password_expiration;
		this.login_trial = login_trial;
	}

	public int getIdle_time() {
		return idle_time;
	}

	public void setIdle_time(int idle_time) {
		this.idle_time = idle_time;
	}

	public int getPassword_expiration() {
		return password_expiration;
	}

	public void setPassword_expiration(int password_expiration) {
		this.password_expiration = password_expiration;
	}

	public int getLogin_trial() {
		return login_trial;
	}

	public void setLogin_trial(int login_trial) {
		this.login_trial = login_trial;
	}
	
	

}
