package project.maker.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Many;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import project.maker.model.Contract;
import project.maker.model.ContractView;
import project.maker.model.Payments;
import project.maker.model.Product;
import project.maker.model.ReportPayment;
import project.maker.model.SearchSqlProvider;
import project.maker.model.ServiceModel;

@Mapper
public interface ReportMapper {

	@Select("SELECT  v.name as vendor_name, c.id as contract_id, ROW_NUMBER() OVER(PARTITION BY c.id ORDER BY p.id) as payment_number,  p.paid_amount, p.date as expected_date, p.paid_date , p.payment_contigency, p.amount_per_contigency, c.payment_frequency, p.payment_description, p.status\r\n"
			+ "FROM vendors v\r\n" + "JOIN contract_vendor vc ON v.id = vc.vendor_id\r\n"
			+ "JOIN contract c ON vc.contract_id = c.id\r\n" + "JOIN contract_payment cp ON c.id = cp.contract_id\r\n"
			+ "JOIN payment p ON cp.payment_id = p.id\r\n" + "ORDER BY c.id;")
	public List<ReportPayment> PaymentReport();

	@Select("SELECT  v.name as vendor_name, c.id as contract_id, c.payment_end_date, ROW_NUMBER() OVER(PARTITION BY c.id ORDER BY p.id) as payment_number,  p.paid_amount, p.date as expected_date, p.paid_date , p.payment_contigency, p.amount_per_contigency, c.payment_frequency, p.payment_description, p.status\r\n"
			+ "FROM vendors v\r\n" + "JOIN contract_vendor vc ON v.id = vc.vendor_id\r\n"
			+ "JOIN contract c ON vc.contract_id = c.id\r\n" + "JOIN contract_payment cp ON c.id = cp.contract_id\r\n"
			+ "JOIN payment p ON cp.payment_id = p.id where p.status=1\r\n" + "ORDER BY c.id;")
	public List<ReportPayment> getUnpaidContracts();

	 @SelectProvider(type = SearchSqlProvider.class, method = "getReportSearchQuery")
	    @Results(id = "contractResultMap", value = {
	            @Result(property = "id", column = "id"),
	            @Result(property = "payments", javaType = List.class, column = "id",
	                    many = @Many(select = "getContractPaymentSearchQuery")),
	            @Result(property = "products", javaType = List.class, column = "id", many = @Many(select = "getProducts")),
				@Result(property = "services", javaType = List.class, column = "id", many = @Many(select = "getServices"))
	    })
	    List<ContractView> getReportSearchQuery(
	            @Param("id") Long id,
	            @Param("contract_start_date_min") String contract_start_date_min,
	            @Param("contract_start_date_max") String contract_start_date_max,
	            @Param("contract_end_date_min") String contract_end_date_min,
	            @Param("contract_end_date_max") String contract_end_date_max,
	            @Param("contract_payment_frequency") String contract_payment_frequency,
	            @Param("contract_payment_date_min") String contract_payment_date_min,
	            @Param("contract_payment_date_max") String contract_payment_date_max);

	 @SelectProvider(type = SearchSqlProvider.class, method = "getContractPaymentSearchQuery")
	    List<Payments> getContractPaymentSearchQuery(
	            @Param("id") Long id);
	 
	 @SelectProvider(type = SearchSqlProvider.class, method = "getProductByContractId")
	    List<Product> getProducts(
	            @Param("id") Long id);
	 
	 @SelectProvider(type = SearchSqlProvider.class, method = "getServiceByContractId")
	    List<ServiceModel> getServices(
	            @Param("id") Long id);
}
