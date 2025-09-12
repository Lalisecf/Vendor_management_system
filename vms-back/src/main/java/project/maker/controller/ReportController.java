package project.maker.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import project.maker.service.ReportService;
import project.response.APIResponse;



@RestController
@RequestMapping("/api/report/")
public class ReportController {
	
	@Autowired
	private ReportService reportService;
	
	@RequestMapping(value = "payment-report", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Object> paymentReport(HttpServletRequest request) {
		return APIResponse.response(reportService.paymentReport(request));
	}

}
