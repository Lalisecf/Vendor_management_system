package project.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Many;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import project.admin.dto.RegisterActorDto;
import project.admin.model.Users;
import project.model.Errors;
import project.model.RefreshToken;
import project.model.Roles;
import project.model.User;
import project.model.UserRole;

@Mapper
public interface MapperAuth {

	@Select("insert into users(fullname, username, password, class_level, gender, profile, status) OUTPUT Inserted.id "
			+ "values(#{fullname}, #{username}, #{password}, #{class_level}, #{gender}, #{profile}, #{status});")
	public Long signup(User user);

	@Insert("insert into user_role (user_id, role_id) values (#{user_id}, #{role_id});")
	public void addUserRole(UserRole userRole);

	@Select("select * from users where email = #{email} and status = 1 and availability = 1")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "roles", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getRolesByUserId")),
//			@Result(property = "rights", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getUserRights")),
//			@Result(property = "subject", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId")) 
	})
	public User findByUserName2(String email);

	@Select("select * from users where email = #{email} and status = 1 and availability = 1")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "roles", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getRolesByUserId")),
//			@Result(property = "rights", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getUserRights")),
//			@Result(property = "subject", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId")) 
	})
	public Optional<User> findByUserName(String email);

	@Select("select * from users where id = #{id} and status = 1 and availability = 1")
	@Results(value = { @Result(property = "id", column = "id"),
			@Result(property = "roles", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getRolesByUserId")),
//			@Result(property = "rights", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getUserRights")),
//			@Result(property = "subject", javaType = List.class, column = "id", many = @Many(select = "project.mapper.MapperAuth.getSubjectsByUserId")) 
	})
	public User findByUserName3(Long id);

	@Select("select 1 from users where username = #{username}")
	public Boolean check_username(String username);
	@Select("IF EXISTS (SELECT users_tempo.id FROM users_tempo WHERE email =#{email} and (status=1  or status=2) and availability=1 union SELECT users.id FROM users WHERE email =#{email} and availability=1 ) SELECT 'True' \r\n"
			+ "ELSE   SELECT 'False'")
	public Boolean check_email(String email);

	@Update("update files set status=0 where id = #{profileId}")
	public void changeProfileStatus(Long profileId);

	@Select("select * from roles where name = #{role_name}")
	public Long getRoleId(String role_name);

	@Select("select r.* from roles r join user_role ur on r.id = ur.role_id where ur.user_id = #{userId} and r.status = 1 and r.availability = 1 and ur.status = 1 and ur.availability = 1")
	public Collection<Roles> getRolesByUserId(Long userId);

	@Select("insert into errors(timeStamp, status, message, traceId, type, cause, localizedMessage, instance, help, "
			+ "stackTrace) OUTPUT Inserted.id values (#{timeStamp}, #{status}, #{message}, #{traceId}, "
			+ "#{type}, #{cause}, #{localizedMessage}, #{instance}, #{help}, #{stackTrace})")
	public Long registerError(Errors error);

	@Select("insert into refresh_token (email) OUTPUT Inserted.id values(#{email})")
	public Long addRefreshToken(RefreshToken refreshToken);
	@Delete("delete from refresh_token where email=#{email}")
	public void logdoutfromOtherDevice(String email);

	@Select("select top 1 1 from refresh_token where id = #{refreshToken_id}")
	public Long tokenExists(Long refreshToken_id);

	@Delete("delete from refresh_token where id = #{refreshToken_id}")
	public void deleteRefreshToken(Long refreshToken_id);

	@Delete("delete from refresh_token where email = #{email}")
	public void deleteRefreshTokenAll(String tokenIdFromRefreshToken);

	@Select("select email from refresh_token where id = #{tokenIdFromRefreshToken}")
	public String getEmailFromTokenId(Long tokenIdFromRefreshToken);

	@Select("select id from users where email = #{email} and status = 1 and availability = 1")
	public Long getUserIdByEmail(@Param("email") String email);

	@Select("select r.name from roles r, user_role ur where ur.user_id = #{user_id} and ur.role_id = r.id and"
			+ " ur.status = 1 and ur.availability = 1 and r.status = 1 and r.availability = 1;")
	public String[] getRoleByUserId(Long user_id);

	@Select("select status from roles where name = #{role}")
	public String getStatusOfRole(@Param("role") String role);

	@Select("select status from roles where name = 'User'")
	public String getStatusOfUser();

	@Select("select status from roles where name = 'Approver'")
	public String getStatusOfApprover();

//	@Select("select id from functionalities where name = #{functioinality}")
//	public Long getFunctionalityIdByFunctionalityName(@Param("functionality") String functionality);

	@Select("select status from functionalities where name = #{functionality}")
	public String getStatusOfFunctionalityByFunctionName(String functionality);

	@Select("select rf.status from roles r, role_functionality rf, functionalities f where "
			+ "r.name = #{type} and r.id = rf.role_id and f.name = #{functionality} and f.id = rf.functionality_id")
	public String getStatusFromRoleFunctionalityByRoleAndFunctionality(@Param("type") String type,
			@Param("functionality") String functionality);

	@Select("insert into log (activity, ip, browser_type, browser_version, date, status, availability) OUTPUT Inserted.id "
			+ "values (#{activity}, #{ip}, #{browser_type}, #{browser_version}, #{date}, #{status}, #{availability})")
	public Long registerLog(@Param("ip") String ip, @Param("browser_type") String browser_type,
			@Param("browser_version") String browser_version, @Param("activity") String activity,
			@Param("date") String date, @Param("status") String status, @Param("availability") String availability);

	@Insert("insert into user_log (user_id, log_id, status, availability) values (#{user_id}, #{log_id}, #{status}, #{availability})")
	public void registerUserLog(@Param("user_id") Long user_id, @Param("log_id") Long log_id,
			@Param("status") String status, @Param("availability") String availability);

	@Select("insert into activities (name, description, date, status, availability) OUTPUT Inserted.id"
			+ " values (#{activity}, #{description}, #{date}, #{status}, #{availability})")
	public Long registerActivity(@Param("activity") String activity, @Param("description") String description,
			@Param("date") String date, @Param("status") String status, @Param("availability") String availability);

	@Insert("insert into user_activity (user_id, activity_id, status, availability) values (#{user_id}, #{activity_id},"
			+ " #{status}, #{availability})")
	public void registerUserActivity(@Param("user_id") Long user_id, @Param("activity_id") Long activity_id,
			@Param("status") String status, @Param("availability") String availability);

	@Select("select status from users where id = #{user_id}")
	public String getUserStatus(@Param("user_id") Long user_id);

	@Select("select availability from users where id = #{user_id}")
	public String getUserAvailability(@Param("user_id") Long user_id);

	@Select("select 1 from refresh_token where id = #{id}")
	public Boolean check_refreshTokenExist(@Param("id") String claim);
	@Select("IF EXISTS (SELECT * FROM refresh_token WHERE email = #{email}) " + "    SELECT 'True' "
			+ "ELSE " + " SELECT 'False'")
	public Boolean check_refreshTokenExistByEmail(@Param("email") String email);
//	@Select("select 1 from refresh_token where id = #{id}")
//	public Boolean check_refreshTokenExist(@Param("id") String claim);

	@Select("select id from workspace where reconciliation_type = #{recon_type} and status = 1 and availability = 1")
	public Long getWorkspaceIdFromReconciliationType(@Param("recon_type") String reconciliation_type);

	@Select("select top 1 '1' from user_workspace where workspace_id = #{workspace_id} and status = 1 and availability = 1")
	public Optional<String> check_IfWorkspaceIsFree(@Param("workspace_id") Long workspace_id);

	@Select("select top 1 '1' from user_workspace where user_id = #{user_id} and status = 1 and availability = 1")
	public Optional<String> userHasWorkspace(@Param("user_id") Long user_id);

	@Select("select w.reconciliation_type from user_workspace uw, workspace w where uw.user_id = #{user_id} and uw.status = 1 and uw.availability = 1 and "
			+ "w.id = uw.workspace_id ")
	public String getUserWorkspace(@Param("user_id") Long user_id);

	@Delete("delete from user_workspace where user_id = #{user_id}")
	public boolean removeUserFromWorkspace(@Param("user_id") Long user_id);

	@Select("select top 1 '1' from users where email = #{email} and status = 1 and availability = 1")
	public Optional<String> check_UserExistByEmail(@Param("email") String email);

	@Insert("insert into login_trials (date, email, ip, status, availability) values(#{date}, #{email}, #{ip}, #{status}, #{availability})")
	public void addLoginTrial(@Param("date") String date,@Param("email") String email,@Param("ip") String user_ip,
			@Param("status") String status,@Param("availability") String availability);

	@Select("select count(*) from login_trials where email = #{email} and status = 1 and availability = 1;")
	public int getLoginTrials(@Param("email") String email);

	@Select("SELECT date FROM ("
			+ "  SELECT"
			+ "    ROW_NUMBER() OVER (ORDER BY id ASC) AS rownumber,"
			+ "    id, date "
			+ "  FROM login_trials where status = 1 and availability = 1 and email = #{email}"
			+ ") AS helper "
			+ "WHERE rownumber = #{input_1}")
	public String getDateOfTheFifthLoginTrial(@Param("input_1") int login_trial, @Param("email") String email);

	@Select("select top 1 input_1, input_2 from settings_data where key_identifier = 'login_trials' and status = 1 and availability = 1")
	public Map<String, Integer> getLoginTrialsSettings();

	@Select("select input_1 from settings_data where key_identifier = 'login_fail_time_to_punish' and status = 1 and availability = 1")
	public int loginGetTimeToPunish();

	@Select("select top 1 '1' from login_trials where email = #{email} and status = 1 and availability = 1")
	public Optional<String> check_LoginTrialByEmail(String email);

	@Update("update login_trials set status=0 where email = #{email} and status = 1 and availability = 1")
	public void clearLoginTrials(@Param("email") String email);

	@Update("update users set status=0 where email = #{email} and status = 1 and availability = 1")
	public void disableUserLoginTrialExceeded(@Param("email") String email);
	
	@Select("select status from users where availability = 1 and email = #{email}")
	public String getUserStatusByEmail(@Param("email") String email);
	
	@Select("select top 1 '1' from users where email = #{email} and availability = 1")
	public Optional<String> check_UserExistByEmail_nostatus(String email);

	@Update("update users set firsttime = 1 where email = #{email}")
	public void update_firsttime_status(@Param("email") String email);

	@Update("update users set password = #{password}, firsttime = '1' where email = #{email}")
	public void reset_password_on_forget_password(@Param("password") String password, @Param("email") String email);

	@Select("select concat(firstname, ' ', middlename) from users where id = #{id}")
	public String getUserName(@Param("id") Long userIdByEmail);
	@Insert("insert into users_tempo(firstname, middlename, lastname, gender, email, phonenumber, reg_date, status, availability) "
			+ "values(#{firstname}, #{middlename}, #{lastname}, #{gender}, #{email}, #{phonenumber},#{reg_date}, #{status}, #{availability});")
	public boolean signup_(RegisterActorDto registerRequest);
	@Select("SELECT photo FROM users where id=#{user_id};")
	public Users profiles(Long user_id);

	@Update("update users set photo=#{photo} where id=#{user_id}")
	public boolean photo(@Param("user_id") Long user_id, @Param("photo") byte[] photo);
	@Select("SELECT * FROM users where id=#{user_id};")
	public Users detail(Long user_id);
	@Update("update users set firstname = #{firstname}, middlename = #{middlename},lastname=#{lastname},phonenumber=#{phonenumber} where email = #{email}")
	public boolean update_user_detail( Users user);
	@Select("SELECT email FROM users where id=#{get_user_id};")
	public RefreshToken getRemark(Long get_user_id);
	
	@Select("select password_change_date from users where email=#{email}")
	public String getPasswordChangeDate(String email);

}
