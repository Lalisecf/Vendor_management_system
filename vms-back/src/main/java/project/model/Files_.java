package project.model;

import lombok.Data;

@Data
public class Files_ {

	private Long id;
	private String name;
	private String path;
	private String original_file_name;
	private String file_type;
	private String usage_type;
	private String upload_date;
	private String status;
	private String availability;
	private String type;
	public Files_() {
	}
	public Files_(Long id, String name, String path, String original_file_name, String file_type, String usage_type,
			String upload_date, String status, String availability, String type) {
		super();
		this.id = id;
		this.name = name;
		this.path = path;
		this.original_file_name = original_file_name;
		this.file_type = file_type;
		this.usage_type = usage_type;
		this.upload_date = upload_date;
		this.status = status;
		this.availability = availability;
		this.type = type;
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
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getOriginal_file_name() {
		return original_file_name;
	}
	public void setOriginal_file_name(String original_file_name) {
		this.original_file_name = original_file_name;
	}
	public String getFile_type() {
		return file_type;
	}
	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}
	public String getUsage_type() {
		return usage_type;
	}
	public void setUsage_type(String usage_type) {
		this.usage_type = usage_type;
	}
	public String getUpload_date() {
		return upload_date;
	}
	public void setUpload_date(String upload_date) {
		this.upload_date = upload_date;
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
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

}
