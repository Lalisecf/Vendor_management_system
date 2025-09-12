package project.maker.model;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class Contract {
	private Long id;
	private String contract_title;
	private Long vendor_id;
	private String product_id;
	private String service_id;
	private String contract_type;
	private String directorate;
	private String start_date;
	private String end_date;
	private double total_amount;
	private String renewal_termination_option;
	private MultipartFile security_document;
	private String security_document_descreption;
	private MultipartFile compliance_document;
	private String payment_deccription;
	private String payment_method;
	private String payment_frequency;
	private String currency;
	private String vat;
	private String sla;
	private double bond_amount;
	private String bond_expiry_date;
	private String issuer_bank;
	private double amount_per_frequency;
	private double late_penality_fee;
	private String payment_status;
	private String pending_payment_status;
	private String payment_term_condition;
	private String payment_start_date;
	private String payment_end_date;
	private String payment_condition;
	private MultipartFile payment_confirmation_document;
	private MultipartFile contract_document_document;
	private MultipartFile SLA_document;
	private String SLA_path;
	private String SLA_description;
	private double phase1;
	private double phase2;
	private double phase3;
	private double phase4;
	private double phase5;
	private String phases_description;
	private double paid_amount;
	private String date;
	private String payment_contigency;
	private double amount_per_contigency;
	private String confirmation_path;
	private String security_path;
	private String contract_path;
	private String contract_registration_date;
	private Long contract_id;
	private List<Payment> payments;
	private String request_type;
	private String requested_by;
	private String approved_by;
	private String request_date;
	private String approved_date;

	public Contract() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Contract(Long id, String contract_title, Long vendor_id, String product_id, String service_id,
			String contract_type,
			String directorate,
			String start_date, String end_date, double total_amount, String renewal_termination_option,
			MultipartFile security_document, String security_document_descreption, MultipartFile compliance_document,
			String payment_deccription, String payment_method, String payment_frequency, String currency,
			String vat, String sla, double bond_amount, String bond_expiry_date, String issuer_bank,
			double amount_per_frequency, double late_penality_fee, String payment_status, String pending_payment_status,
			String payment_term_condition, String payment_start_date, String payment_end_date, String payment_condition,
			MultipartFile payment_confirmation_document, MultipartFile contract_document_document,
			MultipartFile sLA_document, String sLA_path, String sLA_description, double phase1, double phase2,
			double phase3, double phase4, double phase5, String phases_description, double paid_amount, String date,
			String payment_contigency, double amount_per_contigency, String confirmation_path, String security_path,
			String contract_path, String contract_registration_date, Long contract_id, List<Payment> payments,
			String request_type, String requested_by, String approved_by, String request_date, String approved_date) {
		super();
		this.id = id;
		this.contract_title = contract_title;
		this.vendor_id = vendor_id;
		this.product_id = product_id;
		this.service_id = service_id;
		this.contract_type = contract_type;
		this.directorate = directorate;
		this.start_date = start_date;
		this.end_date = end_date;
		this.total_amount = total_amount;
		this.renewal_termination_option = renewal_termination_option;
		this.security_document = security_document;
		this.security_document_descreption = security_document_descreption;
		this.compliance_document = compliance_document;
		this.payment_deccription = payment_deccription;
		this.payment_method = payment_method;
		this.payment_frequency = payment_frequency;
		this.currency = currency;
		this.vat = vat;
		this.sla = sla;
		this.bond_amount = bond_amount;
		this.bond_expiry_date = bond_expiry_date;
		this.issuer_bank = issuer_bank;
		this.amount_per_frequency = amount_per_frequency;
		this.late_penality_fee = late_penality_fee;
		this.payment_status = payment_status;
		this.pending_payment_status = pending_payment_status;
		this.payment_term_condition = payment_term_condition;
		this.payment_start_date = payment_start_date;
		this.payment_end_date = payment_end_date;
		this.payment_condition = payment_condition;
		this.payment_confirmation_document = payment_confirmation_document;
		this.contract_document_document = contract_document_document;
		SLA_document = sLA_document;
		SLA_path = sLA_path;
		SLA_description = sLA_description;
		this.phase1 = phase1;
		this.phase2 = phase2;
		this.phase3 = phase3;
		this.phase4 = phase4;
		this.phase5 = phase5;
		this.phases_description = phases_description;
		this.paid_amount = paid_amount;
		this.date = date;
		this.payment_contigency = payment_contigency;
		this.amount_per_contigency = amount_per_contigency;
		this.confirmation_path = confirmation_path;
		this.security_path = security_path;
		this.contract_path = contract_path;
		this.contract_registration_date = contract_registration_date;
		this.contract_id = contract_id;
		this.payments = payments;
		this.request_type = request_type;
		this.requested_by = requested_by;
		this.approved_by = approved_by;
		this.request_date = request_date;
		this.approved_date = approved_date;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContract_title() {
		return contract_title;
	}

	public void setContract_title(String contract_title) {
		this.contract_title = contract_title;
	}

	public Long getVendor_id() {
		return vendor_id;
	}

	public void setVendor_id(Long vendor_id) {
		this.vendor_id = vendor_id;
	}

	public String getProduct_id() {
		return product_id;
	}

	public void setProduct_id(String product_id) {
		this.product_id = product_id;
	}

	public String getService_id() {
		return service_id;
	}

	public void setService_id(String service_id) {
		this.service_id = service_id;
	}

	public String getContract_type() {
		return contract_type;
	}

	public void setContract_type(String contract_type) {
		this.contract_type = contract_type;
	}

	public String getDirectorate() {
		return directorate;
	}

	public void setDirectorate(String directorate) {
		this.directorate = directorate;
	}

	public String getStart_date() {
		return start_date;
	}

	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}

	public String getEnd_date() {
		return end_date;
	}

	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}

	public double getTotal_amount() {
		return total_amount;
	}

	public void setTotal_amount(double total_amount) {
		this.total_amount = total_amount;
	}

	public String getRenewal_termination_option() {
		return renewal_termination_option;
	}

	public void setRenewal_termination_option(String renewal_termination_option) {
		this.renewal_termination_option = renewal_termination_option;
	}

	public MultipartFile getSecurity_document() {
		return security_document;
	}

	public void setSecurity_document(MultipartFile security_document) {
		this.security_document = security_document;
	}

	public String getSecurity_document_descreption() {
		return security_document_descreption;
	}

	public void setSecurity_document_descreption(String security_document_descreption) {
		this.security_document_descreption = security_document_descreption;
	}

	public MultipartFile getCompliance_document() {
		return compliance_document;
	}

	public void setCompliance_document(MultipartFile compliance_document) {
		this.compliance_document = compliance_document;
	}

	public String getPayment_deccription() {
		return payment_deccription;
	}

	public void setPayment_deccription(String payment_deccription) {
		this.payment_deccription = payment_deccription;
	}

	public String getPayment_method() {
		return payment_method;
	}

	public void setPayment_method(String payment_method) {
		this.payment_method = payment_method;
	}

	public String getPayment_frequency() {
		return payment_frequency;
	}

	public void setPayment_frequency(String payment_frequency) {
		this.payment_frequency = payment_frequency;
	}

	public String getCurrency() {
		return currency;
	}

	public String getVat() {
		return vat;
	}

	public void setVat(String vat) {
		this.vat = vat;
	}

	public String getSla() {
		return sla;
	}

	public void setSla(String sla) {
		this.sla = sla;
	}

	public double getBond_amount() {
		return bond_amount;
	}

	public void setBond_amount(double bond_amount) {
		this.bond_amount = bond_amount;
	}

	public String getBond_expiry_date() {
		return bond_expiry_date;
	}

	public void setBond_expiry_date(String bond_expiry_date) {
		this.bond_expiry_date = bond_expiry_date;
	}

	public String getIssuer_bank() {
		return issuer_bank;
	}

	public void setIssuer_bank(String issuer_bank) {
		this.issuer_bank = issuer_bank;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public double getAmount_per_frequency() {
		return amount_per_frequency;
	}

	public void setAmount_per_frequency(double amount_per_frequency) {
		this.amount_per_frequency = amount_per_frequency;
	}

	public double getLate_penality_fee() {
		return late_penality_fee;
	}

	public void setLate_penality_fee(double late_penality_fee) {
		this.late_penality_fee = late_penality_fee;
	}

	public String getPayment_status() {
		return payment_status;
	}

	public void setPayment_status(String payment_status) {
		this.payment_status = payment_status;
	}

	public String getPending_payment_status() {
		return pending_payment_status;
	}

	public void setPending_payment_status(String pending_payment_status) {
		this.pending_payment_status = pending_payment_status;
	}

	public String getPayment_term_condition() {
		return payment_term_condition;
	}

	public void setPayment_term_condition(String payment_term_condition) {
		this.payment_term_condition = payment_term_condition;
	}

	public String getPayment_start_date() {
		return payment_start_date;
	}

	public void setPayment_start_date(String payment_start_date) {
		this.payment_start_date = payment_start_date;
	}

	public String getPayment_end_date() {
		return payment_end_date;
	}

	public void setPayment_end_date(String payment_end_date) {
		this.payment_end_date = payment_end_date;
	}

	public String getPayment_condition() {
		return payment_condition;
	}

	public void setPayment_condition(String payment_condition) {
		this.payment_condition = payment_condition;
	}

	public MultipartFile getPayment_confirmation_document() {
		return payment_confirmation_document;
	}

	public void setPayment_confirmation_document(MultipartFile payment_confirmation_document) {
		this.payment_confirmation_document = payment_confirmation_document;
	}

	public MultipartFile getContract_document_document() {
		return contract_document_document;
	}

	public void setContract_document_document(MultipartFile contract_document_document) {
		this.contract_document_document = contract_document_document;
	}

	public MultipartFile getSLA_document() {
		return SLA_document;
	}

	public void setSLA_document(MultipartFile sLA_document) {
		SLA_document = sLA_document;
	}

	public String getSLA_path() {
		return SLA_path;
	}

	public void setSLA_path(String sLA_path) {
		SLA_path = sLA_path;
	}

	public String getSLA_description() {
		return SLA_description;
	}

	public void setSLA_description(String sLA_description) {
		SLA_description = sLA_description;
	}

	public double getPhase1() {
		return phase1;
	}

	public void setPhase1(double phase1) {
		this.phase1 = phase1;
	}

	public double getPhase2() {
		return phase2;
	}

	public void setPhase2(double phase2) {
		this.phase2 = phase2;
	}

	public double getPhase3() {
		return phase3;
	}

	public void setPhase3(double phase3) {
		this.phase3 = phase3;
	}

	public double getPhase4() {
		return phase4;
	}

	public void setPhase4(double phase4) {
		this.phase4 = phase4;
	}

	public double getPhase5() {
		return phase5;
	}

	public void setPhase5(double phase5) {
		this.phase5 = phase5;
	}

	public String getPhases_description() {
		return phases_description;
	}

	public void setPhases_description(String phases_description) {
		this.phases_description = phases_description;
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

	public String getConfirmation_path() {
		return confirmation_path;
	}

	public void setConfirmation_path(String confirmation_path) {
		this.confirmation_path = confirmation_path;
	}

	public String getSecurity_path() {
		return security_path;
	}

	public void setSecurity_path(String security_path) {
		this.security_path = security_path;
	}

	public String getContract_path() {
		return contract_path;
	}

	public void setContract_path(String contract_path) {
		this.contract_path = contract_path;
	}

	public String getContract_registration_date() {
		return contract_registration_date;
	}

	public void setContract_registration_date(String contract_registration_date) {
		this.contract_registration_date = contract_registration_date;
	}

	public Long getContract_id() {
		return contract_id;
	}

	public void setContract_id(Long contract_id) {
		this.contract_id = contract_id;
	}

	public List<Payment> getPayments() {
		return payments;
	}

	public void setPayments(List<Payment> payments) {
		this.payments = payments;
	}

	public String getRequest_type() {
		return request_type;
	}

	public void setRequest_type(String request_type) {
		this.request_type = request_type;
	}

	public String getRequested_by() {
		return requested_by;
	}

	public void setRequested_by(String requested_by) {
		this.requested_by = requested_by;
	}

	public String getApproved_by() {
		return approved_by;
	}

	public void setApproved_by(String approved_by) {
		this.approved_by = approved_by;
	}

	public String getRequest_date() {
		return request_date;
	}

	public void setRequest_date(String request_date) {
		this.request_date = request_date;
	}

	public String getApproved_date() {
		return approved_date;
	}

	public void setApproved_date(String approved_date) {
		this.approved_date = approved_date;
	}

}
