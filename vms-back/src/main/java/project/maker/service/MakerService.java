package project.maker.service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Field;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.google.auto.value.processor.escapevelocity.ParseException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.zxing.WriterException;
import com.lowagie.text.DocumentException;

import project.Exception.CustomAllException;
import project.Exception.ExceptionsList;
import project.maker.mapper.MakerCheckerDashboardMapper;
import project.maker.mapper.MakerMapper;
import project.maker.mapper.ReportMapper;
import project.maker.model.Contract;
import project.maker.model.ContractView;
import project.maker.model.FileTable;
import project.maker.model.Licence;
import project.maker.model.Payment;
import project.maker.model.Product;
import project.maker.model.Reasons;
import project.maker.model.Remarks;
import project.maker.model.Reports;
import project.maker.model.ServiceModel;
import project.maker.model.Vendor;
import project.maker.model.Vendors;
import project.mapper.MapperAuth;
import project.model.Remark;
import project.utils.ExcelHelper;
import project.utils.PDFGenerator;
import project.utils.Utils;

@Service
public class MakerService {
	@Autowired
	MakerCheckerDashboardMapper makerCheckerDashboard;
	@Autowired
	private MakerMapper makerMapper;
	@Autowired
	private Utils util;
	@Autowired
	private ReportMapper reportMapper;
	@Autowired
	private MapperAuth authMapper;

	public boolean register_product(Product productModel, HttpServletRequest request) {
		try {
			System.out.println("**********" + productModel.getName());
			System.out.println("**********" + productModel.getDescription());
			if (util.isPermitted(request, "Maker", "register_product")) {
				String created_by = makerMapper.getFullName(util.get_user_id(request));
				productModel.setStatus("1");
				productModel.setAvailability("1");
				productModel.setCreated_by(created_by);
				productModel.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				makerMapper.register_product(productModel);

				util.registerActivity(request, "Register product", "Register " + productModel.getName() + " product");
				return true;
			} else {
				System.out.println("No user does not have permission to register a user.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean update_service(ServiceModel addServiceModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "update_Service")) {
				makerMapper.updateService(addServiceModel);
				util.registerActivity(request, "update Service", makerMapper.getFullName(util.get_user_id(request))
						+ " " + "updated " + "  " + addServiceModel.getName() + " service. ");
				return true;
			} else {
				System.out.println("No user does not have permission to register a user.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}
		}
	}

	public boolean update_directorate(ServiceModel addServiceModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "update_Service")) {
				makerMapper.updateDirectorate(addServiceModel);
				util.registerActivity(request, "update directorate", makerMapper.getFullName(util.get_user_id(request))
						+ " " + "updated " + "  " + addServiceModel.getName() + " directorate. ");
				return true;
			} else {
				System.out.println("No user does not have permission to register a user.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}
		}
	}

	public boolean update_issuer_bank(ServiceModel addServiceModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "update_Service")) {
				makerMapper.updateIssuerBank(addServiceModel);
				util.registerActivity(request, "update issuer Bank", makerMapper.getFullName(util.get_user_id(request))
						+ " " + "updated " + "  " + addServiceModel.getName() + "Issuer Bank. ");
				return true;
			} else {
				System.out.println("No user does not have permission to register a user.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}
		}
	}

	public boolean register_service(ServiceModel serviceModel, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Add_Service")) {
				serviceModel.setStatus("1");
				serviceModel.setAvailability("1");
				serviceModel.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				serviceModel.setCreated_by(makerMapper.getFullName(util.get_user_id(request)));
				makerMapper.addService(serviceModel);
				util.registerActivity(request, "Add Service", makerMapper.getFullName(util.get_user_id(request)) + " "
						+ "Add " + "  " + serviceModel.getName() + " service. ");
				return true;
			} else {
				System.out.println("No user does not have permission to register a user.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean register_directorate(ServiceModel serviceModel, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Add_Service")) {
				serviceModel.setStatus("1");
				serviceModel.setAvailability("1");
				serviceModel.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				serviceModel.setCreated_by(makerMapper.getFullName(util.get_user_id(request)));
				makerMapper.addDirectorate(serviceModel);
				util.registerActivity(request, "registor directorate",
						makerMapper.getFullName(util.get_user_id(request)) + " "
								+ "register" + "  " + serviceModel.getName() + " directorate. ");
				return true;
			} else {
				System.out.println("No user does not have permission to register a diractorate.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean register_issuer_bank(ServiceModel serviceModel, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Add_Service")) {
				serviceModel.setStatus("1");
				serviceModel.setAvailability("1");
				serviceModel.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				serviceModel.setCreated_by(makerMapper.getFullName(util.get_user_id(request)));
				makerMapper.addIssuerBank(serviceModel);
				util.registerActivity(request, "registor issuer bank",
						makerMapper.getFullName(util.get_user_id(request)) + " "
								+ "register" + "  " + serviceModel.getName() + " Issuer bank. ");
				return true;
			} else {
				System.out.println("No user does not have permission to register a diractorate.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public List<Product> getAllProducts(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "login")) {
				List<Product> product = makerMapper.getAllProducts();

				util.registerActivity(request, "View product", "Views all product list");
				return product;
			} else {
				System.out.println("No user does not have permission. get_all_products");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivate_product(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.deactivate_product(product_id);
				util.registerActivity(request, "Deactivate", "Deactivate a product id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activate_product(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.activate_product(product_id);
				util.registerActivity(request, "activate product", "activating a product id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean delete_product(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.delete_product(product_id);
				util.registerActivity(request, "Delete product", "delete a product id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Product getProduct(String product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				Product product = null;
				System.out.println("Yes user has permission.");
				product = makerMapper.get_product(product_id);
				return product;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean update_product(Product productModel, HttpServletRequest request) {
		try {
			System.out.println("**********" + productModel.getName());
			System.out.println("**********" + productModel.getDescription());
			if (util.isPermitted(request, "Maker", "login")) {
				makerMapper.update_product(productModel);
				util.registerActivity(request, "Update product", "update " + productModel.getName() + " product");
				return true;
			} else {
				System.out.println("No user does not have permission to update a product.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public List<ServiceModel> getAllServices(HttpServletRequest request) {
		try {
			List<ServiceModel> service = makerMapper.getAllServices();
			return service;

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ServiceModel> getAllDirectorates(HttpServletRequest request) {
		try {
			List<ServiceModel> service = makerMapper.getAllDirectorates();

			util.registerActivity(request, "View directorates", "Views all directorates  lists");
			return service;

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ServiceModel> getAllIssuerBanks(HttpServletRequest request) {
		try {
			List<ServiceModel> service = makerMapper.getAllIssuerBanks();

			util.registerActivity(request, "View Issuer Banks", "Views all issuer bank lists");
			return service;

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deleteService(String service_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "delete_service")) {
				util.registerActivity(request, "Delete Service", "Delete Service id = " + service_id);
				return makerMapper.delete_service(service_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deleteDirectorate(String directorate_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "delete_service")) {
				util.registerActivity(request, "Delete Directorate", "Delete directorate id = " + directorate_id);
				return makerMapper.delete_directorate(directorate_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deleteIssuerBank(String bank_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "delete_service")) {
				util.registerActivity(request, "Delete issuer bank", "Delete issuer bank id = " + bank_id);
				return makerMapper.delete_issuer_bank(bank_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activateService(String service_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "activate_service")) {
				System.out.println("Yes user has permission.");
				makerMapper.activate_service(service_id);
				util.registerActivity(request, "Activate Service", "Ativate  service id = " + service_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activateDirectorate(String directorate_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "activate_service")) {
				System.out.println("Yes user has permission.");
				makerMapper.activate_directorate(directorate_id);
				util.registerActivity(request, "Activate Directorate", "Ativate  directorate id = " + directorate_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activateIssuerBank(String bank_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "activate_service")) {
				System.out.println("Yes user has permission.");
				makerMapper.activate_issuer_bank(bank_id);
				util.registerActivity(request, "Activate issuer bank", "Ativate  issuer bank id = " + bank_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivateService(String service_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "deactivate_service")) {
				util.registerActivity(request, "Deactivate User", "Deactivate  services id = " + service_id);
				return makerMapper.deactivate_service(service_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivateDirectorate(String directorate_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "deactivate_service")) {
				util.registerActivity(request, "Deactivate directorate",
						"Deactivate  directorate id = " + directorate_id);
				return makerMapper.deactivate_directorate(directorate_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivateIssuerBank(String bank_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "deactivate_service")) {
				util.registerActivity(request, "Deactivate issuer bank",
						"Deactivate  issuer bank id = " + bank_id);
				return makerMapper.deactivate_issuer_bank(bank_id);
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ServiceModel getService(String service_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "get_service")) {
				ServiceModel service = null;

				service = makerMapper.getService(service_id);
				return service;
			} else {
				System.out.println("No user does not have permission to get specific user information for updating.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ServiceModel getDirectorate(String directorate_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "get_service")) {
				ServiceModel service = null;

				service = makerMapper.getDirectorate(directorate_id);
				return service;
			} else {
				System.out.println(
						"No user does not have permission to get specific diractoratwe information for updating.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ServiceModel getIssuerBank(String directorate_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "get_service")) {
				ServiceModel service = null;

				service = makerMapper.getIssuerBank(directorate_id);
				return service;
			} else {
				System.out.println(
						"No user does not have permission to get specific issuer bank information for updating.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean register_vendor(Vendors vendorModel, HttpServletRequest request) {
		try {
			System.out.println("**********" + vendorModel.getName());
			if (util.isPermitted(request, "Maker", "register_product")) {
				final String DIRECTORY = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "vendor_document" + "/";
				String created_by = makerMapper.getFullName(util.get_user_id(request));
				File file_path = new File(StringUtils.join(DIRECTORY));

				if (!file_path.exists()) {
					file_path.mkdirs();
				}
				if (vendorModel.getGeneral_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(vendorModel.getGeneral_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(vendorModel.getGeneral_document().getOriginalFilename());
					String file_location_with_name = file_path.getAbsolutePath() + "/"
							+ generateUniqueFileName("general_document") + "." + extension;
					vendorModel.setPath(file_location_with_name);
					vendorModel.getGeneral_document().transferTo(new File(file_location_with_name));
				}

				if (vendorModel.getTrade_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(vendorModel.getTrade_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(vendorModel.getTrade_document().getOriginalFilename());
					String file_location_with_name = file_path.getAbsolutePath() + "/"
							+ generateUniqueFileName("trade_licence") + "." + extension;
					vendorModel.setPath2(file_location_with_name);
					vendorModel.getTrade_document().transferTo(new File(file_location_with_name));
				}
				if (vendorModel.getTin_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(vendorModel.getTin_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(vendorModel.getTin_document().getOriginalFilename());
					String file_location_with_name = file_path.getAbsolutePath() + "/"
							+ generateUniqueFileName("tin_certificate") + "." + extension;
					vendorModel.setPath3(file_location_with_name);
					vendorModel.getTin_document().transferTo(new File(file_location_with_name));
				}
				if (vendorModel.getOther_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(vendorModel.getOther_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(vendorModel.getOther_document().getOriginalFilename());
					String file_location_with_name = file_path.getAbsolutePath() + "/"
							+ generateUniqueFileName("other_document") + "." + extension;
					vendorModel.setPath4(file_location_with_name);
					vendorModel.getOther_document().transferTo(new File(file_location_with_name));
				}

				vendorModel.setStatus("1");
				vendorModel.setAvailability("1");
				System.out.println("**********111" + vendorModel.getService());
				vendorModel.setVendor_registration_date(
						DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				Long vendor_id = makerMapper.register_vendor(vendorModel);

				makerMapper.Delete_vendor_notification(vendor_id);
				Remark remark = new Remark();
				remark.setTitle("Pending vendor Request");
				remark.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				remark.setDescription("Vendor");
				Long notification_id = makerMapper.addNotification(remark);
				makerMapper.Vendor_Notification(notification_id, vendor_id);

				makerMapper.addUserVendor(util.get_user_id(request), vendor_id);
				System.out.println("**********2222");
				if (!vendorModel.getProduct().isEmpty()) {
					String[] id_s = vendorModel.getProduct().split(",");
					Long[] product_id = new Long[vendorModel.getProduct().split(",").length];
					System.out.println("**********33333");
					for (int i = 0; i < id_s.length; i++) {
						System.out.println("**********44444");
						product_id[i] = Long.parseLong(id_s[i]);
						System.out.println("**********aaaa " + Long.parseLong(id_s[i]));
					}

					for (int i = 0; i < product_id.length; i++) {
						makerMapper.addVendorProduct(product_id[i], vendor_id);
						System.out.println("**********55555");
					}
				}
				// if (!vendorModel.getService().isEmpty()) {
				// System.out.println("**********6666");
				// String[] id_s2 = vendorModel.getService().split(",");
				// Long[] service_id = new Long[vendorModel.getService().split(",").length];
				// for (int i = 0; i < id_s2.length; i++) {
				// service_id[i] = Long.parseLong(id_s2[i]);
				// }

				// for (int i = 0; i < service_id.length; i++) {
				// makerMapper.addVendorService(service_id[i], vendor_id);
				// System.out.println("**********6666 " + vendor_id);
				// }
				// }

				util.registerActivity(request, "Register vendor", "Register " + vendorModel.getName() + " vendor");

				return true;
			} else {
				System.out.println("No user does not have permission to register a vendor.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	String generateUniqueFileName(String document) {
		String filename = "";
		long millis = System.currentTimeMillis();
		String datetime = new Date().toGMTString();
		datetime = datetime.replace(" ", "");
		datetime = datetime.replace(":", "");
		String rndchars = RandomStringUtils.randomAlphanumeric(16);
		filename = document + "_" + datetime + "_" + millis;
		return filename;
	}

	public List<Vendor> getAllVendors(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "View_vendors")
					|| util.isPermitted(request, "Checker", "View_vendors")) {
				List<Vendor> vendor = makerMapper.getAllVendors();

				util.registerActivity(request, "View vendors", "Views all Vendors list");
				return vendor;
			} else {
				System.out.println("No user does not have permission. get_all_products");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Licence> getAllLicences(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "View_vendors")
					|| util.isPermitted(request, "Checker", "View_vendors")) {
				List<Licence> licence = makerMapper.getAllLicences();

				util.registerActivity(request, "View licences", "Views all licence lists");
				return licence;
			} else {
				System.out.println("No user does not have permission. get_all_products");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean approveLicences(String licence_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Checker", "approve_vendor")) {
				System.out.println("Yes user has permission.");
				System.out.println("id=" + licence_id);
				makerMapper.ApproveLicence(Long.parseLong(licence_id));
				// checkerMapper.updateUserVendor(util.get_user_id(request),
				// Long.parseLong(licence_id));
				makerMapper.delete_licence_notification(Long.parseLong(licence_id));
				Remark remark = new Remark();
				remark.setTitle("Approved licence Request");
				remark.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				remark.setDescription("Licence");
				Long notification_id = makerMapper.addNotification(remark);
				makerMapper.licence_notification(notification_id, Long.parseLong(licence_id));
				List<Long> roleId = makerMapper.roleId();
				for (int i = 0; i < roleId.size(); i++) {
					makerMapper.user_Notification(notification_id, roleId.get(i));
				}
				util.registerActivity(request, "Approve licence", "Approve licence  with id =" + licence_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Vendor> getVendor(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Checker", "login")) {
				List<Vendor> vendor = makerMapper.getVendorByEditedId(id);
				return vendor;
			} else {
				System.out.println("No user does not have permission. get_all_products");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivate_vendor(Long vendor_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Deactivate_vendor")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
				makerMapper.deactivate_vendor(vendor_id);
				makerMapper.Delete_vendor_notification(vendor_id);
				Remark nitify = new Remark();
				nitify.setTitle("Deactivate vendor Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Vendor");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Vendor_Notification(notification_id, vendor_id);
				util.registerActivity(request, "Deactivate", "Deactivate vendor. id=" + vendor_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activate_vendor(Long vendor_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Activate_vendor")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
				makerMapper.activate_vendor(vendor_id);

				makerMapper.Delete_vendor_notification(vendor_id);
				Remark nitify = new Remark();
				nitify.setTitle("Activate vendor Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Vendor");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Vendor_Notification(notification_id, vendor_id);
				util.registerActivity(request, "Activate", "Activate vendor. id=" + vendor_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean delete_vendor(Long vendor_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Delete_vendor")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.Delete_vendor_notification(vendor_id);
				Remark nitify = new Remark();
				nitify.setTitle("Delete vendor Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Vendor");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Vendor_Notification(notification_id, vendor_id);
				makerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
				Vendor vendor = makerMapper.getVendor(vendor_id);
				if (vendor.getStatus().equalsIgnoreCase("1") || vendor.getStatus().equalsIgnoreCase("0")) {
					makerMapper.delete_vendor_request(vendor_id);
					util.registerActivity(request, "Delete", "Delete " + vendor.getName() + " vendor request");
				} else if (vendor.getStatus().equalsIgnoreCase("2") || vendor.getStatus().equalsIgnoreCase("3")) {
					makerMapper.delete_vendor(vendor_id);
					util.registerActivity(request, "Delete", "Delete " + vendor.getName() + " vendor");
				}
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean reject_update(Long vendor_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Checker", "Reject_update_request")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReason(reason_id, util.get_user_id(request), vendor_id);
				makerMapper.Update_request_type(makerMapper.vendor_id(vendor_id));
				makerMapper.reject_update_vendor_request(vendor_id);

				makerMapper.Delete_vendor_notification(vendor_id);
				Remark nitify = new Remark();
				nitify.setTitle("Reject Update_vendor Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Vendor");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Vendor_Notification(notification_id, vendor_id);
				util.registerActivity(request, "Reject Update request",
						"Reject Update request.  request vendor id: " + vendor_id + " vendor");

				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Remarks> getRemarksByVendorId(String vendor_id, HttpServletRequest request) {
		try {
			List<Remarks> remarkss = new ArrayList<>(); // Initialize the list
			// List<Remarks> remarkss = null; // Initialize the list

			List<Remarks> remarks = makerMapper.getRemarksByVendorId(vendor_id);
			List<Reasons> reason = makerMapper.getReasonsByVendorId(vendor_id);
			for (int i = 0; i < reason.size(); i++) {
				Remarks reasonss = new Remarks(); // Assuming Remarks has a default constructor
				reasonss.setId(reason.get(i).getId());
				String reasonText = reason.get(i).getReason();
				String[] lines = reasonText.split("\n"); // Split by newline
				String firstLine = lines[0]; // Get the first el
				String description = "";
				for (int k = 1; k < lines.length; k++) {
					description = description + (lines[k]);
				}
				reasonss.setTitle(firstLine);
				reasonss.setDescription(description);
				reasonss.setCreated_date(reason.get(i).getDate());
				reasonss.setCreated_by(makerMapper.getFullName(Long.parseLong(reason.get(i).getCreated_by())));
				reasonss.setEmail(makerMapper.getEmail(Long.parseLong(reason.get(i).getCreated_by())));
				reasonss.setAvailability(reason.get(i).getAvailability());
				reasonss.setStatus(reason.get(i).getStatus());
				System.out.println("Email=" + reasonss.getEmail());
				remarkss.add(reasonss);
			}
			for (int i = 0; i < remarks.size(); i++) {
				Remarks newRemark = new Remarks(); // Assuming Remarks has a default constructor
				newRemark.setId(remarks.get(i).getId());
				newRemark.setTitle(remarks.get(i).getTitle());
				newRemark.setDescription(remarks.get(i).getDescription());
				newRemark.setCreated_date(remarks.get(i).getCreated_date());
				newRemark.setCreated_by(makerMapper.getFullName(Long.parseLong(remarks.get(i).getCreated_by())));
				newRemark.setEmail(makerMapper.getEmail(Long.parseLong(remarks.get(i).getCreated_by())));
				newRemark.setAvailability(remarks.get(i).getAvailability());
				newRemark.setStatus(remarks.get(i).getStatus());
				System.out.println("Email=" + newRemark.getEmail());
				remarkss.add(newRemark);
			}

			util.registerActivity(request, "View Remarks", "Views all Remarks list of vendor id=" + vendor_id);
			return remarkss;

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean vendor_remark(HttpServletRequest request, long vendor_id, Remarks remark) {
		System.out.println("-----------------------" + remark.getId());
		Long reciver_id = makerMapper.getReciverId(remark.getId());
		try {
			try {
				if (util.isPermitted(request, "Maker", "vendor_remark")) {
					Remarks remarkk = new Remarks();
					remarkk.setTitle(remark.getTitle());
					remarkk.setDescription(remark.getDescription());
					remarkk.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					long remark_id = makerMapper.send_remark(remarkk);
					makerMapper.addUserRemark(remark_id, util.get_user_id(request), reciver_id, vendor_id);
					util.registerActivity(request, "send remark ", "send vendor remark. remark id is = " + remark_id);
					return true;
				} else {
					System.out.println("No user does not have permission.");
					return false;
				}
			} catch (Exception e) {
				throw new ExceptionsList(e);
			}
		} catch (Exception ex) {
			throw new ExceptionsList(ex);
		}
	}

	public Remarks getRemarkByID(HttpServletRequest request, long id) {
		try {
			System.out.println("id-------->" + id);
			return makerMapper.getRemarkById(id);

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deleteRemark(String remark_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "delete_remark")
					|| util.isPermitted(request, "Checker", "delete_remark")) {
				System.out.println("Yes user has permission.");
				System.out.println("id=" + remark_id);

				util.registerActivity(request, "Delete comment", "delete remark id =" + remark_id);
				makerMapper.deleteRemark(remark_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean update_remark(HttpServletRequest request, long remark_id, Remarks remark) {
		try {
			try {
				if (util.isPermitted(request, "Maker", "update_remark")
						|| util.isPermitted(request, "Checker", "update_remark")) {
					Remarks remarkk = new Remarks();
					remarkk.setTitle(remark.getTitle());
					remarkk.setDescription(remark.getDescription());
					remarkk.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					remarkk.setId(remark_id);
					makerMapper.update_remark(remarkk);
					util.registerActivity(request, "update  remark ", "update your remark id is=" + remark_id);
					return true;
				} else {
					System.out.println("No user does not have permission to edit remark.");
					return false;
				}
			} catch (Exception e) {
				throw new ExceptionsList(e);
			}
		} catch (Exception ex) {
			throw new ExceptionsList(ex);
		}
	}

	public Vendor getVendorById(HttpServletRequest request, String datas) {
		try {
			if (util.isPermitted(request, "Maker", "View_vendors")
					|| util.isPermitted(request, "Checker", "View_vendors")) {
				JsonObject id_data_object = JsonParser.parseString(datas).getAsJsonObject();
				String role = id_data_object.get("role").getAsString();
				String Vendor_id = id_data_object.get("vendor_id").getAsString();
				Vendor vendor = null;
				if (role != null && role.equalsIgnoreCase("Maker")) {
					vendor = makerMapper.getVendorById(Vendor_id);

				} else if (role != null && role.equalsIgnoreCase("Checker")) {
					vendor = makerMapper.getVendorEditedById(Vendor_id);
				}

				return vendor;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean update_vendor(Vendors vendorModel, HttpServletRequest request) {
		try {
			System.out.println("vendor name**********" + vendorModel.getName());
			System.out.println("vendor status**********" + vendorModel.getStatus());
			System.out.println("vendor availability**********" + vendorModel.getAvailability());
			if (vendorModel.getAvailability().equalsIgnoreCase("Checker")) {
				long vendor_id;
				long vendor_edited_id;
				// Checker accept vender update request start
				if (util.isPermitted(request, "Checker", "Accept_update_request")) {
					final String DIRECTORY = System.getProperty("user.dir") + "/src/main/resources/static/files/"
							+ "vendor_document" + "/";
					String created_by = makerMapper.getFullName(util.get_user_id(request));
					File file_path = new File(StringUtils.join(DIRECTORY));

					if (!file_path.exists()) {
						file_path.mkdirs();
					}

					if (vendorModel.getGeneral_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getGeneral_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getGeneral_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("vendor") + "." + extension;
						vendorModel.setPath(file_location_with_name);
						vendorModel.getGeneral_document().transferTo(new File(file_location_with_name));
						System.out.println(" 1Document path=" + vendorModel.getPath());
					} else {
						vendorModel.setPath(makerMapper.getFilePathInVendorEdited(vendorModel.getId()));
						System.out.println("2Document path=" + vendorModel.getPath());
					}

					if (vendorModel.getTrade_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTrade_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTrade_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("trade_licence") + "." + extension;
						vendorModel.setPath2(file_location_with_name);
						vendorModel.getTrade_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath2(makerMapper.getFilePathOftrade_licence(vendorModel.getId()));
					}
					if (vendorModel.getTin_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTin_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTin_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("tin_certificate") + "." + extension;
						vendorModel.setPath3(file_location_with_name);
						vendorModel.getTin_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath3(makerMapper.getFilePathOftin_certificate(vendorModel.getId()));
					}
					if (vendorModel.getOther_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getOther_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getOther_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("other_document") + "." + extension;
						vendorModel.setPath4(file_location_with_name);
						vendorModel.getOther_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath4(makerMapper.getFilePathOfother_document(vendorModel.getId()));
					}
					vendor_edited_id = vendorModel.getId();
					System.out.println("vendor id====" + vendorModel.getId());
					vendorModel.setEdited_by(created_by);
					// vendorModel.setVendor_registration_date(
					// DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					vendorModel.setAvailability("1");
					vendorModel.setStatus("2");
					vendor_id = makerMapper.getVendorIdByVendorEditedId(vendorModel.getId());
					vendorModel.setId(vendor_id);
					Long vendor_previous_id = makerMapper.moveVendorPrevious(vendor_id);
					makerMapper.updateVendor(vendorModel);
					if (!vendorModel.getProduct().isEmpty()) {
						String[] id_s = vendorModel.getProduct().split(",");
						Long[] product_id = new Long[vendorModel.getProduct().split(",").length];
						for (int i = 0; i < id_s.length; i++) {
							product_id[i] = Long.parseLong(id_s[i]);
						}
						makerMapper.deleteVendorProduct(vendorModel.getId());
						for (int i = 0; i < product_id.length; i++) {
							makerMapper.deleteVendorEditedProduct(vendor_edited_id);
							makerMapper.addVendorProduct(product_id[i], vendorModel.getId());
						}
					}
					// if (!vendorModel.getService().isEmpty()) {
					// System.out.println("**********6666");
					// String[] id_s2 = vendorModel.getService().split(",");
					// Long[] service_id = new Long[vendorModel.getService().split(",").length];
					// for (int i = 0; i < id_s2.length; i++) {
					// service_id[i] = Long.parseLong(id_s2[i]);
					// }
					// makerMapper.deleteVendorService(vendorModel.getId());
					// for (int i = 0; i < service_id.length; i++) {
					// makerMapper.deleteVendorEditedService(vendor_edited_id);
					// makerMapper.addVendorService(service_id[i], vendorModel.getId());
					// }
					// }
					makerMapper.addVendorPreviousVendor(vendorModel.getId(), vendor_previous_id);
					makerMapper.deleteVendorEditedVendor(vendor_edited_id);

					makerMapper.Delete_vendor_notification(vendorModel.getId());
					Remark nitify = new Remark();
					nitify.setTitle("Update vendor Request accepeted");
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Vendor");
					Long notification_id = makerMapper.addNotification(nitify);
					makerMapper.Vendor_Notification(notification_id, vendor_id);

					List<Long> roleId = makerMapper.roleId();
					for (int i = 0; i < roleId.size(); i++) {
						makerMapper.user_Notification(notification_id, roleId.get(i));
					}
					util.registerActivity(request, "approve vendor update request",
							"Accept " + vendorModel.getName() + " Requests");

					return true;
				} else {
					System.out.println("No user does not have permission to update a vendor.");
					return false;
				}
				// Checker accept vender update request end
			} else {
				if (util.isPermitted(request, "Maker", "register_product")) {
					vendorModel.setAvailability("1");
					final String DIRECTORY = System.getProperty("user.dir") + "/src/main/resources/static/files/"
							+ "vendor_document" + "/";
					String created_by = makerMapper.getFullName(util.get_user_id(request));
					File file_path = new File(StringUtils.join(DIRECTORY));

					if (!file_path.exists()) {
						file_path.mkdirs();
					}

					if (vendorModel.getGeneral_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getGeneral_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getGeneral_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("vendor") + "." + extension;
						vendorModel.setPath(file_location_with_name);
						vendorModel.getGeneral_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath(makerMapper.getFilePath(vendorModel.getId()));
					}

					if (vendorModel.getTrade_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTrade_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTrade_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("trade_licence") + "." + extension;
						vendorModel.setPath2(file_location_with_name);
						vendorModel.getTrade_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath2(makerMapper.getFilePathtrade_licence(vendorModel.getId()));
					}
					if (vendorModel.getTin_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTin_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getTin_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("tin_certificate") + "." + extension;
						vendorModel.setPath3(file_location_with_name);
						vendorModel.getTin_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath3(makerMapper.getFilePathtin_certificate(vendorModel.getId()));
					}
					if (vendorModel.getOther_document() != null) {
						String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
								.cleanPath(vendorModel.getOther_document().getOriginalFilename()));
						String filename = org.springframework.util.StringUtils
								.cleanPath(vendorModel.getOther_document().getOriginalFilename());
						String file_location_with_name = file_path.getAbsolutePath() + "/"
								+ generateUniqueFileName("other_document") + "." + extension;
						vendorModel.setPath4(file_location_with_name);
						vendorModel.getOther_document().transferTo(new File(file_location_with_name));
					} else {
						vendorModel.setPath4(makerMapper.getFilePathother_document(vendorModel.getId()));
					}

					if (vendorModel.getStatus().equals("1")) {
						makerMapper.deleteVendorProduct(vendorModel.getId());
						makerMapper.deleteVendorService(vendorModel.getId());
						System.out.println("**********2222");
						if (!vendorModel.getProduct().isEmpty()) {
							String[] id_s = vendorModel.getProduct().split(",");
							Long[] product_id = new Long[vendorModel.getProduct().split(",").length];
							System.out.println("**********33333");
							for (int i = 0; i < id_s.length; i++) {
								System.out.println("**********44444");
								product_id[i] = Long.parseLong(id_s[i]);
								System.out.println("**********aaaa " + Long.parseLong(id_s[i]));
							}

							for (int i = 0; i < product_id.length; i++) {
								makerMapper.addVendorProduct(product_id[i], vendorModel.getId());
								System.out.println("**********55555");
							}
						}
						// if (!vendorModel.getService().isEmpty()) {
						// System.out.println("**********6666");
						// String[] id_s2 = vendorModel.getService().split(",");
						// Long[] service_id = new Long[vendorModel.getService().split(",").length];
						// for (int i = 0; i < id_s2.length; i++) {
						// service_id[i] = Long.parseLong(id_s2[i]);
						// }

						// for (int i = 0; i < service_id.length; i++) {
						// makerMapper.addVendorService(service_id[i], vendorModel.getId());
						// }
						// }
						System.out.println("path1=" + vendorModel.getPath());
						System.out.println("path2=" + vendorModel.getPath2());
						System.out.println("path3=" + vendorModel.getPath3());
						System.out.println("path4=" + vendorModel.getPath4());
						makerMapper.update_vendor(vendorModel);
					} else {
						vendorModel.setEdited_by(created_by);
						vendorModel.setVendor_registration_date(
								DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
						Long vendor_edited_id = makerMapper.register_edited_vendor(vendorModel);
						if (!vendorModel.getProduct().isEmpty()) {
							String[] id_s = vendorModel.getProduct().split(",");
							Long[] product_id = new Long[vendorModel.getProduct().split(",").length];
							for (int i = 0; i < id_s.length; i++) {
								product_id[i] = Long.parseLong(id_s[i]);
							}

							for (int i = 0; i < product_id.length; i++) {
								makerMapper.addVendorEditedProduct(product_id[i], vendor_edited_id);
								System.out.println("**********55555");
							}
						}
						// if (!vendorModel.getService().isEmpty()) {
						// System.out.println("**********6666");
						// String[] id_s2 = vendorModel.getService().split(",");
						// Long[] service_id = new Long[vendorModel.getService().split(",").length];
						// for (int i = 0; i < id_s2.length; i++) {
						// service_id[i] = Long.parseLong(id_s2[i]);
						// }

						// for (int i = 0; i < service_id.length; i++) {
						// makerMapper.addVendorEditedService(service_id[i], vendor_edited_id);
						// System.out.println("**********6666 " + vendor_edited_id);
						// }
						// }
						makerMapper.addVendorEditedVendor(vendorModel.getId(), vendor_edited_id);
						makerMapper.updateRequestType(vendorModel.getId());

						makerMapper.Delete_vendor_notification(vendorModel.getId());
						Remark nitify = new Remark();
						nitify.setTitle("Update vendor Request");
						nitify.setCreate_date(
								DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
						nitify.setDescription("Vendor");
						Long notification_id = makerMapper.addNotification(nitify);
						makerMapper.Vendor_Notification(notification_id, vendorModel.getId());
					}
					util.registerActivity(request, "Update vendor", "Update " + vendorModel.getName() + " vendor");

					return true;
				} else {
					System.out.println("No user does not have permission to update a vendor.");
					return false;
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean update_bank_detail(Vendors vendorModel, HttpServletRequest request) {
		try {
			System.out.println("bank name**********" + vendorModel.getBank_name());
			System.out.println("bank name**********" + vendorModel.getId());

			if (util.isPermitted(request, "Maker", "register_product")
					|| util.isPermitted(request, "Checker", "login")) {

				makerMapper.update_bank_detail(vendorModel);
				util.registerActivity(request, "Update bank detail", "Update " + vendorModel.getName() + " vendor");

				return true;
			} else {
				System.out.println("No user does not have permission to update a vendor.");
				return false;
			}

		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public ResponseEntity<Resource> downloadFiles(HttpServletRequest request, Long id, String document_type) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download file " + document_type);
				System.out.println("====document type====--- " + document_type);
				String path1 = makerMapper.downloadFiles(id, document_type);
				System.out.println("====document path====--- " + path1);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> downloadFilesupdated(HttpServletRequest request, Long id, String document_type) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download updated vendor file=" + document_type);
				System.out.println("====document type====--- " + document_type);
				System.out.println("====document type====---id " + id);
				String path1 = makerMapper.downloadFilesupdated(id, document_type);
				System.out.println("====document path====--- " + path1);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ServiceModel> getServicesByVendorId(HttpServletRequest request, Long vendor_id) {
		try {
			if (util.isPermitted(request, "Maker", "View_services")) {
				List<ServiceModel> service = makerMapper.getServicesByVendorId(vendor_id);
				return service;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Product> getProductsByVendorId(HttpServletRequest request, Long vendor_id) {
		try {
			if (util.isPermitted(request, "Maker", "View_services")) {
				List<Product> product = makerMapper.getProductsByVendorId(vendor_id);
				return product;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	@Transactional
	public boolean register_contract(Contract contractModel, List<Payment> paymentData, HttpServletRequest request) {
		try {
			System.out.println("**********" + contractModel.getService_id());
			if (util.isPermitted(request, "Maker", "register_product")) {
				final String DIRECTORY1 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "confirmation_document" + "/";
				final String DIRECTORY2 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "security_document" + "/";
				final String DIRECTORY3 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "contract_document" + "/";

				final String DIRECTORY4 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "SLA_document" + "/";

				File file_path1 = new File(StringUtils.join(DIRECTORY1));
				File file_path2 = new File(StringUtils.join(DIRECTORY2));
				File file_path3 = new File(StringUtils.join(DIRECTORY3));
				File file_path4 = new File(StringUtils.join(DIRECTORY4));

				if (!file_path1.exists()) {
					file_path1.mkdirs();
				}
				if (!file_path2.exists()) {
					file_path2.mkdirs();
				}
				if (!file_path3.exists()) {
					file_path3.mkdirs();
				}

				if (!file_path4.exists()) {
					file_path4.mkdirs();
				}
				if (contractModel.getPayment_confirmation_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getPayment_confirmation_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getPayment_confirmation_document().getOriginalFilename());
					String file_location_with_name1 = file_path1.getAbsolutePath() + "/"
							+ generateUniqueFileName("confirmation") + "." + extension;
					contractModel.setConfirmation_path(file_location_with_name1);
					contractModel.getPayment_confirmation_document().transferTo(new File(file_location_with_name1));
				}
				if (contractModel.getContract_document_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getContract_document_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getContract_document_document().getOriginalFilename());
					String file_location_with_name3 = file_path3.getAbsolutePath() + "/"
							+ generateUniqueFileName("contract") + "." + extension;
					contractModel.setContract_path(file_location_with_name3);
					contractModel.getContract_document_document().transferTo(new File(file_location_with_name3));
				}
				if (contractModel.getSecurity_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getSecurity_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getSecurity_document().getOriginalFilename());
					String file_location_with_name2 = file_path2.getAbsolutePath() + "/"
							+ generateUniqueFileName("security") + "." + extension;
					contractModel.setSecurity_path(file_location_with_name2);
					contractModel.getSecurity_document().transferTo(new File(file_location_with_name2));
				}

				if (contractModel.getSLA_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getSLA_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getSLA_document().getOriginalFilename());
					String file_location_with_name4 = file_path4.getAbsolutePath() + "/" + generateUniqueFileName("SLA")
							+ "." + extension;
					contractModel.setSLA_path(file_location_with_name4);
					contractModel.getSLA_document().transferTo(new File(file_location_with_name4));
				}
				System.out.println("**********111" + contractModel.getService_id());

				String currunt_date = DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now());
				String created_by = makerMapper.getFullName(util.get_user_id(request));

				Long contract_id = (long) 0;
				if (contractModel.getId() == null) {
					contractModel.setRequest_date(currunt_date);
					contractModel.setRequested_by(created_by);
					contract_id = makerMapper.register_contract(contractModel);
					contractModel.setId(contract_id);
					System.out.println("here is issuer bank" + contractModel.getIssuer_bank());
					if (!contractModel.getIssuer_bank().equals(""))
						makerMapper.addPerformanceBond(contractModel);
					Remark nitify = new Remark();
					nitify.setTitle("Pending Contract Request");
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Contract");
					Long notification_id = makerMapper.addNotification(nitify);
					makerMapper.Contract_Notification(notification_id, contract_id);
					makerMapper.addUserContract(util.get_user_id(request), contract_id);
					makerMapper.addContractVendor(contractModel.getVendor_id(), contract_id);
					for (Payment payment : paymentData) {
						// Save or process each payment

						System.out.println("Processing payment term: " + payment.getPaymentTerm());
						System.out.println("Processing payment amount: " + payment.getAmount());
						System.out.println("Processing payment due date: " + payment.getDueDate());
						System.out.println("processing payment description: " + payment.getPaymentDescription());
						// paymentRepository.save(payment); // Save payment to the database
						payment.setContract_id(contract_id);
						if (payment.getAmount() != null)
							makerMapper.savePayments(payment);
					}
				}
				// if (contractModel.getPayment_status().equals("paid")) {
				// contractModel.setPayment_deccription("payment fully covered during
				// contract");
				// contractModel.setPaid_amount(contractModel.getTotal_amount());
				// }

				// if (contractModel.getPayment_status().equals("partial_pending"))
				// contractModel.setPayment_deccription("During contract " +
				// contractModel.getPaid_amount()
				// + " amount is paid. The rest will be paid based on the agreement");

				// if (contractModel.getPayment_status().equals("paid")
				// || contractModel.getPayment_status().equals("partial_pending")) {
				// Long payment_id = makerMapper.addPayment(contractModel);
				// makerMapper.addContractPayment(payment_id, contract_id);
				// util.registerActivity(request, "Register contract", "Register contract id = "
				// + contract_id);

				// }

				// if (contractModel.getPayment_status().equalsIgnoreCase("add-payment")) {
				// Long payment_id = makerMapper.addPaymentaftercontract(contractModel);
				// makerMapper.addContractPayment(payment_id, contractModel.getContract_id());
				// util.registerActivity(request, "Add payment",
				// "Add payment ,contract id = " + contractModel.getContract_id());
				// }
				util.registerActivity(request, "Register contract", "Register contract id = " + contract_id);

				return true;
			} else {
				System.out.println("No user does not have permission to register a vendor.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	@Transactional
	public boolean register_licence(Licence licenceModel, HttpServletRequest request) {
		try {
			// System.out.println("**********" + contractModel.getService_id());
			if (util.isPermitted(request, "Maker", "register_product")) {
				final String DIRECTORY1 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "licence_document" + "/";

				File file_path1 = new File(StringUtils.join(DIRECTORY1));

				if (!file_path1.exists()) {
					file_path1.mkdirs();
				}

				if (licenceModel.getLicence_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(licenceModel.getLicence_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(licenceModel.getLicence_document().getOriginalFilename());
					String file_location_with_name1 = file_path1.getAbsolutePath() + "/"
							+ generateUniqueFileName("licence") + "." + extension;
					licenceModel.setFile_path(file_location_with_name1);
					licenceModel.getLicence_document().transferTo(new File(file_location_with_name1));
				}

				// System.out.println("**********111" + contractModel.getService_id());

				String currunt_date = DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now());
				String created_by = makerMapper.getFullName(util.get_user_id(request));

				Long licence_id = (long) 0;
				if (licenceModel.getId() == null) {
					licenceModel.setRequest_date(currunt_date);
					licenceModel.setRequested_by(created_by);
					licence_id = makerMapper.register_licence(licenceModel);

					Remark nitify = new Remark();
					nitify.setTitle("Pending licence Request");
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Licence");
					Long notification_id = makerMapper.addNotification(nitify);
					makerMapper.licence_notification(notification_id, licence_id);
					// makerMapper.addUserContract(util.get_user_id(request), contract_id);
					// makerMapper.addContractVendor(contractModel.getVendor_id(), contract_id);

				}
				util.registerActivity(request, "Register licence", "Register licence id = " + licence_id);

				return true;
			} else {
				System.out.println("No user does not have permission to register a vendor.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	@Transactional
	public boolean update_licence(Licence licenceModel, HttpServletRequest request) {
		try {
			// System.out.println("**********" + contractModel.getService_id());
			String roleName = "";
			String[] roles = authMapper.getRoleByUserId(util.getUserId(request));
			for (String role : roles) {
				if (role.equals("Maker")) {
					roleName = "Maker";

				} else
					roleName = "Checker";
			}

			if (util.isPermitted(request, "Maker", "register_product")
					|| util.isPermitted(request, "Checker", "login")) {
				final String DIRECTORY1 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "licence_document" + "/";

				File file_path1 = new File(StringUtils.join(DIRECTORY1));

				if (!file_path1.exists()) {
					file_path1.mkdirs();
				}

				if (licenceModel.getLicence_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(licenceModel.getLicence_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(licenceModel.getLicence_document().getOriginalFilename());
					String file_location_with_name1 = file_path1.getAbsolutePath() + "/"
							+ generateUniqueFileName("licence") + "." + extension;
					licenceModel.setFile_path(file_location_with_name1);
					licenceModel.getLicence_document().transferTo(new File(file_location_with_name1));
				} else {
					if (roleName.equals("Maker")) {
						licenceModel.setFile_path(makerMapper.getLicencePathInLicence(licenceModel.getId()));
					} else
						licenceModel.setFile_path(makerMapper.getLicencePathInTempLicence(licenceModel.getId()));
				}

				// if the request is pending and user is maker
				if (roleName.equals("Maker") && makerMapper.getLicenceStatus(licenceModel.getId()).equals("1")) {
					makerMapper.update_licence(licenceModel);

					util.registerActivity(request, "update licence request",
							"update pending licence request for licence id = " + licenceModel.getId());

				}
				// if the request is approved and user is maker
				else if (roleName.equals("Maker") && makerMapper.getLicenceStatus(licenceModel.getId()).equals("2")) {

					licenceModel.setRequest_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					licenceModel.setRequested_by(makerMapper.getFullName(util.get_user_id(request)));

					makerMapper.moveLicenceToOldLicence(licenceModel.getId());
					makerMapper.insertTempLicence(licenceModel);

					Remark nitify = new Remark();
					nitify.setTitle("Update/Renewal licence Request");
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("licence");
					Long notification_id = makerMapper.addNotification(nitify);
					makerMapper.licence_notification(notification_id, licenceModel.getId());

					util.registerActivity(request, "update or renew licence request",
							"send update or renew licence request for licence id = " + licenceModel.getId());

				}
				// the user is checker
				else {
					licenceModel
							.setApproved_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					licenceModel.setApproved_by(makerMapper.getFullName(util.get_user_id(request)));
					licenceModel.setRequested_by(makerMapper.getLicenceRequestedBy(licenceModel.getId()));
					licenceModel.setRequest_date(makerMapper.getLicenceRequestDate(licenceModel.getId()));

					makerMapper.moveLicenceToOldLicence(licenceModel.getId());
					makerMapper.updateLicenceDuringApproval(licenceModel);

					makerMapper.deleteTempLicence(licenceModel.getId());

					Remark nitify = new Remark();
					nitify.setTitle("approve Update/Renewal licence Request");
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("licence");
					Long notification_id = makerMapper.addNotification(nitify);
					makerMapper.licence_notification(notification_id, licenceModel.getId());

					util.registerActivity(request, "approved update or renew licence request",
							"approved licence request for licence id = " + licenceModel.getId());
				}

				return true;
			} else {
				System.out.println("No user does not have permission to register a vendor.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public List<ContractView> getAllContracts(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")) {
				List<ContractView> contracts = makerMapper.getAllContracts();

				util.registerActivity(request, "View Contracts", "Views all contracts list");
				return contracts;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Payment> getPaymentsByContract(HttpServletRequest request, long id) {
		try {
			List<Payment> payments = null;
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")
					|| util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				String[] roles = authMapper.getRoleByUserId(util.getUserId(request));

				for (String role : roles) {
					if (role.equals("Maker") || role.equals("Checker")) {
						payments = makerMapper.getPaymentsByContractId(id);
					} else {
						payments = makerMapper.getPaymentsByContractIdAndIfExistAddendum(id);
					}
				}
				// List<Payment> payments = makerMapper.getPaymentsByContractId(id);
				System.out.println("id:" + id);
				util.registerActivity(request, "View Contracts", "Views all contracts list");
				return payments;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Payment> getTempPaymentsByContract(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")) {
				String request_type = makerMapper.getRequestType(id);
				List<Payment> payments = new ArrayList<>();
				if (!request_type.equals("Addendum request"))
					payments = makerMapper.getTempPaymentsByContractId(id);
				else
					payments = makerMapper.getAddendumPaymentsByContractId(id);

				util.registerActivity(request, "View Contracts", "Views all contracts list");
				return payments;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ContractView> getPaymentDetailByContractId(HttpServletRequest request, long id) {
		try {
			// util.registerActivity(request, "Get spesfic Payment for view payment detail
			// ", "get payment detail ");
			System.out.println("id-------->" + id);
			List<ContractView> paymentDetail = new ArrayList<>(); // Initialize the list
			List<ContractView> fetchedDetail = makerMapper.getPaymentByContractId(id);
			double total_paid_amount = 0;

			for (int i = 0; i < fetchedDetail.size(); i++) {
				ContractView newContracts = new ContractView(); // Assuming Contracts has a default constructor
				newContracts.setId(fetchedDetail.get(i).getId());
				newContracts.setDate(fetchedDetail.get(i).getDate());
				newContracts.setConfirmation_document(fetchedDetail.get(i).getConfirmation_document());
				newContracts.setAmount_per_contigency(fetchedDetail.get(i).getAmount_per_contigency());
				newContracts.setPayment_contigency(fetchedDetail.get(i).getPayment_contigency());
				newContracts.setPaid_amount(fetchedDetail.get(i).getPaid_amount());
				newContracts.setPayment_description(fetchedDetail.get(i).getPayment_description());
				newContracts.setPayment_frequency(fetchedDetail.get(i).getPayment_frequency());
				newContracts.setStatus(fetchedDetail.get(i).getStatus());
				newContracts.setAmount_per_frequency(fetchedDetail.get(i).getAmount_per_frequency());
				total_paid_amount += fetchedDetail.get(i).getPaid_amount();
				newContracts.setTotal_amount(fetchedDetail.get(i).getTotal_amount() - total_paid_amount);
				String dateString = fetchedDetail.get(i).getDate();
				newContracts.setRequest_type(fetchedDetail.get(i).getRequest_type());
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				try {
					if (!dateString.equalsIgnoreCase("NaN-aN-aN")) {
						Date date = dateFormat.parse(dateString);
						Calendar calendar = Calendar.getInstance();
						calendar.setTime(date);
						if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("monthly")) {
							calendar.add(Calendar.MONTH, 1); // Adding one month to the date
						} else if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("quarterly")) {
							calendar.add(Calendar.MONTH, 3); // Adding three months to the date
						} else if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("semi_anualy")) {
							calendar.add(Calendar.MONTH, 6); // Adding six months to the date
						} else if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("annually")) {
							calendar.add(Calendar.YEAR, 1); // Adding one year to the date
						} else
							calendar.add(Calendar.DAY_OF_MONTH, 0); // Adding 30 days to the date
						Date newDate = calendar.getTime();
						String newDateString = dateFormat.format(newDate);
						newContracts.setPayment_start_date(newDateString);
					}

					if (fetchedDetail.get(i).getTotal_amount() - total_paid_amount == 0.0)
						newContracts.setPayment_start_date("Finished");

				} catch (ParseException e) {
					e.printStackTrace(); // Handle parsing exception
				}

				paymentDetail.add(newContracts);
			}

			return paymentDetail;

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean DeleteContractRequest(HttpServletRequest request, long id) {
		try {
			util.registerActivity(request, "Delete spesfic Contract request ", "Delete contract request  id=  " + id);
			System.out.println("id-------->" + id);
			return makerMapper.deleteContractById(id);

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ContractView getContractById(String contract_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")
					|| util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {

				ContractView contract = null;
				System.out.println("Yes user has permission.");
				contract = makerMapper.get_contractById(contract_id);
				System.out.println("currency=" + contract.getCurrency());
				// util.registerActivity(request, "get single contract", "get a contract id=" +
				// contract_id);
				return contract;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Licence getLicenceById(String licence_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")) {
				Licence licence = null;
				String[] roles = authMapper.getRoleByUserId(util.getUserId(request));
				if (roles[0].equals("Maker"))
					licence = makerMapper.get_licenceById(licence_id);
				else
					licence = makerMapper.getLicencesByID(Long.parseLong(licence_id));
				// util.registerActivity(request, "get single contract", "get a contract id=" +
				// contract_id);
				return licence;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Licence getTempLicenceById(String licence_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")) {
				Licence licence = null;
				System.out.println("Yes user has permission.");
				licence = makerMapper.getTemp_licenceById(licence_id);
				// util.registerActivity(request, "get single contract", "get a contract id=" +
				// contract_id);
				return licence;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ContractView getTempContractById(String contract_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")) {
				ContractView contract = null;
				Long bond_id;
				String request_type = makerMapper.getRequestType(Long.valueOf(contract_id));
				if (!request_type.equals("Addendum request")) {
					bond_id = makerMapper.getTempbondId(contract_id);
					if (bond_id == null)
						bond_id = (long) 0;
					contract = makerMapper.get_temp_contractById(contract_id, bond_id);
				}
				if (request_type.equals("Addendum request")) {
					bond_id = makerMapper.getAddendumbondId(contract_id);
					contract = makerMapper.get_addendum_contractById(contract_id, bond_id);
				}
				// util.registerActivity(request, "get single contract", "get a contract id=" +
				// contract_id);
				return contract;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Vendors getBankDetail(String vendor_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")) {
				Vendors bankDetail = null;
				System.out.println("Yes user has permission.");
				bankDetail = makerMapper.getBankDetail(vendor_id);
				// util.registerActivity(request, "get single contract", "get a contract id=" +
				// contract_id);
				return bankDetail;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	@Transactional
	public boolean update_contract(Contract contractModel, List<Payment> paymentData, HttpServletRequest request)
			throws IOException {
		// try {
		System.out.println("**********" + contractModel.getService_id());
		String update_renew = "";
		String[] roles = authMapper.getRoleByUserId(util.getUserId(request));

		final String DIRECTORY1 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
				+ "confirmation_document" + "/";
		final String DIRECTORY2 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
				+ "security_document" + "/";
		final String DIRECTORY3 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
				+ "contract_document" + "/";

		final String DIRECTORY4 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
				+ "SLA_document" + "/";

		File file_path1 = new File(StringUtils.join(DIRECTORY1));
		File file_path2 = new File(StringUtils.join(DIRECTORY2));
		File file_path3 = new File(StringUtils.join(DIRECTORY3));
		File file_path4 = new File(StringUtils.join(DIRECTORY4));

		if (!file_path1.exists()) {
			file_path1.mkdirs();
		}
		if (!file_path2.exists()) {
			file_path2.mkdirs();
		}
		if (!file_path3.exists()) {
			file_path3.mkdirs();
		}

		if (!file_path4.exists()) {
			file_path4.mkdirs();
		}
		// if (contractModel.getPayment_confirmation_document() != null) {
		// String extension =
		// FilenameUtils.getExtension(org.springframework.util.StringUtils
		// .cleanPath(contractModel.getPayment_confirmation_document().getOriginalFilename()));
		// String filename = org.springframework.util.StringUtils
		// .cleanPath(contractModel.getPayment_confirmation_document().getOriginalFilename());
		// String file_location_with_name1 = file_path1.getAbsolutePath() + "/"
		// + generateUniqueFileName("confirmation") + "." + extension;
		// contractModel.setConfirmation_path(file_location_with_name1);
		// contractModel.getPayment_confirmation_document().transferTo(new
		// File(file_location_with_name1));
		// } else {
		// contractModel
		// .setConfirmation_path(makerMapper.getConfirmationPathInContract(contractModel.getId()));
		// }
		if (contractModel.getContract_document_document() != null) {
			String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
					.cleanPath(contractModel.getContract_document_document().getOriginalFilename()));
			String filename = org.springframework.util.StringUtils
					.cleanPath(contractModel.getContract_document_document().getOriginalFilename());
			String file_location_with_name3 = file_path3.getAbsolutePath() + "/"
					+ generateUniqueFileName("contract") + "." + extension;
			contractModel.setContract_path(file_location_with_name3);
			contractModel.getContract_document_document().transferTo(new File(file_location_with_name3));
		} else {

			for (String role : roles) {
				if (role.equals("Maker")) {
					contractModel.setContract_path(makerMapper.getContractPathInContract(contractModel.getId()));
				} else if (role.equals("Checker")) {
					if (!contractModel.getRequest_type().equals("Addendum request"))
						contractModel
								.setContract_path(makerMapper.getContractPathInTempContract(contractModel.getId()));
					if (contractModel.getRequest_type().equals("Addendum request"))
						contractModel
								.setContract_path(makerMapper.getContractPathInAddendumContract(contractModel.getId()));

				}
			}
		}
		if (contractModel.getSecurity_document() != null) {
			String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
					.cleanPath(contractModel.getSecurity_document().getOriginalFilename()));
			String filename = org.springframework.util.StringUtils
					.cleanPath(contractModel.getSecurity_document().getOriginalFilename());
			String file_location_with_name2 = file_path2.getAbsolutePath() + "/"
					+ generateUniqueFileName("security") + "." + extension;
			contractModel.setSecurity_path(file_location_with_name2);
			contractModel.getSecurity_document().transferTo(new File(file_location_with_name2));
		} else {
			for (String role : roles) {
				if (role.equals("Maker")) {
					contractModel.setSecurity_path(makerMapper.getSecurityPathInContract(contractModel.getId()));
				} else if (role.equals("Checker")) {
					if (!contractModel.getRequest_type().equals("Addendum request"))
						contractModel
								.setSecurity_path(makerMapper.getSecurityPathInTempContract(contractModel.getId()));
					if (contractModel.getRequest_type().equals("Addendum request"))
						contractModel.setSecurity_path(makerMapper.getSecurityPathInContract(contractModel.getId()));
				}
			}
		}

		// if (contractModel.getSLA_document() != null) {
		// String extension =
		// FilenameUtils.getExtension(org.springframework.util.StringUtils
		// .cleanPath(contractModel.getSLA_document().getOriginalFilename()));
		// String filename = org.springframework.util.StringUtils
		// .cleanPath(contractModel.getSLA_document().getOriginalFilename());
		// String file_location_with_name4 = file_path4.getAbsolutePath() + "/" +
		// generateUniqueFileName("SLA")
		// + "." + extension;
		// contractModel.setSLA_path(file_location_with_name4);
		// contractModel.getSLA_document().transferTo(new
		// File(file_location_with_name4));
		// } else {

		// contractModel.setSLA_path(makerMapper.getSLAPathInContract(contractModel.getId()));
		// }
		if (util.isPermitted(request, "Maker", "register_product")) {
			System.out.println("**********111" + contractModel.getService_id());
			contractModel.setRequest_date(
					DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
			// System.out.println("ampount per frequency------->" +
			// contractModel.getAmount_per_frequency());
			// System.out.println("type------->" + contractModel.getContract_type());
			Long temp_contract_id = (long) 0;

			String action_by = makerMapper.getFullName(util.get_user_id(request));
			contractModel.setRequested_by(action_by);

			if (contractModel.getRequest_type() != null
					&& !contractModel.getRequest_type().equals("Addendum request")) {
				// ContractView currentContract =
				// makerMapper.get_contractById(String.valueOf(contractModel.getId()));
				// String updatedColumns = getUpdatedColumns(currentContract, contractModel);
				// System.out.println("Updated Columns: " + updatedColumns);
				contractModel.setRequested_by(action_by);
				temp_contract_id = makerMapper.register_temp_contract(contractModel);
				Remark nitify = new Remark();
				if (contractModel.getRequest_type().equals("Update request"))
					nitify.setTitle("Update Contract Request");
				if (contractModel.getRequest_type().equals("Renew request"))
					nitify.setTitle("Renewal Contract Request");
				nitify.setCreate_date(
						DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Contract_Notification(notification_id, contractModel.getId());
				// makerMapper.addUserContract(util.get_user_id(request), temp_contract_id);
				// makerMapper.addContractVendor(contractModel.getVendor_id(),temp_contract_id);
				for (Payment payment : paymentData) {
					// Save or process each payment

					System.out.println("Processing payment term: " + payment.getPaymentTerm());
					System.out.println("Processing payment amount: " + payment.getAmount());
					System.out.println("Processing payment due date: " + payment.getDueDate());
					System.out.println("processing payment description: " + payment.getPaymentDescription());
					// paymentRepository.save(payment); // Save payment to the database
					payment.setContract_id(temp_contract_id);
					makerMapper.saveTempPayments(payment);
				}
				makerMapper.updateContractRequestType(contractModel.getRequest_type(), contractModel.getId());
				contractModel.setId(temp_contract_id);
				System.out.println("tttttttttttttttttttt" + contractModel.getBond_amount());
				if (!Double.isNaN(contractModel.getBond_amount()))
					makerMapper.addTempPerformanceBond(contractModel);
			} else if (contractModel.getRequest_type() != null
					&& contractModel.getRequest_type().equals("Addendum request")) {

				contractModel.setRequested_by(action_by);
				Long addendum_id = makerMapper.register_addendum_contract(contractModel);
				Remark nitify = new Remark();
				if (contractModel.getRequest_type().equals("Addendum request"))
					nitify.setTitle("Addendum Contract Request");
				nitify.setCreate_date(
						DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Contract_Notification(notification_id, contractModel.getId());
				// makerMapper.addUserContract(util.get_user_id(request), temp_contract_id);
				// makerMapper.addContractVendor(contractModel.getVendor_id(),temp_contract_id);
				for (Payment payment : paymentData) {
					// Save or process each payment

					System.out.println("Processing payment term: " + payment.getPaymentTerm());
					System.out.println("Processing payment amount: " + payment.getAmount());
					System.out.println("Processing payment due date: " + payment.getDueDate());
					System.out.println("processing payment description: " + payment.getPaymentDescription());
					// paymentRepository.save(payment); // Save payment to the database
					payment.setContract_id(addendum_id);
					makerMapper.saveAddendumPayments(payment);
				}
				makerMapper.updateContractRequestType(contractModel.getRequest_type(), contractModel.getId());
				contractModel.setId(addendum_id);
				makerMapper.addAddendumPerformanceBond(contractModel);

			} else {
				Long maxPerformance_id = makerMapper.getMaxPerformanceId(contractModel.getId());

				makerMapper.updateContract(contractModel);
				System.out.println("vvendpr id =" + contractModel.getVendor_id());
				System.out.println("cccontra id =" + contractModel.getId());
				makerMapper.updateContractVendor(contractModel.getVendor_id(), contractModel.getId());

				makerMapper.updatePerformanceBond(contractModel, maxPerformance_id);
				for (Payment payment : paymentData) {
					// Save or process each payment

					System.out.println("Processing payment term: " + payment.getPaymentTerm());
					System.out.println("Processing payment amount: " + payment.getAmount());
					System.out.println("Processing payment due date: " + payment.getDueDate());
					System.out.println("processing payment description: " + payment.getPaymentDescription());
					// paymentRepository.save(payment); // Save payment to the database
					payment.setContract_id(contractModel.getId());
					if (payment.getId() != null) { // Corrected method name;
						makerMapper.updatePayments(payment);
					} else {
						makerMapper.savePayments(payment);
					}
				}

				util.registerActivity(request, "Update contract", "Update contract id = " + contractModel.getId());

				// if (contractModel.getPayment_status().equals("partial_pending")) {
				// contractModel.setId(makerMapper.getPaymentIdByContractId(contractModel.getId()));
				// makerMapper.updatePayment(contractModel);

				// }
			}
			// else if (contractModel.getContract_type().equalsIgnoreCase("Extend")
			// || contractModel.getContract_type().equalsIgnoreCase("Renewal")) {
			// if (contractModel.getContract_type().equalsIgnoreCase("Extend")) {
			// Remark nitify = new Remark();
			// nitify.setTitle("Extend Contract Request");
			// nitify.setCreate_date(
			// DateTimeFormatter.ofPattern("yyyy/MM/dd
			// HH:mm:ss").format(LocalDateTime.now()));
			// nitify.setDescription("Contract");
			// Long notification_id = makerMapper.addNotification(nitify);
			// makerMapper.Contract_Notification(notification_id, contractModel.getId());
			// }

			// if (contractModel.getContract_type().equalsIgnoreCase("Renewal")) {
			// Remark nitify = new Remark();
			// nitify.setTitle("Renewal Contract Request");
			// nitify.setCreate_date(
			// DateTimeFormatter.ofPattern("yyyy/MM/dd
			// HH:mm:ss").format(LocalDateTime.now()));
			// nitify.setDescription("Contract");
			// Long notification_id = makerMapper.addNotification(nitify);
			// makerMapper.Contract_Notification(notification_id, contractModel.getId());
			// }

			// System.out.println("============" + contractModel.getId());
			// long extend_and_renew_id = makerMapper.addExtendRenew(contractModel);
			// makerMapper.addRequestType(contractModel.getContract_type(),
			// contractModel.getId());
			// makerMapper.addContractExtendRenew(extend_and_renew_id,
			// contractModel.getId());

			// util.registerActivity(request, "Maker sent either extend or renew request ",
			// contractModel.getContract_type() + " request, sent contract id = " +
			// contractModel.getId());
			// }

			return true;
		} else if (util.isPermitted(request, "Checker", "Extend_Renew")) {
			if (contractModel.getRequest_type() != null) {
				// String vendor_name =makerMapper.getvendorName(contractModel.getVendor_id());
				contractModel.setApproved_by(makerMapper.getFullName(util.get_user_id(request)));
				contractModel.setApproved_date(
						DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				if (!contractModel.getRequest_type().equals("Addendum request")) {

					contractModel.setRequest_date(makerMapper.getRequestDate(contractModel.getId()));
					contractModel.setRequested_by(makerMapper.getRequestedBy(contractModel.getId()));

					Long old_contract_id = makerMapper.moveOldContract(contractModel.getId());
					List<Payment> payments = makerMapper.getPaymentsByContractId(contractModel.getId());

					for (Payment paymentss : payments) {
						// Save old each payment

						System.out.println("Processing payment term: " + paymentss.getPaymentTerm());
						System.out.println("Processing payment amount: " + paymentss.getAmount());
						System.out.println("Processing payment due date: " + paymentss.getDueDate());
						System.out.println("processing payment description: " + paymentss.getPaymentDescription());
						// paymentRepository.save(payment); // Save payment to the database
						paymentss.setContract_id(old_contract_id);
						System.out.println("old contid " + old_contract_id);
						makerMapper.saveOldPayments(paymentss);
						System.out.println("22222");

					}
					System.out.println("22222");
					makerMapper.moveOldPerformanceBond(old_contract_id, contractModel.getId());
					System.out.println("33333");
					makerMapper.updateContractAfterApproval(contractModel);
					System.out.println("44444");
					makerMapper.updateContractVendor(contractModel.getVendor_id(), contractModel.getId());
					System.out.println("55555");
					for (Payment payment : paymentData) {
						// Save or process each payment
						System.out.println("this is checker activity: ");
						System.out.println("Processing payment term: " + payment.getId());
						System.out.println("Processing payment term: " + payment.getPaymentTerm());
						System.out.println("Processing payment amount: " + payment.getAmount());
						System.out.println("Processing payment due date: " + payment.getDueDate());
						System.out.println("processing payment description: " + payment.getPaymentDescription());
						// paymentRepository.save(payment); // Save payment to the database
						payment.setContract_id(contractModel.getId());
						if (payment.getId() != null && !payments.isEmpty()) { // Corrected method name;
							makerMapper.updatePayments(payment);
						} else {
							makerMapper.savePayments(payment);
						}
					}

					Long maxPerformance_id = makerMapper.getMaxPerformanceId(contractModel.getId());
					if (maxPerformance_id != null)
						makerMapper.updatePerformanceBond(contractModel, maxPerformance_id);
					else
						makerMapper.addPerformanceBond(contractModel);

					// then delete data from 3 temp tables
					makerMapper.deleteTempInfo(contractModel.getId());

				}
				if (contractModel.getRequest_type().equals("Addendum request")) {
					Long maxAddendumPerformance_id = makerMapper.getMaxAddendumPerformanceId(contractModel.getId());

					makerMapper.updateAddendumPerformanceBond(contractModel, maxAddendumPerformance_id);

					for (Payment paymentt : paymentData) {
						// Save or process each payment
						System.out.println("Processing payment term: " + paymentt.getId());
						System.out.println("Processing payment term: " + paymentt.getPaymentTerm());
						System.out.println("Processing payment amount: " + paymentt.getAmount());
						System.out.println("Processing payment due date: " + paymentt.getDueDate());
						System.out.println("processing payment description: " + paymentt.getPaymentDescription());
						// paymentRepository.save(payment); // Save payment to the database
						paymentt.setContract_id(contractModel.getId());
						if (paymentt.getId() != null) { // Corrected method name;
							makerMapper.updatePayments(paymentt);
						} else {
							makerMapper.saveAddendumPayments(paymentt);
						}
					}

					makerMapper.updateAddendumContractDuringApproval(contractModel);
					makerMapper.updatOriginalContract(contractModel.getId());

				}

				makerMapper.Delete_contract_notification(contractModel.getId());
				Remark remarkks = new Remark();
				if (contractModel.getRequest_type().equals("Update request")) {
					remarkks.setTitle("Accepted update Contract Reques");
				}
				if (contractModel.getRequest_type().equals("Addendum request")) {
					remarkks.setTitle("Accepted addendum Contract Reques");
				}

				if (contractModel.getRequest_type().equals("Renew request")) {
					remarkks.setTitle("Accepted renewal Contract Reques");
				}
				// remarkks.setTitle(" Accepted update Contract Request");
				remarkks.setCreate_date(
						DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				remarkks.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(remarkks);
				makerMapper.Contract_Notification(notification_id, contractModel.getId());
				List<Long> roleId = makerMapper.roleId();
				for (int ii = 0; ii < roleId.size(); ii++) {
					makerMapper.user_Notification(notification_id, roleId.get(ii));
				}

				util.registerActivity(request, "Checker  approved  request ",
						" request approved contract id = " + contractModel.getId());
			}

			return true;

		} else {
			System.out.println("No user does not have permission to update a contract.");
			return false;
		}
		// } catch (Exception e) {
		// e.printStackTrace();
		// if (e instanceof CustomAllException) {
		// StringWriter sw = new StringWriter();
		// e.printStackTrace(new PrintWriter(sw));
		// throw new CustomAllException(sw.toString());
		// } else {
		// StringWriter sw = new StringWriter();
		// e.printStackTrace(new PrintWriter(sw));
		// throw new CustomAllException("it is from here...: " + sw.toString());
		// }

		// throw new ExceptionsList(e);
		// }

	}

	// mebrat start

	public static String getUpdatedColumns(Object oldObject, Object newObject) {
		StringBuilder updatedColumns = new StringBuilder();

		try {
			Field[] fields = oldObject.getClass().getDeclaredFields(); // Get all fields
			for (Field field : fields) {
				field.setAccessible(true); // Access private fields

				Object oldValue = field.get(oldObject);
				Object newValue = field.get(newObject);

				if (!Objects.equals(oldValue, newValue)) { // Compare values
					if (updatedColumns.length() > 0) {
						updatedColumns.append(", ");
					}
					updatedColumns.append(field.getName()); // Append field name
				}
			}
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}

		return updatedColumns.toString();
	}

	public Boolean deactivate_contract(Long contract_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Hold_Contract")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReasonForContract(reason_id, util.get_user_id(request), contract_id);
				makerMapper.deactivate_contract(contract_id);

				Remark nitify = new Remark();
				nitify.setTitle("Hold Contract Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Contract_Notification(notification_id, contract_id);
				util.registerActivity(request, "Hold Contract", "Hold a Contract id=" + contract_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activate_contract(Long contract_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Unhold_Contract")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReasonForContract(reason_id, util.get_user_id(request), contract_id);
				makerMapper.activate_contract(contract_id);

				Remark nitify = new Remark();
				nitify.setTitle("Unhold Contract Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Contract_Notification(notification_id, contract_id);
				util.registerActivity(request, "Unhold contract", "Unhold a contract id=" + contract_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean complete_contract(Long contract_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Unhold_Contract")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReasonForContract(reason_id, util.get_user_id(request), contract_id);
				makerMapper.complete_contract(contract_id);

				Remark nitify = new Remark();
				nitify.setTitle("Successfully Completed Contract Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Contract_Notification(notification_id, contract_id);
				util.registerActivity(request, "Terminate After contract completed successfully Request",
						" contract id=" + contract_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean Terminate_contract(Long contract_id, Remarks remark, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "Terminate_Contract")) {
				Reasons reason = new Reasons();
				reason.setReason(remark.getTitle() + '\n' + remark.getDescription());
				reason.setDate(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				reason.setStatus("1");
				reason.setAvailability("1");
				long reason_id = makerMapper.Reason(reason);
				makerMapper.addUserReasonForContract(reason_id, util.get_user_id(request), contract_id);
				makerMapper.terminate_contract(contract_id);
				Remark nitify = new Remark();
				nitify.setTitle("Terminate Contract Request");
				nitify.setCreate_date(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
				nitify.setDescription("Contract");
				Long notification_id = makerMapper.addNotification(nitify);
				makerMapper.Contract_Notification(notification_id, contract_id);
				util.registerActivity(request, "Terminate contract",
						"Terminate a contract id= " + contract_id + " before complete the contract");

				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Remarks> getRemarksByContractId(String contract_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "View_Remark")) {
				List<Remarks> remarkss = new ArrayList<>(); // Initialize the list
				// List<Remarks> remarkss = null; // Initialize the list

				List<Remarks> remarks = makerMapper.getRemarksByContractId(contract_id);
				List<Reasons> reason = makerMapper.getReasonsByContractId(contract_id);
				for (int i = 0; i < reason.size(); i++) {
					Remarks reasonss = new Remarks(); // Assuming Remarks has a default constructor
					reasonss.setId(reason.get(i).getId());
					String reasonText = reason.get(i).getReason();
					String[] lines = reasonText.split("\n"); // Split by newline
					String firstLine = lines[0]; // Get the first el
					String description = "";
					for (int k = 1; k < lines.length; k++) {
						description = description + (lines[k]);
					}
					reasonss.setTitle(firstLine);
					reasonss.setDescription(description);
					reasonss.setCreated_date(reason.get(i).getDate());
					reasonss.setCreated_by(makerMapper.getFullName(Long.parseLong(reason.get(i).getCreated_by())));
					reasonss.setEmail(makerMapper.getEmail(Long.parseLong(reason.get(i).getCreated_by())));
					reasonss.setAvailability(reason.get(i).getAvailability());
					reasonss.setStatus(reason.get(i).getStatus());
					System.out.println("Email=" + reasonss.getEmail());
					remarkss.add(reasonss);
				}
				for (int i = 0; i < remarks.size(); i++) {
					Remarks newRemark = new Remarks(); // Assuming Remarks has a default constructor
					newRemark.setId(remarks.get(i).getId());
					newRemark.setTitle(remarks.get(i).getTitle());
					newRemark.setDescription(remarks.get(i).getDescription());
					newRemark.setCreated_date(remarks.get(i).getCreated_date());
					newRemark.setCreated_by(makerMapper.getFullName(Long.parseLong(remarks.get(i).getCreated_by())));
					newRemark.setEmail(makerMapper.getEmail(Long.parseLong(remarks.get(i).getCreated_by())));
					newRemark.setAvailability(remarks.get(i).getAvailability());
					newRemark.setStatus(remarks.get(i).getStatus());
					System.out.println("Email=" + newRemark.getEmail());
					remarkss.add(newRemark);
				}

				util.registerActivity(request, "View Contract Remarks", "Views all Remarks list");
				return remarkss;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean contract_remark(HttpServletRequest request, long contract_id, Remarks remark) {
		try {
			System.out.println("-----------------------" + remark.getId());
			Long reciver_id = makerMapper.getReciverId(remark.getId());
			if (util.isPermitted(request, "Maker", "Contract_remark")) {
				Remarks remarkk = new Remarks();
				remarkk.setTitle(remark.getTitle());
				remarkk.setDescription(remark.getDescription());
				remarkk.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				long remark_id = makerMapper.send_remark(remarkk);
				makerMapper.addUserContractRemark(remark_id, util.get_user_id(request), reciver_id, contract_id);
				util.registerActivity(request, "send remark ", "send Contract request remark");
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> security_downloadFiles(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download security document");
				String path1 = makerMapper.downloadFiles_security(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> contract_downloadFiles(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download contract document");
				String path1 = makerMapper.downloadFiles_contract(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> addendum_downloadFiles(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download SLA document");
				String path1 = makerMapper.downloadFiles_addendum(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> payment_confirmation_downloadFiles(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download payment confirmation document");
				String path1 = makerMapper.downloadFiles_payment_confirmation(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> contract_document_renew_downloadFiles(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download previous contract document after renew");
				String path1 = makerMapper.downlFileContractRenew(makerMapper.extend_and_renew_id(id));
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Map<String, Object> getMakerDashboardData(HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "get_dashboard_data")
					|| util.isPermitted(request, "Checker", "get_dashboard_data")) {
				Map<String, Object> response = new HashMap<>();
				response.put("pending_vendors", makerCheckerDashboard.getPendingVendor());
				response.put("active_vendors", makerCheckerDashboard.getActiveVendor());
				response.put("total_vendors", makerCheckerDashboard.getTotalVendor());
				response.put("deactive_vendors", makerCheckerDashboard.getInactiveVendor());
				response.put("reject_vendors", makerCheckerDashboard.getRejectVendor());
				response.put("working_vendors", makerCheckerDashboard.getWorkingVendor());
				response.put("Has_no_contract", makerCheckerDashboard.getVendorNoContract());

				response.put("deactive_vendors_requests", makerCheckerDashboard.getDeactiveVendorRequest());
				response.put("active_vendors_requests", makerCheckerDashboard.getActiveVendorRequest());
				response.put("update_vendors_requests", makerCheckerDashboard.getUpdateVendorRequest());
				response.put("delete_vendors_requests", makerCheckerDashboard.getDeleteVendorRequest());

				response.put("hold_contracts_requests", makerCheckerDashboard.getHoldContractRequest());
				response.put("unhold_contracts_requests", makerCheckerDashboard.getUnholdContractRequest());
				response.put("extend_contracts_requests", makerCheckerDashboard.getExtendContract());
				response.put("renew_contracts_requests", makerCheckerDashboard.getRenewContract());
				response.put("terminate_contracts_requests", makerCheckerDashboard.getTerminatContract());

				response.put("total_contracts", makerCheckerDashboard.getTotalContract());
				response.put("pending_contracts", makerCheckerDashboard.getPendingContract());
				response.put("reject_contracts", makerCheckerDashboard.getRejectContract());
				response.put("active_contracts", makerCheckerDashboard.getActiveContract());
				response.put("hold_contracts", makerCheckerDashboard.getHoldContract());
				response.put("terminate_contracts", makerCheckerDashboard.getTerminatedContract());
				response.put("extend_contracts", makerCheckerDashboard.getExtendedContract());
				response.put("renew_contracts", makerCheckerDashboard.getRenewedContract());

				System.out.println("response: " + response);
				return response;
			} else {
				System.out.println("User has no permision to get_dashboard_data");
				return null;
			}

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}

	}

	public boolean register_Contract_Type(Product productModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "register_product")) {
				String created_by = makerMapper.getFullName(util.get_user_id(request));
				productModel.setStatus("1");
				productModel.setAvailability("1");
				productModel.setCreated_by(created_by);
				productModel.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				makerMapper.register_ContractType(productModel);

				util.registerActivity(request, "Register Contract type",
						"Register " + productModel.getName() + " Contract type");
				return true;
			} else {
				System.out.println("No user does not have permission to register a contract type.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean update_contract_type(Product productModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "login")) {
				makerMapper.update_Contract_type(productModel);
				util.registerActivity(request, "Update contract type",
						"update " + productModel.getName() + " contract type");
				return true;
			} else {
				System.out.println("No user does not have permission to update a product.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public List<Product> getAllContractTypes(HttpServletRequest request) {
		try {

			List<Product> product = makerMapper.getAllContractTypes();
			return product;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Vendors> getAllVendorsForReport(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")
					|| util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				List<Vendors> vendors = makerMapper.getVendorsForReport();
				return vendors;
			} else {
				System.out.println("No user does not have permission. get_all_products");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Product getContractType(String product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				Product product = null;
				System.out.println("Yes user has permission.");
				product = makerMapper.get_ContractType(product_id);
				return product;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivate_ContractType(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.deactivate_ContractType(product_id);
				util.registerActivity(request, "Deactivate", "Deactivate a Contract type id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activate_ContractType(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.activate_ContractType(product_id);
				util.registerActivity(request, "activate", "activating a Contract type id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean delete_ContractType(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.delete_ContractType(product_id);
				util.registerActivity(request, "Delete", "delete Contract type, id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean register_PaymentStatus(Product productModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "register_product")) {
				String created_by = makerMapper.getFullName(util.get_user_id(request));
				productModel.setStatus("1");
				productModel.setAvailability("1");
				productModel.setCreated_by(created_by);
				productModel.setCreated_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				makerMapper.register_PaymentStatus(productModel);

				util.registerActivity(request, "Register Payment Status",
						"Register " + productModel.getName() + " Payment Status");
				return true;
			} else {
				System.out.println("No user does not have permission to register a Payment Status.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public boolean update_PaymentStatus(Product productModel, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "login")) {
				makerMapper.update_PaymentStatus(productModel);
				util.registerActivity(request, "Update Payment Status",
						"update " + productModel.getName() + " Payment Status");
				return true;
			} else {
				System.out.println("No user does not have permission to update a Payment Status.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public List<Product> getAllPaymentStatus(HttpServletRequest request) {
		try {

			List<Product> product = makerMapper.getAllPaymentStatus();
			return product;

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Product getPaymentStatus(String product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				Product product = null;
				System.out.println("Yes user has permission.");
				product = makerMapper.get_PaymentStatus(product_id);
				return product;
			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean deactivate_PaymentStatus(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.deactivate_PaymentStatus(product_id);
				util.registerActivity(request, "Deactivate", "Deactivate a Payment Status id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean activate_PaymentStatus(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.activate_PaymentStatus(product_id);
				util.registerActivity(request, "activate", "activating a Payment Status, id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean delete_PaymentStatus(Long product_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.delete_PaymentStatus(product_id);
				util.registerActivity(request, "Delete", "deleting a Payment Status, id=" + product_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ContractView getPaymentByContractId(HttpServletRequest request, long id) {

		ContractView newContracts = new ContractView(); // Assuming ContractView has a default constructor
		try {
			List<ContractView> fetchedDetail = makerMapper.getPaymentByContractId(id);
			double total_paid_amount = 0;
			if (fetchedDetail != null) {
				for (int i = 0; i < fetchedDetail.size(); i++) {
					newContracts.setId(fetchedDetail.get(i).getId());
					newContracts.setDate(fetchedDetail.get(i).getDate());
					newContracts.setConfirmation_document(fetchedDetail.get(i).getConfirmation_document());
					newContracts.setAmount_per_contigency(fetchedDetail.get(i).getAmount_per_contigency());
					newContracts.setPayment_contigency(fetchedDetail.get(i).getPayment_contigency());
					newContracts.setPaid_amount(fetchedDetail.get(i).getPaid_amount());
					newContracts.setPayment_description(fetchedDetail.get(i).getPayment_description());
					newContracts.setPayment_frequency(fetchedDetail.get(i).getPayment_frequency());
					newContracts.setStatus(fetchedDetail.get(i).getStatus());
					newContracts.setAmount_per_frequency(fetchedDetail.get(i).getAmount_per_frequency());
					total_paid_amount += fetchedDetail.get(i).getPaid_amount();
					newContracts.setTotal_amount(fetchedDetail.get(i).getTotal_amount() - total_paid_amount);
					String dateString = fetchedDetail.get(i).getDate();
					newContracts.setRequest_type(fetchedDetail.get(i).getRequest_type());
					SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
					try {
						Calendar calendar = Calendar.getInstance();
						if (!dateString.equalsIgnoreCase("NaN-aN-aN")) {
							Date date = dateFormat.parse(dateString);
							calendar.setTime(date);
							if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("monthly")) {
								calendar.add(Calendar.MONTH, 1); // Adding one month to the date
							} else if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("quarterly")) {
								calendar.add(Calendar.MONTH, 3); // Adding three months to the date
							} else if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("semi_anualy")) {
								calendar.add(Calendar.MONTH, 6); // Adding six months to the date
							} else if (fetchedDetail.get(i).getPayment_frequency().equalsIgnoreCase("annually")) {
								calendar.add(Calendar.YEAR, 1); // Adding one year to the date
							} else
								calendar.add(Calendar.DAY_OF_MONTH, 0); // Adding 30 days to the date
							Date newDate = calendar.getTime();
							String newDateString = dateFormat.format(newDate);
							newContracts.setPayment_start_date(newDateString);
						} else {
							newContracts.setPayment_start_date(dateString);
						}
						if (fetchedDetail.get(i).getTotal_amount() - total_paid_amount == 0.0)
							newContracts.setPayment_start_date("Finished");

					} catch (ParseException e) {
						e.printStackTrace(); // Handle parsing exception
					}
				}
				return newContracts;
			} else {
				return null;
			}

		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean delete_Payment(Long payment_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.delete_Payment(payment_id);
				util.registerActivity(request, "Delete", "delete a Payment after register,  id=" + payment_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Payment> getPaymentById(HttpServletRequest request, long id) {
		try {
			List<Payment> fetchedDetail = makerMapper.getPaymentByContractIdForContractDetail(id);
			return fetchedDetail;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Payment> getOldPaymentById(HttpServletRequest request, long id) {
		try {
			List<Payment> fetchedDetail = makerMapper.getOldPaymentByOldContractId(id);
			return fetchedDetail;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Payment> getAddendumPaymentById(HttpServletRequest request, long id) {
		try {
			List<Payment> fetchedDetail = makerMapper.getAddendumPaymentByAddendumContractId(id);
			return fetchedDetail;
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean contract_request(Contract contractModel, HttpServletRequest request) {
		try {
			System.out.println("**********" + contractModel.getId());
			if (util.isPermitted(request, "Maker", "register_product")) {
				final String DIRECTORY1 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "confirmation_document" + "/";
				final String DIRECTORY2 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "security_document" + "/";
				final String DIRECTORY3 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "contract_document" + "/";

				final String DIRECTORY4 = System.getProperty("user.dir") + "/src/main/resources/static/files/"
						+ "SLA_document" + "/";
				String created_by = makerMapper.getFullName(util.get_user_id(request));
				File file_path1 = new File(StringUtils.join(DIRECTORY1));
				File file_path2 = new File(StringUtils.join(DIRECTORY2));
				File file_path3 = new File(StringUtils.join(DIRECTORY3));
				File file_path4 = new File(StringUtils.join(DIRECTORY4));

				if (!file_path1.exists()) {
					file_path1.mkdirs();
				}
				if (!file_path2.exists()) {
					file_path2.mkdirs();
				}
				if (!file_path3.exists()) {
					file_path3.mkdirs();
				}

				if (!file_path4.exists()) {
					file_path4.mkdirs();
				}
				if (contractModel.getPayment_confirmation_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getPayment_confirmation_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getPayment_confirmation_document().getOriginalFilename());
					String file_location_with_name1 = file_path1.getAbsolutePath() + "/"
							+ generateUniqueFileName("confirmation") + "." + extension;
					contractModel.setConfirmation_path(file_location_with_name1);
					contractModel.getPayment_confirmation_document().transferTo(new File(file_location_with_name1));
				} else {
					if (contractModel.getPayment_status().equalsIgnoreCase("pending")) {
						contractModel
								.setConfirmation_path(makerMapper.getConfirmationPathInContract(
										makerMapper.getContractIdByPaymentId(contractModel.getId())));
					} else {
						contractModel
								.setConfirmation_path(makerMapper.getConfirmationPathInContract(contractModel.getId()));
					}
				}
				if (contractModel.getContract_document_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getContract_document_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getContract_document_document().getOriginalFilename());
					String file_location_with_name3 = file_path3.getAbsolutePath() + "/"
							+ generateUniqueFileName("contract") + "." + extension;
					contractModel.setContract_path(file_location_with_name3);
					contractModel.getContract_document_document().transferTo(new File(file_location_with_name3));
				} else {
					contractModel.setContract_path(makerMapper.getContractPathInContract(contractModel.getId()));
				}
				if (contractModel.getSecurity_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getSecurity_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getSecurity_document().getOriginalFilename());
					String file_location_with_name2 = file_path2.getAbsolutePath() + "/"
							+ generateUniqueFileName("security") + "." + extension;
					contractModel.setSecurity_path(file_location_with_name2);
					contractModel.getSecurity_document().transferTo(new File(file_location_with_name2));
				} else {
					contractModel.setSecurity_path(makerMapper.getSecurityPathInContract(contractModel.getId()));
				}

				if (contractModel.getSLA_document() != null) {
					String extension = FilenameUtils.getExtension(org.springframework.util.StringUtils
							.cleanPath(contractModel.getSLA_document().getOriginalFilename()));
					String filename = org.springframework.util.StringUtils
							.cleanPath(contractModel.getSLA_document().getOriginalFilename());
					String file_location_with_name4 = file_path4.getAbsolutePath() + "/" + generateUniqueFileName("SLA")
							+ "." + extension;
					contractModel.setSLA_path(file_location_with_name4);
					contractModel.getSLA_document().transferTo(new File(file_location_with_name4));
				} else {

					contractModel.setSLA_path(makerMapper.getSLAPathInContract(contractModel.getId()));
				}

				contractModel.setContract_registration_date(
						DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));

				if (contractModel.getPayment_status().equalsIgnoreCase("pending")) {
					makerMapper.pendingPayment(contractModel);
					makerMapper.pending_payment_contract(makerMapper.getContractIdByPaymentId(contractModel.getId()));

					makerMapper
							.Delete_contract_notification(makerMapper.getContractIdByPaymentId(contractModel.getId()));
					System.out.println("==============================" + contractModel.getId());
					Remark nitify = new Remark();
					nitify.setTitle("Pending Payment Request");
					nitify.setCreate_date(
							DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss").format(LocalDateTime.now()));
					nitify.setDescription("Contract");
					Long notification_id = makerMapper.addNotification(nitify);
					makerMapper.Contract_Notification(notification_id,
							makerMapper.getContractIdByPaymentId(contractModel.getId()));
					System.out.println("*****id1****" + contractModel.getId());
					util.registerActivity(request, "Maker sent Payment confirmation request ",
							" request send Payment id = " + contractModel.getId());

				} else if (contractModel.getPayment_status().equalsIgnoreCase("update")) {
					System.out.println("*****id2****" + contractModel.getId());
					makerMapper.updatePaymentByPaymentId(contractModel);
					util.registerActivity(request, "Maker update payment ",
							" payment id = " + contractModel.getId());
				}

				return true;
			} else if (util.isPermitted(request, "Checker", "Extend_Renew")) {
				if (contractModel.getContract_type().equalsIgnoreCase("Extend")) {

					long extend_and_renew_id = makerMapper.moveContractPreviousExtend(contractModel.getId());
					makerMapper.addContractPrextendAndRenew(contractModel.getId(), extend_and_renew_id);
					makerMapper.extendContract(contractModel);

					makerMapper.deletExtendRenew(contractModel.getId(),
							makerMapper.extend_and_renew_id(contractModel.getId()));

					util.registerActivity(request, "Checker approved extend contract request ",
							" contract id = " + contractModel.getId());
				} else if (contractModel.getContract_type().equalsIgnoreCase("Renewal")) {

					long extend_and_renew_id = makerMapper.moveContractPreviousRenew(contractModel.getId());
					makerMapper.addContractPrextendAndRenew(contractModel.getId(), extend_and_renew_id);
					if (makerMapper.downlFileContractRenew(makerMapper.extend_and_renew_id(contractModel.getId()))
							.equalsIgnoreCase(null)) {
						makerMapper.extendContract(contractModel);
					} else {
						contractModel.setContract_path(makerMapper
								.downlFileContractRenew(makerMapper.extend_and_renew_id(contractModel.getId())));
						makerMapper.renewContract(contractModel);
					}
					makerMapper.deletExtendRenew(contractModel.getId(),
							makerMapper.extend_and_renew_id(contractModel.getId()));
					util.registerActivity(request, "Checker approved contract renewal request ",
							"contract id = " + contractModel.getId());
				}

				return true;

			} else {
				System.out.println("No user does not have permission to update a contract.");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof CustomAllException) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException(sw.toString());
			} else {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				throw new CustomAllException("it is from here...: " + sw.toString());
			}

			// throw new ExceptionsList(e);
		}

	}

	public List<ContractView> getDetailHistory(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")) {
				System.out.println("you are on back end end2");
				List<ContractView> contracts = makerMapper.getDetailHistory(id);

				util.registerActivity(request, "View Contract Detail History",
						"View contract detail history contract id: " + id);
				return contracts;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ContractView> getContractAddendum(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Manager", "login")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				List<ContractView> contracts = makerMapper.getContractAddendum(id);

				util.registerActivity(request, "View Contract addendum",
						"View contract addendum of contract id: " + id);
				return contracts;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> contract_downloadFiles_renew_extend(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download previous files");
				String path1 = makerMapper.downloadFiles_contract_renew(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Vendor> getVendorDetailHistory(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")) {
				List<Vendor> vendors = makerMapper.getVendorHistory(id);

				util.registerActivity(request, "View Vendor Detail History",
						"View Contract detail history Vendor id:" + id);
				return vendors;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Licence> getLicenceDetailHistory(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")) {
				List<Licence> licence = makerMapper.getLicenceHistory(id);

				util.registerActivity(request, "View licence Detail History",
						"View licence detail history licence id:" + id);
				return licence;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Remarks> getMakerNotification(HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "update_remark")) {
				List<Remarks> remarkss = new ArrayList<>(); // Initialize the list

				List<Remarks> reason = makerMapper.getMakerNotification(util.get_user_id(request));
				for (int i = 0; i < reason.size(); i++) {
					Remarks reasonss = new Remarks(); // Assuming Remarks has a default constructor
					reasonss.setId(reason.get(i).getId());
					reasonss.setTitle(reason.get(i).getTitle());
					reasonss.setCreated_by(reason.get(i).getCreated_by());
					reasonss.setEmail(reason.get(i).getEmail());
					reasonss.setCreated_date(reason.get(i).getCreated_date());

					reasonss.setAvailability(reason.get(i).getAvailability());
					reasonss.setStatus(reason.get(i).getStatus());
					remarkss.add(reasonss);
				}

				// util.registerActivity(request, "Maker Get Notification", "View List of
				// notification");
				return remarkss;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean ViewNotification(HttpServletRequest request, Long id, String type) {
		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")
					|| util.isPermitted(request, "Manager", "login")) {
				System.out.println("pppppppppppppppp=" + id);
				if (type.equalsIgnoreCase("Contract")) {
					makerMapper.notificationChecked(makerMapper.viewContractNotification(id),
							util.get_user_id(request));
				} else if (type.equalsIgnoreCase("Vendor")) {
					makerMapper.notificationChecked(makerMapper.viewVendorNotification(id), util.get_user_id(request));
					// makerMapper.viewVendorNotification(id);
				} else if (type.equalsIgnoreCase("Payment")) {
					makerMapper.notificationChecked(makerMapper.viewPaymentNotification(id), util.get_user_id(request));
					// makerMapper.viewVendorNotification(id);
				}

				return true;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public String exportExcelFile(Reports report)
			throws IOException, ParseException, WriterException, java.text.ParseException {

		System.out.println("ReportType:" + report.getType());
		List<ContractView> data_contract = reportMapper.getReportSearchQuery(report.getId(),
				report.getContract_start_date_min(), report.getContract_start_date_max(),
				report.getContract_end_date_min(), report.getContract_end_date_max(),
				report.getContract_payment_frequency(), report.getContract_payment_date_min(),
				report.getContract_payment_date_max());

		ByteArrayInputStream in = null;
		InputStream targetStream;
		report.setVendor(makerMapper.vendorName(report.getId()));
		in = ExcelHelper.generate(report, data_contract);
		InputStreamResource file = new InputStreamResource(in);
		targetStream = in;

		final String DIRECTORY2 = System.getProperty("user.dir") + "/src/main/resources/static/generated_reports/"
				+ DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()).substring(0, 7) + "/";

		final String DIRECTORY = System.getProperty("user.dir") + "/src/main/resources/static/generated_reports/"
				+ DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()).substring(0, 7) + "/"
				+ "REPORT As of " + DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()) + ", "
				+ DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()).toString().split(" ") + ".xls";
		File file_path = new File(StringUtils.join(DIRECTORY2));

		if (!file_path.exists()) {
			file_path.mkdirs();
		}

		File filee = new File(DIRECTORY);
		// commons-io
		FileUtils.copyInputStreamToFile(targetStream, filee);
		return DIRECTORY;

	}

	//
	//
	public String exportPdfFile(Reports report)
			throws IOException, DocumentException, ParseException, WriterException, java.text.ParseException {
		report.setVendor(makerMapper.vendorName(report.getId()));
		List<ContractView> data_contract = reportMapper.getReportSearchQuery(report.getId(),
				report.getContract_start_date_min(), report.getContract_start_date_max(),
				report.getContract_end_date_min(), report.getContract_end_date_max(),
				report.getContract_payment_frequency(), report.getContract_payment_date_min(),
				report.getContract_payment_date_max());
		PDFGenerator generator = new PDFGenerator();
		return generator.generate(report, data_contract);

	}

	public ResponseEntity<Resource> downloadReportFiles(HttpServletRequest request, Reports report) {
		try {
			if (util.isPermitted(request, "Maker", "login")
					|| util.isPermitted(request, "Checker", "login")) {
				util.registerActivity(request, "download  report files", "-");
				//

				String path = "";
				if (report.getType().equalsIgnoreCase("pdf")) {
					if (1 == 1) {
						path = exportPdfFile(report);
					} else
						throw new ExceptionsList(new CustomAllException(""));
				} else if (report.getType().equalsIgnoreCase("excel")) {
					if (1 == 1) {
						path = exportExcelFile(report);
					} else
						throw new ExceptionsList(new CustomAllException(""));

				}
				Path filePath = Paths.get(path).toAbsolutePath().normalize().resolve(path);
				if (!Files.exists(filePath)) {
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path);
				if (report.getType().equalsIgnoreCase("pdf")) {
					httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				} else {
					httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
				}
				return ResponseEntity.ok().headers(httpHeaders).body(resource);
				// return null;
			}

			else {
				System.out.println("No user does not have permission.");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}

	}

	// mebrat end
	public Boolean checkVendoName(String vendor_name, HttpServletRequest request) {
		try {
			return makerMapper.checkVendorName(vendor_name);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean checkDirectorateExists(String directorate_name, HttpServletRequest request) {
		try {
			return makerMapper.checkDirectorateExists(directorate_name);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean checkBankExists(String bank_name, HttpServletRequest request) {
		try {
			return makerMapper.checkBankExists(bank_name);
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<ContractView> get_Contracts_by_vendorId(HttpServletRequest request, Long vendorId) {
		try {
			System.out.println("vendorid:" + vendorId);
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")
					|| util.isPermitted(request, "Manager", "View_contracts")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Chief", "login")
					|| util.isPermitted(request, "Finance", "login")) {
				List<ContractView> contracts = makerMapper.get_Contracts_by_vendorId(vendorId);
				util.registerActivity(request, "Get Contracts by vendorId:" + vendorId, "Get contracts by vendor id");
				return contracts;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Payment> getPaymentByPaymentId(HttpServletRequest request, Long id, Long contract_id) {
		List<Payment> payment = null;

		try {
			if (util.isPermitted(request, "Maker", "View_contracts")
					|| util.isPermitted(request, "Checker", "View_contracts")
					|| util.isPermitted(request, "Manager", "View_contracts")
					|| util.isPermitted(request, "Director", "login")
					|| util.isPermitted(request, "Finance", "login")
					|| util.isPermitted(request, "Chief", "login")) {

				if (contract_id.equals(0L)) {
					payment = makerMapper.getPaymentByPaymentId(id);
				} else {
					payment = makerMapper.getPaymentsByContractIdAndIfExistAddendum(contract_id);
				}

				util.registerActivity(request, "Get payment by its id:" + id, "Get payment by its id");
				return payment;
			} else {
				System.out.println("No user does not have permission. View_contracts");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public boolean processPayment(Long paymentId, Double amount, Double paidAmount, String dueDate, String reason,
			String addendum,
			List<MultipartFile> files, List<String> fileLabels, HttpServletRequest request) {
		try {
			// Check user permission
			if (!util.isPermitted(request, "Maker", "register_product")) {
				System.out.println("User does not have permission to process payment");
				return false;
			}
			System.out.println("User have  have permission to process payment.");
			final String DIRECTORY = System.getProperty("user.dir")
					+ "/src/main/resources/static/files/Payment_document/";
			String createdBy = makerMapper.getFullName(util.get_user_id(request));
			File filePath = new File(DIRECTORY);

			if (!filePath.exists()) {
				filePath.mkdirs();
			}

			for (int i = 0; i < files.size(); i++) {
				MultipartFile file = files.get(i);
				String label = fileLabels.get(i);
				if (file != null && !file.isEmpty()) {
					FileTable fileTable = new FileTable();
					fileTable.setCrtd(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
					fileTable.setPayment_id(paymentId);
					fileTable.setName(label);
					fileTable.setStatus("1");
					fileTable.setAvailability("1");

					// Generate unique file name
					String extension = FilenameUtils.getExtension(file.getOriginalFilename());
					String filename = generateUniqueFileName("Payment_document") + "." + extension;
					String fullPath = filePath.getAbsolutePath() + "/" + filename;

					fileTable.setPath(fullPath);
					file.transferTo(new File(fullPath));
					makerMapper.paymenProcesse(fileTable);
				}
			}
			List<Payment> payments;
			List<Payment> addendumpayments;
			if (addendum.equalsIgnoreCase("0")) {
				payments = makerMapper.getPaymentByPaymentId(paymentId);
				Payment paymentDetail = payments.get(0);
				paymentDetail.setPaid_amount(paidAmount);
				paymentDetail.setInitait_by(createdBy);
				paymentDetail.setInitaited_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				paymentDetail.setStatus("2");
				paymentDetail.setReason(reason);
				makerMapper.updatePayments(paymentDetail);
			} else if (addendum.equalsIgnoreCase("1")) {
				addendumpayments = makerMapper.getAddendumPaymentByPaymentId(paymentId);
				Payment AddendumpaymentDetail = addendumpayments.get(0);
				AddendumpaymentDetail.setPaid_amount(paidAmount);
				AddendumpaymentDetail.setInitait_by(createdBy);
				AddendumpaymentDetail
						.setInitaited_date(DateTimeFormatter.ofPattern("MM/dd/yyyy").format(LocalDateTime.now()));
				AddendumpaymentDetail.setStatus("2");
				AddendumpaymentDetail.setReason(reason);
				makerMapper.updateAddendumPayments(AddendumpaymentDetail);
			}
			util.registerActivity(request, "Payment process", "Processed payment with ID: " + paymentId);

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			StringWriter sw = new StringWriter();
			e.printStackTrace(new PrintWriter(sw));
			throw new CustomAllException("Error processing payment: " + sw.toString());
		}
	}

	public List<FileTable> getPaymentFiles(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download previous files");

				List<FileTable> files = makerMapper.payment_files_by_payment_id(id);
				if (files.isEmpty()) {
					throw new FileNotFoundException("No files found for the given payment ID.");
				}
				return files;

			} else {
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean delete_file(Long file_id, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")) {
				System.out.println("Yes user has permission.");
				makerMapper.delete_file(file_id);
				util.registerActivity(request, "Delete file", "delete files,  id=" + file_id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public ResponseEntity<Resource> download_files(HttpServletRequest request, Long id) {
		try {
			if (util.isPermitted(request, "Maker", "download_file")
					|| util.isPermitted(request, "Checker", "download_file")) {
				util.registerActivity(request, "download files", "download files (document)");
				String path1 = makerMapper.download_and_preview_files(id);
				Path filePath = Paths.get(path1).toAbsolutePath().normalize().resolve(path1);
				if (!Files.exists(filePath)) {
					// System.out.println("it does not exist.");
					throw new FileNotFoundException("The requested file could not be found on the server.");
				}
				Resource resource = new UrlResource(filePath.toUri());
				HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.add("File-Name", path1);
				httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
				httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
				return ResponseEntity.ok().headers(httpHeaders).body(resource);

			} else {
				System.out.println("No user does not have permission.");
				return null;
			}
		}

		catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public Boolean remove_payments(Long id, String addendum, HttpServletRequest request) {

		try {
			if (util.isPermitted(request, "Maker", "login") || util.isPermitted(request, "Checker", "login")) {
				System.out.println("Yes user has permission.");
				if (addendum.equalsIgnoreCase("0")) {
					makerMapper.remove_payments(id);
				} else if (addendum.equalsIgnoreCase("1")) {
					makerMapper.remove_Addendumpayments(id);
				}
				util.registerActivity(request, "Delete Processed Payment", "removed processed payment,  id=" + id);
				return true;
			} else {
				System.out.println("No user does not have permission.");
				return false;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}

	public List<Reasons> get_payment_reason(String payment_id, HttpServletRequest request) {
		try {
			if (util.isPermitted(request, "Maker", "View_Remark") || util.isPermitted(request, "Checker", "login")) {
				List<Reasons> reasons = makerMapper.getReasonsByPaymentId(payment_id);
				util.registerActivity(request, "View payment reject reason", "Views reasons list");
				return reasons;
			} else {
				System.out.println("No user does not have permission. View_Remark");
				return null;
			}
		} catch (Exception e) {
			throw new ExceptionsList(e);
		}
	}
}
