import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Callbacks } from 'jquery';
import { LocalStorageService } from 'ngx-webstorage';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { MakerService } from '../../Services/maker.service';

@Component({
  selector: 'app-view-services',
  templateUrl: './view-services.component.html',
  styleUrls: ['./view-services.component.css']
})
export class ViewServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  dtOptions: any;
  // min!: number;
  // max!: number;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  input_0!: any;
  input_1!: any;
  input_2!: any;
  input_3!: any;
  input_4!: any;
  input_5!: any;
  input_6!: any;
  input_7!: any;


  first_column_id = '0';
  second_column_id = '1';
  third_column_id = '2';
  fourth_column_id = '3';
  fifth_column_id = '4';
  sixth_column_id = '5';
  seventh_column_id = '6';
  eight_column_id = '7';


  first_column_title = '-ID-';
  second_column_title = 'Service Name';
  third_column_title = 'Description';
  fourth_column_title = 'Created Date';
  fifth_column_title = 'Created By';
  sixth_column_title = 'Status';
  seventh_column_title = 'Change Status';
  eight_column_title = 'Action';
  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private service: MakerService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      lengthChange: true,
      ordering: true,
      paging: true,
      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 7,
      select: false,
      // ajax: '../../../../assets/data/data.json',
      ajax: (dataTablesParameters: any, callback: any) => {
        this.service.getAllService().subscribe(
          async (resp: any) => {
            if (resp != null) {
              console.log(
                'response for table: ' + JSON.stringify(resp, null, 2)
              );
              // data: resp
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp,
              });
              console.log(
                'records total: ' + JSON.stringify(resp.recordsTotal)
              );
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Permission',
                text: 'You are not permitted to perform this action!',
              });
            }
          },
          (error: any) => {
            if (error.error.text === 'access-token-expired') {
              console.log('Access-token-expired requesting refresh token...');
              if (
                this.localStorageService.retrieve('refresh_token_requested') ==
                null
              ) {
                this.utilService.refreshToken().subscribe(
                  (data) => {
                    if (data === true) {
                      console.log(
                        'refresh token success re-requesting the actual request'
                      );
                      this.localStorageService.clear('refresh_token_requested');
                      //================================================================================
                      this.service.getAllService().subscribe(
                        async (resp: any) => {
                          if (resp != null) {
                            console.log(
                              'response for table: ' +
                              JSON.stringify(resp, null, 2)
                            );
                            // data: resp
                            callback({
                              recordsTotal: resp.recordsTotal,
                              recordsFiltered: resp.recordsFiltered,
                              data: resp,
                            });
                            console.log(
                              'records total: ' +
                              JSON.stringify(resp.recordsTotal)
                            );
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Permission',
                              text: 'You are not permitted to perform this action!',
                            });
                          }
                        },
                        (error: any) => {
                          if (error.error.text === 'access-token-expired') {
                            console.log('refresh token expired.');
                            this.SwalSessionExpired.fire();
                            this._refreshTokenExpired();
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!',
                            });
                            console.log(
                              JSON.stringify(error.error.apierror, null, 2)
                            );
                          }
                        }
                      );
                      //================================================================================
                    } else {
                      console.log('refresh token expired.');
                      this.SwalSessionExpired.fire();
                      this._refreshTokenExpired();
                    }
                  },
                  (error: any) => {
                    console.log('error refreshing access token');
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                    });
                    console.log(JSON.stringify(error.error.apierror, null, 2));
                  }
                );
                this.localStorageService.store('refresh_token_requested', true);
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              });
              console.log(JSON.stringify(error.error.apierror, null, 2));
            }
          }
        );
      },
      columns: [
        {
          title: this.first_column_title,
          render: function (data: any, type: any, full: any) {
            return   'Serv'+full.id
          }
        },
        {
          title: this.second_column_title,
          data: 'name',
        },
        {
          title: this.third_column_title,
          data: 'description',
        },
        {
          title: this.fourth_column_title,
          data: 'created_date',
        },
        {
          title: this.fifth_column_title,
          data: 'created_by',
        },
        {
          title: this.sixth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 1)
              return '<span class="badge bg-success rounded-pill">Active</span>';
            else
              return '<span class="badge bg-danger rounded-pill">Inactive</span>';
          },
        },
        {
          title: this.seventh_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.status == 1)
              return (
                '<button class="btn btn-outline-danger btn-sm"  ' +
                'deactivate-service-name="' +
                full.name +
                '" deactivate-service="' +
                full.id +
                '"><i class="mdi mdi-window-close mr-1"></i>Deactivate</button>'
              );

            return (
              '<button class="btn btn-outline-success btn-sm"  ' +
              'activate-service-name="' +
              full.name +
              '" activate-service="' +
              full.id +
              '"><i class="mdi mdi-check"></i>Activate</button>'
            );
            // <button type="button" class="btn btn-warning"><i class="mdi mdi-wrench"></i> </button>
          },
        },

        {
          title: this.eight_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            return (
              '<i class="mdi mdi-18px mdi-pencil text-secondary" style="cursor: pointer;" edit-service="' +
              full.id +
              '"></i>' +
              '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
              'service-name="' +
              full.name +
              '" delete-service="' +
              full.id +
              '"></i>'
            );
          },
        },
      ],
      dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },
      buttons: {
        buttons: [
          'colvis',
          ,
          {
            extend: 'fixedColumns',
            text: 'FixedColumns',
            config: {
              left: 1,
            },
          },
          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
              // alert('reload success');
            },
          },
          {
            extend: 'copy',
            text: '<u>C</u>opy',
            key: {
              key: 'c',
              altKey: true,
            },
          },
          'print',
          {
            extend: 'pdf',
            text: 'Pdf',
          },
          {
            extend: 'pdf',
            text: 'Pdf current page',
            exportOptions: {
              modifier: {
                page: 'current',
              },
            },
          },
          {
            extend: 'excel',
            text: 'Excel',
          },

          {
            extend: 'collection',
            text: 'Header',
            autoClose: true,
            background: true,
            dropup: false,
            collectionTitle: '',
            buttons: [
              {
                text: 'Enable fixed header',
                key: '1',
                action: function (e: any, dt: any, node: any, config: any) {
                  dt.fixedHeader.enable();
                },
              },
              {
                text: 'Disable fixed header',
                key: '1',
                action: function (e: any, dt: any, node: any, config: any) {
                  dt.fixedHeader.disable();
                },
              },
            ],
            fade: true,
          },
        ],
      },

      stateSave: true,
      stateDuration: 0,
      fixedFooter: true,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      // searchPanes: {
      //   initCollapsed: true,
      //   cascadePanes: true,
      //   clear: true,
      // },
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
        //   {
        //     searchPanes: {
        //       show: true,
        //     },
        //     targets: [0, 1, 4, 5, 8],
        //   },
        //   {
        //     searchPanes: {
        //       show: false,
        //     },
        //     targets: [2, 3, 6, 7, 9, 10, 11],
        //   },
      ],
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
    };
    let jsonObj = JSON.parse(
      localStorage.getItem('DataTables_services_table_/admin/services')!
    );
    if (jsonObj != null) {
      console.log(jsonObj.columns);
      var counter: number = 0;
      for (let c of jsonObj.columns) {
        console.log(c.search.search);
        if (counter == 0) {
          this.input_0 = c.search.search;
        } else if (counter == 1) {
          this.input_1 = c.search.search;
        } else if (counter == 2) {
          this.input_2 = c.search.search;
        } else if (counter == 3) {
          this.input_3 = c.search.search;
        } else if (counter == 4) {
          this.input_4 = c.search.search;
        } else if (counter == 5) {
          this.input_5 = c.search.search;
        }
        counter++;
      }
    }
  }

  //FOOTER SEARCH AND BUTTON ON CLICK
  
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        $('input', this.footer()).on('keyup change', function () {
          if (this['id'] != '') {
            if (
              dtInstance.column(this['id']).search() !==
              (this as HTMLInputElement).value
            ) {
              dtInstance
                .column(this['id'])
                .search((this as HTMLInputElement).value)
                .draw();
            }
            console.log('the column is: ' + this['id']);
          }
        });
      });
      dtInstance.on(
        'draw stateRestore-change',
        function (e, settings, details) {
          var c = 0;
          for (let col of settings.aoColumns) {
            if (col.title == that.first_column_title) {
              that.first_column_id = c.toString();
            } else if (col.title == that.second_column_title) {
              that.second_column_id = c.toString();
            } else if (col.title == that.third_column_title) {
              that.third_column_id = c.toString();
            } else if (col.title == that.fourth_column_title) {
              that.fourth_column_id = c.toString();
            } else if (col.title == that.fifth_column_title) {
              that.fifth_column_id = c.toString();
            } else if (col.title == that.sixth_column_title) {
              that.sixth_column_id = c.toString();
            }
            c++;
          }
        }
      );

      dtInstance.on('column-reorder', function (e, settings, details) {
        var c = 0;
        for (let col of settings.aoColumns) {
          if (col.title == that.first_column_title) {
            that.first_column_id = c.toString();
          } else if (col.title == that.second_column_title) {
            that.second_column_id = c.toString();
          } else if (col.title == that.third_column_title) {
            that.third_column_id = c.toString();
          } else if (col.title == that.fourth_column_title) {
            that.fourth_column_id = c.toString();
          } else if (col.title == that.fifth_column_title) {
            that.fifth_column_id = c.toString();
          } else if (col.title == that.sixth_column_title) {
            that.sixth_column_id = c.toString();
          }
          c++;
        }
      });
    });
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('edit-service')) {
        this.router.navigateByUrl(
          'maker/view-services/edit/' + event.target.getAttribute('edit-service')
        );
      } else if (event.target.hasAttribute('delete-service')) {
        var selected_service_name = event.target.getAttribute('service-name');
        Swal.fire({
          title: 'Delete service: ' + selected_service_name,
          text:
            'Are you sure? you are about to delete ' +
            selected_service_name +
            ' from the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {
            const sw = Swal.fire({
              title: 'Please wait !',
              allowOutsideClick: false,
              // timer: 4000,
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: false,
              showDenyButton: false,
              didOpen: () => {
                Swal.showLoading(Swal.getDenyButton()!);
              },
            });
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.service
              .deleteService(event.target.getAttribute('delete-service'))
              .subscribe(
                (data: any) => {
                  this.datatableElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload((data) => {
                        // alert(data);
                        Swal.hideLoading();
                        Swal.close();
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: 'service deleted successfully!',
                        });
                      }, false);
                    }
                  );
                },
                (error: any) => {
                  if (error.error.text === 'access-token-expired') {
                    console.log(
                      'Access-token-expired requesting refresh token...'
                    );
                    if (
                      this.localStorageService.retrieve(
                        'refresh_token_requested'
                      ) == null
                    ) {
                      this.utilService.refreshToken().subscribe(
                        (data) => {
                          if (data === true) {
                            console.log(
                              'refresh token success re-requesting the actual request'
                            );
                            this.localStorageService.clear(
                              'refresh_token_requested'
                            );
                            //================================================================================
                            this.service
                              .deleteService(
                                event.target.getAttribute('delete-service')
                              )
                              .subscribe(
                                (data: any) => {
                                  this.datatableElement.dtInstance.then(
                                    (dtInstance: DataTables.Api) => {
                                      dtInstance.ajax.reload((data) => {
                                        // alert(data);
                                        Swal.hideLoading();
                                        Swal.close();
                                        Swal.fire({
                                          icon: 'success',
                                          title: 'Success',
                                          text: 'service deleted successfully!',
                                        });
                                      }, false);
                                    }
                                  );
                                },
                                (error: any) => {
                                  if (
                                    error.error.text === 'access-token-expired'
                                  ) {
                                    console.log('refresh token expired.');
                                    this.SwalSessionExpired.fire();
                                    this._refreshTokenExpired();
                                  } else {
                                    Swal.fire({
                                      icon: 'error',
                                      title: 'Oops...',
                                      text: 'Something went wrong!',
                                    });
                                    console.log(
                                      JSON.stringify(
                                        error.error.apierror,
                                        null,
                                        2
                                      )
                                    );
                                  }
                                }
                              );
                            //================================================================================
                          } else {
                            console.log('refresh token expired.');
                            this.SwalSessionExpired.fire();
                            this._refreshTokenExpired();
                          }
                        },
                        (error: any) => {
                          console.log('error refreshing access token');
                          Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                          });
                          console.log(
                            JSON.stringify(error.error.apierror, null, 2)
                          );
                        }
                      );
                      this.localStorageService.store(
                        'refresh_token_requested',
                        true
                      );
                    }
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                    });
                    console.log(JSON.stringify(error.error.apierror, null, 2));
                  }
                }
              );
            console.log(
              'delete-service: ' + event.target.getAttribute('delete-service')
            );
          }
        });
      } else if (event.target.hasAttribute('activate-service')) {
        var service_name = event.target.getAttribute('activate-service-name');
        var service_id = event.target.getAttribute('activate-service');
        Swal.fire({
          title: 'Activate service: ' + service_name,
          text:
            'Are you sure? you are about to activate ' +
            service_name +
            '.This means the service will be allowed to use the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Activate',
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.service.activateService(service_id).subscribe(
              (data) => {
                if (data) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Activated!',
                  });
                  this.datatableElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    }
                  );
                  // this.datatableElement.dtInstance.then()
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Permission',
                    text: 'You are not permitted to perform this action!',
                  });
                }
              },
              (error) => {
                if (error.error.text === 'access-token-expired') {
                  console.log(
                    'Access-token-expired requesting refresh token...'
                  );
                  if (
                    this.localStorageService.retrieve(
                      'refresh_token_requested'
                    ) == null
                  ) {
                    this.utilService.refreshToken().subscribe(
                      (data) => {
                        if (data === true) {
                          console.log(
                            'refresh token success re-requesting the actual request'
                          );
                          this.localStorageService.clear(
                            'refresh_token_requested'
                          );
                          //================================================================================
                          this.service.activateService(service_id).subscribe(
                            (data) => {
                              if (data) {
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Success',
                                  text: 'Successfully Activated!',
                                });
                                this.datatableElement.dtInstance.then(
                                  (dtInstance: DataTables.Api) => {
                                    dtInstance.ajax.reload();
                                  }
                                );
                                // this.datatableElement.dtInstance.then()
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Permission',
                                  text: 'You are not permitted to perform this action!',
                                });
                              }
                            },
                            (error) => {
                              if (error.error.text === 'access-token-expired') {
                                console.log('refresh token expired.');
                                this.SwalSessionExpired.fire();
                                this._refreshTokenExpired();
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Oops...',
                                  text: 'Something went wrong!',
                                });
                                console.log(
                                  JSON.stringify(error.error.apierror, null, 2)
                                );
                              }
                            }
                          );
                          //================================================================================
                        } else {
                          console.log('refresh token expired.');
                          this.SwalSessionExpired.fire();
                          this._refreshTokenExpired();
                        }
                      },
                      (error: any) => {
                        console.log('error refreshing access token');
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    );
                    this.localStorageService.store(
                      'refresh_token_requested',
                      true
                    );
                  }
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  });
                  console.log(JSON.stringify(error.error.apierror, null, 2));
                }
              }
            );
          }
        });
      } else if (event.target.hasAttribute('deactivate-service')) {
        var service_name = event.target.getAttribute('deactivate-service-name');
        var service_id = event.target.getAttribute('deactivate-service');
        Swal.fire({
          title: 'Deactivate service: ' + service_name,
          text:
            'Are you sure? you are about to deactivate ' +
            service_name +
            '. This means the service will be prevented from using the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Deactivate',
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.service.deactivateService(service_id).subscribe(
              (data) => {
                if (data == true) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Deactivated!',
                  });
                  this.datatableElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    }
                  );
                  // this.datatableElement.dtInstance.then()
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Permission',
                    text: 'You are not permitted to perform this action!',
                  });
                }
              },
              (error) => {
                if (error.error.text === 'access-token-expired') {
                  console.log(
                    'Access-token-expired requesting refresh token...'
                  );
                  if (
                    this.localStorageService.retrieve(
                      'refresh_token_requested'
                    ) == null
                  ) {
                    this.utilService.refreshToken().subscribe(
                      (data) => {
                        if (data === true) {
                          console.log(
                            'refresh token success re-requesting the actual request'
                          );
                          this.localStorageService.clear(
                            'refresh_token_requested'
                          );
                          //================================================================================
                          this.service.deactivateService(service_id).subscribe(
                            (data) => {
                              if (data == true) {
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Success',
                                  text: 'Successfully Deactivated!',
                                });
                                this.datatableElement.dtInstance.then(
                                  (dtInstance: DataTables.Api) => {
                                    dtInstance.ajax.reload();
                                  }
                                );
                                // this.datatableElement.dtInstance.then()
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Permission',
                                  text: 'You are not permitted to perform this action!',
                                });
                              }
                            },
                            (error) => {
                              if (error.error.text === 'access-token-expired') {
                                console.log('refresh token expired.');
                                this.SwalSessionExpired.fire();
                                this._refreshTokenExpired();
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Oops...',
                                  text: 'Something went wrong!',
                                });
                                console.log(
                                  JSON.stringify(error.error.apierror, null, 2)
                                );
                              }
                            }
                          );
                          //================================================================================
                        } else {
                          console.log('refresh token expired.');
                          this.SwalSessionExpired.fire();
                          this._refreshTokenExpired();
                        }
                      },
                      (error: any) => {
                        console.log('error refreshing access token');
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    );
                    this.localStorageService.store(
                      'refresh_token_requested',
                      true
                    );
                  }
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  });
                  console.log(JSON.stringify(error.error.apierror, null, 2));
                }
              }
            );
          }
        });
      }
    });
  }
  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }

  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
      console.log(dtInstance)
    );
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('service');
          this.localStorageService.clear('roles');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        console.log(
          'Error: ' + JSON.stringify(error.error.apierror.message, null, 2)
        );
      }
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

