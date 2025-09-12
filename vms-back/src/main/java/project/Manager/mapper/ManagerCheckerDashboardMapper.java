package project.Manager.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.github.jknack.handlebars.internal.antlr.atn.SemanticContext.AND;

@Mapper
public interface ManagerCheckerDashboardMapper {
	
	// Vendor
	@Select("select count(*) from vendors where availability=1 and status=2")
	Integer getActiveVendor();
	
	@Select("select count(*) from payments where availability=1")
	Integer getTotalPayment();

	@Select("select sum(amount) from payments where availability=1") 
    Double getTotalPaymentAmount();
  
	
	@Select("select count(*) from payments where status=3 and availability=1")
	Integer getRejectPayment();

    @Select("select count(*) from payments where status=2 or status=4 or status=5 or status=6  and availability=1")
	Integer getInitiatedpayment();
	

	@Select("select count(*) from payments where status=1 and availability=1")
	Integer getnotInitiatedpayment();

	@Select("select COALESCE(sum(amount), 0) from payments where status=3 and availability=1")
    Integer getRejectPaymentAmount();


	@Select("select count(*) from payments where status=7 and availability=1")
	Integer total_payments_paid();

	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND dueDate > CAST(GETDATE() AS DATE)")
    Integer getExcessedDueDate_payments();

	
	@Select("select count(*) from addendum_payments")
	Integer getAddedumTotalPayment();

	@Select("select sum(amount) from addendum_payments") 
    Double getAddedumTotalPaymentAmount();
  
	
	@Select("select count(*) from addendum_payments where status=3")
	Integer getAddedumRejectPayment();

    @Select("select count(*) from addendum_payments where status=1")
	Integer getAddedumInitiatedpayment();

	@Select("select count(*) from addendum_payments where status=1")
	Integer getnotInitiatedAddedumpayment();

	@Select("select count(*) from addendum_payments where status=7")
	Integer total_Addedumpayments_paid();

	@Select("SELECT COUNT(*) " +
        "FROM addendum_payments " +
        "WHERE TRY_CAST(dueDate AS DATE) > CAST(GETDATE() AS DATE) " +
        "AND TRY_CAST(dueDate AS DATE) IS NOT NULL")
		Integer getAddedumExcessedDueDate_payments();

	@Select("select count(*) from payments where availability=1 and status=2")
	Integer getManagerReview();
	
	@Select("select count(*) from payments where availability=1 and status=4")
	Integer getDirectorReview();
	
	@Select("select count(*) from payments where status=5 and availability=1")
	Integer getChiefReview();
	
	@Select("select count(*) from payments where status=6 and availability=1")
	Integer getFinanceReview();


    @Select("select COALESCE(SUM(amount), 0) from payments where status=2 or status=4 or status=5 or status=6 and availability=1")
	Integer getInitiatedpaymentAmount();

	@Select("select COALESCE(SUM(amount), 0) from payments where status=1 and availability=1")
    Integer getnotInitiatedpaymentAmount();



	@Select("select COALESCE(SUM(amount), 0) from payments where status=7 and availability=1")
	Integer total_payments_paidAmount();

	@Select("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE availability = 1 AND dueDate > CAST(GETDATE() AS DATE)")
    Integer getExcessedDueDate_paymentsAmount();


    @Select("select COALESCE(SUM(amount), 0) from addendum_payments where status=1")
	Integer getAddedumInitiatedpaymentAmount();

	@Select("select COALESCE(SUM(amount), 0) from addendum_payments where status=1")
	Integer getnotInitiatedAddedumpaymentAmount();

	@Select("select COALESCE(SUM(amount), 0) from addendum_payments where status=3")
	Integer getRejectPaymentAddedumAmount();

	@Select("select COALESCE(SUM(amount), 0) from addendum_payments where status=7")
	Integer total_Addedumpayments_paidAmount();

	@Select("SELECT COALESCE(SUM(amount), 0) " +
        "FROM addendum_payments " +
        "WHERE TRY_CAST(dueDate AS DATE) > CAST(GETDATE() AS DATE) " +
        "AND TRY_CAST(dueDate AS DATE) IS NOT NULL")
	Integer getAddedumExcessedDueDate_paymentsAmount();

	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND contract_id = #{id}")
    Integer getTotalPaymentDetail(long id);

	@Select("SELECT COALESCE(SUM(amount), 0)  FROM payments WHERE availability = 1 AND contract_id = #{id}")
    Integer getTotalPaymentDetailAmount(long id);

	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND status=2 or status=4 or status=5 or status=6 AND contract_id = #{id}")
    Integer getInitiatedDetailpayments(long id);

	@Select("SELECT  COALESCE(SUM(amount), 0) FROM payments WHERE availability = 1 AND status=2 or status=4 or status=5 or status=6 AND contract_id = #{id}")
    Integer getInitiatedPaymentsDetailAmount(long id);
  
	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND status=1 AND contract_id = #{id}")
    Integer getNotInitiatedDetailPayments(long id); 

	@Select("SELECT  COALESCE(SUM(amount), 0) FROM payments WHERE availability = 1 AND status=1 AND contract_id = #{id}")
    Integer getNotInitiatedPaymentsDetailAmount(long id);

	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND status=7 AND contract_id = #{id}")
    Integer getTotalDetailPaymentsPaid(long id); 

	@Select("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE availability = 1 AND status=7 AND contract_id = #{id}")
    Integer getTotalPaymentsDetailAmountPaid(long id);

	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND status=3 AND contract_id = #{id}")
    Integer getRejectPaymentsDetail(long id); 

	@Select("SELECT  COALESCE(SUM(amount), 0) FROM payments WHERE availability = 1 AND status=3 AND contract_id = #{id}")
    Integer getRejectPaymentsDetailAmount(long id);

	@Select("SELECT count(*) FROM payments WHERE availability = 1 AND dueDate > CAST(GETDATE() AS DATE) AND contract_id = #{id}")
    Integer getExcessedDueDatePaymentsDetail(long id);
    
	@Select("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE availability = 1 AND dueDate > CAST(GETDATE() AS DATE) AND contract_id = #{id}")
    Integer getExcessedDueDatePaymentsDetailAmount(long id);

}
