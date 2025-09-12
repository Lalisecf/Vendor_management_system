package project.maker.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MakerCheckerDashboardMapper {
	
	// Vendor
	@Select("select count(*) from vendors where availability=1 and status=2")
	int getActiveVendor();
	
	@Select("select count(*) from vendors where availability=1")
	int getTotalVendor();

	@Select("select count(*) from vendors where status=3 and availability=1")
	int getInactiveVendor();

	@Select("select count(*) from vendors where status=1 and availability=1")
	int getPendingVendor();

	@Select("select count(*) from Vendors where status=0 and availability=1")
	int getRejectVendor();

	
	@Select("select count(*) from vendors where availability=1 and status=3 and request_type='activate'")
	int getActiveVendorRequest();
	
	@Select("select count(*) from vendors where availability=1 and status=2 and request_type='deactivate'")
	int getDeactiveVendorRequest();
	
	@Select("select count(*) from vendors where availability=1 and status=2 and request_type='delete'")
	int getDeleteVendorRequest();
	
	@Select("select count(*) from vendors where availability=1 and status=2 and request_type='update'")
	int getUpdateVendorRequest();
	
	// Contract
	@Select("select count(*) from contract where availability=1 and status=2")
	int getActiveContract();

	@Select("select count(*) from contract where status=3 and availability=1")
	int getHoldContract();

	@Select("select count(*) from contract where status=1 and availability=1")
	int getPendingContract();
	
	@Select("select count(*) from contract where availability=1")
	int getTotalContract();

	@Select("select count(*) from contract where status=0 and availability=1")
	int getRejectContract();
	
	@Select("SELECT COUNT(DISTINCT vendor_id) FROM contract_vendor;")
	int getWorkingVendor();
	
	@Select("SELECT COUNT(DISTINCT v.id) FROM vendors v WHERE v.id NOT IN (SELECT cv.vendor_id FROM contract_vendor cv)")
	int getVendorNoContract();
	
	// extend renew
	@Select("select count(*) from contract where status=2 and availability=1 and type='Extend'")
	int getExtendedContract();
	
	@Select("select count(*) from contract where status=2 and availability=1 and type='Renewal'")
	int getRenewedContract();
	
	@Select("select count(*) from contract where status=2 and availability=1 and request_type='Extend'")
	int getExtendContract();
	
	@Select("select count(*) from contract where status=2 and availability=1 and request_type='Renewal'")
	int getRenewContract();
	
	@Select("select count(*) from contract where status=2 and availability=1 and request_type='Terminate'")
	int getTerminatContract();
	
	@Select("select count(*) from contract where status=4 and availability=1")
	int getTerminatedContract();
	
	@Select("select count(*) from contract where status=2 and availability=1 and request_type='Hold'")
	int getHoldContractRequest();
	
	@Select("select count(*) from contract where availability=1 and request_type='Unhold'")
	int getUnholdContractRequest();

}
