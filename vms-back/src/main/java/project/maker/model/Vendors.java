package project.maker.model;

import org.springframework.web.multipart.MultipartFile;

public class Vendors {
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
	private MultipartFile general_document;
	private MultipartFile trade_document;
	private MultipartFile tin_document;
	private MultipartFile other_document;
	private String general_document_descreption;
	private String request_type;
	private String status;
	private String availability;
	private String path;
	private String path2;
	private String path3;
	private String path4;
	private String product;
	private String service;
	private String bank_name;
	private String branch_name;
	private String account_name;
	private String account_number;
	private String swift_code;
	private String beneficiary_address;
	private String iban;
	private String vendor_registration_date;
	private String edited_by;

	public Vendors() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Vendors(Long id, String name, String phone_number, String email, String website, String location,
			String address,
			String industry, String post_number, String fax_number, MultipartFile general_document,
			MultipartFile trade_document, MultipartFile tin_document, MultipartFile other_document,
			String general_document_descreption, String request_type, String status, String availability, String path,
			String path2, String path3, String path4, String product, String service,
			String bank_name, String branch_name, String account_name, String account_number, String swift_code,
			String beneficiary_address, String iban, String vendor_registration_date, String edited_by) {
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
		this.trade_document = trade_document;
		this.tin_document = tin_document;
		this.other_document = other_document;
		this.general_document_descreption = general_document_descreption;
		this.request_type = request_type;
		this.status = status;
		this.availability = availability;
		this.path = path;
		this.path2 = path2;
		this.path3 = path3;
		this.path4 = path4;
		this.product = product;
		this.service = service;
		this.bank_name = bank_name;
		this.branch_name = branch_name;
		this.account_name = account_name;
		this.account_number = account_number;
		this.swift_code = swift_code;
		this.beneficiary_address = beneficiary_address;
		this.iban = iban;
		this.vendor_registration_date = vendor_registration_date;
		this.edited_by = edited_by;
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

	public void setLocation(String location) {
		this.location = location;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public MultipartFile getGeneral_document() {
		return general_document;
	}

	public void setGeneral_document(MultipartFile general_document) {
		this.general_document = general_document;
	}

	public MultipartFile getTrade_document() {
		return trade_document;
	}

	public void setTrade_document(MultipartFile trade_document) {
		this.trade_document = trade_document;
	}

	public MultipartFile getTin_document() {
		return tin_document;
	}

	public void setTin_document(MultipartFile tin_document) {
		this.tin_document = tin_document;
	}

	public MultipartFile getOther_document() {
		return other_document;
	}

	public void setOther_document(MultipartFile other_document) {
		this.other_document = other_document;
	}

	public String getGeneral_document_descreption() {
		return general_document_descreption;
	}

	public void setGeneral_document_descreption(String general_document_descreption) {
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

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getPath2() {
		return path2;
	}

	public void setPath2(String path2) {
		this.path2 = path2;
	}

	public String getPath3() {
		return path3;
	}

	public void setPath3(String path3) {
		this.path3 = path3;
	}

	public String getPath4() {
		return path4;
	}

	public void setPath4(String path4) {
		this.path4 = path4;
	}

	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
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

	public String getVendor_registration_date() {
		return vendor_registration_date;
	}

	public void setVendor_registration_date(String vendor_registration_date) {
		this.vendor_registration_date = vendor_registration_date;
	}

	public String getEdited_by() {
		return edited_by;
	}

	public void setEdited_by(String edited_by) {
		this.edited_by = edited_by;
	}
}
