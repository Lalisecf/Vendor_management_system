package project.maker.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Many;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import project.maker.model.Contract;
import project.maker.model.ContractView;
import project.maker.model.FileTable;
import project.maker.model.Licence;
import project.maker.model.Payment;
import project.maker.model.Product;
import project.maker.model.Reasons;
import project.maker.model.Remarks;
import project.maker.model.ServiceModel;
import project.maker.model.Vendor;
import project.maker.model.Vendors;
import project.model.Remark;

@Mapper
public interface MakerMapper {
	@Select("select firstname+' '+middlename+' '+lastname from users where id=#{user_id}")
	String getFullName(Long user_id);

	@Insert("insert into products(name, description, created_date, created_by, status, availability) values(#{name}, #{description}, #{created_date}, #{created_by}, #{status}, #{availability})")
	void register_product(Product productModel);

	@Insert("insert into services(name, description, created_date, created_by, availability, status) "
			+ "values(#{name}, #{description}, #{created_date}, #{created_by}, #{availability}, #{status});")
	public void addService(ServiceModel serviceModel);

	@Insert("insert into directorates(name, description, created_date, created_by, availability, status) "
			+ "values(#{name}, #{description}, #{created_date}, #{created_by}, #{availability}, #{status});")
	public void addDirectorate(ServiceModel serviceModel);

	@Insert("insert into issuer_bank(name, description, created_date, created_by, availability, status) "
			+ "values(#{name}, #{description}, #{created_date}, #{created_by}, #{availability}, #{status});")
	public void addIssuerBank(ServiceModel serviceModel);

	@Select("select * from products where availability=1")
	public List<Product> getAllProducts();

	@Update("update products set status = '0' where id = #{product_id}")
	public void deactivate_product(@Param("product_id") Long product_id);

	@Update("update products set status = '1' where id = #{product_id}")
	public void activate_product(@Param("product_id") Long product_id);

	@Update("update products set availability = '0' where id = #{product_id}")
	public void delete_product(@Param("product_id") Long product_id);

	@Select("select * from products where id=#{product_id}")
	public Product get_product(@Param("product_id") String product_id);

	@Update("update products set name=#{name}, description=#{description}  where id=#{id}")
	void update_product(Product productModel);

	@Select("select * from services where availability=1")
	public List<ServiceModel> getAllServices();

	@Select("select * from directorates where availability=1")
	public List<ServiceModel> getAllDirectorates();

	@Select("select * from issuer_bank where availability=1")
	public List<ServiceModel> getAllIssuerBanks();

	@Select("select * from services where status=1 and availability=1 and id=#{service_id}")
	ServiceModel getService(String service_id);

	@Select("select * from directorates where status=1 and availability=1 and id=#{diractorate_id}")
	ServiceModel getDirectorate(String diractorate_id);

	@Select("select * from issuer_bank where status=1 and availability=1 and id=#{bank_id}")
	ServiceModel getIssuerBank(String bank_id);

	@Update("update services set availability = 0 where id = #{service_id}; ")
	Boolean delete_service(String service_id);

	@Update("update directorates set availability = 0 where id = #{directorate_id}; ")
	Boolean delete_directorate(String directorate_id);

	@Update("update issuer_bank set availability = 0 where id = #{bank_id}; ")
	Boolean delete_issuer_bank(String bank_id);

	@Update("update services set status = 1 where id = #{service_id}; ")
	void activate_service(String service_id);

	@Update("update directorates set status = 1 where id = #{directorate_id}; ")
	void activate_directorate(String directorate_id);

	@Update("update issuer_bank set status = 1 where id = #{bank_id}; ")
	void activate_issuer_bank(String bank_id);

	@Update("update services set status = 0 where id = #{service_id}; ")
	Boolean deactivate_service(String service_id);

	@Update("update directorates set status = 0 where id = #{directorate_id}; ")
	Boolean deactivate_directorate(String directorate_id);

	@Update("update issuer_bank set status = 0 where id = #{bank_id}; ")
	Boolean deactivate_issuer_bank(String bank_id);

	@Update("update  services set name=#{name}, description=#{description} where id=#{id};")
	void updateService(ServiceModel addServiceModel);

	@Update("update  directorates set name=#{name}, description=#{description} where id=#{id};")
	void updateDirectorate(ServiceModel addServiceModel);

	@Update("update  issuer_bank set name=#{name}, description=#{description} where id=#{id};")
	void updateIssuerBank(ServiceModel addServiceModel);

	@Select("insert into vendors(name, phone_number, email, website, location, address, post_number, fax_number, general_document, trade_licence, tin_certificate, other_document,  general_document_descreption, bank_name, branch_name, account_name, account_number, swift_code, beneficiary_address, iban, vendor_registration_date, status, availability) OUTPUT Inserted.id values(#{name}, #{phone_number}, #{email}, #{website}, #{location}, #{address}, #{post_number}, #{fax_number}, #{path}, #{path2}, #{path3}, #{path4}, #{general_document_descreption}, #{bank_name}, #{branch_name}, #{account_name}, #{account_number}, #{swift_code}, #{beneficiary_address}, #{iban}, #{vendor_registration_date}, #{status}, #{availability} )")
	Long register_vendor(Vendors vendorModel);

	@Insert("insert into vendor_product(product_id, vendor_id, status, availability) values(#{product_id}, #{vendor_id},1,1)")
	void addVendorProduct(@Param("product_id") Long product_id, @Param("vendor_id") Long vendor_id);

	@Insert("insert into vendor_service(service_id, vendor_id, status, availability) values(#{service_id}, #{vendor_id},1,1)")
	void addVendorService(@Param("service_id") Long service_id, @Param("vendor_id") Long vendor_id);

	@Select("select p.* from products p join vendor_product vp on p.id = vp.product_id where vp.vendor_id = #{vendorId} and p.status = 1 and p.availability = 1 and vp.status = 1 and vp.availability = 1")
	public Collection<Product> getProductByVendorId(Long vendorId);

	@Select("select s.* from services s join vendor_service vs on s.id = vs.service_id where vs.vendor_id = #{vendorId} and s.status = 1 and s.availability = 1 and vs.status = 1 and vs.availability = 1")
	public Collection<Product> getServiceByVendorId(Long vendorId);

	@Select("select p.* from products p join vendor_edited_product vp on p.id = vp.product_id where vp.vendor_edited_id = #{vendorId} and p.status = 1 and p.availability = 1 and vp.status = 1 and vp.availability = 1")
	public Collection<Product> getProductByVendorEditedId(Long vendorId);

	@Select("select s.* from services s join vendor_edited_service vs on s.id = vs.service_id where vs.vendor_edited_id = #{vendorId} and s.status = 1 and s.availability = 1 and vs.status = 1 and vs.availability = 1")
	public Collection<Product> getServiceByVendorEditedId(Long vendorId);

	@Select("select *" + " from vendors v where v.availability = '1';")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "products", javaType = List.class, column = "id", many = @Many(select = "getProductByVendorId")),
			@Result(property = "services", javaType = List.class, column = "id", many = @Many(select = "getServiceByVendorId")),
			@Result(property = "contract", javaType = List.class, column = "id", many = @Many(select = "getContractByVendorId")),
	// @Result(property = "subject", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId"))
	})
	public List<Vendor> getAllVendors();

	@Select("SELECT l.*, v.name as vendor_name, c.contract_title FROM licence l LEFT JOIN vendors v ON v.id = l.vendor_id LEFT JOIN contract c on c.id= l.contract_id WHERE c.availability = '1'")
	public List<Licence> getAllLicences();

	@Select("SELECT l.*, v.name as vendor_name, c.contract_title FROM licence l LEFT JOIN vendors v ON v.id = l.vendor_id LEFT JOIN contract c on c.id= l.contract_id WHERE c.availability = '1' and l.id = #{licence_id}")
	public Licence getLicencesByID(Long licence_id);

	@Select("SELECT l.*, v.name as vendor_name, c.contract_title FROM old_licence l LEFT JOIN vendors v ON v.id = l.vendor_id LEFT JOIN contract c on c.id= l.contract_id WHERE c.availability = '1' and l.licence_id=#{id}")
	public List<Licence> getLicenceHistory(Long id);

	@Select("select c.* from contract c join contract_vendor cv on c.id = cv.contract_id where cv.vendor_id = #{vendorId} and c.availability = 1 and cv.status = 1 and cv.availability = 1")
	public Collection<Contract> getContractByVendorId(Long vendorId);

	@Select("select v.*"
			+ " from vendors v,vendor_edited_vendor vpv where v.id=vpv.vendor_id and vpv.vendor_edited_id=#{id} and v.availability = '1';")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "products", javaType = List.class, column = "id", many = @Many(select = "getProductByVendorId")),
			@Result(property = "services", javaType = List.class, column = "id", many = @Many(select = "getServiceByVendorId"))
	// @Result(property = "rights", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getUserRights")),
	// @Result(property = "subject", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId"))
	})
	public List<Vendor> getVendorByEditedId(Long id);

	@Update("update vendors set request_type = 'deactivate' where id = #{vendor_id}")
	public void deactivate_vendor(@Param("vendor_id") Long vendor_id);

	@Update("update vendors set request_type = 'activate' where id = #{vendor_id}")
	public void activate_vendor(@Param("vendor_id") Long vendor_id);

	@Update("update licence set status = '2' where id = #{licence_id}")
	public void ApproveLicence(Long licence_id);

	@Select("select * from vendors where id=#{vendor_id}")
	Vendor getVendor(@Param("vendor_id") Long vendor_id);

	@Update("update vendors set availability = '0' where id = #{vendor_id}")
	public void delete_vendor_request(@Param("vendor_id") Long vendor_id);

	@Update("update vendors set request_type = 'delete' where id = #{vendor_id}")
	public void delete_vendor(@Param("vendor_id") Long vendor_id);

	@Select("select vendor_id  from vendor_edited_vendor where vendor_edited_id=#{vendor_id}")
	Long vendor_id(@Param("vendor_id") Long vendor_id);

	@Update("update vendors set request_type=NULL where id = #{vendor_id}")
	public void Update_request_type(@Param("vendor_id") Long vendor_id);

	@Delete("delete from vendors_edited where id = #{vendor_id};delete from vendor_edited_vendor where id = #{vendor_id}")
	public void reject_update_vendor_request(@Param("vendor_id") Long vendor_id);

	@Select("select r.*,ur.sender_id as created_by from remark r join users_remark ur on r.id = ur.remark_id where ur.vendor_id = #{vendorId} and r.status = 1 and r.availability = 1 and ur.status = 1 and ur.availability = 1")
	List<Remarks> getRemarksByVendorId(String vendorId);

	@Select("select email from users where id=#{user_id}")
	String getEmail(Long user_id);

	@Select("select sender_id from users_remark where remark_id=#{remark_id}")
	public Long getReciverId(Long remark_id);

	@Select("insert into remark(title, description, created_date,status,availability) OUTPUT Inserted.id "
			+ "values(#{title}, #{description}, #{created_date},1,1);")
	public Long send_remark(Remarks remark);

	@Insert("INSERT INTO users_remark(remark_id, sender_id,receiver_id,vendor_id,status,availability)  values(#{remark_id},#{sender_id},#{reciver_id},#{vendor_id},1,1)")
	public void addUserRemark(@Param("remark_id") Long remark_id, @Param("sender_id") Long sender_id,
			@Param("reciver_id") Long reciver_id, @Param("vendor_id") Long vendor_id);

	@Select("select * from remark where  id=#{id}")
	public Remarks getRemarkById(long id);

	@Delete("delete users_remark where remark_id=#{id};")
	public void deleteRemark(String request_id);

	@Update("update remark set title=#{title}, description=#{description}, created_date=#{created_date} where id=#{id}")
	public boolean update_remark(Remarks remark);

	@Select("select *" + " from vendors v where v.availability = '1' and v.id=#{vendor_id};")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "products", javaType = List.class, column = "id", many = @Many(select = "getProductByVendorId")),
			@Result(property = "services", javaType = List.class, column = "id", many = @Many(select = "getServiceByVendorId"))
	// @Result(property = "rights", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getUserRights")),
	// @Result(property = "subject", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId"))
	})
	public Vendor getVendorById(@Param("vendor_id") String vendor_id);

	@Select("select *" + " from vendors_edited v where v.id=#{vendor_id};")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "products", javaType = List.class, column = "id", many = @Many(select = "getProductByVendorEditedId")),
			@Result(property = "services", javaType = List.class, column = "id", many = @Many(select = "getServiceByVendorEditedId"))
	// @Result(property = "rights", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getUserRights")),
	// @Result(property = "subject", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId"))
	})
	public Vendor getVendorEditedById(@Param("vendor_id") String vendor_id);

	@Select("select general_document from vendors where id = #{vendor_id}")
	public String getFilePath(@Param("vendor_id") Long vendor_id);

	@Select("select trade_licence from vendors where id = #{vendor_id}")
	public String getFilePathtrade_licence(@Param("vendor_id") Long vendor_id);

	@Select("select tin_certificate from vendors where id = #{vendor_id}")
	public String getFilePathtin_certificate(@Param("vendor_id") Long vendor_id);

	@Select("select other_document from vendors where id = #{vendor_id}")
	public String getFilePathother_document(@Param("vendor_id") Long vendor_id);

	@Select("insert into vendors_edited(name, phone_number, email, website, location, address, post_number, fax_number, general_document,trade_licence,tin_certificate,other_document, general_document_descreption, bank_name, branch_name, account_name, account_number, swift_code, beneficiary_address, iban, edited_by, vendor_edited_date, status, availability) OUTPUT Inserted.id values(#{name}, #{phone_number}, #{email}, #{website}, #{location}, #{address}, #{post_number}, #{fax_number}, #{path},#{path2},#{path3},#{path4}, #{general_document_descreption}, #{bank_name}, #{branch_name}, #{account_name}, #{account_number}, #{swift_code}, #{beneficiary_address}, #{iban}, #{edited_by}, #{vendor_registration_date}, #{status}, #{availability} )")
	Long register_edited_vendor(Vendors vendorModel);

	@Insert("insert into vendor_edited_product(product_id, vendor_edited_id, status, availability) values(#{product_id}, #{vendor_edited_id},1,1)")
	void addVendorEditedProduct(@Param("product_id") Long product_id, @Param("vendor_edited_id") Long vendor_edited_id);

	@Insert("insert into vendor_edited_service(service_id, vendor_edited_id, status, availability) values(#{service_id}, #{vendor_edited_id},1,1)")
	void addVendorEditedService(@Param("service_id") Long service_id, @Param("vendor_edited_id") Long vendor_edited_id);

	@Update("update vendors set request_type='update' where id=#{vendor_id}")
	public void updateRequestType(@Param("vendor_id") Long vendor_id);

	@Delete("delete from vendor_product where vendor_id = #{id};")
	public void deleteVendorProduct(@Param("id") Long id);

	@Delete("delete from vendor_service where vendor_id = #{id}")
	public void deleteVendorService(@Param("id") Long id);

	@Delete("delete from vendor_edited_product where vendor_edited_id = #{id}")
	public void deleteVendorEditedProduct(@Param("id") Long id);

	@Delete("delete from vendor_edited_service where vendor_edited_id = #{id}")
	public void deleteVendorEditedService(@Param("id") Long id);

	// #{name}, #{phone_number}, #{email}, #{website}, #{location}, #{industry},
	// #{post_number}, #{fax_number}, #{path}, #{general_document_descreption},
	// #{vendor_registration_date}, #{status}, #{availability}
	@Update("update vendors set name = #{name}, phone_number = #{phone_number}, email = #{email}, website = #{website}, location = #{location},  post_number = #{post_number}, fax_number = #{fax_number}, general_document = #{path},trade_licence=#{path2},tin_certificate=#{path3},other_document=#{path4},general_document_descreption=#{general_document_descreption}, bank_name=#{bank_name}, branch_name=#{branch_name}, account_name=#{account_name}, account_number=#{account_number}, swift_code=#{swift_code}, beneficiary_address=#{beneficiary_address}, iban=#{iban}  where id = #{id}")
	public void update_vendor(Vendors vendors);

	@Update("update vendors set bank_name=#{bank_name}, branch_name=#{branch_name}, account_name=#{account_name}, account_number=#{account_number}, swift_code=#{swift_code}, beneficiary_address=#{beneficiary_address}, iban=#{iban}  where id = #{id}")
	public void update_bank_detail(Vendors vendors);

	@Select("insert into reasons(reason,date,status,availability) OUTPUT Inserted.id "
			+ "values(#{reason}, #{date},#{status},#{availability});")
	public Long Reason(Reasons reason);

	@Insert("INSERT INTO user_reason(reason_id, user_id,vendor_id,status,availability)  values(#{reason_id},#{user_id},#{vendor_id},1,1)")
	public void addUserReason(@Param("reason_id") Long reason_id, @Param("user_id") Long user_id,
			@Param("vendor_id") Long vendor_id);

	@Select("select ${document_type} from vendors where id=#{id}")
	public String downloadFiles(@Param("id") Long id, @Param("document_type") String document_type);

	@Select("select ${document_type} from vendors_previous where id=#{id}")
	public String downloadFilesupdated(@Param("id") Long id, @Param("document_type") String document_type);

	@Select("select s.* from services s join vendor_service vs on s.id = vs.service_id where vs.vendor_id = #{vendorId} and s.status = 1 and s.availability = 1 and vs.status = 1 and vs.availability = 1")
	public List<ServiceModel> getServicesByVendorId(Long vendorId);

	@Select("select p.* from products p join vendor_product vp on p.id = vp.product_id where vp.vendor_id = #{vendorId} and p.status = 1 and p.availability = 1 and vp.status = 1 and vp.availability = 1")
	public List<Product> getProductsByVendorId(Long vendorId);

	@Select(" select vendor_id from vendors_edited ve,vendor_edited_vendor vev where vev.vendor_edited_id=ve.id and ve.id=#{id}")
	public Long getVendorIdByVendorEditedId(@Param("id") Long id);

	@Select("INSERT INTO vendors_previous(name,phone_number,email,website,location, address, post_number,fax_number,security_document,compliance_document,general_document,security_document_description,compliance_document_descreption,general_document_descreption,vendor_registration_date,request_type,trade_licence,tin_certificate,other_document, bank_name, branch_name, account_name, account_number, swift_code, beneficiary_address, iban, status,availability)OUTPUT Inserted.id "
			+ "SELECT name,phone_number,email,website,location, address, post_number,fax_number,security_document,compliance_document,general_document,security_document_description,compliance_document_descreption,general_document_descreption,vendor_registration_date,request_type,trade_licence,tin_certificate,other_document, bank_name, branch_name, account_name, account_number, swift_code, beneficiary_address, iban, status,availability"
			+ " FROM vendors where id = #{id};")
	Long moveVendorPrevious(@Param("id") Long id);

	@Update("update vendors set name=#{name},phone_number=#{phone_number},email=#{email},website=#{website},location=#{location},address=#{address},post_number=#{post_number},fax_number=#{fax_number},general_document=#{path},general_document_descreption=#{general_document_descreption},vendor_registration_date=#{vendor_registration_date},request_type=Null,trade_licence=#{path2},tin_certificate=#{path3},other_document=#{path4},status=#{status},availability=#{availability}, bank_name=#{bank_name}, branch_name=#{branch_name}, account_name=#{account_name}, account_number=#{account_number}, swift_code=#{swift_code}, beneficiary_address=#{beneficiary_address}, iban=#{iban}"
			+ " where id = #{id};")
	Long updateVendor(Vendors vendors);

	@Insert("insert into vendor_previous_vendor(vendor_id,vendor_previous_id, status, availability) values(#{vendor_id}, #{vendor_previous_id},1,1)")
	void addVendorPreviousVendor(@Param("vendor_id") Long vendor_id,
			@Param("vendor_previous_id") Long vendor_previous_id);

	@Insert("insert into vendor_edited_vendor(vendor_id,vendor_edited_id, status, availability) values(#{vendor_id}, #{vendor_edited_id},1,1)")
	void addVendorEditedVendor(@Param("vendor_id") Long vendor_id, @Param("vendor_edited_id") Long vendor_edited_id);

	@Delete("delete from vendor_edited_vendor where vendor_edited_id = #{id}")
	public void deleteVendorEditedVendor(@Param("id") Long id);

	@Select("select r.*,ur.user_id as created_by from reasons r join user_reason ur on r.id = ur.reason_id where ur.vendor_id = #{vendorId} and r.status = 1 and r.availability = 1 and ur.status = 1 and ur.availability = 1")
	List<Reasons> getReasonsByVendorId(String vendorId);

	@Select("select general_document from vendors_edited where id = #{vendor_id}")
	public String getFilePathInVendorEdited(@Param("vendor_id") Long vendor_id);

	@Select("select trade_licence from vendors_edited where id = #{vendor_id}")
	public String getFilePathOftrade_licence(@Param("vendor_id") Long vendor_id);

	@Select("select tin_certificate from vendors_edited where id = #{vendor_id}")
	public String getFilePathOftin_certificate(@Param("vendor_id") Long vendor_id);

	@Select("select other_document from vendors_edited where id = #{vendor_id}")
	public String getFilePathOfother_document(@Param("vendor_id") Long vendor_id);

	@Select("insert into contract(contract_title, contract_type, directorate, start_date, end_date, total_amount, currency, vat, sla, payment_method, payment_status, contract_document_document, requested_by, request_date, status, availability)"
			+ " OUTPUT Inserted.id values (#{contract_title}, #{contract_type}, #{directorate}, #{start_date}, #{end_date}, #{total_amount}, #{currency}, #{vat}, #{sla}, #{payment_method}, 'incomplet',  #{contract_path}, #{requested_by}, #{request_date}, '1', '1')")
	Long register_contract(Contract contractModel);

	@Select("insert into licence(vendor_id, contract_id, product_service_name, licence_quantity, product_category, licence_type, start_date, expiry_date, renewal_date, total_cost, support_period, additional_info, file_path, requested_by, request_date, status, availability)"
			+ " OUTPUT Inserted.id values (#{vendor_id}, #{contract_id}, #{product_service_name}, #{licence_quantity}, #{product_category}, #{licence_type}, #{start_date}, #{expiry_date}, #{renewal_date}, #{total_cost}, #{support_period}, #{additional_info}, #{file_path}, #{requested_by}, #{request_date}, '1', '1')")
	Long register_licence(Licence licenceModel);

	@Select("insert into temp_licence(vendor_id, contract_id, licence_id, product_service_name, licence_quantity, product_category, licence_type, start_date, expiry_date, renewal_date, total_cost, support_period, additional_info, file_path, requested_by, request_date, status, availability)"
			+ " OUTPUT Inserted.id values (#{vendor_id}, #{contract_id}, #{id}, #{product_service_name}, #{licence_quantity}, #{product_category}, #{licence_type}, #{start_date}, #{expiry_date}, #{renewal_date}, #{total_cost}, #{support_period}, #{additional_info}, #{file_path}, #{requested_by}, #{request_date}, '1', '1')")
	Long insertTempLicence(Licence licenceModel);

	@Update("update licence set vendor_id = #{vendor_id}, contract_id = #{contract_id}, product_service_name = #{product_service_name}, licence_quantity = #{licence_quantity}, product_category = #{product_category}, \r\n"
			+
			"  licence_type = #{licence_type}, start_date = #{start_date}, expiry_date = #{expiry_date}, renewal_date = #{renewal_date}, total_cost = #{total_cost}, support_period = #{support_period}, additional_info = #{additional_info}, file_path = #{file_path} where id = #{id}")
	void update_licence(Licence licenceModel);

	@Select("INSERT INTO old_contract (\r\n" +
			"  contract_id, contract_title, contract_type, directorate, start_date, end_date, total_amount, \r\n" +
			"  currency, vat, sla, payment_method, payment_status, contract_document_document, \r\n" +
			"  request_type, requested_by, request_date, approved_by, approved_date, status, availability\r\n" +
			")\r\n" +
			"OUTPUT Inserted.id\r\n" +
			"SELECT \r\n" +
			"  #{contract_id}, contract_title, contract_type, directorate, start_date, end_date, total_amount, \r\n" +
			"  currency, vat, sla, payment_method, payment_status, contract_document_document, \r\n" +
			"  request_type, requested_by, request_date, approved_by, approved_date, status, availability\r\n" +
			"FROM contract\r\n" +
			"WHERE id = #{contract_id}")
	Long moveOldContract(@Param("contract_id") Long contract_id);

	@Select("insert into temp_contract(contract_title, contract_type, directorate, start_date, end_date, total_amount, currency, vat, sla, payment_method, payment_status, contract_document_document, contract_id, requested_by,request_type, request_date, status, availability)"
			+ " OUTPUT Inserted.id values (#{contract_title}, #{contract_type}, #{directorate}, #{start_date}, #{end_date}, #{total_amount}, #{currency}, #{vat}, #{sla}, #{payment_method}, 'incomplet',  #{contract_path}, #{id}, #{requested_by}, #{request_type}, #{request_date}, '1', '1')")
	Long register_temp_contract(Contract contractModel);

	@Select("insert into addendum_contract(contract_title, contract_type, directorate, start_date, end_date, total_amount, currency, vat, sla, payment_method, payment_status, contract_document_document, contract_id, requested_by,request_type, request_date, status, availability)"
			+ " OUTPUT Inserted.id values (#{contract_title}, #{contract_type}, #{directorate}, #{start_date}, #{end_date}, #{total_amount}, #{currency}, #{vat}, #{sla}, #{payment_method}, 'incomplet',  #{contract_path}, #{id}, #{requested_by}, #{request_type}, #{request_date}, '1', '1')")
	Long register_addendum_contract(Contract contractModel);

	@Insert("insert into performance_bond(bond_amount, bond_expiry_date, issuer_bank, bond_document, contract_id, status, availability)"
			+ " values (#{bond_amount}, #{bond_expiry_date}, #{issuer_bank}, #{security_path}, #{id}, '1', '1')")
	void addPerformanceBond(Contract contractModel);

	@Insert("INSERT INTO old_performance_bond (bond_amount, bond_expiry_date, issuer_bank, bond_document, old_contract_id, status, availability)"
			+ " SELECT bond_amount, bond_expiry_date, issuer_bank, bond_document, #{old_contract_id}, status, availability"
			+ " FROM performance_bond WHERE contract_id = #{id}")
	void moveOldPerformanceBond(@Param("old_contract_id") Long old_contract_id, @Param("id") Long id);

	@Insert("insert into temp_performance_bond(bond_amount, bond_expiry_date, issuer_bank, bond_document, temp_contract_id, status, availability)"
			+ " values (#{bond_amount}, #{bond_expiry_date}, #{issuer_bank}, #{security_path}, #{id}, '1', '1')")
	void addTempPerformanceBond(Contract contractModel);

	@Insert("insert into addendum_performance_bond(bond_amount, bond_expiry_date, issuer_bank, bond_document, addendum_id, status, availability)"
			+ " values (#{bond_amount}, #{bond_expiry_date}, #{issuer_bank}, #{security_path}, #{id}, '1', '1')")
	void addAddendumPerformanceBond(Contract contractModel);

	@Update("update performance_bond set bond_amount = #{contractModel.bond_amount}, bond_expiry_date = #{contractModel.bond_expiry_date}, issuer_bank = #{contractModel.issuer_bank}, bond_document = #{contractModel.security_path} where id = #{maxPerformance_id}")
	void updatePerformanceBond(@Param("contractModel") Contract contractModel,
			@Param("maxPerformance_id") Long maxPerformance_id);

	@Update("update addendum_performance_bond set bond_amount = #{contractModel.bond_amount}, bond_expiry_date = #{contractModel.bond_expiry_date}, issuer_bank = #{contractModel.issuer_bank}, bond_document = #{contractModel.security_path} where id = #{maxAddendumPerformance_id}")
	void updateAddendumPerformanceBond(@Param("contractModel") Contract contractModel,
			@Param("maxAddendumPerformance_id") Long maxAddendumPerformance_id);

	@Update("update contract set request_type= 'NO', type='Addendum' where id = #{contract_id}")
	void updatOriginalContract(Long contract_id);

	@Insert("insert into payments(paymentTerm, amount, dueDate, paymentDescription, contract_id, status, availability) values (#{paymentTerm}, #{amount}, #{dueDate}, #{paymentDescription}, ${contract_id}, '1', '1')")
	void savePayments(Payment payment);

	@Insert("insert into old_payments(paymentTerm, amount, dueDate, paymentDescription, old_contract_id, status, availability) values (#{paymentTerm}, #{amount}, #{dueDate}, #{paymentDescription}, ${contract_id}, '1', '1')")
	void saveOldPayments(Payment payment);

	@Insert("insert into temp_payments(paymentTerm, amount, dueDate, paymentDescription, temp_contract_id, status, availability) values (#{paymentTerm}, #{amount}, #{dueDate}, #{paymentDescription}, ${contract_id}, '1', '1')")
	void saveTempPayments(Payment payment);

	@Insert("insert into addendum_payments(paymentTerm, amount, dueDate, paymentDescription, addendum_id, status, availability) values (#{paymentTerm}, #{amount}, #{dueDate}, #{paymentDescription}, ${contract_id}, '1', '1')")
	void saveAddendumPayments(Payment payment);

	@Update("update payments set paymentTerm = #{paymentTerm}, amount = #{amount}, dueDate = #{dueDate}, paymentDescription = #{paymentDescription}, initait_by = #{initait_by}, approved_by = #{approved_by}, initaited_date = #{initaited_date}, reason = #{reason},paid_amount=#{paid_amount},status=#{status} where id = #{id}")
	void updatePayments(Payment payment);

	@Update("update addendum_payments set paymentTerm = #{paymentTerm}, amount = #{amount}, dueDate = #{dueDate}, paymentDescription = #{paymentDescription}, initait_by = #{initait_by}, approved_by = #{approved_by}, initaited_date = #{initaited_date}, reason = #{reason},paid_amount=#{paid_amount},status=#{status}  where id = #{id}")
	void updateAddendumPayments(Payment payment);

	@Insert("insert into contract_product(product_id, contract_id, status, availability) values(#{product_id}, #{contract_id}, '1', '1')")
	void addContractProduct(@Param("product_id") Long product_id, @Param("contract_id") Long contract_id);

	@Insert("insert into contract_service(service_id, contract_id, status, availability) values(#{service_id}, #{contract_id}, '1', '1')")
	void addContractService(@Param("service_id") Long service_id, @Param("contract_id") Long contract_id);

	@Select("insert into payment(paid_amount, confirmation_document, date, payment_description, status, availability) OUTPUT Inserted.id values(#{paid_amount}, #{confirmation_path}, #{date}, #{payment_deccription}, '1', '1')")
	Long addPayment(Contract contractModel);

	@Insert("insert into contract_payment(payment_id, contract_id, status, availability) values(#{payment_id}, #{contract_id}, '1', '1')")
	void addContractPayment(@Param("payment_id") Long payment_id, @Param("contract_id") Long contract_id);

	@Insert("insert into contract_vendor(vendor_id, contract_id, status, availability) values(#{vendor_id}, #{contract_id}, '1', '1')")
	void addContractVendor(@Param("vendor_id") Long vendor_id, @Param("contract_id") Long contract_id);

	@Select("select p.* from products p join contract_product cp on p.id = cp.product_id where cp.contract_id = #{contractId} and p.status = 1 and p.availability = 1 and cp.status = 1 and cp.availability = 1")
	public Collection<Product> getProductByContractId(Long contractId);

	@Select("select s.* from services s join contract_service cs on s.id = cs.service_id where cs.contract_id = #{contractId} and s.status = 1 and s.availability = 1 and cs.status = 1 and cs.availability = 1")
	public Collection<Product> getServiceByContractId(Long contractId);

	@Select("select request_date from temp_contract where contract_id = #{id}")
	String getRequestDate(Long id);

	@Select("select requested_by from temp_contract where contract_id = #{id}")
	String getRequestedBy(Long id);

	// @Select("SELECT c.*, v.name AS vendor_name, \r\n" + " (SELECT
	// COALESCE(SUM(p.paid_amount), 0) \r\n"
	// + " FROM payment p \r\n" + " JOIN contract_payment cp ON cp.payment_id = p.id
	// \r\n"
	// + " WHERE cp.contract_id = c.id and p.status=2) AS paid_amount \r\n" + "FROM
	// contract c\r\n"
	// + "JOIN contract_vendor cv ON c.id = cv.contract_id\r\n" + "JOIN vendors v ON
	// cv.vendor_id = v.id\r\n"
	// + "WHERE c.availability = '1';")
	// @Results(value = { @Result(property = "id", column = "id"),
	// @Result(property = "products", javaType = List.class, column = "id", many =
	// @Many(select = "getProductByContractId")),
	// @Result(property = "services", javaType = List.class, column = "id", many =
	// @Many(select = "getServiceByContractId"))
	// })
	@Select("select c.*, v.name as vendor_name from contract c join contract_vendor cv on c.id=cv.contract_id join vendors v on cv.vendor_id=v.id where c.availability=1")
	public List<ContractView> getAllContracts();

	// new
	@Select("select * from payments where  contract_id=#{id}")
	public List<Payment> getPaymentsByContractId(long id);

	@Select("select * from temp_payments where  temp_contract_id=(select id from temp_contract where contract_id=#{id})")
	public List<Payment> getTempPaymentsByContractId(Long id);

	@Select("select * from addendum_payments where  addendum_id=(select max(id) from addendum_contract where contract_id=#{id})")
	public List<Payment> getAddendumPaymentsByContractId(Long id);

	@Select("select p.*,c.payment_frequency,c.amount_per_frequency,c.total_amount from payment p,contract_payment cp,contract c where p.id=cp.payment_id and  cp.contract_id=#{id} and c.id= cp.contract_id ORDER BY p.id ASC")
	public List<ContractView> getPaymentByContractId(long id);

	// @Select("SELECT c.*, v.id AS vendor_name, (SELECT top 1 p.paid_amount \r\n"
	// + " FROM payment p JOIN contract_payment cp ON cp.payment_id = p.id \r\n"
	// + " WHERE cp.contract_id = c.id) AS paid_amount,(SELECT top 1 p.date \r\n"
	// + " FROM payment p JOIN contract_payment cp ON cp.payment_id = p.id \r\n"
	// + " WHERE cp.contract_id = c.id) AS date FROM contract c\r\n"
	// + " JOIN contract_vendor cv ON c.id = cv.contract_id JOIN vendors v ON
	// cv.vendor_id = v.id\r\n"
	// + " WHERE c.availability = '1' and c.id=#{contract_id};")
	// @Results(value = { @Result(property = "id", column = "id"),
	// @Result(property = "products", javaType = List.class, column = "id", many =
	// @Many(select = "getProductByContractId")),
	// @Result(property = "services", javaType = List.class, column = "id", many =
	// @Many(select = "getServiceByContractId")) })
	// public ContractView get_contractById(@Param("contract_ id") String
	// contract_id);
	@Select("SELECT c.*, v.id AS vendor_name, v.name as name_vendor,v.email,v.location,v.post_number,v.bank_name,v.branch_name,v.account_name,v.account_number,v.swift_code,v.beneficiary_address,v.iban, pb.bond_amount, pb.bond_expiry_date,  pb.issuer_bank, pb.bond_document as security_document, pb.contract_id\n"
			+ //
			"FROM contract c\n" + //
			"JOIN contract_vendor cv ON c.id = cv.contract_id\n" + //
			"JOIN vendors v ON cv.vendor_id = v.id\n" + //
			"LEFT JOIN performance_bond pb ON c.id = pb.contract_id\n" + //
			"AND pb.id = (SELECT TOP 1 id FROM performance_bond WHERE contract_id = #{contract_id} ORDER BY id DESC) WHERE c.id=#{contract_id}")
	public ContractView get_contractById(@Param("contract_id") String contract_id);

	@Select("select * from licence where id=#{licence_id}")
	public Licence get_licenceById(@Param("licence_id") String licence_id);

	@Select("select * from temp_licence where licence_id=#{licence_id}")
	public Licence getTemp_licenceById(@Param("licence_id") String licence_id);

	@Select("SELECT c.*, v.id AS vendor_name, v.name as name_vendor, pb.* \n" + //
			"FROM temp_contract c\n" + //
			"JOIN contract_vendor cv ON c.contract_id = cv.contract_id\n" + //
			"JOIN vendors v ON cv.vendor_id = v.id\n" + //
			"LEFT JOIN temp_performance_bond pb ON c.id = pb.temp_contract_id AND pb.id = #{bond_id}\n" + //
			"WHERE c.contract_id=#{contract_id}")
	public ContractView get_temp_contractById(@Param("contract_id") String contract_id,
			@Param("bond_id") long bond_id);

	@Select("SELECT c.*, v.id AS vendor_name, v.name as name_vendor, pb.* \n" + //
			"FROM addendum_contract c\n" + //
			"JOIN contract_vendor cv ON c.contract_id = cv.contract_id\n" + //
			"JOIN vendors v ON cv.vendor_id = v.id\n" + //
			"JOIN addendum_performance_bond pb ON c.id = pb.addendum_id\n" + //
			"WHERE c.contract_id=#{contract_id} AND pb.id = #{bond_id} and c.status=1")
	public ContractView get_addendum_contractById(@Param("contract_id") String contract_id,
			@Param("bond_id") long bond_id);

	@Select("SELECT tp.id  FROM temp_performance_bond tp JOIN temp_contract tc ON tp.temp_contract_id = tc.id WHERE tc.contract_id = #{contract_id}")
	Long getTempbondId(String contract_id);

	@Select("SELECT max(ap.id)  FROM addendum_performance_bond ap JOIN addendum_contract ac ON ap.addendum_id = ac.id WHERE ac.contract_id = #{contract_id}")
	long getAddendumbondId(String contract_id);

	@Select("select * from vendors where id=#{vendor_id}")
	public Vendors getBankDetail(@Param("vendor_id") String vendor_id);

	@Update("update contract set availability='0' where id=#{contract_id}")
	public boolean deleteContractById(@Param("contract_id") Long contract_id);

	@Select("insert into payment(paid_amount, confirmation_document, date, payment_description,payment_contigency,amount_per_contigency, status, availability) OUTPUT Inserted.id values(#{paid_amount}, #{confirmation_path}, #{date}, #{payment_deccription},#{payment_contigency},#{amount_per_contigency}, '1', '1')")
	Long addPaymentaftercontract(Contract contractModel);

	// demeke start
	@Select("SELECT TOP 1 p.confirmation_document FROM payment p JOIN contract_payment cp ON p.id = cp.payment_id\r\n"
			+ "JOIN contract c ON cp.contract_id = c.id WHERE c.id = #{contract_id}")
	public String getConfirmationPathInContract(@Param("contract_id") Long contract_id);

	@Select("SELECT contract_document_document from contract where id=#{contract_id}")
	public String getContractPathInContract(@Param("contract_id") Long contract_id);

	@Select("SELECT contract_document_document from addendum_contract where contract_id=#{contract_id} and status=1")
	public String getContractPathInAddendumContract(@Param("contract_id") Long contract_id);

	@Select("SELECT request_type from contract where id=#{contract_id}")
	public String getRequestType(@Param("contract_id") Long contract_id);

	@Select("SELECT contract_document_document from temp_contract where contract_id=#{contract_id}")
	public String getContractPathInTempContract(@Param("contract_id") Long contract_id);

	@Select("SELECT bond_document as security_document from performance_bond where contract_id=#{contract_id}")
	public String getSecurityPathInContract(@Param("contract_id") Long contract_id);

	@Select("SELECT bond_document as security_document from addendum_performance_bond where addendum_id=(select id from addendum_contract where contract_id =#{contract_id} and status=1)")
	public String getSecurityPathInAddendumBond(@Param("contract_id") Long contract_id);

	@Select("SELECT bond_document from temp_performance_bond where temp_contract_id=(select id from temp_contract where contract_id=#{contract_id})")
	public String getSecurityPathInTempContract(@Param("contract_id") Long contract_id);

	// update contract by maker before aproval
	@Update("update contract set contract_type = #{contract_type}, start_date=#{start_date}, end_date=#{end_date}, total_amount=#{total_amount}, currency=#{currency},  payment_method=#{payment_method},"
			+ " payment_status='incomplete', contract_title=#{contract_title}, directorate=#{directorate}, vat=#{vat}, sla=#{sla}, "
			+ " contract_document_document=#{contract_path} where id = #{id};")
	public void updateContract(Contract contract);

	@Update("update addendum_contract set contract_type = #{contract_type}, start_date=#{start_date}, end_date=#{end_date}, total_amount=#{total_amount}, currency=#{currency},  payment_method=#{payment_method},"
			+ " contract_title=#{contract_title}, directorate=#{directorate}, vat=#{vat}, sla=#{sla}, "
			+ " contract_document_document=#{contract_path}, request_type='NO', approved_date=#{approved_date}, approved_by=#{approved_by}, status= '2' where contract_id = #{id} and status=1;")
	public void updateAddendumContractDuringApproval(Contract contract);

	@Update("update contract set contract_type = #{contract_type}, start_date=#{start_date}, end_date=#{end_date}, total_amount=#{total_amount}, currency=#{currency},  payment_method=#{payment_method},"
			+ " contract_title=#{contract_title}, directorate=#{directorate}, vat=#{vat}, sla=#{sla}, "
			+ " contract_document_document=#{contract_path}, request_type='NO', request_date=#{request_date}, requested_by=#{requested_by}, approved_date=#{approved_date}, approved_by=#{approved_by} where id = #{id};")
	public void updateContractAfterApproval(Contract contract);

	@Update("update contract_vendor set vendor_id=#{vendor_id} where contract_id=#{contract_id}")
	public void updateContractVendor(@Param("vendor_id") Long vendor_id, @Param("contract_id") Long contract_id);

	@Delete("delete from contract_product where contract_id = #{id}")
	public void deleteContractProduct(@Param("id") Long id);

	@Delete(" delete from temp_payments where temp_contract_id= (select id from temp_contract where contract_id=#{id}); "
			+ " delete from temp_performance_bond where temp_contract_id=(select id from temp_contract where contract_id=#{id}); "
			+ " delete from temp_contract where contract_id=#{id}; ")
	public void deleteTempInfo(@Param("id") Long id);

	@Delete("delete from contract_service where contract_id = #{id}")
	public void deleteContractService(@Param("id") Long id);

	@Select("SELECT TOP 1 p.id FROM payment p JOIN contract_payment cp ON p.id = cp.payment_id\r\n"
			+ "JOIN contract c ON cp.contract_id = c.id WHERE c.id = #{contract_id}")
	public Long getPaymentIdByContractId(@Param("contract_id") Long contract_id);

	@Update("update payment set paid_amount=#{paid_amount}, confirmation_document=#{confirmation_path}, date=#{date}, payment_description=#{payment_deccription} where id=#{id}")
	public void updatePayment(Contract contractModel);

	@Update("update contract set request_type = #{request_type}   where id = #{contract_id};")
	public void addRequestType(@Param("request_type") String request_type, @Param("contract_id") Long contract_id);

	@Select("insert into extend_and_renew(total_amount, contract_document_document, start_date, end_date,type, status, availability) OUTPUT Inserted.id values(#{total_amount}, #{contract_path}, #{start_date}, #{end_date},#{contract_type}, '1', '1')")
	Long addExtendRenew(Contract contractModel);

	@Insert("insert into contract_extend_and_renew(contract_id,extend_and_renew_id, status, availability) OUTPUT Inserted.id values(#{contract_id}, #{extend_and_renew_id}, '1', '1')")
	void addContractExtendRenew(@Param("extend_and_renew_id") Long extend_and_renew_id,
			@Param("contract_id") Long contract_id);

	@Update("update contract set request_type = 'Hold' where id = #{contract_id}")
	public void deactivate_contract(@Param("contract_id") Long contract_id);

	@Update("update contract set request_type = 'Unhold' where id = #{contract_id}")
	public void activate_contract(@Param("contract_id") Long contract_id);

	@Update("update contract set request_type = 'Pending_payment' where id = #{contract_id}")
	public void pending_payment_contract(@Param("contract_id") Long contract_id);

	@Update("update contract set request_type = 'Complete' where id = #{contract_id}")
	public void complete_contract(@Param("contract_id") Long contract_id);

	@Update("update contract set request_type = 'Terminate' where id = #{contract_id}")
	public void terminate_contract(@Param("contract_id") Long contract_id);

	@Insert("INSERT INTO user_reason(reason_id, user_id,contract_id,status,availability)  values(#{reason_id},#{user_id},#{contract_id},1,1)")
	public void addUserReasonForContract(@Param("reason_id") Long reason_id, @Param("user_id") Long user_id,
			@Param("contract_id") Long contract_id);

	@Select("select r.*,ur.sender_id as created_by from remark r join users_remark ur on r.id = ur.remark_id where ur.contract_id = #{contractId} and r.status = 1 and r.availability = 1 and ur.status = 1 and ur.availability = 1")
	List<Remarks> getRemarksByContractId(String contractId);

	@Select("select r.*,ur.user_id as created_by from reasons r join user_reason ur on r.id = ur.reason_id where ur.contract_id = #{contractId} and r.status = 1 and r.availability = 1 and ur.status = 1 and ur.availability = 1")
	List<Reasons> getReasonsByContractId(String contractId);

	@Insert("INSERT INTO users_remark(remark_id, sender_id,receiver_id,contract_id,status,availability)  values(#{remark_id},#{sender_id},#{reciver_id},#{contract_id},1,1)")
	public void addUserContractRemark(@Param("remark_id") Long remark_id, @Param("sender_id") Long sender_id,
			@Param("reciver_id") Long reciver_id, @Param("contract_id") Long contract_id);

	@Select("SELECT bond_document \n" + //
			"FROM performance_bond \n" + //
			"WHERE contract_id = #{id} \n" + //
			"AND id = (SELECT MAX(id) FROM performance_bond WHERE contract_id = #{id})")
	public String downloadFiles_security(Long id);

	@Select("select contract_document_document from contract where id=#{id}")
	public String downloadFiles_contract(Long id);

	@Select("select contract_document_document from addendum_contract where id=#{id}")
	public String downloadFiles_addendum(Long id);

	@Select("select confirmation_document from payment where id=#{id}")
	public String downloadFiles_payment_confirmation(Long id);

	@Select("select top 1 id from vendors where name = #{vendor_name} and status != 0 and availability = 1")
	public Boolean checkVendorName(String vendor_name);

	@Select("select top 1 id from directorates where name = #{directorate_name} and availability = 1")
	public Boolean checkDirectorateExists(String directorate_name);

	@Select("select top 1 id from issuer_bank where name = #{bank_name} and availability = 1")
	public Boolean checkBankExists(String bank_name);

	@Insert("insert into user_vendor(maker_id, vendor_id, status, availability) values(#{maker_id}, #{vendor_id},1,1)")
	void addUserVendor(@Param("maker_id") Long maker_id, @Param("vendor_id") Long vendor_id);

	@Insert("insert into user_contract(maker_id, contract_id, status, availability) values(#{maker_id}, #{contract_id},1,1)")
	void addUserContract(@Param("maker_id") Long maker_id, @Param("contract_id") Long contract_id);

	@Select("INSERT INTO pre_extend_and_renew(end_date,total_amount,type,start_date,status,availability)OUTPUT Inserted.id "
			+ "SELECT end_date,total_amount,type,extend_renew_date,status,availability"
			+ " FROM contract where id = #{id};")
	Long moveContractPreviousExtend(@Param("id") Long id);

	@Select("INSERT INTO pre_extend_and_renew(end_date,total_amount,contract_document_document,type,start_date,status,availability)OUTPUT Inserted.id "
			+ "SELECT end_date,total_amount,contract_document_document,type,extend_renew_date,status,availability"
			+ " FROM contract where id = #{id};")
	Long moveContractPreviousRenew(@Param("id") Long id);

	@Update("update contract set end_date=#{end_date},total_amount=#{total_amount},type=#{contract_type},extend_renew_date=#{start_date},request_type=Null"
			+ " where id = #{id};")
	Long extendContract(Contract contract);

	@Update("update contract set end_date=#{end_date},total_amount=#{total_amount},type=#{contract_type},extend_renew_date=#{start_date},contract_document_document=#{contract_path},request_type=Null"
			+ " where id = #{id};")
	Long renewContract(Contract contract);

	@Insert("insert into contract_pre_extend_and_renew(contract_id,pre_extend_and_renew_id, status, availability) values(#{contract_id}, #{pre_extend_and_renew_id},1,1)")
	void addContractPrextendAndRenew(@Param("contract_id") Long contract_id,
			@Param("pre_extend_and_renew_id") Long pre_extend_and_renew_id);

	@Select("select extend_and_renew_id from contract_extend_and_renew  where contract_id=#{id}")
	public Long extend_and_renew_id(Long id);

	@Delete("delete from contract_extend_and_renew where contract_id = #{contract_id};delete from extend_and_renew where id = #{id}")
	void deletExtendRenew(@Param("contract_id") Long contract_id, @Param("id") Long id);

	@Select("select contract_document_document from extend_and_renew where id=#{id}")
	public String downlFileContractRenew(Long id);

	@Insert("insert into Contract_types(name, description, created_date, created_by, status, availability) values(#{name}, #{description}, #{created_date}, #{created_by}, #{status}, #{availability})")
	void register_ContractType(Product productModel);

	@Update("update Contract_types set name=#{name}, description=#{description}  where id=#{id}")
	void update_Contract_type(Product productModel);

	@Update("update contract set request_type=#{request_type} where id=#{contract_id}")
	void updateContractRequestType(@Param("request_type") String request_type, @Param("contract_id") Long contract_id);

	@Select("select * from Contract_types where availability=1")
	public List<Product> getAllContractTypes();

	@Select("select * from vendors where availability=1 and status=2")
	public List<Vendors> getVendorsForReport();

	@Select("select * from Contract_types where id=#{product_id}")
	public Product get_ContractType(@Param("product_id") String product_id);

	@Update("update Contract_types set status = '0' where id = #{product_id}")
	public void deactivate_ContractType(@Param("product_id") Long product_id);

	@Update("update Contract_types set status = '1' where id = #{product_id}")
	public void activate_ContractType(@Param("product_id") Long product_id);

	@Update("update Contract_types set availability = '0' where id = #{product_id}")
	public void delete_ContractType(@Param("product_id") Long product_id);

	@Insert("insert into Payment_status(name, description, created_date, created_by, status, availability) values(#{name}, #{description}, #{created_date}, #{created_by}, #{status}, #{availability})")
	void register_PaymentStatus(Product productModel);

	@Update("update Payment_status set name=#{name}, description=#{description}  where id=#{id}")
	void update_PaymentStatus(Product productModel);

	@Select("select * from Payment_status where availability=1")
	public List<Product> getAllPaymentStatus();

	@Select("select * from Payment_status where id=#{product_id}")
	public Product get_PaymentStatus(@Param("product_id") String product_id);

	@Update("update Payment_status set status = '0' where id = #{product_id}")
	public void deactivate_PaymentStatus(@Param("product_id") Long product_id);

	@Update("update Payment_status set status = '1' where id = #{product_id}")
	public void activate_PaymentStatus(@Param("product_id") Long product_id);

	@Update("update Payment_status set availability = '0' where id = #{product_id}")
	public void delete_PaymentStatus(@Param("product_id") Long product_id);

	@Select("SELECT SLA_document from contract where id=#{contract_id}")
	public String getSLAPathInContract(@Param("contract_id") Long contract_id);

	@Select("select p.* from payments p where p.contract_id=#{id}")
	public List<Payment> getPaymentByContractIdForContractDetail(long id);

	@Select("select p.* from old_payments p where p.old_contract_id=#{id}")
	public List<Payment> getOldPaymentByOldContractId(long id);

	@Select("select p.* from addendum_payments p where p.addendum_id=#{id}")
	public List<Payment> getAddendumPaymentByAddendumContractId(long id);

	@Delete("delete contract_payment  where payment_id = #{payment_id};delete payment where id=#{payment_id}")
	public void delete_Payment(@Param("payment_id") Long product_id);

	@Update("update payment set date = #{date}, paid_amount=#{paid_amount},payment_description=#{payment_deccription} where id = #{id};")
	public void updatePaymentByPaymentId(Contract contract);

	@Update("update payment set date = #{date},paid_date = #{payment_start_date}, paid_amount=#{paid_amount},payment_description=#{payment_deccription},confirmation_document=#{confirmation_path},payment_contigency=#{payment_contigency},amount_per_contigency=#{amount_per_contigency},request_type='pending' where id = #{id};")
	public void pendingPayment(Contract contract);

	@Update("update payment set request_type = NULL, status='2' where id = #{id};")
	public void ApprovePayment(Long id);

	@Update("update contract set request_type = NULL where id = #{id};")
	public void ApprovePaymentWithnContract(Long id);

	@Select("select cp.contract_id from contract_payment cp where cp.payment_id=#{id}")
	public Long getContractIdByPaymentId(long id);

	@Update("update payment set request_type = NULL where id = #{id};")
	public void rejectPaymentRequest(Long id);

	@Select("select contract_id from contract_payment where payment_id= #{id};")
	public Long contract_id(Long id);

	@Select("SELECT c.*, pb.bond_amount, pb.bond_expiry_date, pb.issuer_bank, pb.bond_document AS security_document\r\n"
			+ //
			"FROM old_contract c\r\n" + //
			"LEFT JOIN old_performance_bond pb ON c.id = pb.old_contract_id\r\n" + //
			"WHERE c.contract_id = #{id}")
	public List<ContractView> getDetailHistory(long id);

	@Select("SELECT c.*, pb.bond_amount, pb.bond_expiry_date, pb.issuer_bank, pb.bond_document AS security_document\r\n"
			+ //
			"FROM addendum_contract c\r\n" + //
			"JOIN addendum_performance_bond pb ON c.id = pb.addendum_id\r\n" + //
			"WHERE c.contract_id = #{id}")
	public List<ContractView> getContractAddendum(long id);

	@Select("select contract_document_document from pre_extend_and_renew where id=#{id}")
	public String downloadFiles_contract_renew(Long id);

	@Select("select vpv.vendor_id as id,vp.id as history_id,vp.* from vendors_previous vp,vendor_previous_vendor vpv where vp.availability = '1'\r\n"
			+ "		and vp.id=vpv.vendor_previous_id and vpv.vendor_id=#{id}")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "products", javaType = List.class, column = "id", many = @Many(select = "getProductByVendorId")),
			@Result(property = "services", javaType = List.class, column = "id", many = @Many(select = "getServiceByVendorId"))
	// @Result(property = "rights", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getUserRights")),
	// @Result(property = "subject", javaType = List.class, column = "id", many =
	// @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId"))
	})
	public List<Vendor> getVendorHistory(Long id);

	@Select("insert into notification(title, created_date, type,status, availability) OUTPUT Inserted.id values(#{title}, #{create_date}, #{description},1,1 )")
	Long addNotification(Remark remark);

	@Select("insert into vendor_notification(notification_id, vendor_id,status, availability)  values(#{notification_id}, #{vendor_id},1,1 )")
	Long Vendor_Notification(@Param("notification_id") Long notification_id, @Param("vendor_id") Long vendor_id);

	@Select("insert into user_notification(notification_id, user_id,status)  values(#{notification_id}, #{user_id},0 )")
	Long user_Notification(@Param("notification_id") Long notification_id, @Param("user_id") Long user_id);

	@Select("select u.id from users u,roles r,user_role ur where u.id=ur.user_id and r.id=ur.role_id and r.name='Maker' and r.status=1 and r.availability=1\r\n"
			+ "and u.status=1 and u.availability=1")
	List<Long> roleId();

	@Select("insert into contract_notification(notification_id, contract_id,status, availability)  values(#{notification_id}, #{contract_id},1,1 )")
	Long Contract_Notification(@Param("notification_id") Long notification_id, @Param("contract_id") Long contract_id);

	@Select("insert into licence_notification(notification_id, licence_id, status, availability)  values(#{notification_id}, #{licence_id},1,1 )")
	Long licence_notification(@Param("notification_id") Long notification_id, @Param("licence_id") Long licence_id);

	@Select("SELECT distinct \r\n" + "    n.title,\r\n" + "    n.created_date,\r\n" + "    n.type AS created_by,\r\n"
			+ "    COALESCE(vn.vendor_id, 0) + COALESCE(cn.contract_id, 0) AS id,un.user_id as email\r\n" + "FROM\r\n"
			+ "    notification n\r\n" + "	LEFT JOIN\r\n"
			+ "    vendor_notification vn ON n.id = vn.notification_id\r\n" + "LEFT JOIN\r\n"
			+ "    vendors v ON vn.vendor_id = v.id\r\n" + "LEFT JOIN\r\n"
			+ "    contract_notification cn ON n.id = cn.notification_id\r\n" + "	LEFT JOIN\r\n"
			+ "    user_notification un ON n.id = un.notification_id\r\n" + "LEFT JOIN\r\n"
			+ "    contract c ON cn.contract_id = c.id\r\n" + "	WHERE\r\n" + "    (v.request_type IS NULL\r\n"
			+ "    OR c.request_type IS NULL)\r\n"
			+ "    AND un.status = 0 and un.user_id=#{id} and COALESCE(vn.vendor_id, 0) + COALESCE(cn.contract_id, 0)!=0 ORDER BY n.created_date DESC\r\n"
			+ "")
	List<Remarks> getMakerNotification(Long id);

	@Select("select notification_id from contract_notification where contract_id=#{id}")
	public Long viewContractNotification(@Param("id") Long id);

	@Select("select notification_id from vendor_notification where vendor_id=#{id}")
	public Long viewVendorNotification(@Param("id") Long id);
	@Select("select notification_id from payments_notification where vendor_id=#{id}")
	public Long viewPaymentNotification(@Param("id") Long id);

	@Delete("Delete from user_notification  where notification_id = #{id} and user_id=#{user_id}")
	public void notificationChecked(@Param("id") Long id, @Param("user_id") Long user_id);

	@Delete("Delete from vendor_notification  where vendor_id = #{id}")
	public void Delete_vendor_notification(@Param("id") Long id);

	@Delete("delete from licence_notification  where licence_id = #{id}")
	public void delete_licence_notification(@Param("id") Long id);

	@Delete("Delete from contract_notification  where contract_id = #{id}")
	public void Delete_contract_notification(@Param("id") Long id);

	@Select("select name from vendors  where id=#{id}")
	public String vendorName(@Param("id") Long id);

	@Select("SELECT MAX(id) FROM performance_bond WHERE contract_id = #{id}")
	Long getMaxPerformanceId(Long id);

	@Select("SELECT MAX(id) FROM addendum_performance_bond WHERE addendum_id=(select id from addendum_contract where contract_id = #{id} and status=1)")
	Long getMaxAddendumPerformanceId(Long id);

	@Select("select c.*, v.name as vendor_name from contract c join contract_vendor cv on c.id=cv.contract_id join vendors v on cv.vendor_id=v.id  where c.availability=1 and cv.vendor_id=#{vendorId}")
	public List<ContractView> get_Contracts_by_vendorId(@Param("vendorId") Long vendorId);

	@Select("select p.* from payments p where p.id=#{id}")
	public List<Payment> getPaymentByPaymentId(@Param("id") long id);

	@Select("select ap.* from addendum_payments ap where ap.id=#{id}")
	public List<Payment> getAddendumPaymentByPaymentId(@Param("id") long id);

	@Select("insert into file_table(name, path, payment_id,crtd, status, availability) OUTPUT Inserted.id values(#{name}, #{path}, #{payment_id}, #{crtd}, #{status}, #{availability})")
	Long paymenProcesse(FileTable fileModel);

	@Select("SELECT * FROM file_table WHERE payment_id = #{id}")
	public List<FileTable> payment_files_by_payment_id(Long id);

	@Delete("delete file_table  where id = #{file_id};")
	public void delete_file(@Param("file_id") Long file_id);

	@Select("SELECT path FROM file_table WHERE id = #{id}")
	public String download_and_preview_files(Long id);

	@Delete({
			"UPDATE payments",
			"SET status = 1, reason = NULL, paid_amount = NULL,",
			"initait_by = NULL, initaited_date = NULL",
			"WHERE id = #{id};",
			"DELETE FROM file_table WHERE payment_id = #{id};"
	})
	public void remove_payments(@Param("id") Long id);

	@Delete({
			"UPDATE addendum_payments",
			"SET status = 1, reason = NULL, paid_amount = NULL,",
			"initait_by = NULL, initaited_date = NULL",
			"WHERE id = #{id};",
			"DELETE FROM file_table WHERE payment_id = #{id};"
	})
	public void remove_Addendumpayments(@Param("id") Long id);

	@Select("SELECT id, paymentTerm, amount, dueDate, paidDate, paymentDescription, paid_amount, contract_id, "
			+
			"NULL AS addendum_id, status, availability, initait_by, approved_by, initaited_date, reason, 0 AS addendum_type "
			+
			"FROM payments WHERE contract_id = #{id} " +
			"UNION " +
			"SELECT id, paymentTerm, amount, dueDate, paidDate, paymentDescription," +
			" paid_amount, NULL AS contract_id, addendum_id, status, availability, initait_by, approved_by, " +
			"initaited_date, reason, 1 AS addendum_type " +
			"FROM addendum_payments WHERE addendum_id IN (SELECT id FROM addendum_contract WHERE contract_id = #{id})")
	List<Payment> getPaymentsByContractIdAndIfExistAddendum(@Param("id") long id);

	@Select("SELECT r.reason, r.[date],  CONCAT(u.firstname, ' ', u.middlename, ' ', u.lastname) AS created_by FROM reasons r INNER JOIN user_reason ur ON r.id = ur.reason_id INNER JOIN users u ON u.id = ur.user_id WHERE ur.payment_id = #{paymentId} AND r.status = 1 AND r.availability = 1 AND ur.status = 1")
	List<Reasons> getReasonsByPaymentId(String paymentId);

	@Select("select status from licence where id=#{id}")
	String getLicenceStatus(Long id);

	@Update("update licence set request_type = 'update/renew' where id= #{id}")
	void updateLicenceRequestType(Long id);

	@Select("select file_path from licence where id = #{id}")
	String getLicencePathInLicence(Long id);

	@Select("select file_path from temp_licence where licence_id = #{id}")
	String getLicencePathInTempLicence(Long id);

	@Select("select requested_by from temp_licence where licence_id = #{id}")
	String getLicenceRequestedBy(Long id);

	@Select("select request_date from temp_licence where licence_id = #{id}")
	String getLicenceRequestDate(Long id);

	@Select(" insert into old_licence(vendor_id, contract_id, licence_id, product_service_name, licence_quantity, product_category, licence_type, start_date, expiry_date, renewal_date, total_cost, support_period, additional_info, file_path, request_type, requested_by, request_date, approved_by, approved_date)  "
			+ " select vendor_id, contract_id, id, product_service_name, licence_quantity, product_category, licence_type, start_date, expiry_date, renewal_date, total_cost, support_period, additional_info, file_path, request_type, requested_by, request_date, approved_by, approved_date from licence where id= #{id} ")
	void moveLicenceToOldLicence(long id);

	@Update("update licence set vendor_id = #{vendor_id}, contract_id = #{contract_id}, product_service_name = #{product_service_name}, licence_quantity = #{licence_quantity}, product_category = #{product_category}, licence_type = #{licence_type}, start_date = #{start_date}, expiry_date = #{expiry_date}, "
			+ " renewal_date = #{renewal_date}, total_cost = #{total_cost}, support_period = #{support_period}, additional_info = #{additional_info}, file_path = #{file_path}, request_type = 'NULL', requested_by = #{requested_by}, request_date = #{request_date}, approved_by = #{approved_by}, approved_date = #{approved_date} where id = #{id}")
	void updateLicenceDuringApproval(Licence licenceModel);

	@Delete("delete from temp_licence where licence_id = #{id}")
	void deleteTempLicence(Long id);

}
