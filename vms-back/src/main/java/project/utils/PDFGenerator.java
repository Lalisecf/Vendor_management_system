package project.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.commons.io.IOUtils;

import com.google.zxing.WriterException;
import com.lowagie.text.BadElementException;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.html.WebColors;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;

import project.maker.model.ContractView;
import project.maker.model.Payments;
import project.maker.model.Product;
import project.maker.model.Reports;
import project.maker.model.ServiceModel;

public class PDFGenerator {
	public String generate(Reports report, List<ContractView> contracts)
			throws DocumentException, IOException, ParseException {

		final String DIRECTORY_logo = System.getProperty("user.dir")
				+ "/src/main/resources/static/awash_logo/awash_logo_002.png";
		final String DIRECTORY2 = System.getProperty("user.dir") + "/src/main/resources/static/generated_reports/";
		final String FILE_NAME = "REPORT_As_of_" + ".pdf";
		final String DIRECTORY = DIRECTORY2 + FILE_NAME;

		File file_path = new File(DIRECTORY2);
		if (!file_path.exists()) {
			file_path.mkdirs();
		}

		FileOutputStream pdfOutputFile = new FileOutputStream(DIRECTORY);

		// Create document with margins and size
		Document document = new Document(PageSize.A4);
		PdfWriter writer = PdfWriter.getInstance(document, pdfOutputFile);

		// Define page event handler to add page numbers
		PageNumberEvent event = new PageNumberEvent();
		writer.setPageEvent(event);

		// Open document for writing
		document.open();

		Font fo = FontFactory.getFont(FontFactory.HELVETICA, 8.85f, Font.BOLD);
		Font fo7 = FontFactory.getFont(FontFactory.HELVETICA, 7.5f, Font.BOLD);
		Font fom = FontFactory.getFont(FontFactory.HELVETICA, 6.5f, Font.BOLD);
		Font fo1 = FontFactory.getFont(FontFactory.HELVETICA, 10f, Font.BOLD);
		Font fo2 = FontFactory.getFont(FontFactory.HELVETICA, 6.5f, Font.NORMAL);

		PdfPTable tablet = new PdfPTable(2);
		tablet.setWidthPercentage(100f);
		tablet.setWidths(new int[] { 8000, 2000 });
		tablet.setSpacingBefore(5);

		PdfPCell cellt1 = new PdfPCell();
		cellt1.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt1.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt1.setFixedHeight(60.5f);

		// Load the logo image
		Image image = Image.getInstance(IOUtils.toByteArray(new FileInputStream(DIRECTORY_logo)));
		image.scaleToFit(2000, 1000);
		cellt1.addElement(image); // Add the logo to the cell

		// Add text to the same cell
		Phrase phrase = new Phrase();
		cellt1.addElement(phrase);

		cellt1.setBorder(Rectangle.NO_BORDER);
		cellt1.setBackgroundColor(WebColors.getRGBColor("#191970"));

		// Add the cell to the table
		tablet.addCell(cellt1);

		String signature = "AWASH BANK VENDOR MANAGEMENT Report OF " + " AS of "
				+ DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now());
		PdfPCell celly = new PdfPCell();
		celly.setFixedHeight(60.5f);
		celly.setPaddingLeft(50f);
		try {
			celly.addElement(Image.getInstance(QRCodeGenerator.getQRCodeImage(signature, 10, 10)));
		} catch (BadElementException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (WriterException e) {
			e.printStackTrace();
		}
		celly.setBorder(Rectangle.NO_BORDER);
		celly.setBackgroundColor(WebColors.getRGBColor("orange"));
		tablet.addCell(celly);

		PdfPCell cell12 = new PdfPCell();
		cell12.setPhrase(new Phrase("", fo));
		cell12.setBorder(Rectangle.NO_BORDER);
		tablet.addCell(cell12);
		PdfPCell cell13 = new PdfPCell();
		cell13.setPhrase(new Phrase("", fo));
		cell13.setBorder(Rectangle.NO_BORDER);
		tablet.addCell(cell13);
		PdfPCell cell14 = new PdfPCell();
		cell14.setPhrase(new Phrase("AWAH BANK V-M-S-Report AS", fo7));
		cell14.setBorder(Rectangle.NO_BORDER);
		tablet.addCell(cell14);
		document.add(tablet);

		PdfPTable tablets = new PdfPTable(1);
		tablets.setWidthPercentage(100f);
		tablets.setWidths(new int[] { 20000 });
		tablets.setSpacingBefore(0);

		PdfPCell cellt2 = new PdfPCell();
		cellt2.setPaddingLeft(1f);
		cellt2.setPaddingRight(1f);
		cellt2.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt2.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt2.setNoWrap(false);
		cellt2.setFixedHeight(25.5f);
		cellt2.setPaddingTop(5f);
		cellt2.setBorder(Rectangle.NO_BORDER);

		PdfPCell cellt22 = new PdfPCell();
		cellt22.setPaddingLeft(1f);
		cellt22.setPaddingRight(1f);
		cellt22.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt22.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt22.setNoWrap(false);
		cellt22.setFixedHeight(25.5f);
		cellt22.setPaddingTop(5f);
		cellt22.setBorder(Rectangle.NO_BORDER);

		PdfPCell cellt33 = new PdfPCell();
		cellt33.setPaddingLeft(1f);
		cellt33.setPaddingRight(1f);
		cellt33.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt33.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt33.setNoWrap(false);
		cellt33.setFixedHeight(25.5f);
		cellt33.setPaddingTop(5f);
		cellt33.setBorder(Rectangle.NO_BORDER);

		PdfPCell cellt44 = new PdfPCell();
		cellt44.setPaddingLeft(1f);
		cellt44.setPaddingRight(1f);
		cellt44.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt44.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt44.setNoWrap(false);
		cellt44.setFixedHeight(25.5f);
		cellt44.setPaddingTop(5f);
		cellt44.setBorder(Rectangle.NO_BORDER);

		PdfPCell cellt55 = new PdfPCell();
		cellt55.setPaddingLeft(1f);
		cellt55.setPaddingRight(1f);
		cellt55.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt55.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt55.setNoWrap(false);
		cellt55.setFixedHeight(25.5f);
		cellt55.setPaddingTop(5f);
		cellt55.setBorder(Rectangle.NO_BORDER);
		PdfPCell cellt66 = new PdfPCell();
		cellt66.setPaddingLeft(1f);
		cellt66.setPaddingRight(1f);
		cellt66.setHorizontalAlignment(Element.ALIGN_CENTER);
		cellt66.setVerticalAlignment(Element.ALIGN_MIDDLE);
		cellt66.setNoWrap(false);
		cellt66.setFixedHeight(25.5f);
		cellt66.setPaddingTop(5f);
		cellt66.setBorder(Rectangle.NO_BORDER);

		StringBuilder p = new StringBuilder();
		StringBuilder p1 = new StringBuilder();
		StringBuilder p2 = new StringBuilder();
		StringBuilder p3 = new StringBuilder();
		StringBuilder p4 = new StringBuilder();

		if (report.getContract_payment_frequency() != null && !report.getContract_payment_frequency().isEmpty()) {
			p.append("#/ Contract payment frequency: ").append(report.getContract_payment_frequency()).append("\n");
		}
		if (report.getContract_start_date_min() != null && !report.getContract_start_date_min().isEmpty()) {
			p2.append("#/ Contract Start date from: ").append(report.getContract_start_date_min()).append(" to ")
					.append(report.getContract_start_date_max()).append("\n");
		}
		if (report.getContract_end_date_min() != null && !report.getContract_end_date_min().isEmpty()) {
			p3.append("#/ Contract End date from: ").append(report.getContract_end_date_min()).append(" to ")
					.append(report.getContract_end_date_max()).append("\n");
		}
		if (report.getContract_payment_date_min() != null && !report.getContract_payment_date_min().isEmpty()) {
			p1.append("#/ Contract Payment date from: ").append(report.getContract_payment_date_min()).append(" to ")
					.append(report.getContract_payment_date_max()).append("\n");
		}
		if (report.getId() != null) {
			p4.append("#/ Vendor: ").append(report.getVendor());
		}

		Paragraph pt1 = new Paragraph(p.toString(), fo1);
		cellt2.addElement(pt1);

		Paragraph pt11 = new Paragraph(p1.toString(), fo1);
		cellt22.addElement(pt11);

		Paragraph pt22 = new Paragraph(p2.toString(), fo1);
		cellt33.addElement(pt22);

		Paragraph pt33 = new Paragraph(p3.toString(), fo1);
		cellt44.addElement(pt33);
		Paragraph pt44 = new Paragraph(p4.toString(), fo1);
		cellt55.addElement(pt44);
		String monthName = new SimpleDateFormat("MMMM").format(Calendar.getInstance().getTime());
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
		Date date2 = formatter.parse(new SimpleDateFormat("yyyy-MM-dd").format(Calendar.getInstance().getTime()));

		Paragraph pt66 = new Paragraph("@_ .  AWAH BANK VENDOR MANAGMENT SYSTEM Report AS Of " + monthName + " "
				+ date2.getDate() + ", Based on the following  Crateria :-", fo1);
		cellt66.addElement(pt66);
		cellt66.setBackgroundColor(WebColors.getRGBColor("#E6E6FA"));
		tablets.addCell(cellt66);
		tablets.addCell(cellt2);
		tablets.addCell(cellt55);
		tablets.addCell(cellt22);
		tablets.addCell(cellt33);
		tablets.addCell(cellt44);
		document.add(tablets);

		PdfPTable table = new PdfPTable(12);
		table.setWidthPercentage(110f);
		table.setSpacingBefore(5);

		// Create table cells with common styling
		PdfPCell[] cells = new PdfPCell[12];
		for (int i = 0; i < 12; i++) {
			PdfPCell cell = new PdfPCell();
			cell.setPaddingLeft(1f);
			cell.setPaddingRight(1f);
			cell.setVerticalAlignment(Element.ALIGN_CENTER);
			cell.setHorizontalAlignment(Element.ALIGN_CENTER); // Adjust alignment as needed
			cell.setNoWrap(false); // Allow text wrapping
			cell.setFixedHeight(20f); // Increase cell height if needed
			cells[i] = cell;
		}

		// Header titles
		cells[0].setPhrase(new Phrase("NO.", fo));
		cells[1].setPhrase(new Phrase("Contract ID", fo));
		cells[2].setPhrase(new Phrase("Vendor", fo));
		cells[3].setPhrase(new Phrase("Contract Type", fo));
		cells[4].setPhrase(new Phrase("Start Date", fo));
		cells[5].setPhrase(new Phrase("End Date", fo));
		cells[6].setPhrase(new Phrase("Payment Method", fo));
		cells[7].setPhrase(new Phrase("Payment Frequency", fo));
		cells[8].setPhrase(new Phrase("Currency", fo));
		cells[9].setPhrase(new Phrase("Total Amount", fo));
		cells[10].setPhrase(new Phrase("Product", fo));
		cells[11].setPhrase(new Phrase("Service", fo));

		// Add cells to the table
		for (PdfPCell cell : cells) {
			cell.setBackgroundColor(WebColors.getRGBColor("silver"));
			cell.setNoWrap(false);
			cell.setFixedHeight(40.5f);
			cell.setPaddingTop(5f);
			cell.setBorderColor(WebColors.getRGBColor("black"));
			table.addCell(cell);
		}

		// Initialize counters
		int contract_counter = 1;
		int payment_counter = 1;

		// Loop through each contract
		for (ContractView contract : contracts) {
			if (contracts.isEmpty()) {
				PdfPCell noDataCell = new PdfPCell(new Phrase("No data available", fo));
				noDataCell.setColspan(12); // Span across all 6 columns
				noDataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
				noDataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
				noDataCell.setBackgroundColor(WebColors.getRGBColor("lightgray"));
				noDataCell.setPadding(20f);
				table.addCell(noDataCell);
			}
			table.addCell(new Phrase(String.valueOf(contract_counter++), fo2)); // Contract counter

			PdfPCell contractIdCell = new PdfPCell(new Phrase("Cont " + contract.getId(), fo2));
			contractIdCell.setBackgroundColor(WebColors.getRGBColor("gold")); // Light gray background color
			contractIdCell.setHorizontalAlignment(Element.ALIGN_CENTER); // Center alignment
			contractIdCell.setVerticalAlignment(Element.ALIGN_MIDDLE); // Middle alignment
			table.addCell(contractIdCell); // Contract ID

			table.addCell(new Phrase(contract.getVendor_name() != null ? contract.getVendor_name() : "", fo2)); // Vendor
																												// name
			table.addCell(new Phrase(contract.getContract_type() != null ? contract.getContract_type() : "", fo2)); // Contract
																													// type
			table.addCell(new Phrase(contract.getStart_date() != null ? contract.getStart_date() : "", fo2)); // Start
																												// date
			table.addCell(new Phrase(contract.getEnd_date() != null ? contract.getEnd_date() : "", fo2)); // End date
			table.addCell(new Phrase(contract.getPayment_method() != null ? contract.getPayment_method() : "", fo2)); // Payment
																														// method
			table.addCell(
					new Phrase(contract.getPayment_frequency() != null ? contract.getPayment_frequency() : "", fo2)); // Payment
																														// frequency
			table.addCell(new Phrase(contract.getCurrency() != null ? contract.getCurrency() : "", fo2)); // Currency
			table.addCell(new Phrase(String.valueOf(contract.getTotal_amount()), fo2)); // Total amount

			// Concatenate product names into a single string
			StringBuilder productBuilder = new StringBuilder();
			for (Product product : contract.getProducts()) {
				if (product != null) {
					productBuilder.append(product.getName()).append(", ");
				}
			}
			String products = productBuilder.toString().isEmpty() ? ""
					: productBuilder.substring(0, productBuilder.length() - 2);
			table.addCell(new Phrase(products, fo2)); // Products

			// Concatenate service names into a single string
			StringBuilder serviceBuilder = new StringBuilder();
			for (ServiceModel service : contract.getServices()) {
				if (service != null) {
					serviceBuilder.append(service.getName()).append(", ");
				}
			}
			String services = serviceBuilder.toString().isEmpty() ? ""
					: serviceBuilder.substring(0, serviceBuilder.length() - 2);
			table.addCell(new Phrase(services, fo2)); // Services

			// Create a nested table for payments
			PdfPTable paymentTable = new PdfPTable(6); // Assuming you need 6 columns for payments
			paymentTable.setWidthPercentage(100f);

			// Header row for payments
			PdfPCell headerCell;
			PdfPCell headerCelll = new PdfPCell(new Phrase("Currency\n=> " + contract.getCurrency(), fom));
			headerCelll.setPadding(8f);

			// Add the header cell to your table
			table.addCell(headerCelll);

			if (contract.getPayments().isEmpty()) {
				headerCell = new PdfPCell(new Phrase("# Not Payments Attached (" + contract.getPayments()
						+ " ) for the above contract Contract ID: Cont " + contract.getId() + ", Total Amount: "
						+ contract.getTotal_amount() + ", Paid amount: 0.00  , unPaid amount: "
						+ contract.getTotal_amount(), fom));
				headerCell.setColspan(6); // Span across all 6 columns
				headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
				headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
				headerCell.setBackgroundColor(WebColors.getRGBColor("orange"));
				headerCell.setPadding(8f);
				paymentTable.addCell(headerCell);
			} else {
				double paid_amount = 0.00;
				double unpaid_amount = 0.0;

				for (Payments payment : contract.getPayments()) {
					if (payment.getStatus().equalsIgnoreCase("2")) {
						paid_amount = paid_amount + payment.getPaid_amount();
					}
				}
				unpaid_amount = contract.getTotal_amount() - paid_amount;

				headerCell = new PdfPCell(new Phrase("The following (" + contract.getPayments().size()
						+ ") Payments Attached for the above contract Contract ID: Cont " + contract.getId()
						+ " , Total Amount: " + contract.getTotal_amount() + " , Paid Amount: " + paid_amount
						+ " , UnPaid Amount: " + unpaid_amount, fom));
				headerCell.setColspan(6); // Span across all 6 columns
				headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
				headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
				headerCell.setBackgroundColor(WebColors.getRGBColor("gold"));
				headerCell.setPadding(8f);
				paymentTable.addCell(headerCell);
			}

			// Iterate through payments for the current contract
			for (Payments payment : contract.getPayments()) {
				paymentTable.addCell(new Phrase("Payment: " + payment_counter++, fo2));
				paymentTable.addCell(
						new Phrase("Expected Date: " + (payment.getDate() != null ? payment.getDate() : ""), fo2));
				paymentTable.addCell(new Phrase(
						"Paid Date: " + (payment.getPaid_date() != null ? payment.getPaid_date() : ""), fo2));
				paymentTable.addCell(new Phrase("Amount: " + (payment.getPaid_amount()), fo2));
				paymentTable.addCell(new Phrase("Amount per contigency: " + (payment.getAmount_per_contigency()), fo2));

				if (payment.getStatus().equals("2")) {
					headerCell = new PdfPCell(new Phrase("Status: Paid", fo));
					headerCell.setBackgroundColor(WebColors.getRGBColor("rgb(32, 178, 170)" + ""));
					paymentTable.addCell(headerCell);
//					paymentTable
//					.addCell(new Phrase("Status: " + (payment.getStatus().equals("2") ? "Paid" : "Not paid"), fo2));
				} else if (payment.getStatus().equals("1") && payment.getRequest_type() == null) {
					headerCell = new PdfPCell(new Phrase("Status: No Initiation", fo));
					headerCell.setBackgroundColor(WebColors.getRGBColor("#FFF8DC"));
					paymentTable.addCell(headerCell);
				} else {
					headerCell = new PdfPCell(new Phrase("Status: Pending", fo));
					headerCell.setBackgroundColor(WebColors.getRGBColor("#BC8F8F"));
					paymentTable.addCell(headerCell);
				}

			}

			// Add payment table to the main table as a single cell
			PdfPCell paymentCell = new PdfPCell(paymentTable);
			paymentCell.setColspan(12); // Span across all 12 columns of the main table
			table.addCell(paymentCell);

			// Reset payment counter for the next contract
			payment_counter = 1;
		}
		if (contracts.isEmpty()) {
			PdfPCell noDataCell = new PdfPCell(new Phrase("No data available", fo));
			noDataCell.setColspan(12); // Span across all 6 columns
			noDataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
			noDataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
			noDataCell.setBackgroundColor(WebColors.getRGBColor("lightgray"));
			noDataCell.setPadding(20f);
			table.addCell(noDataCell);
		}
		// Add the main table to the document
		document.add(table);

		Font fo3 = FontFactory.getFont(FontFactory.HELVETICA, 10f, Font.NORMAL);
		Paragraph paragraph2 = new Paragraph(
				"Prepared By ________    Checked By _________    Follow Up By _________    Approved By _________", fo3);
		document.add(new Paragraph(" "));
		document.add(paragraph2);

		document.close();

		return DIRECTORY;
	}

	public class PageNumberEvent extends PdfPageEventHelper {

		private String footerText;

		public PageNumberEvent() throws ParseException {
			// Get current month name
			String monthName = new SimpleDateFormat("MMMM", Locale.ENGLISH).format(Calendar.getInstance().getTime());

			// Get current date formatted as yyyy-MM-dd
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
			Date date2 = formatter.parse(new SimpleDateFormat("yyyy-MM-dd").format(Calendar.getInstance().getTime()));
			footerText = "Vendor Management Systems " + Year.now().getValue() + " ©Awash Bank  Report As Of "
					+ monthName + " " + date2.getDate();
		}

		public void onEndPage(PdfWriter writer, Document document) {
			PdfContentByte cb = writer.getDirectContent();
			cb.saveState();

			// Draw line above footer
			float lineWidth = 0.5f;
			float lineOffset = 10f; // Space between line and footer text
			float lineYPosition = document.bottomMargin() - lineOffset;
			cb.setLineWidth(lineWidth);
			cb.moveTo(document.leftMargin(), lineYPosition);
			cb.lineTo(document.right() - document.rightMargin(), lineYPosition);
			cb.stroke();

			// Footer Text
			float footerTextSize = 8.5f;
			float footerTextBase = document.bottom() - 20 - lineOffset; // Adjusted for line offset
			try {
				BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
				cb.beginText();
				cb.setFontAndSize(baseFont, footerTextSize);
				cb.setTextMatrix(document.leftMargin(), footerTextBase);
				cb.showTextAligned(Element.ALIGN_LEFT, footerText, document.leftMargin(), footerTextBase, 0);
				cb.endText();
			} catch (DocumentException | IOException e) {
				e.printStackTrace();
			}

			// Page Number
			String pageNumberText = "Page " + writer.getPageNumber();
			float pageNumberTextSize = 8.5f;
			float pageNumberTextBase = document.bottom() - 20 - lineOffset; // Adjusted for line offset
			try {
				BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
				cb.beginText();
				cb.setFontAndSize(baseFont, pageNumberTextSize);
				float pageTextWidth = baseFont.getWidthPoint(pageNumberText, pageNumberTextSize);
				cb.setTextMatrix(document.right() - document.rightMargin() - pageTextWidth, pageNumberTextBase);
				cb.showTextAligned(Element.ALIGN_RIGHT, pageNumberText, document.right() - document.rightMargin(),
						pageNumberTextBase, 0);
				cb.endText();
			} catch (DocumentException | IOException e) {
				e.printStackTrace();
			}

			cb.restoreState();
		}
	}
}
