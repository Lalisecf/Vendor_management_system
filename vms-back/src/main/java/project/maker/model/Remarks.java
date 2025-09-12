package project.maker.model;

public class Remarks {
	private Long id;
	private String title;
	private String description;
	private String created_date;
	private String created_by;
	private String email;
	private String status;
	private String availability;
	public Remarks() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Remarks(Long id, String title, String description, String created_date, String created_by, String email,
			String status, String availability) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.created_date = created_date;
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
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCreated_date() {
		return created_date;
	}
	public void setCreated_date(String created_date) {
		this.created_date = created_date;
	}
	public String getCreated_by() {
		return created_by;
	}
	public void setCreated_by(String created_by) {
		this.created_by = created_by;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
