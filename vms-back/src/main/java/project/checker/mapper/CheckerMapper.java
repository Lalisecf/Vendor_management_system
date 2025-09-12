package project.checker.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import project.maker.model.ContractView;
import project.maker.model.Reasons;
import project.maker.model.Remarks;
import project.maker.model.Vendor;

@Mapper
public interface CheckerMapper {
	@Update("update vendors set status = '2' where id = #{vendor_id}")
	public void ApproveVendor(Long vendor_id);

	@Update("update vendors set status = '0' where id = #{vendor_id}")
	public void reject_vendor(@Param("vendor_id") Long vendor_id);

	@Select("select distinct r.*,ur.user_id as created_by from reasons r,user_reason ur where ur.vendor_id =#{vendor_id} and r.id=ur.reason_id and r.status=1")
	public List<Reasons> get_reason(Long vendor_id);

	@Update("update vendors set availability = '0',request_type=NULL where id = #{vendor_id}")
	public void accept_vendor_delete(@Param("vendor_id") Long vendor_id);

	@Update("update vendors set status = '2',request_type=NULL where id = #{vendor_id}")
	public void accept_vendor_activate(@Param("vendor_id") Long vendor_id);

	@Update("update vendors set status = '3',request_type=NULL where id = #{vendor_id}")
	public void accept_vendor_deactivate(@Param("vendor_id") Long vendor_id);

	@Update("update reasons set status='0' where id = #{id} and status=1")
	public void deleteUserReason(@Param("id") Long id);

	@Update("update vendors set request_type =NULL where id = #{vendor_id}")
	public void vendor_request_type(@Param("vendor_id") Long vendor_id);

	@Select("select r.name from roles r,user_role ur where r.id=ur.role_id and ur.user_id=#{user_id}")
	public String rolename(@Param("user_id") Long user_id);

	@Select("select distinct ve.* from vendors v,vendors_edited ve,vendor_edited_vendor vev where ve.id=vev.vendor_edited_id and vev.vendor_id=#{vendor_id} and v.status=2")
	public Vendor get_vendor_id_new(@Param("vendor_id") Long vendor_id);

	@Update("update contract set status = '2', request_type = 'NO', approved_by = #{approved_by}, approved_date = #{approved_date} where id = #{contract_id}")
	public void ApproveContract(@Param("contract_id") Long contract_id, @Param("approved_by") String approved_by,
			@Param("approved_date") String approved_date);

	@Insert("INSERT INTO user_reason(reason_id, user_id,contract_id,status,availability)  values(#{reason_id},#{user_id},#{contract_id},1,1)")
	public void addUserReason(@Param("reason_id") Long reason_id, @Param("user_id") Long user_id,
			@Param("contract_id") Long contract_id);

	@Update("update contract set status = '0' where id = #{contract_id}")
	public void reject_contract(@Param("contract_id") Long contract_id);

	@Insert("INSERT INTO users_remark(remark_id, sender_id,receiver_id,contract_id,status,availability)  values(#{remark_id},#{sender_id},#{reciver_id},#{contract_id},1,1)")
	public void addUserRemark(@Param("remark_id") Long remark_id, @Param("sender_id") Long sender_id,
			@Param("reciver_id") Long reciver_id, @Param("contract_id") Long contract_id);

	@Select("select r.*,ur.sender_id as created_by from remark r join users_remark ur on r.id = ur.remark_id where ur.contract_id = #{ContractId} and r.status = 1 and r.availability = 1 and ur.status = 1 and ur.availability = 1")
	List<Remarks> getRemarksByContractId(String ContractId);

	@Select("select distinct r.*,ur.user_id as created_by from reasons r,user_reason ur where ur.contract_id =#{contract_id} and r.id=ur.reason_id and r.status=1")
	public List<Reasons> get_reason_contract(Long contract_id);

	@Update("update contract set status = '3',request_type=NULL where id = #{contract_id}")
	public void accept_contract_hold(@Param("contract_id") Long contract_id);

	@Update("update contract set hold_date = #{hold_date} where id = #{contract_id}")
	public void add_hold_date(@Param("contract_id") Long contract_id, @Param("hold_date") String hold_date);

	@Update("update contract set status = '2',request_type=NULL where id = #{contract_id}")
	public void accept_contract_unhold(@Param("contract_id") Long contract_id);

	@Update("update contract set unhold_date = #{unhold_date} where id = #{contract_id}")
	public void add_unhold_date(@Param("contract_id") Long contract_id, @Param("unhold_date") String unhold_date);

	@Update("update contract set status = '4',request_type=NULL where id = #{contract_id}")
	public void accept_terminate_request(@Param("contract_id") Long contract_id);

	@Update("update contract set status = '5',request_type=NULL where id = #{contract_id}")
	public void accept_complete_request(@Param("contract_id") Long contract_id);

	@Update("update contract set request_type =NULL where id = #{contract_id}")
	public void contract_request_type(@Param("contract_id") Long contract_id);

	@Update("update user_vendor set checker_id=#{checker_id} where vendor_id= #{vendor_id}")
	void updateUserVendor(@Param("checker_id") Long maker_id, @Param("vendor_id") Long vendor_id);

	@Update("update user_contract set checker_id=#{checker_id} where contract_id= #{contract_id}")
	void updateUserContrtact(@Param("checker_id") Long maker_id, @Param("contract_id") Long contract_id);

	@Select("select status from vendors where id=#{vendor_id}")
	public String GetVendorStatus(@Param("vendor_id") Long vendor_id);

	@Select("select distinct c.start_date,c.end_date,c.total_amount,c.contract_document_document,er.start_date as payment_start_date,er.end_date as payment_end_date,er.total_amount as paid_amount,er.contract_document_document as confirmation_document from contract c,extend_and_renew er,contract_extend_and_renew cer where c.id=cer.contract_id and er.id= cer.extend_and_renew_id and c.id=#{contract_id}\r\n"
			+ "")
	public List<ContractView> getcontractsId(Long contract_id);

	@Select("SELECT DISTINCT \r\n" + //
			"    n.title,\r\n" + //
			"    n.created_date,\r\n" + //
			"    n.type AS created_by,\r\n" + //
			"    COALESCE(vn.vendor_id, 0) + COALESCE(cn.contract_id, 0) AS id\r\n" + //
			"FROM \r\n" + //
			"    notification n\r\n" + //
			"LEFT JOIN \r\n" + //
			"    vendor_notification vn ON n.id = vn.notification_id\r\n" + //
			"LEFT JOIN \r\n" + //
			"    vendors v ON vn.vendor_id = v.id\r\n" + //
			"LEFT JOIN \r\n" + //
			"    contract_notification cn ON n.id = cn.notification_id\r\n" + //
			"LEFT JOIN \r\n" + //
			"    contract c ON cn.contract_id = c.id\r\n" + //
			"LEFT JOIN \r\n" + //
			"    temp_contract tc ON cn.contract_id = tc.contract_id\r\n" + //
			"\r\n" + //
			"WHERE \r\n" + //
			"    v.request_type IS NOT NULL \r\n" + //
			"    OR c.request_type IS NOT NULL \r\n" + //
			"\tOR tc.request_type IS NOT NULL \r\n" + //
			"    OR v.status = 1 \r\n" + //
			"    OR c.status = 1 \r\n" + //
			"ORDER BY \r\n" + //
			"    n.created_date DESC")
	List<Remarks> getCheckerNotification();

}
