package project.maker.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Payment {
    private Long id;
    private String paymentTerm;
    private Double amount;
    private String dueDate;
    private String paymentDescription;
    private Long contract_id;
    private String initait_by;
    private String approved_by;
    private String director;
    private String chief;
    private String finance;
    private String initaited_date;
    private String reason;
    private Double paid_amount = 0.00;
    private String status;
    private String addendum_type;
    private String addendum_id;

    // Constructors
    public Payment() {
    }

    public Payment(Long id, String paymentTerm, Double amount, String dueDate, String paymentDescription,
            Long contract_id) {
        this.id = id;
        this.paymentTerm = paymentTerm;
        this.amount = amount;
        this.dueDate = dueDate;
        this.paymentDescription = paymentDescription;
        this.contract_id = contract_id;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaymentTerm() {
        return paymentTerm;
    }

    public void setPaymentTerm(String paymentTerm) {
        this.paymentTerm = paymentTerm;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getPaymentDescription() {
        return paymentDescription;
    }

    public void setPaymentDescription(String paymentDescription) {
        this.paymentDescription = paymentDescription;
    }

    public Long getContract_id() {
        return contract_id;
    }

    public void setContract_id(Long contract_id) {
        this.contract_id = contract_id;
    }

}
