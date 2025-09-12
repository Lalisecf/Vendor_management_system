package project.Exception;

public class CustomPasswordErrorHandler extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8646927585025715721L;
	
	public CustomPasswordErrorHandler(String message) {
		super(message);
	}

}
