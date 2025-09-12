package project.admin.model;

public class Role {
	private Long id;
	private String name;
	private String description;
	private String status;
	private String availability;
	public Role() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Role(Long id, String name, String description, String status, String availability) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.status = status;
		this.availability = availability;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
