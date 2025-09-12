package project.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.IOUtils;

import com.google.auto.value.processor.escapevelocity.ParseException;
import com.google.zxing.WriterException;

import project.maker.model.ContractView;
import project.maker.model.Payments;
import project.maker.model.Product;
import project.maker.model.Reports;
import project.maker.model.ServiceModel;

public class ExcelHelper {

	private static void insertQrCodeToCell(Workbook workbook, int rowNum, Drawing drawing, Sheet sheet, String date)
			throws IOException, WriterException, ParseException, java.text.ParseException {

		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
		Date date2 = formatter.parse(date);
		Calendar cal = Calendar.getInstance();
		cal.setTime(date2);
		String monthName = new SimpleDateFormat("MMMM").format(cal.getTime());

		String signature = "VENDOR MANAGMENT REPORT " + monthName + " " + date2.getDate() + ", "
				+ date2.toString().split(" ")[5];
		byte[] image = new byte[0];
		image = QRCodeGenerator.getQRCodeImage(signature, 300, 300);

		int inputImagePictureID = workbook.addPicture(image, Workbook.PICTURE_TYPE_PNG);
		ClientAnchor anchor = new HSSFClientAnchor();

		anchor.setCol1(3);
		anchor.setCol2(4);
		anchor.setRow1(rowNum - 1);
		anchor.setRow2(rowNum);
		anchor.setDx1(500);
		anchor.setDy1(0);

		final Picture pict = drawing.createPicture(anchor, inputImagePictureID);
		pict.resize();
		pict.resize(0.12, 0.25);
	}

	private static void insertLogoToCell(Workbook workbook, int rowNum, Drawing drawing) throws IOException {

		final String DIRECTORY_logo = System.getProperty("user.dir")
				+ "/src/main/resources/static/logo/logo_002.png";
		File file_path = new File(StringUtils.join(DIRECTORY_logo));
		if (!file_path.exists()) {
			file_path.mkdirs();
		}

		InputStream is = new FileInputStream(DIRECTORY_logo);
		byte[] inputImageBytes = IOUtils.toByteArray(is);
		int inputImagePictureID = workbook.addPicture(inputImageBytes, Workbook.PICTURE_TYPE_PNG);
		is.close();
		ClientAnchor anchor = new HSSFClientAnchor();

		anchor.setCol1(1);
		anchor.setCol2(3);
		anchor.setRow1(rowNum - 1);
		anchor.setRow2(rowNum);
		drawing.createPicture(anchor, inputImagePictureID);

	}

	public static ByteArrayInputStream generate(Reports report, List<ContractView> contracts)
			throws ParseException, WriterException, java.text.ParseException {
		try (Workbook workbook = new HSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

			String monthName = new SimpleDateFormat("MMMM").format(Calendar.getInstance().getTime());
			String FILE_NAME = "REPORT_As_of_" + monthName + ".xls";

			Sheet sheet = workbook.createSheet("Vendor Management Report");

			// Header styles
			Font headerFont = workbook.createFont();
			headerFont.setBold(true);
			CellStyle headerCellStyle = workbook.createCellStyle();
			headerCellStyle.setFont(headerFont);
			headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
			headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

			// Cell styles
			Font cellFont = workbook.createFont();
			CellStyle cellStyle = workbook.createCellStyle();
			cellStyle.setFont(cellFont);
			cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
			Date date2 = formatter.parse(new SimpleDateFormat("yyyy-MM-dd").format(Calendar.getInstance().getTime()));
			// Row 1: Title
			Row titleRow = sheet.createRow(0);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("V-M-S Report - As of " + monthName + " " + date2.getDate());
			titleCell.setCellStyle(headerCellStyle);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 17));

			// Row 2: Subtitle
			Row subtitleRow = sheet.createRow(1);
			Cell subtitleCell = subtitleRow.createCell(0);
			subtitleCell.setCellValue(
					"Generated on " + new SimpleDateFormat("MM/dd/yyyy").format(Calendar.getInstance().getTime()));
			subtitleCell.setCellStyle(headerCellStyle);
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 17));

			Font font = workbook.createFont();
			font.setFontHeightInPoints((short) 8);
			font.setBold(true);

			Font font2 = workbook.createFont();
			font2.setFontHeightInPoints((short) 8);

			// sheet.addMergedRegion(new CellRangeAddress(0, 0, 1, 2));

			// Header
			// Row titleRow = sheet.createRow(0);
			titleRow.setHeight((short) (1200));

			// =============================================
			Drawing drawing = sheet.createDrawingPatriarch();

			insertLogoToCell(workbook, 1, drawing);
			// =============================================

			// =============================================
			Drawing drawing2 = sheet.createDrawingPatriarch();
			// Cell cell_qr_code = titleRow.createCell(2);
			insertQrCodeToCell(workbook, 1, drawing2, sheet,
					DateTimeFormatter.ofPattern("MM-dd-yyyy").format(LocalDateTime.now()));
			// Row 3: Column Headers
			Row headerRow = sheet.createRow(2);
			String[] headers = { "NO.", "Contract ID", "Vendor", "Contract Type", "Start Date", "End Date",
					"Payment Method", "Payment Frequency", "Currency", "Total Amount", "Product", "Service",
					"Payment No.", "Expected Date", "Paid Date", "Paid Amount", "Amount per Contigency", "Status" };
			for (int i = 0; i < headers.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headers[i]);
				cell.setCellStyle(headerCellStyle);
			}

			// Populate data rows
			int rowNum = 3;
			int contractNo = 1;
			int paymentNo = 1;
			for (ContractView contract : contracts) {
				Row row = sheet.createRow(rowNum++);

				// Contract details
				row.createCell(0).setCellValue(contractNo++);
				row.createCell(1).setCellValue("Cont " + contract.getId());
				row.createCell(2).setCellValue(contract.getVendor_name() != null ? contract.getVendor_name() : "");
				row.createCell(3).setCellValue(contract.getContract_type() != null ? contract.getContract_type() : "");
				row.createCell(4).setCellValue(contract.getStart_date() != null ? contract.getStart_date() : "");
				row.createCell(5).setCellValue(contract.getEnd_date() != null ? contract.getEnd_date() : "");
				row.createCell(6)
						.setCellValue(contract.getPayment_method() != null ? contract.getPayment_method() : "");
				row.createCell(7)
						.setCellValue(contract.getPayment_frequency() != null ? contract.getPayment_frequency() : "");
				row.createCell(8).setCellValue(contract.getCurrency() != null ? contract.getCurrency() : "");
				row.createCell(9).setCellValue(contract.getTotal_amount());

				// Products
				StringBuilder products = new StringBuilder();
				for (Product product : contract.getProducts()) {
					if (product != null) {
						products.append(product.getName()).append(", ");
					}
				}
				row.createCell(10).setCellValue(products.toString());

				// Services
				StringBuilder services = new StringBuilder();
				for (ServiceModel service : contract.getServices()) {
					if (service != null) {
						services.append(service.getName()).append(", ");
					}
				}
				row.createCell(11).setCellValue(services.toString());
				// Payments
				int payment_counter = 1;
				int startRow = rowNum;
				if (contract.getPayments() != null && !contract.getPayments().isEmpty()) {
					for (Payments payment : contract.getPayments()) {
						Row paymentRow = sheet.createRow(rowNum++);

						// Create cells for payment details
						paymentRow.createCell(12).setCellValue("Payment " + payment_counter);
						paymentRow.createCell(13).setCellValue(payment.getDate() != null ? payment.getDate() : "");
						paymentRow.createCell(14)
								.setCellValue(payment.getPaid_date() != null ? payment.getPaid_date() : "");
						paymentRow.createCell(15).setCellValue(payment.getPaid_amount());
						paymentRow.createCell(16).setCellValue(payment.getAmount_per_contigency());
						paymentRow.createCell(17).setCellValue(payment.getStatus().equals("2") ? "Paid" : "Not paid");

						payment_counter++;
					}

					int endRow = rowNum - 1; // Last row of the "Payments" section

					// Merge cells for "Payments" section (from column 0 to 11)
					sheet.addMergedRegion(new CellRangeAddress(startRow, endRow, 0, 11));

					double paid_amount = 0.00;
					for (Payments payment : contract.getPayments()) {
						if (payment.getStatus().equalsIgnoreCase("2")) {
							paid_amount = paid_amount + payment.getPaid_amount();
						}
					}

					// Create a single "Payments" cell in the merged region
					Row mergedPaymentRow = sheet.getRow(startRow); // Get the first row of the merged region
					Cell paymentCell = mergedPaymentRow.createCell(0);
					paymentCell.setCellValue("(" + contract.getPayments().size()
							+ ") Payments Attached for the above Contract Contract ID: Cont " + contract.getId()
							+ " , Toatl Amount: " + contract.getTotal_amount() + " , Paid mount: " + paid_amount
							+ " , Unpaid Amount: " + (contract.getTotal_amount() - paid_amount));
					CellStyle backgroundStyle = workbook.createCellStyle();
					backgroundStyle.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
					backgroundStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
					paymentCell.setCellStyle(backgroundStyle);
					// Define style for "Payments" cell
					CellStyle paymentCellStyle = workbook.createCellStyle();
					Font paymentFont = workbook.createFont();
					paymentFont.setFontHeightInPoints((short) 14); // Set large font size
					paymentFont.setBold(true); // Set bold font
					paymentCellStyle.setFont(paymentFont);
					paymentCellStyle.setAlignment(HorizontalAlignment.CENTER);
					paymentCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
					paymentCell.setCellStyle(paymentCellStyle);

					// Skip to create other cells for payment details
					for (int i = 1; i <= 11; i++) {
						mergedPaymentRow.createCell(i);
					}
				} else {
					Row paymentRow = sheet.createRow(rowNum++);
					sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 11));

					// Create cell for "Payments" and set style
					Cell paymentCell = paymentRow.createCell(0);
					paymentCell.setCellValue("(" + contract.getPayments().size()
							+ ") Payments Attached for the above Contract Contract ID: Cont " + contract.getId()
							+ " , Toatl Amount: " + contract.getTotal_amount() + " , Paid mount: 0.00 , Unpaid Amount: "
							+ contract.getTotal_amount());

					// Define style for "Payments" cell
					CellStyle paymentCellStyle = workbook.createCellStyle();
					Font paymentFont = workbook.createFont();
					paymentFont.setFontHeightInPoints((short) 14); // Set large font size
					paymentFont.setBold(true); // Set bold font
					paymentCellStyle.setFont(paymentFont);
					paymentCellStyle.setAlignment(HorizontalAlignment.CENTER);
					paymentCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
					paymentCell.setCellStyle(paymentCellStyle);

					// Skip to create other cells for payment details
					for (int i = 1; i <= 11; i++) {
						paymentRow.createCell(i);
					}
				}
			}

			// Auto-size columns
			for (int i = 0; i < headers.length; i++) {
				sheet.autoSizeColumn(i);
			}

			// Footer row
			Row footerRow = sheet.createRow(rowNum++);
			footerRow.setHeightInPoints((2 * sheet.getDefaultRowHeightInPoints()));
			Cell footerCell = footerRow.createCell(0);
			footerCell.setCellValue(
					"           Prepared By: ____________________________    Checked By: ___________________________    Follow Up By: ________________________________    Approved By: ________________________________");
			CellStyle footerStyle = workbook.createCellStyle();
			Font footerFont = workbook.createFont();
			footerFont.setFontHeightInPoints((short) 10);
			footerFont.setFontName("Helvetica");
			footerFont.setBold(false);
			footerStyle.setFont(footerFont);
			footerCell.setCellStyle(footerStyle);

			workbook.write(out);
			return new ByteArrayInputStream(out.toByteArray());
		} catch (IOException e) {
			throw new RuntimeException("Failed to export data to Excel file: " + e.getMessage());
		}
	}
}
