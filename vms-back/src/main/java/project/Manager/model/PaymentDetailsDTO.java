package project.Manager.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentDetailsDTO {

    private String payment_id;
    private String name;
    private String phone_number;
    private String email;
    private String website;
    private String location;
    private String address;
    private String vendor_registration_date;
    private String bank_name;
    private String branch_name;
    private String account_name;
    private String account_number;
    private String swift_code;
    private String beneficiary_address;
    private String iban;
    private Long history_id;

    private String contract_title;
    private String contract_type;
    private String directorate;
    private String start_date;
    private String end_date;
    private String payment_method;

    private double total_amount;

    private String currency;
    private String vat;
    private String sla;
    private double bond_amount;
    private String bond_expiry_date;
    private String issuer_bank;

    private String vendor_availability;
    private String vendor_status;
    private String contract_availability;
    private String contract_status;
    private BigDecimal amount;
    private BigDecimal paid_amount;
    private String paymentDescription;
    private String paymentTerm;
    private String reason;
    private String dueDate;
    private String paidDate;
    private String initait_by;
    private String approved_by;
    private String director;
    private String chief;
    private String finance;
    private String initaited_date;
    private String manager_action_date;
    private String director_action_date;
    private String chief_action_date;
    private String finance_action_date;
    private boolean addendum;
    private String payement_status;

}
