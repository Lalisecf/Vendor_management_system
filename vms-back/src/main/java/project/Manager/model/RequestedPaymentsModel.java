package project.Manager.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestedPaymentsModel {
    private Long id;
    private String paymentTerm;
    private Double amount;
    private String dueDate;
    private String paymentDescription;
    private Long contract_id;
    private String initait_by;
    private String approved_by;
    private String initaited_date;
    private String reason;
    private Double paid_amount;
    private String status;
    private String contract_title;
    private String name;
    private String addendum_id;
    
    
}
