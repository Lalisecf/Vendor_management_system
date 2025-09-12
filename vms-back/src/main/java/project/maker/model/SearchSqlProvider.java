package project.maker.model;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.jdbc.SQL;

public class SearchSqlProvider {
	public String getReportSearchQuery(@Param("id") Long id,
			@Param("contract_start_date_min") String contract_start_date_min,
			@Param("contract_start_date_max") String contract_start_date_max,
			@Param("contract_end_date_min") String contract_end_date_min,
			@Param("contract_end_date_max") String contract_end_date_max,
			@Param("contract_payment_frequency") String contract_payment_frequency,
			@Param("contract_payment_date_min") String contract_payment_date_min,
			@Param("contract_payment_date_max") String contract_payment_date_max) {

		SQL sql = new SQL().SELECT_DISTINCT("c.*, v.name as vendor_name")
				.FROM("contract c, vendors v, contract_vendor cv,payment p,contract_payment cp").WHERE("1 = 1");

		if (contract_start_date_min != null && !contract_start_date_min.trim().isEmpty()) {
			System.out.println("contract_start_date_min: " + contract_start_date_min);
			sql.AND().WHERE("c.start_date >= #{contract_start_date_min}");
		}

		if (contract_start_date_max != null && !contract_start_date_max.trim().isEmpty()) {
			System.out.println("from contract_start_date_max: " + contract_start_date_max);
			sql.AND().WHERE("c.start_date <= #{contract_start_date_max}");
		}

		if (contract_end_date_min != null && !contract_end_date_min.trim().isEmpty()) {
			System.out.println("from contract_end_date_min: " + contract_end_date_min);
			sql.AND().WHERE("c.end_date >= #{contract_end_date_min}");
		}

		if (contract_end_date_max != null && !contract_end_date_max.trim().isEmpty()) {
			System.out.println("from contract_end_date_max: " + contract_end_date_max);
			sql.AND().WHERE("c.end_date <= #{contract_end_date_max}");
		}

		if (contract_payment_frequency != null && !contract_payment_frequency.trim().isEmpty()) {
			System.out.println("from contract_payment_frequency: " + contract_payment_frequency);
			sql.AND().WHERE("c.payment_frequency = #{contract_payment_frequency}");
		}

		if (id != null) {
			System.out.println("from id: " + id);
			sql.AND().WHERE("v.id = #{id}");
		}

		if (contract_payment_date_min != null && !contract_payment_date_min.trim().isEmpty()) {
			System.out.println("contract_payment_date_max: " + contract_payment_date_max);
			sql.AND().WHERE("p.date >= #{contract_payment_date_min}");
			sql.AND().WHERE("c.id = cp.contract_id");
			sql.AND().WHERE("p.id = cp.payment_id");
		}

		if (contract_payment_date_max != null && !contract_payment_date_max.trim().isEmpty()) {
			System.out.println("from contract_start_date_max: " + contract_start_date_max);
			sql.AND().WHERE("p.date <= #{contract_payment_date_max}");
			sql.AND().WHERE("c.id = cp.contract_id");
			sql.AND().WHERE("p.id = cp.payment_id");
		}
		sql.AND().WHERE("c.status = 2");
		sql.AND().WHERE("c.availability = 1");
		sql.AND().WHERE("c.id = cv.contract_id");
		sql.AND().WHERE("v.id = cv.vendor_id");
		sql.AND().WHERE("v.availability = 1");
		sql.AND().WHERE("v.status = 2");

//		SQL sqll = new SQL().SELECT_DISTINCT("c.*, v.name as vendor_name")
//				.FROM("contract c, vendors v, contract_vendor cv,payment p,contract_payment cp").WHERE("1 = 1");
//
//		if (contract_payment_date_min != null && !contract_payment_date_min.trim().isEmpty()) {
//			System.out.println("contract_payment_date_max: " + contract_payment_date_max);
//			sqll.AND().WHERE("p.date >= #{contract_payment_date_min}");
//		}
//
//		if (contract_payment_date_max != null && !contract_payment_date_max.trim().isEmpty()) {
//			System.out.println("from contract_start_date_max: " + contract_start_date_max);
//			sqll.AND().WHERE("p.date <= #{contract_payment_date_max}");
//		}
//
//		sqll.AND().WHERE("c.status = 2");
//		sqll.AND().WHERE("c.availability = 1");
//		sqll.AND().WHERE("c.id = cv.contract_id");
//		sqll.AND().WHERE("v.id = cv.vendor_id");
//		sqll.AND().WHERE("v.availability = 1");
//		sqll.AND().WHERE("v.status = 2");
//		sqll.AND().WHERE("c.id = cp.contract_id");
//		sqll.AND().WHERE("p.id = cp.payment_id");
//
//		

//		String sql_all = sql.toString() + " UNION " + sqll.toString();
		return sql.toString();
	}

	public String getContractPaymentSearchQuery(

			@Param("id") Long id) {

		SQL sql = new SQL().SELECT_DISTINCT("p.*").FROM("payment p").JOIN("contract_payment cp ON p.id = cp.payment_id")
				.JOIN("contract c ON cp.contract_id = c.id").WHERE("1 = 1");

		sql.AND().WHERE("c.id = #{id}");

		return sql.toString();
	}

	public String getProductByContractId(

			@Param("id") Long id) {

		SQL sql = new SQL().SELECT_DISTINCT("p.*").FROM("products p")
				.JOIN("contract_product cp ON p.id = cp.product_id").JOIN("contract c ON cp.contract_id = c.id")
				.WHERE("1 = 1");

		sql.AND().WHERE("c.id = #{id}");

		return sql.toString();
	}

	public String getServiceByContractId(

			@Param("id") Long id) {

		SQL sql = new SQL().SELECT_DISTINCT("s.*").FROM("services s")
				.JOIN("contract_service cs ON s.id = cs.service_id").JOIN("contract c ON cs.contract_id = c.id")
				.WHERE("1 = 1");

		sql.AND().WHERE("c.id = #{id}");

		return sql.toString();
	}

}
