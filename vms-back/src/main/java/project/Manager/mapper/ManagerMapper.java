package project.Manager.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import project.Manager.model.PaymentDetailsDTO;
import project.Manager.model.RequestedPaymentsModel;
import project.Manager.model.file_table;
import project.maker.model.Payment;

@Mapper
public interface ManagerMapper {

	// @Select("select v.name,c.contract_title,p.* from contract c ,contract_vendor
	// cv,vendors v,payments p where cv.vendor_id = v.id \r\n" +
	// " and cv.contract_id = c.id and c.id = p.contract_id and v.availability = 1
	// and c.availability = 1 and cv.availability = 1 and p.availability = 1 and
	// p.status = 2")
	// public List<RequestedPaymentsModel> getPaymentByContractIdForRequest();

	@Select("SELECT  v.name,  c.contract_title, p.* FROM addendum_contract c JOIN contract_vendor cv ON cv.contract_id = c.contract_id JOIN vendors v ON cv.vendor_id = v.id JOIN addendum_payments p ON c.id = p.addendum_id WHERE v.availability = 1 AND c.availability = 1 AND cv.availability = 1 AND p.availability = 1 AND p.status = #{status};")
	public List<RequestedPaymentsModel> getPaymentByContractIdForAddendumRequest(long status);

	@Select("select v.name,c.contract_title,p.* from contract c ,contract_vendor cv,vendors v,payments p where cv.vendor_id = v.id \r\n"
			+
			"  and cv.contract_id = c.id and c.id = p.contract_id and v.availability = 1 and c.availability = 1 and cv.availability = 1 and p.availability = 1 and p.status = #{status}")
	public List<RequestedPaymentsModel> getPaymentByContractIdForRequest(long status);

	@Select("select p.* from payments p where p.id=#{id}")
	public Payment getPaymentByPaymentIdForPaymenttDetail(long id);

	@Select("select p.* from addendum_payments p where p.id=#{id}")
	public Payment getPaymentByPaymentIdForAddendumPaymenttDetail(long id);

	@Select("select d.* from file_table d where d.payment_id=#{payment_id}")
	public List<file_table> getPaymentsDocForPaymenttDetail(long payment_id);

	@Select("SELECT path \n" + //
			"FROM file_table \n" + //
			"WHERE id = #{id}")
	public String downloadFiles_payment(String id);

	@Update("update payments set status=#{status}, ${approved_by}=#{user_name},${action_date}=#{date}, paidDate=#{paiddate} where id = #{id};")
	public void ApprovePayment(@Param("id") Long id, @Param("user_name") String user_name,
			@Param("approved_by") String approved_by, @Param("action_date") String action_date,
			@Param("date") String date,
			@Param("paiddate") String paiddate,
			@Param("status") long status);

	@Update("update payments set status = #{status} , ${approved_by}=#{user_name},${action_date}=#{date} where id = #{payment_id};")
	public void reject_payment(@Param("payment_id") Long payment_id, @Param("user_name") String user_name,
			@Param("approved_by") String approved_by, @Param("action_date") String action_date,
			@Param("date") String date,
			@Param("status") long status);


	@Insert("INSERT INTO user_reason(reason_id, user_id,payment_id,status,availability)  values(#{reason_id},#{user_id},#{payment_id},1,1)")
	public void addUserReason(@Param("reason_id") Long reason_id, @Param("user_id") Long user_id,
			@Param("payment_id") Long payment_id);

	@Update("UPDATE addendum_payments SET status = #{status}, ${approved_by} = #{user_name},${action_date}=#{date},paidDate=#{paiddate} WHERE id = #{id};")
	public void ApproveAddendumPayment(@Param("id") Long id, @Param("user_name") String user_name,
			@Param("approved_by") String approved_by, @Param("action_date") String action_date,
			@Param("date") String date,
			@Param("paiddate") String paiddate,
			@Param("status") long status);

	@Update("update addendum_payments set status = #{status} , ${approved_by}=#{user_name},${action_date}=#{date} where id = #{payment_id};")
	public void reject_Addendum_payment(@Param("payment_id") Long payment_id, @Param("user_name") String user_name,
			@Param("approved_by") String approved_by, @Param("action_date") String action_date,
			@Param("date") String date,
			@Param("status") long status);

	@Select("select v.*,v.availability as vendor_availability,v.status as vendor_status,c.*,c.availability as contract_availability,c.status as contract_status, p.amount,p.paid_amount,p.paymentDescription,p.paymentTerm,p.reason,p.dueDate,paidDate,p.initait_by,p.approved_by,p.director,p.chief,p.finance,p.initaited_date, p.manager_action_date,p.director_action_date,p.chief_action_date,p.finance_action_date ,0 as addendum,p.status as payement_status,CONCAT('not_addendum_', p.id) AS payment_id from payments p,contract c,vendors v,contract_vendor cv  where v.id=cv.vendor_id "
			+ " and c.id=cv.contract_id and p.contract_id=c.id \r\n" + //
			" union" +
			" select v.*,v.availability as vendor_availability,v.status as vendor_status,c.*,c.availability as contract_availability,c.status as contract_status, p.amount,p.paid_amount,p.paymentDescription,p.paymentTerm,p.reason,p.dueDate,paidDate,p.initait_by,p.approved_by,p.director,p.chief,p.finance ,p.initaited_date, p.manager_action_date,p.director_action_date,p.chief_action_date,p.finance_action_date,1 as addendum ,p.status as payement_status,CONCAT('addendum_', p.id) AS payment_id from addendum_payments p,contract c,vendors v,contract_vendor cv ,addendum_contract ac where v.id=cv.vendor_id "
			+ " and c.id=cv.contract_id and ac.contract_id = c.id and p.addendum_id=ac.id")
	public List<PaymentDetailsDTO> getPaymentHistory();

}
