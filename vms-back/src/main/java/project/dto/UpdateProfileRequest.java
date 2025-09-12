package project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateProfileRequest {

	private Long user_id;
	private Long profile_id;

	public UpdateProfileRequest() {

	}

	public UpdateProfileRequest(Long user_id, Long profile_id) {
		super();
		this.user_id = user_id;
		this.profile_id = profile_id;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public Long getProfile_id() {
		return profile_id;
	}

	public void setProfile_id(Long profile_id) {
		this.profile_id = profile_id;
	}

}
