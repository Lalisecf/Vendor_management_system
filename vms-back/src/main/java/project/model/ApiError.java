package project.model;

import java.time.LocalDateTime;

public class ApiError {

	private String status;
	private String message;
	private String trace_id;
	private String instance;
	private String help;
	private LocalDateTime timeStamp;

	public ApiError() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ApiError(String status, String message, String trace_id, String instance, String help,
			LocalDateTime timeStamp) {
		super();
		this.status = status;
		this.message = message;
		this.trace_id = trace_id;
		this.instance = instance;
		this.help = help;
		this.timeStamp = timeStamp;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getTrace_id() {
		return trace_id;
	}

	public void setTrace_id(String trace_id) {
		this.trace_id = trace_id;
	}

	public String getInstance() {
		return instance;
	}

	public void setInstance(String instance) {
		this.instance = instance;
	}

	public String getHelp() {
		return help;
	}

	public void setHelp(String help) {
		this.help = help;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}

}
