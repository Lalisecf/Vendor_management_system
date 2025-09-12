package project.admin.model;

public class Functionality {

	private Long id;
	private String name;
	private String Description;
	private String status;
	private String status_all;

	public Functionality(Long id, String name, String description, String status, String status_all) {
		super();
		this.id = id;
		this.name = name;
		Description = description;
		this.status = status;
		this.status_all = status_all;
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
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStatus_all() {
		return status_all;
	}

	public void setStatus_all(String status_all) {
		this.status_all = status_all;
	}

}
