package project.maker.model;

public class Reasons {
	private Long id;
	private String reason;
	private String date;
	private String created_by;
	private String email;
	private String status;
	private String availability;

	public Reasons() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Reasons(Long id, String reason, String date, String created_by, String email, String status,
			String availability) {
		super();
		this.id = id;
		this.reason = reason;
		this.date = date;
		this.created_by = created_by;
		this.email = email;
		this.status = status;
		this.availability = availability;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getCreated_by() {
		return created_by;
	}

	public void setCreated_by(String created_by) {
		this.created_by = created_by;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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

}
