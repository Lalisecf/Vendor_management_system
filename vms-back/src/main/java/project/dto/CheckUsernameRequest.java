package project.dto;

import lombok.Data;

@Data
public class CheckUsernameRequest {
	private String username;

	public CheckUsernameRequest() {
	}

	public CheckUsernameRequest(String username) {
		super();
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
