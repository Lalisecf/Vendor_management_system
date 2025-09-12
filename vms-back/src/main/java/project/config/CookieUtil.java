package project.config;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

	public static void create(HttpServletResponse httpServletResponse, String name, String value, Boolean secure,
			String maxAge, String domain) {
		Cookie cookie = new Cookie(name, value);
		cookie.setSecure(secure);
		cookie.setHttpOnly(true);
		cookie.setMaxAge(convert_max_age(Long.parseLong(maxAge)));
		cookie.setDomain(domain);
		cookie.setPath("/");
		cookie.setSecure(secure);
		httpServletResponse.addCookie(cookie);
	}
	
	public static void clear(HttpServletResponse httpServletResponse, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(1);
        cookie.setDomain("localhost");
        httpServletResponse.addCookie(cookie);
	}
	
	public static int convert_max_age(long age) {
		return (int) (age/1000);
	}
}


//DO NOT DELETE THIS CODE IT IS USEFULL

//@Component
//public class CookieUtil {
//
//	public static void create(HttpServletResponse httpServletResponse, String name, String value, Boolean secure,
//			String maxAge, String domain) {
//		
//		
//		
////		final ResponseCookie responseCookie = ResponseCookie
////		        .from(name, value)
////		        .secure(secure)
////		        .httpOnly(true)
////		        .path("/")
////		        .maxAge(Integer.parseInt(maxAge))
////		        .sameSite("None").secure(true).domain(domain)
////		        .build();
////		System.out.println("Cookie is being added...");
////		httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
////		System.out.println("Cookie is added successfully: ... : ");
//		
//		Cookie cookie = new Cookie(name, value);
//		cookie.setSecure(secure);
//		cookie.setHttpOnly(true);
//		cookie.setMaxAge(Integer.parseInt(maxAge));
//		cookie.setDomain(domain);
//		cookie.setPath("/");
//		cookie.setSecure(secure);
//		System.out.println("Cookie is being added...");
//		httpServletResponse.addCookie(cookie);
//		System.out.println("Cookie is added successfully: ... : ");
//	
//	}
//
//	public static void clear(HttpServletResponse httpServletResponse, String name) {
//		Cookie cookie = new Cookie(name, null);
//		cookie.setPath("/");
//		cookie.setHttpOnly(true);
//		cookie.setMaxAge(1);
//		cookie.setDomain("localhost");
//		httpServletResponse.addCookie(cookie);
//	}
//}
