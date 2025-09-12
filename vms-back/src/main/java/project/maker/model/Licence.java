package project.maker.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Licence {
    private Long id;
    private Long vendor_id;
    private String vendor_name;
    private String contract_title;
    private Long contract_id;
    private String product_service_name;
    private Integer licence_quantity;
    private String product_category;
    private String licence_type;
    private String start_date;
    private String expiry_date;
    private String renewal_date;
    private Double total_cost;
    private String support_period;
    private String additional_info;
    private String file_path;
    private MultipartFile licence_document;
    private String status;
    private String availability;
    private String requested_by;
    private String request_date;
    private String approved_by;
    private String approved_date;
    private String request_type;

}
