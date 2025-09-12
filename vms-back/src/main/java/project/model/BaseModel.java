package project.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonSerialize()
public class BaseModel {

	private Long id;

	public BaseModel(Long id) {
		this.id = id;
	}

}
