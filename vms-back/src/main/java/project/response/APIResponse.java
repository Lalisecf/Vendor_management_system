package project.response;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class APIResponse {

	public static final String ERROR = "error";
	public static final String SUCCESS = "success";

	private Map<String, Object> data = new HashMap<>();
	
	public APIResponse() {
	}

	public APIResponse(String key, Object data) {
		this.data.put(key, data);
	}

	@JsonAnySetter
	public void addData(String key, Object data) {
		this.data.put(key, data);
	}
	
	public ResponseEntity<APIResponse> response(HttpStatus status) {
		return new ResponseEntity<>(this, status);
	}

	public static ResponseEntity<APIResponse> success(String successMessage) {
		return response(SUCCESS, successMessage, OK, APPLICATION_JSON_VALUE);
	}
	
	public static ResponseEntity<APIResponse> success(Long successMessage) {
		return response(SUCCESS, successMessage, OK, APPLICATION_JSON_VALUE);
	}

	public ResponseEntity<APIResponse> successEntity(String successMessage) {
		addData(SUCCESS, successMessage);
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", APPLICATION_JSON_VALUE);
		return new ResponseEntity<>(this, headers, OK);
	}

	public static ResponseEntity<APIResponse> success(String successMessage, String contentType) {
		return response(SUCCESS, successMessage, OK, contentType);
	}

	public static ResponseEntity<APIResponse> error(String errorMessage, HttpStatus statusCode) {
		return error(errorMessage, statusCode, APPLICATION_JSON_VALUE);
	}

	public ResponseEntity<APIResponse> errorEntity(String errorMessage, HttpStatus statusCode) {
		addData(ERROR, errorMessage);
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", APPLICATION_JSON_VALUE);
		return new ResponseEntity<>(this, headers, statusCode);
	}

	public static ResponseEntity<APIResponse> error(String errorMessage, HttpStatus statusCode, String contentType) {
		return response(ERROR, errorMessage, statusCode, contentType);
	}

	public static ResponseEntity<APIResponse> response(String key, String message, HttpStatus statusCode,
			String contentType) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", contentType);
		return new ResponseEntity<>(new APIResponse(key, message), headers, statusCode);
	}
	
	public static ResponseEntity<APIResponse> response(String key, Long message, HttpStatus statusCode,
			String contentType) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", contentType);
		return new ResponseEntity<>(new APIResponse(key, message), headers, statusCode);
	}

	////////////////////////////////////////////////////////////////////////////////////
	//return ResponseEntity OF Object and status by accepting only the Object
	public static ResponseEntity<Object> response(Object value) {
		return new ResponseEntity<>(value, OK);
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	//return ResponseEntity OF Object and status by accepting only the Object
	public static ResponseEntity<Boolean> response(Boolean value) {
		return new ResponseEntity<>(value, OK);
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	//response only one Map<String, Object> map and status by accepting the string and object separately
	public static ResponseEntity<APIResponse> response(String key, Object value) {
		return new ResponseEntity<>(new APIResponse(key, value), OK);
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	//return Map<String, Object> and status
	public static ResponseEntity<APIResponse> response(String key, Map<String, Object> value) {
		return new ResponseEntity<>(new APIResponse(key, value), OK);
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	//response only one Map<String, Object> map and status by accepting the string and object separately
	public static ResponseEntity<APIResponse> response(String key, Object value, HttpStatus status) {
		return new ResponseEntity<>(new APIResponse(key, value), status);
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	//return Map<String, String> and status
	public static ResponseEntity<APIResponse> response(Map<String, String> messages, HttpStatus status) {
		return response(messages, status, APPLICATION_JSON_VALUE);
	}

	public static ResponseEntity<APIResponse> response(Map<String, String> messages, HttpStatus status,
			String contentType) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", contentType);
		APIResponse response = new APIResponse();
		response.setData(messages);
		return new ResponseEntity<>(response, headers, status);
	}
	
	
	////////////////////////////////////////////////////////////////////////////////////
	//return Map<String, Object> and status
	public static ResponseEntity<APIResponse> responseMap(Map<String, Object> object, HttpStatus status, ResponseCookie springCookie) {
		return responseMap(object, status, APPLICATION_JSON_VALUE, springCookie);
	}

	public static ResponseEntity<APIResponse> responseMap(Map<String, Object> object, HttpStatus status,
			String contentType, ResponseCookie springCookie) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", contentType);
		headers.add(HttpHeaders.SET_COOKIE, springCookie.toString());
		APIResponse response = new APIResponse();
		response.setDataMap(object);
		return new ResponseEntity<>(response, headers, status);
	}
	
	public static ResponseEntity<APIResponse> responseMap(Map<String, Object> object, HttpStatus status) {
		return responseMap(object, status, APPLICATION_JSON_VALUE);
	}

	public static ResponseEntity<APIResponse> responseMap(Map<String, Object> object, HttpStatus status,
			String contentType) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		headers.add("Content-Type", contentType);
		APIResponse response = new APIResponse();
		response.setDataMap(object);
		return new ResponseEntity<>(response, headers, status);
	}

	//////////////////////////////////////////////////////////////////////////////////////
	@JsonAnyGetter
	@SuppressWarnings("unused")
	public Map<String, Object> getData() {
		return data;
	}

	private void setData(Map<String, String> errors) {
		for (String key : errors.keySet()) {
			addData(key, errors.get(key));
		}
	}
	
	private void setDataMap(Map<String, Object> errors) {
		for (String key : errors.keySet()) {
			addData(key, errors.get(key));
		}
	}

	@JsonIgnore
	public String getErrorMsg() {
		return (String) data.get(ERROR);
	}

	@JsonIgnore
	public String getSuccessMsg() {
		return (String) data.get(SUCCESS);
	}
}
