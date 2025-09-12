package project.maker.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.Exception.ExceptionsList;
import project.maker.mapper.ReportMapper;
import project.maker.model.ReportPayment;
import project.utils.Utils;



@Service
public class ReportService {
	
	@Autowired
	private ReportMapper reportMapper;
	
	@Autowired
	private Utils util;
	
	public List<ReportPayment> paymentReport(HttpServletRequest request) {
		try {
//			if (util.isPermitted(request, "Maker", "View_services")) {
				List<ReportPayment> service = reportMapper.PaymentReport();

				util.registerActivity(request, "View report", "get payment report");
				return service;
//			} else {
//				System.out.println("No user does not have permission.");
//				return null;
//			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

}
