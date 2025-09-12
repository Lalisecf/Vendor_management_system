package project.model;

import org.springframework.context.annotation.Configuration;

@Configuration


public class Currencyy{
  	private Long id;
 	private String name;
 	private String code;
 	private String description;
 	private String created_date;
 	private String type;
 	private String status;
 	private String availability;
 	private String request_status;
 	
 	public Currencyy() {
 		
 	}

	public Currencyy(Long id, String name, String code, String description, String created_date, String type,
			String status, String availability, String request_status) {
		super();
		this.id = id;
		this.name = name;
		this.code = code;
		this.description = description;
		this.created_date = created_date;
		this.type = type;
		this.status = status;
		this.availability = availability;
		this.request_status = request_status;
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
	
	 
	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
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

	public String getRequest_status() {
		return request_status;
	}

	public void setRequest_status(String request_status) {
		this.request_status = request_status;
	}
	
	 
}
