import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LocalStorageService } from 'ngx-webstorage';
import { Roles } from 'src/app/Admin/payloads/roles_payload';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { services } from 'src/app/Maker/Payloads/services';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multi-dropdown-service',
  templateUrl: './multi-dropdown-service.component.html',
  styleUrls: ['./multi-dropdown-service.component.css']
})
export class MultiDropdownServiceComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  //drop down select or subject
  dropdownList: any[] = []
  ServiceselectedItems: any[] = []
  dropdownSettings: IDropdownSettings = {}

  constructor(private formBuilder: FormBuilder,
    private makerService: MakerService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute

  ) { }
  ngOnInit() {
    let tmp: any[] = []
    // this.authService.getAllSubjects().subscribe(
    //   (subjects: Array<SubjectPayload>) => {
    //     for (let i = 0; i < subjects.length; i++) {
    //       tmp.push({ id: subjects[i].id, name: subjects[i].name })
    //     }
    //     this.dropdownList = tmp
    //   },
    //   (err: any) => {
    //     console.log('Error Response: ' + err)
    //   },
    // )

    this.makerService.getAllService().subscribe(
      (services: Array<services>) => {
        if (services != null) {
          for (let i = 0; i < services.length; i++) {
            tmp.push({ id: services[i].id, name: services[i].name })
          }
          this.dropdownList = tmp
          console.log("temp: " + JSON.stringify(tmp, null, 3))
          console.log("dropdownList: " + JSON.stringify(this.dropdownList, null, 3))
        } else {
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Permission',
          //   text: 'You are not permitted to perform this action!',
          // });
        }
      },

      (error) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  // ========================================================
                  this.makerService.getAllService().subscribe(
                    (services: Array<services>) => {
                      if (data != null) {
                        for (let i = 0; i < services.length; i++) {
                          if(services[i].status!='0')
                          tmp.push({ id: services[i].id, name: services[i].name })
                        }
                        this.dropdownList = tmp
                        console.log("temp:= " + JSON.stringify(tmp, null, 3))
                        console.log("dropdownList: " + JSON.stringify(this.dropdownList, null, 3));
                      } else {
                        // Swal.fire({
                        //   icon: 'error',
                        //   title: 'Permission',
                        //   text: 'You are not permitted to perform this action!',
                        // });
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
                  // ========================================================
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

    this.ServiceselectedItems = []
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    }
  }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
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

  onItemSelect(item: any) { 
    
  }
  onSelectAll(items: any) { }

}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
