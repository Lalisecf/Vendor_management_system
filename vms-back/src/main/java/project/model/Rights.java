package project.model;

import lombok.Data;

@Data
public class Rights extends BaseModel {

	private String code;
	private String description;
	private String status;

	public Rights(Long id) {
		super(id);
		// TODO Auto-generated constructor stub
	}

	public Rights(Long id, String code, String description, String status) {
		super(id);
		this.code = code;
		this.description = description;
		this.status = status;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
