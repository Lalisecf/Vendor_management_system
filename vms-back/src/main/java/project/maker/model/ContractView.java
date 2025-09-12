package project.maker.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContractView {
	private Long id;
	private String contract_title;
	private String vendor_name;
	private String name_vendor;
	private String directorate;
	private List<Product> products;
	private List<ServiceModel> services;
	private List<Payments> payments;
	private String contract_type;
	private String start_date;
	private String end_date;
	private Double total_amount;
	private String vat;
	private String sla;
	private double bond_amount;
	private String bond_expiry_date;
	private String issuer_bank;
	private String renewal_termination_option;
	private String security_document;
	private String SLA_document;
	private String security_document_descreption;
	private String compliance_document;
	private String payment_description;
	private String payment_method;
	private String payment_frequency;
	private String currency;
	private Double amount_per_frequency;
	private Double late_penality_fee;
	private String payment_status;
	private String pending_payment_status;
	private String payment_term_condition;
	private String payment_start_date;
	private String payment_end_date;
	private String payment_condition;
	private String confirmation_document;
	private String contract_document_document;
	private String SLA_description;
	private String phase1;
	private String phase2;
	private String phase3;
	private String phase4;
	private String phase5;
	private String phases_description;
	private double paid_amount;
	private String date;
	private String payment_contigency;
	private double amount_per_contigency;
	private String status;
	private String availability;
	private String request_type;
	private String requested_by;
	private String approved_by;
	private String email;
	private String location;
	private String post_number;
	private String bank_name;
	private String branch_name;
	private String account_name;
	private String account_number;
	private String swift_code;
	private String beneficiary_address;
	private String iban;
}
