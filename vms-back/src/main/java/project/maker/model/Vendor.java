package project.maker.model;

import java.util.List;

public class Vendor {
	private Long id;
	private String name;
	private String phone_number;
	private String email;
	private String website;
	private String location;
	private String address;
	private String industry;
	private String post_number;
	private String fax_number;
	private String general_document;
	private String trade_licence;
	private String tin_certificate;
	private String other_document;
	private String general_document_descreption;
	private String request_type;
	private String status;
	private String availability;
	private String vendor_registration_date;
	private List<Product> products;
	private List<ServiceModel> services;
	private List<Contract> contract;
	private String bank_name;
	private String branch_name;
	private String account_name;
	private String account_number;
	private String swift_code;
	private String beneficiary_address;
	private String iban;
	private Long history_id;

	public Vendor() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Vendor(Long id, String name, String phone_number, String email, String website, String location,
			String address,
			String industry, String post_number, String fax_number, String general_document, String trade_licence,
			String tin_certificate, String other_document, String general_document_descreption, String request_type,
			String status, String availability, String vendor_registration_date, List<Product> products,
			List<ServiceModel> services, List<Contract> contract, String bank_name, String branch_name,
			String account_name, String account_number, String swift_code, String beneficiary_address, String iban,
			Long history_id) {
		super();
		this.id = id;
		this.name = name;
		this.phone_number = phone_number;
		this.email = email;
		this.website = website;
		this.location = location;
		this.address = address;
		this.industry = industry;
		this.post_number = post_number;
		this.fax_number = fax_number;
		this.general_document = general_document;
		this.trade_licence = trade_licence;
		this.tin_certificate = tin_certificate;
		this.other_document = other_document;
		this.general_document_descreption = general_document_descreption;
		this.request_type = request_type;
		this.status = status;
		this.availability = availability;
		this.vendor_registration_date = vendor_registration_date;
		this.products = products;
		this.services = services;
		this.contract = contract;
		this.bank_name = bank_name;
		this.branch_name = branch_name;
		this.account_name = account_name;
		this.account_number = account_number;
		this.swift_code = swift_code;
		this.beneficiary_address = beneficiary_address;
		this.iban = iban;
		this.history_id = history_id;
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

	public String getPhone_number() {
		return phone_number;
	}

	public void setPhone_number(String phone_number) {
		this.phone_number = phone_number;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getLocation() {
		return location;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getPost_number() {
		return post_number;
	}

	public void setPost_number(String post_number) {
		this.post_number = post_number;
	}

	public String getFax_number() {
		return fax_number;
	}

	public void setFax_number(String fax_number) {
		this.fax_number = fax_number;
	}

	public String getGeneral_document() {
		return general_document;
	}

	public void setGeneral_document(String general_document) {
		this.general_document = general_document;
	}

	public String getTrade_licence() {
		return trade_licence;
	}

	public void setTrade_licence(String trade_licence) {
		this.trade_licence = trade_licence;
	}

	public String getTin_certificate() {
		return tin_certificate;
	}

	public void setTin_certificate(String tin_certificate) {
		this.tin_certificate = tin_certificate;
	}

	public String getOther_document() {
		return other_document;
	}

	public void setOther_document(String other_document) {
		this.other_document = other_document;
	}

	public String getGeneral_document_descreption() {
		return general_document_descreption;
	}

	public void setGeneral_document_description(String general_document_descreption) {
		this.general_document_descreption = general_document_descreption;
	}

	public String getRequest_type() {
		return request_type;
	}

	public void setRequest_type(String request_type) {
		this.request_type = request_type;
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

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	public List<ServiceModel> getServices() {
		return services;
	}

	public void setServices(List<ServiceModel> services) {
		this.services = services;
	}

	public List<Contract> getContract() {
		return contract;
	}

	public void setContract(List<Contract> contract) {
		this.contract = contract;
	}

	public String getVendor_registration_date() {
		return vendor_registration_date;
	}

	public void setVendor_registration_date(String vendor_registration_date) {
		this.vendor_registration_date = vendor_registration_date;
	}

	public void setGeneral_document_descreption(String general_document_descreption) {
		this.general_document_descreption = general_document_descreption;
	}

	public Long getHistory_id() {
		return history_id;
	}

	public void setHistory_id(Long history_id) {
		this.history_id = history_id;
	}

	public String getBank_name() {
		return bank_name;
	}

	public void setBank_name(String bank_name) {
		this.bank_name = bank_name;
	}

	public String getBranch_name() {
		return branch_name;
	}

	public void setBranch_name(String branch_name) {
		this.branch_name = branch_name;
	}

	public String getAccount_name() {
		return account_name;
	}

	public void setAccount_name(String account_name) {
		this.account_name = account_name;
	}

	public String getAccount_number() {
		return account_number;
	}

	public void setAccount_number(String account_number) {
		this.account_number = account_number;
	}

	public String getSwift_code() {
		return swift_code;
	}

	public void setSwift_code(String swift_code) {
		this.swift_code = swift_code;
	}

	public String getBeneficiary_address() {
		return beneficiary_address;
	}

	public void setBeneficiary_address(String beneficiary_address) {
		this.beneficiary_address = beneficiary_address;
	}

	public String getIban() {
		return iban;
	}

	public void setIban(String iban) {
		this.iban = iban;
	}

}
