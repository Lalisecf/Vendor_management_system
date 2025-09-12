import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LocalStorageService } from 'ngx-webstorage';
import { Product } from 'src/app/Maker/Payloads/product';
import { MakerService } from 'src/app/Maker/Services/maker.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multi-dropdown-product',
  templateUrl: './multi-dropdown-product.component.html',
  styleUrls: ['./multi-dropdown-product.component.css']
})
export class MultiDropdownProductComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  //drop down select or subject
  dropdownList: any[] = []
  ProductselectedItems: any[] = []
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

    this.makerService.getAllProducts().subscribe(
      (products: Array<Product>) => {
        if (products != null) {
          for (let i = 0; i < products.length; i++) {
            if(products[i].status!='0')
            tmp.push({ id: products[i].id, name: products[i].name })
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
                  this.makerService.getAllProducts().subscribe(
                    (products: Array<Product>) => {
                      if (data != null) {
                        for (let i = 0; i < products.length; i++) {
                          tmp.push({ id: products[i].id, name: products[i].name })
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

    this.ProductselectedItems = []
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
