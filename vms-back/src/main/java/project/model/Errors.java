package project.model;

import java.time.LocalDateTime;

public class Errors {
	private Long id;
	private LocalDateTime timeStamp;
	private String status;
	private String message;
	private String traceId;
	private String type;
	private String cause;
	private String localizedMessage;
	private String instance;
	private String help;
	private String stackTrace;

	public Errors() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Errors(Long id, LocalDateTime timeStamp, String status, String message, String traceId, String type,
			String cause, String localizedMessage, String instance, String help, String stackTrace) {
		super();
		this.id = id;
		this.timeStamp = timeStamp;
		this.status = status;
		this.message = message;
		this.traceId = traceId;
		this.type = type;
		this.cause = cause;
		this.localizedMessage = localizedMessage;
		this.instance = instance;
		this.help = help;
		this.stackTrace = stackTrace;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
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

	public String getTraceId() {
		return traceId;
	}

	public void setTraceId(String traceId) {
		this.traceId = traceId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCause() {
		return cause;
	}

	public void setCause(String cause) {
		this.cause = cause;
	}

	public String getLocalizedMessage() {
		return localizedMessage;
	}

	public void setLocalizedMessage(String localizedMessage) {
		this.localizedMessage = localizedMessage;
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

	public String getStackTrace() {
		return stackTrace;
	}

	public void setStackTrace(String stackTrace) {
		this.stackTrace = stackTrace;
	}

}
