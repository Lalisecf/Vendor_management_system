package project.admin.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminDashboardMapper {
	@Select("select count(*) from users where availability=1")
	int getTotalNumberOfUsers();
	@Select("select count(*) from users where status=1 and availability=1")
	int getTotalNumberOfActiveUsers();
	
	@Select("select count(*) from users where status=0")
	int getTotalNumberOfInActiveUsers();
	
	@Select("select count(*) from role_functionality where role_id=1")
	int getTotalNumberOfAdminFunctionalities();
	
	@Select("select count(*) from role_functionality where role_id=2")
	int getTotalNumberOfMakerFunctionalities();
	
	@Select("select count(*) from role_functionality where role_id=3")
	int getTotalNumberOfCheckerFunctionalities();
	
	@Select("select count(*) from role_functionality where role_id=4")
	int getTotalNumberOfApproverFunctionalities();
	
	@Select("select count(*) from functionalities where availability=1")
	int getTotalNumberOfFunctionalities();
	
	@Select("select count(*) from log")
	int getTotalLogins();
	
	@Select("select count(*) from activities")
	int getTotalUserActivity();
	
	@Select("select count(*) from users_tempo where status=1")
	int getTotalNumberOfPendingUsers();
	
	@Select("select count(*) from users_tempo where status=2")
	int getTotalNumberOfApprovedUsers();
	
	@Select("select count(*) from users_tempo where status=0")
	int getTotalNumberOfRejectedUsers();
}
