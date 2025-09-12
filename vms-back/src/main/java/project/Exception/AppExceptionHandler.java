package project.Exception;

import java.awt.color.CMMException;
import java.awt.color.ProfileDataException;
import java.awt.geom.IllegalPathStateException;
import java.awt.image.ImagingOpException;
import java.awt.image.RasterFormatException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.annotation.AnnotationTypeMismatchException;
import java.lang.annotation.IncompleteAnnotationException;
import java.lang.invoke.WrongMethodTypeException;
import java.lang.reflect.UndeclaredThrowableException;
import java.nio.BufferOverflowException;
import java.nio.BufferUnderflowException;
import java.nio.file.FileSystemAlreadyExistsException;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.ProviderNotFoundException;
import java.security.ProviderException;
import java.security.SignatureException;
import java.time.LocalDateTime;
import java.util.ConcurrentModificationException;
import java.util.Date;
import java.util.HashMap;
import java.util.IllformedLocaleException;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.NoSuchElementException;
import java.util.concurrent.RejectedExecutionException;

import javax.lang.model.UnknownEntityException;
import javax.lang.model.type.MirroredTypesException;
import javax.management.JMRuntimeException;
import javax.print.attribute.UnmodifiableSetException;
import javax.swing.undo.CannotRedoException;
import javax.swing.undo.CannotUndoException;
import javax.xml.crypto.NoSuchMechanismException;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.ConversionNotSupportedException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.firewall.RequestRejectedException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException.BadRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.annotation.JsonFormat;

import project.mapper.MapperAuth;
import project.model.ApiError;
import project.model.Errors;
import project.response.APIResponse;

@ControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler {

	@Autowired
	private Environment env;

	@Autowired
	private MapperAuth mapper;
	
	private boolean checher= false;

//	@ExceptionHandler(CustomDataNotFoundException.class)
//	public ResponseEntity<?> handleCustomDataNotFoundExceptions(Exception e, WebRequest request) {
//		HttpStatus status = HttpStatus.ACCEPTED;
//		System.out.println("from inside exception");
//		StringWriter stringWriter = new StringWriter();
//		PrintWriter printWriter = new PrintWriter(stringWriter);
//		e.printStackTrace(printWriter);
//		String stackTrace = stringWriter.toString();
//		return identifyandHandleException(e, request);
//	}CustomPasswordErrorHandler

	@ExceptionHandler(ExceptionsList.class)
	public ResponseEntity<?> ExceptionsList(ExceptionsList ex, WebRequest request) {
		System.out.println("rOccuredd exception: " + ex.ex.getClass().getName());
		ex.ex.printStackTrace();
		System.out.println("Exception printstacktrace end.");
		return identifyandHandleException(ex.ex, request);
	}

	@ExceptionHandler(CustomTokenExpiredException.class)
	public ResponseEntity<?> CustomTokenExpiredException(Exception e, WebRequest request) {
//		System.out.println("CustomTokenExpiredException exception: " + ex.ex.getClass().getName());
//		ex.ex.printStackTrace();
		System.out.println("Exception CustomTokenExpiredException");
//		return identifyandHandleException(ex.ex, request);
		return APIResponse.response("access-token-expired");
	}
	
	@ExceptionHandler(CustomAllException.class)
	public ResponseEntity<?> CustomAllException(Exception e, WebRequest request) {
		System.out.println("Returning localized message: custom exception");
		return APIResponse.response(e.getLocalizedMessage());
	}


	private ResponseEntity<Object> buildResponse(Exception ex, WebRequest request, String status, String message) {
		String trace_id = generateUniqueTraceId();
		Map<String, Object> response = new HashMap<>();
//		ex.printStackTrace();
		response.put("apierror",
				new ApiError(status, ex.getLocalizedMessage(), trace_id,
						((ServletWebRequest) request).getRequest().getRequestURI().toString(),
						env.getProperty("error.help.url") + trace_id, LocalDateTime.now()));

		Errors error = new Errors();
		if (ex.getCause() != null)
			error.setCause(ex.getCause().toString());
		else
			error.setCause("undefined");
		error.setHelp(env.getProperty("error.help.url") + trace_id);
		error.setInstance(((ServletWebRequest) request).getRequest().getRequestURI().toString());
		error.setLocalizedMessage(ex.getLocalizedMessage());
		error.setMessage(ex.getMessage());
		StringWriter sw = new StringWriter();
		ex.printStackTrace(new PrintWriter(sw));
		error.setStackTrace(sw.toString());
		error.setStatus(status);
		error.setTimeStamp(LocalDateTime.now());
		error.setTraceId(trace_id);
		error.setType("unidentified");

		Long id = mapper.registerError(error);
		System.out.println("pppppppppppppp  error page afterrrrrr");
        String customErrorPageContent = loadCustomErrorPageContent();

     
        customErrorPageContent = customErrorPageContent.replace("{status}", status);
        customErrorPageContent = customErrorPageContent.replace("{message}", message);
        if(checher) {
    		System.out.println("pppppppppppppp  gggggggg");
        	return new ResponseEntity<>(customErrorPageContent, HttpStatus.UNAUTHORIZED);
        }
        else
		return new ResponseEntity<Object>(response, HttpStatus.UNAUTHORIZED);
	}
	
	private ResponseEntity<Object> buildResponse_token(Exception ex, WebRequest request, String status, String message) {
		
		String trace_id = generateUniqueTraceId();
		Map<String, Object> response = new HashMap<>();
//		ex.printStackTrace();
		response.put("apierror",
				new ApiError(status, ex.getLocalizedMessage(), trace_id,
						((ServletWebRequest) request).getRequest().getRequestURI().toString(),
						env.getProperty("error.help.url") + trace_id, LocalDateTime.now()));

		Errors error = new Errors();
		if (ex.getCause() != null)
			error.setCause(ex.getCause().toString());
		else
			error.setCause("undefined");
		error.setHelp(env.getProperty("error.help.url") + trace_id);
		error.setInstance(((ServletWebRequest) request).getRequest().getRequestURI().toString());
		error.setLocalizedMessage(ex.getLocalizedMessage());
		error.setMessage(ex.getMessage());
		StringWriter sw = new StringWriter();
		ex.printStackTrace(new PrintWriter(sw));
		error.setStackTrace(sw.toString());
		error.setStatus(status);
		error.setTimeStamp(LocalDateTime.now());
		error.setTraceId(trace_id);
		error.setType("unidentified");

		Long id = mapper.registerError(error);
		System.out.println("access token response::::::::::");
		return APIResponse.response("access-token-expired");
//		return new ResponseEntity<Object>(response, HttpStatus.UNAUTHORIZED);
	}
	
private ResponseEntity<Object> buildResponse_all(Exception ex, WebRequest request, String status, String message) {
		
		String trace_id = generateUniqueTraceId();
		Map<String, Object> response = new HashMap<>();
//		ex.printStackTrace();
		response.put("apierror",
				new ApiError(status, ex.getLocalizedMessage(), trace_id,
						((ServletWebRequest) request).getRequest().getRequestURI().toString(),
						env.getProperty("error.help.url") + trace_id, LocalDateTime.now()));

		Errors error = new Errors();
		if (ex.getCause() != null)
			error.setCause(ex.getCause().toString());
		else
			error.setCause("undefined");
		error.setHelp(env.getProperty("error.help.url") + trace_id);
		error.setInstance(((ServletWebRequest) request).getRequest().getRequestURI().toString());
		error.setLocalizedMessage(ex.getLocalizedMessage());
		error.setMessage(ex.getMessage());
		StringWriter sw = new StringWriter();
		ex.printStackTrace(new PrintWriter(sw));
		error.setStackTrace(sw.toString());
		error.setStatus(status);
		error.setTimeStamp(LocalDateTime.now());
		error.setTraceId(trace_id);
		error.setType("unidentified");

		Long id = mapper.registerError(error);
		return APIResponse.response(ex.getLocalizedMessage());
//		return new ResponseEntity<Object>(response, HttpStatus.UNAUTHORIZED);
	}

	@SuppressWarnings("deprecation")
	private String generateUniqueTraceId() {
		return RandomStringUtils.randomAlphanumeric(8) + "_"
				+ new Date().toGMTString().replace(" ", "").replace(":", "") + "_" + System.currentTimeMillis();
	}

	private ResponseEntity<?> identifyandHandleException(Exception ex, WebRequest request) {
		if (ex instanceof AnnotationTypeMismatchException || ex instanceof ArithmeticException
				|| ex instanceof ArrayStoreException || ex instanceof IncompleteAnnotationException
				|| ex instanceof IndexOutOfBoundsException || ex instanceof JMRuntimeException
//				|| ex instanceof LSException || ex instanceof MalformedParameterizedTypeException
				|| ex instanceof MirroredTypesException || ex instanceof MissingResourceException
				|| ex instanceof NegativeArraySizeException || ex instanceof NoSuchElementException
				|| ex instanceof NoSuchMechanismException || ex instanceof NullPointerException
				|| ex instanceof ProfileDataException || ex instanceof ProviderException
				|| ex instanceof ProviderNotFoundException || ex instanceof RasterFormatException
				|| ex instanceof RejectedExecutionException || ex instanceof SecurityException
				|| ex instanceof UndeclaredThrowableException || ex instanceof UnknownEntityException
				|| ex instanceof TypeNotPresentException || ex instanceof UnmodifiableSetException
				|| ex instanceof UnsupportedOperationException || ex instanceof WrongMethodTypeException
				|| ex instanceof BufferOverflowException || ex instanceof BufferUnderflowException
				|| ex instanceof CannotRedoException || ex instanceof CannotUndoException
				|| ex instanceof ClassCastException || ex instanceof CMMException
				|| ex instanceof ConcurrentModificationException || ex instanceof EnumConstantNotPresentException
//				|| ex instanceof DOMException || ex instanceof EmptyStackException || ex instanceof EventException
				|| ex instanceof FileSystemAlreadyExistsException || ex instanceof FileSystemNotFoundException
				|| ex instanceof IllegalArgumentException || ex instanceof IllegalMonitorStateException
				|| ex instanceof IllegalPathStateException || ex instanceof IllegalStateException
				|| ex instanceof IllformedLocaleException || ex instanceof ImagingOpException) {
			System.out.println("1 " + ex.getLocalizedMessage());
			return buildResponse(ex, request, HttpStatus.INTERNAL_SERVER_ERROR.toString(),
					env.getProperty("error.internal.server.error"));
		} else if (ex instanceof AuthenticationException) {
			System.out.println("in AppException here we go");
			return buildResponse(ex, request, HttpStatus.UNAUTHORIZED.toString(),
					env.getProperty("error.authentication.failed"));
		} else if (ex instanceof javax.naming.AuthenticationException) {
			return buildResponse(ex, request, HttpStatus.UNAUTHORIZED.toString(),
					env.getProperty("error.register.user.duplicate"));
		} 
		else if (ex instanceof DuplicateKeyException) {
			return buildResponse(ex, request, HttpStatus.UNPROCESSABLE_ENTITY.toString(),
					env.getProperty("error.register.user.duplicate"));
		} 
		else if (ex instanceof TokenExpiredException) {
			System.out.println("Exception origin: App Exception Handler: TokenExpiredException");
			return buildResponse(ex, request, HttpStatus.UNPROCESSABLE_ENTITY.toString(),"token_expired");
		} 
		else if (ex instanceof BadRequest) {
			return buildResponse(ex, request, HttpStatus.BAD_REQUEST.toString(), env.getProperty("error.bad.request"));
		} else if (ex instanceof RequestRejectedException) {
			return buildResponse(ex, request, HttpStatus.BAD_REQUEST.toString(),
					env.getProperty("error.request.rejected"));
		} else if (ex instanceof AccessDeniedException) {
			return buildResponse(ex, request, HttpStatus.FORBIDDEN.toString(), "the access is the denied");
		} else if (ex instanceof BadCredentialsException) {
			return buildResponse(ex, request, HttpStatus.FORBIDDEN.toString(), "the access is the denied");
		} else if (ex instanceof SignatureException) {
			return buildResponse(ex, request, HttpStatus.FORBIDDEN.toString(), "the access is the denied");
		}else if (ex instanceof CustomTokenExpiredException) {//
			System.out.println("===from App Exception Handler: " + ex.getClass().getTypeName());
			return buildResponse_token(ex, request, HttpStatus.FORBIDDEN.toString(), "the access is the denied");
		}else if (ex instanceof CustomPasswordErrorHandler) {
			System.out.println("===It is caughttttt: " + ex.getClass().getTypeName());
			return buildResponse_all(ex, request, HttpStatus.FORBIDDEN.toString(), "");
		}else if (ex instanceof CustomAllException) {
			System.out.println("===It is caughttttt: " + ex.getClass().getTypeName());
			return buildResponse_all(ex, request, HttpStatus.FORBIDDEN.toString(), "");
		}
//		else if (ex instanceof MailSendException) {
//			System.out.println("Custom all exception in app exception MailSendException");
//			return buildResponse_all(ex, request, HttpStatus.FORBIDDEN.toString(), "");
//		}else if (ex instanceof MessagingException) {
//			System.out.println("Custom all exception in app exception MessagingException");
//			return buildResponse_all(ex, request, HttpStatus.FORBIDDEN.toString(), "");
//		}
		System.out.println("last: " + ex.getClass().getTypeName());

		return buildResponse(ex, request, HttpStatus.INTERNAL_SERVER_ERROR.toString(),
				env.getProperty("error.internal.server.error"));
	}

	public class ExceptionMessage {
		@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
		private LocalDateTime timestamp;
		private String message;
		private String path;

		public ExceptionMessage() {
			timestamp = LocalDateTime.now();
		}

		public ExceptionMessage(String message, String path) {
			this();
			this.message = message;
			this.path = path;
		}

	}
	
	@Override
	protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		checher=true;
		System.out.println(":1");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.resource.not.found"));
	}

	@Override
	protected ResponseEntity<Object> handleAsyncRequestTimeoutException(AsyncRequestTimeoutException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("2");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.time.out"));
	}

	@Override
	protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers, HttpStatus status,
			WebRequest request) {
		System.out.println("3");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.binding"));
	}

	@Override
	protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("4");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.http.method.not.supported"));
	}

	@Override
	protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("5");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.http.media.type.not.supported"));
	}

	@Override
	protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("6");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.http.media.type.not.acceptable"));
	}

	@Override
	protected ResponseEntity<Object> handleMissingPathVariable(MissingPathVariableException ex, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		System.out.println("7");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.missing.path.variable"));
	}

	@Override
	protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("8");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.servlet.request.parameter"));
	}

	@Override
	protected ResponseEntity<Object> handleServletRequestBindingException(ServletRequestBindingException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("9");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.servlet.request.bind"));
	}

	@Override
	protected ResponseEntity<Object> handleConversionNotSupported(ConversionNotSupportedException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("10");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.conversion.not.supperted"));
	}

	@Override
	protected ResponseEntity<Object> handleTypeMismatch(TypeMismatchException ex, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		System.out.println("11");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.type.mismatch"));
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("12");
//		System.out.println("Request" + request.getHeader());
		return buildResponse(ex, request, status.toString(), env.getProperty("error.http.message.not.readable"));
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("13");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.http.message.not.writable"));
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("14");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.method.argument.not.valid"));
	}

	@Override
	protected ResponseEntity<Object> handleMissingServletRequestPart(MissingServletRequestPartException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		System.out.println("handleMissingServletRequestPart: 15");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.missing.servlet.request.part"));
	}

	@Override
	protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		System.out.println("16");
		return buildResponse(ex, request, status.toString(), env.getProperty("error.register.user.duplicate"));
	}
	
	
    private String loadCustomErrorPageContent() {
        return "<!DOCTYPE html>\r\n"
        		+ "<html lang=\"en\">\r\n"
        		+ "<head>\r\n"
        		+ "<meta charset=\"UTF-8\">\r\n"
        		+ "<title>Page Not Found</title>\r\n"
        		+ "<style>\r\n"
        		+ "body {\r\n"
        		+ "text-align: center;\r\n"
        		+ "padding: 50px;\r\n"
        		+ "font-family: \"Arial\", sans-serif;\r\n"
        		+ "}\r\n"
        		+ "h1 {\r\n"
        		+ "font-size: 50px;\r\n"
        		+ "}\r\n"
        		+ "body > div {\r\n"
        		+ "padding: 20px;\r\n"
        		+ "}\r\n"
        		+ "</style>\r\n"
        		+ "</head>\r\n"
        		+ "<body>\r\n"
        		+ "<h1>404</h1>\r\n"
        		+ "<div>\r\n"
        		+ "<p>Oops! The page you are looking for doesn't exist.</p>\r\n"
        		+ "<p>You may have mistyped the address or the page may have moved.</p>\r\n"
        		+ "<a href=\"/vms\">Go Home</a>\r\n"
        		+ "</div>\r\n"
        		+ "</body>\r\n"
        		+ "</html>";
   }

}
