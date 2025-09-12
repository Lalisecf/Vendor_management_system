import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ManagerService } from '../../Services/manager.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { AuthService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-payment-work-flow',
  templateUrl: './payment-work-flow.component.html',
  styleUrls: ['./payment-work-flow.component.css']
})
export class PaymentWorkFlowComponent implements OnInit {
  @ViewChild('SwalSessionExpired') public readonly SwalSessionExpired!: SwalComponent;

  dtOptions: any;
  isLoading: boolean = false;

  constructor(
    private managerService: ManagerService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private renderer: Renderer2,
    public localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.initializeDataTable();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('payment-template')) {
        const paymentId = event.target.getAttribute('payment-template');
        this.showPaymentDetails(paymentId);
      }
    });
  }

  initializeDataTable(): void {
    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: true,
      lengthChange: true,
      ordering: true,
      paging: true,
      search: true,
      pageLength: 10,
      select: false,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'print'
      ],
      ajax: (dataTablesParameters: any, callback: any) => {
        this.isLoading = true;
        this.managerService.getPaymentHistory().subscribe(
          (resp: any) => {
            this.isLoading = false;
            if (resp != null) {
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp,
              });
            } else {
              Swal.fire('Error', 'No data available', 'error');
            }
          },
          (error: any) => {
            this.isLoading = false;
            this.handleDataTableError(error, callback);
          }
        );
      },
      columns: [
        {
          title: "Vendor",
          data: 'name',
          width: '300px', // Set a fixed width for the column
          render: (data: any, type: any, full: any) => `
            <div class="d-flex align-items-start"> <!-- Changed to align-items-start -->
              <div class="avatar-sm me-2 flex-shrink-0"> <!-- Added flex-shrink-0 -->
                <div class="avatar-title bg-light rounded-circle text-primary">
                  ${full.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div class="flex-grow-1" style="min-width: 0;"> <!-- Added min-width: 0 for text wrapping -->
                <h6 class="mb-0 text-primary">${full.name}</h6>
                <small class="text-muted d-block text-wrap"> <!-- Added text-wrap -->
                  ${full.contract_title}
                </small>
              </div>
            </div>
          `,
          createdCell: (td: any) => {
            // Ensure the cell content wraps properly
            td.style.whiteSpace = 'normal';
            td.style.wordWrap = 'break-word';
          }
        },
        {
          title: "Payment Details",
          data: null,
          width: '300px', // Set a fixed width for the column
          render: (data: any, type: any, full: any) => `
            <div class="d-flex align-items-start"> <!-- Changed to align-items-start -->
              <div class="flex-grow-1" style="min-width: 0;"> <!-- Added min-width: 0 for text wrapping -->
                <h6 class="mb-0 text-primary">${full.paymentTerm}</h6>
                <small class="text-muted d-block text-wrap"> <!-- Added text-wrap -->
                  ${full.paymentDescription}
                </small>
              </div>
            </div>
          `,
        },
        {
          title: "Amounts",
          data: null,
          render: (data: any, type: any, full: any) => `
            <div>
              <div class="fw-bold text-primary">Scheduled: ${this.formatCurrency(full.amount)} ${full.currency}</div>
              <div class="text-success">Paid: ${this.formatCurrency(full.paid_amount || 0)} ${full.currency}</div>
            </div>
          `
        },
        {
          title: "Status",
          data: null,
          render: (data: any, type: any, full: any) => `
            <div class="d-flex align-items-center">
              ${this.getStatusBadge(full.payement_status)}
              <div class="ms-2">
                <small class="text-muted d-block">${full.dueDate ? 'Due: ' + full.dueDate : ''}</small>
              </div>
            </div>
          `
        },
        {
          title: "Actions",
          data: null,
          render: (data: any, type: any, full: any) => `
            <button class="btn btn-sm btn-outline-primary" payment-template="${full.payment_id}">
              <i class="mdi mdi-eye-outline me-1"></i> View
            </button>
          `
        }
      ],
      responsive: true,
      stateSave: true,
      language: {
        emptyTable: 'No payments found',
        loadingRecords: 'Loading...',
        processing: 'Processing...'
      },
      initComplete: () => {
        this.isLoading = false;
      }
    };
  }

  showPaymentDetails(paymentId: string): void {
    this.isLoading = true;
    this.managerService.getPaymentHistory().subscribe(
      (payments: any[]) => {
        this.isLoading = false;
        const payment = payments.find(p => p.payment_id === paymentId);
        if (payment) {
          this.displayPaymentDetails(payment);
        } else {
          Swal.fire('Error', 'Payment details not found', 'error');
        }
      },
      error => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load payment details', 'error');
      }
    );
  }

  displayPaymentDetails(payment: any): void {
    const formattedAmount = this.formatCurrency(payment.amount);
    const formattedPaidAmount = this.formatCurrency(payment.paid_amount || 0);
    const formattedTotalAmount = this.formatCurrency(payment.total_amount);
    const formattedBondAmount = this.formatCurrency(payment.bond_amount);
    const currency=payment.currency;

    Swal.fire({
      title: `<h4 class="text-primary"><i class="mdi mdi-file-document-outline me-2"></i> Payment Details</h4>`,
      html: `
        <div class="container-fluid p-0">
          <!-- Header with payment summary -->
          <div class="row mb-4">
            <div class="col-12">
              <div class="p-3 bg-light rounded">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="mb-1">${payment.contract_title}</h5>
                    <p class="mb-0 text-muted">${payment.paymentTerm}</p>
                  </div>
                  <div class="text-end">
                    <span class="badge ${payment.addendum ? 'bg-info' : 'bg-primary'} fs-6">
                      ${payment.addendum ? 'Addendum Payment' : 'Regular Payment'}
                    </span>
                    <p class="mb-0 text-muted">ID: ${payment.payment_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3">
            <!-- Vendor Information -->
            <div class="col-lg-6">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-transparent border-bottom">
                  <h5 class="mb-0"><i class="mdi mdi-account-tie-outline me-2 text-primary"></i>Vendor Information</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Name</span>
                      <span>${payment.name}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Contact</span>
                      <span>${payment.phone_number}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Email</span>
                      <span>${payment.email}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Address</span>
                      <span class="text-end">${payment.address || 'N/A'}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Bank Details</span>
                      <span class="text-end">
                        ${payment.bank_name}<br>
                        A/C: ${payment.account_number}<br>
                        ${payment.swift_code ? 'SWIFT: ' + payment.swift_code : ''}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Contract Information -->
            <div class="col-lg-6">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-transparent border-bottom">
                  <h5 class="mb-0"><i class="mdi mdi-file-document-outline me-2 text-primary"></i>Contract Information</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Contract Title</span>
                      <span>${payment.contract_title}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Type</span>
                      <span>${payment.contract_type}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Period</span>
                      <span>${payment.start_date} to ${payment.end_date}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Total Amount</span>
                      <span class="text-success">${formattedTotalAmount} ${currency}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Bond Amount</span>
                      <span>${formattedBondAmount} ${currency}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Payment Method</span>
                      <span>${payment.payment_method || 'N/A'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="col-lg-6 mt-3">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-transparent border-bottom">
                  <h5 class="mb-0"><i class="mdi mdi-cash-multiple me-2 text-primary"></i>Payment Information</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Description</span>
                      <span class="text-end">${payment.paymentDescription || 'N/A'}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Scheduled Amount</span>
                      <span class="text-primary fw-bold">${formattedAmount} ${currency}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Paid Amount</span>
                      <span class="text-success fw-bold">${formattedPaidAmount} ${currency}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Due Date</span>
                      <span class="${this.isPaymentOverdue(payment.dueDate) ? 'text-danger' : ''}">
                        ${payment.dueDate || 'N/A'}
                        ${this.isPaymentOverdue(payment.dueDate) ? '<i class="mdi mdi-alert-circle-outline ms-1"></i>' : ''}
                      </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span class="fw-medium">Status</span>
                      <span>${this.getStatusBadge(payment.payement_status)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Approval Workflow -->
            <div class="col-lg-6 mt-3">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-transparent border-bottom">
                  <h5 class="mb-0"><i class="mdi mdi-clipboard-flow me-2 text-primary"></i>Approval Workflow</h5>
                </div>
                <div class="card-body">
                  <div class="timeline">
                    ${this.generateApprovalTimeline(payment)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '90%',
      padding: '2rem',
      customClass: {
        popup: 'border-radius-8',
        title: 'mb-4'
      }
    });
  }

  generateApprovalTimeline(payment: any): string {
    const steps = [
      {
        title: 'Initiated',
        person: payment.initait_by,
        date: payment.initaited_date,
        icon: 'mdi-play-circle-outline',
        color: 'primary'
      },
      {
        title: 'Division Head Approval',
        person: payment.approved_by,
        date: payment.manager_action_date,
        icon: 'mdi-account-check-outline',
        color: payment.approved_by ? 'success' : 'secondary'
      },
      {
        title: 'Director Approval',
        person: payment.director,
        date: payment.director_action_date,
        icon: 'mdi-account-tie-outline',
        color: payment.director ? 'success' : 'secondary'
      },
      {
        title: 'Senior IT Chief Approval',
        person: payment.chief,
        date: payment.chief_action_date,
        icon: 'mdi-account-star-outline',
        color: payment.chief ? 'success' : 'secondary'
      },
      {
        title: 'Finance Approval',
        person: payment.finance,
        date: payment.finance_action_date,
        icon: 'mdi-cash-check',
        color: payment.finance ? 'success' : 'secondary'
      }
    ];

    return steps.map(step => `
      <div class="timeline-item ${step.color}">
        <div class="timeline-item-marker">
          <div class="timeline-item-marker-indicator bg-${step.color}">
            <i class="mdi ${step.icon} text-white"></i>
          </div>
        </div>
        <div class="timeline-item-content">
          <h6 class="mb-1">${step.title}</h6>
          <div class="d-flex justify-content-between">
            <span class="text-muted small">${step.person || 'Pending'}</span>
            <span class="text-muted small">${step.date || ''}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  isPaymentOverdue(dueDate: string): boolean {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  }

  formatCurrency(value: number): string {
    if (!value) return '0.00';
    const num = value.toString().replace(/,/g, '');
    const parts = parseFloat(num).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  getStatusBadge(status: string): string {
    const statusMap: { [key: string]: { class: string, text: string } } = {
      '1': { class: 'warning', text: 'Not Initiated' },
      '2': { class: 'primary', text: 'Under Review' },
      '3': { class: 'danger', text: 'Rejected' },
      '4': { class: 'info', text: 'Director Review' },
      '5': { class: 'primary', text: 'IT Chief Review' },
      '6': { class: 'info', text: 'Finance Review' },
      '7': { class: 'success', text: 'Paid' }
    };

    const statusInfo = statusMap[status] || { class: 'secondary', text: 'Unknown' };
    return `<span class="badge bg-${statusInfo.class}">${statusInfo.text}</span>`;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      '1': 'Not Initiated',
      '2': 'Under Division Head Review',
      '3': 'Rejected',
      '4': 'Under Director Review',
      '5': 'Under Senior IT Chief Review',
      '6': 'Under Finance Review',
      '7': 'Paid'
    };
    return statusMap[status] || 'Unknown';
  }

  handleDataTableError(error: any, callback: any): void {
    if (error.error.text === 'access-token-expired') {
      this.utilService.refreshToken().subscribe(
        (data) => {
          if (data === true) {
            this.managerService.getPaymentHistory().subscribe(
              (resp: any) => {
                if (resp != null) {
                  callback({
                    recordsTotal: resp.recordsTotal,
                    recordsFiltered: resp.recordsFiltered,
                    data: resp,
                  });
                }
              },
              (error: any) => {
                if (error.error.text === 'access-token-expired') {
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              }
            );
          } else {
            this.SwalSessionExpired.fire();
            this._refreshTokenExpired();
          }
        },
        (error: any) => {
          Swal.fire('Error', 'Something went wrong!', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  }

  _refreshTokenExpired(): void {
    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          setTimeout(() => {
            this.router.navigateByUrl('/login');
            this.localStorageService.clear('user');
          }, 3500);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}