package project.dto;

import lombok.Data;

@Data
public class LogoutRequest {

	private String browser_type;
	private String browser_version;
	
	public LogoutRequest() {}

	public LogoutRequest(String browser_type, String browser_version) {
		super();
		this.browser_type = browser_type;
		this.browser_version = browser_version;
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

}
