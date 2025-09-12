package project.dto;

public class TokenDto {
	private Long id;
	private String refreshToken;

	public TokenDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TokenDto(Long id, String refreshToken) {
		super();
		this.id = id;
		this.refreshToken = refreshToken;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

}
