package project.maker.model;

public class ReportPayment {
	private Long contract_id;
	private String vendor_name;
	private String payment_number;
	private String expected_date;
	private String paid_date;
	private double paid_amount;
	private String payment_contigency;
	private double amount_per_contigency;
	private String payment_frequency;
	private String payment_description;
	private String payment_end_date;
	private String status;
	public ReportPayment() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ReportPayment(Long contract_id, String vendor_name, String payment_number, String expected_date,
			String paid_date, double paid_amount, String payment_contigency, double amount_per_contigency, String payment_frequency,
			String payment_description, String payment_end_date, String status) {
		super();
		this.contract_id = contract_id;
		this.vendor_name = vendor_name;
		this.payment_number = payment_number;
		this.expected_date = expected_date;
		this.paid_date = paid_date;
		this.paid_amount = paid_amount;
		this.payment_contigency = payment_contigency;
		this.amount_per_contigency = amount_per_contigency;
		this.payment_frequency=payment_frequency;
		this.payment_description = payment_description;
		this.payment_end_date=payment_end_date;
		this.status = status;
	}
	public Long getContract_id() {
		return contract_id;
	}
	public void setContract_id(Long contract_id) {
		this.contract_id = contract_id;
	}
	public String getVendor_name() {
		return vendor_name;
	}
	public void setVendor_name(String vendor_name) {
		this.vendor_name = vendor_name;
	}
	public String getPayment_number() {
		return payment_number;
	}
	public void setPayment_number(String payment_number) {
		this.payment_number = payment_number;
	}
	public String getExpected_date() {
		return expected_date;
	}
	public void setExpected_date(String expected_date) {
		this.expected_date = expected_date;
	}
	public String getPaid_date() {
		return paid_date;
	}
	public void setPaid_date(String paid_date) {
		this.paid_date = paid_date;
	}
	public double getPaid_amount() {
		return paid_amount;
	}
	public void setPaid_amount(double paid_amount) {
		this.paid_amount = paid_amount;
	}
	public String getPayment_contigency() {
		return payment_contigency;
	}
	public void setPayment_contigency(String payment_contigency) {
		this.payment_contigency = payment_contigency;
	}
	public double getAmount_per_contigency() {
		return amount_per_contigency;
	}
	public void setAmount_per_contigency(double amount_per_contigency) {
		this.amount_per_contigency = amount_per_contigency;
	}
	
	public String getPayment_frequency() {
		return payment_frequency;
	}
	public void setPayment_frequency(String payment_frequency) {
		this.payment_frequency = payment_frequency;
	}
	public String getPayment_description() {
		return payment_description;
	}
	public void setPayment_description(String payment_description) {
		this.payment_description = payment_description;
	}
	public String getStatus() {
		return status;
	}
	public String getPayment_end_date() {
		return payment_end_date;
	}
	public void setPayment_end_date(String payment_end_date) {
		this.payment_end_date = payment_end_date;
	}
	public void setStatus(String status) {
		this.status = status;
	}

}
