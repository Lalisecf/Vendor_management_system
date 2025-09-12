export class PaymentHistory {
    payment_id!: any;
    name!: string;
    phone_number!: string;
    email!: string;
    website!: string;
    location!: string;
    address!: string;
    vendor_registration_date!: string;
    bank_name!: string;
    branch_name!: string;
    account_name!: string;
    account_number!: string;
    swift_code!: string;
    beneficiary_address!: string;
    iban!: string;
    history_id!: number | null;

    contract_title!: string;
    contract_type!: string;
    directorate!: string;
    start_date!: string;
    end_date!: string;
    total_amount!: number;

    currency!: string;
    vat!: string;
    sla!: string;
    bond_amount!: number;
    bond_expiry_date!: string;
    issuer_bank!: string;

    vendor_availability!: string;
    vendor_status!: string;
    contract_availability!: string;
    contract_status!: string;
    amount!: number;
    paid_amount!: number;
    paymentDescription!: string;
    paymentTerm!: string;
    reason!: string;
    dueDate!: Date | string | null;
    paidDate!: Date | string | null;
    initait_by!: string;
    approved_by!: string;
    director!: string;
    chief!: string;
    finance!: string;
    initaited_date!: Date | string | null;
    manager_action_date!: Date | string | null;
    director_action_date!: Date | string | null;
    chief_action_date!: Date | string | null;
    finance_action_date!: Date | string | null;
    addendum!: boolean;
    payement_status!: string;
}