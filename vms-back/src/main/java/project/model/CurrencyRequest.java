package project.model;

public class CurrencyRequest {
	private Long id;
 	private String name;
 	private String code;
 	private String type;
 	private String description;
 	private String created_date;
 	private String status;
 	private String availability;
 	
 	public CurrencyRequest(){
	
 	}

	public CurrencyRequest(Long id, String name, String code, String type, String description, String created_date,
			String status, String availability) {
		super();
		this.id = id;
		this.name = name;
		this.code = code;
		this.type = type;
		this.description = description;
		this.created_date = created_date;
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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
