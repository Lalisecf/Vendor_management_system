package project.model;

public class Comment {
	private Long id;
	private String title;
	private Double amount_difference;
	private String description;
	private String availiblity;
	private String status;
	
	public Comment() {}

	public Comment(Long id, String title, Double amount_difference, String description, String availiblity,
			String status) {
		super();
		this.id = id;
		this.title = title;
		this.amount_difference = amount_difference;
		this.description = description;
		this.availiblity = availiblity;
		this.status = status;
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

	public Double getAmount_difference() {
		return amount_difference;
	}

	public void setAmount_difference(Double amount_difference2) {
		this.amount_difference = amount_difference2;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAvailiblity() {
		return availiblity;
	}

	public void setAvailiblity(String availiblity) {
		this.availiblity = availiblity;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	

}
