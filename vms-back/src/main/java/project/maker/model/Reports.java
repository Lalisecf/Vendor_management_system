package project.maker.model;

public class Reports {
	private Long id;
	private String contract_start_date_min;
	private String  contract_start_date_max;
	private String contract_end_date_min;
	private String  contract_end_date_max;
	private String  contract_payment_frequency;
	private String  contract_payment_date_min;
	private String contract_payment_date_max;
	private String type;
	private String vendor;
	public Reports() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Reports(Long id, String contract_start_date_min, String contract_start_date_max,
			String contract_end_date_min, String contract_end_date_max, String contract_payment_frequency,
			String contract_payment_date_min, String contract_payment_date_max, String type,String vendor) {
		super();
		this.id = id;
		this.contract_start_date_min = contract_start_date_min;
		this.contract_start_date_max = contract_start_date_max;
		this.contract_end_date_min = contract_end_date_min;
		this.contract_end_date_max = contract_end_date_max;
		this.contract_payment_frequency = contract_payment_frequency;
		this.contract_payment_date_min = contract_payment_date_min;
		this.contract_payment_date_max = contract_payment_date_max;
		this.type = type;
		this.vendor= vendor;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getContract_start_date_min() {
		return contract_start_date_min;
	}
	public void setContract_start_date_min(String contract_start_date_min) {
		this.contract_start_date_min = contract_start_date_min;
	}
	public String getContract_start_date_max() {
		return contract_start_date_max;
	}
	public void setContract_start_date_max(String contract_start_date_max) {
		this.contract_start_date_max = contract_start_date_max;
	}
	public String getContract_end_date_min() {
		return contract_end_date_min;
	}
	public void setContract_end_date_min(String contract_end_date_min) {
		this.contract_end_date_min = contract_end_date_min;
	}
	public String getContract_end_date_max() {
		return contract_end_date_max;
	}
	public void setContract_end_date_max(String contract_end_date_max) {
		this.contract_end_date_max = contract_end_date_max;
	}
	public String getContract_payment_frequency() {
		return contract_payment_frequency;
	}
	public void setContract_payment_frequency(String contract_payment_frequency) {
		this.contract_payment_frequency = contract_payment_frequency;
	}
	public String getContract_payment_date_min() {
		return contract_payment_date_min;
	}
	public void setContract_payment_date_min(String contract_payment_date_min) {
		this.contract_payment_date_min = contract_payment_date_min;
	}
	public String getContract_payment_date_max() {
		return contract_payment_date_max;
	}
	public void setContract_payment_date_max(String contract_payment_date_max) {
		this.contract_payment_date_max = contract_payment_date_max;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getVendor() {
		return vendor;
	}
	public void setVendor(String vendor) {
		this.vendor = vendor;
	}
	
	

}
