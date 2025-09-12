package project.model;

public class Remark {
	private Long id;
	private String title;
	private String description;
	private String create_date;
	private String status;
	private String availability;
	
	public Remark() {
		
	}

	public Remark(Long id, String title, String description, String create_date, String status, String availability) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.create_date = create_date;
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

	public String getCreate_date() {
		return create_date;
	}

	public void setCreate_date(String create_date) {
		this.create_date = create_date;
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
