package project.maker.model;

import java.util.List;

public class Payments {
	private Long id;
	private String paid_date;
	private String confirmation_document;
	private double paid_amount;
	private String date;
	private String payment_contigency;
	private double amount_per_contigency;
	private String status;
	private String request_type;
	private String payment_description;
	public Payments() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Payments(Long id, String paid_date, String confirmation_document, double paid_amount, String date,
			String payment_contigency, double amount_per_contigency, String status, String request_type, String payment_description) {
		super();
		this.id = id;
		this.paid_date = paid_date;
		this.confirmation_document = confirmation_document;
		this.paid_amount = paid_amount;
		this.date = date;
		this.payment_contigency = payment_contigency;
		this.amount_per_contigency = amount_per_contigency;
		this.status = status;
		this.request_type = request_type;
		this.payment_description=payment_description;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getPaid_date() {
		return paid_date;
	}
	public void setPaid_date(String paid_date) {
		this.paid_date = paid_date;
	}
	public String getConfirmation_document() {
		return confirmation_document;
	}
	public void setConfirmation_document(String confirmation_document) {
		this.confirmation_document = confirmation_document;
	}
	public double getPaid_amount() {
		return paid_amount;
	}
	public void setPaid_amount(double paid_amount) {
		this.paid_amount = paid_amount;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
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
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getRequest_type() {
		return request_type;
	}
	public void setRequest_type(String request_type) {
		this.request_type = request_type;
	}
	public String getPayment_description() {
		return payment_description;
	}
	public void setPayment_description(String payment_description) {
		this.payment_description = payment_description;
	}
	

}
