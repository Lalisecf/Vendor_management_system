package project.Exception;

public class CustomDataNotFoundException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8381330732968078600L;

	public CustomDataNotFoundException() {
		super();
	}

	public CustomDataNotFoundException(String message) {
		super(message);
	}
}