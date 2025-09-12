import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';
import { LocalStorageService } from 'ngx-webstorage';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Photo } from '../../payload/photo';
import { UserPayload } from 'src/app/Admin/payloads/user_payload';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { phoneNumberValidator } from 'src/app/Admin/validators/phone_number_validator';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent    implements OnInit {
  submitUserDetailtForm!:FormGroup;
  image!: string;
  imgs!: any;
  uu!: any;
  hh:any;
  magnification!: number;
  myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  ngOnInit(): void {
    this.oninit = true;
    this.UserDetail();
    this.getphoto()
   // this.getPhotoo()
   this.hh="./assets/template_assets/images/image_1.jfif";

  }
  //-----------------------------
  private trigger: Subject<any> = new Subject();
  public webcamImage!: any;
  private nextWebcam: Subject<any> = new Subject();
  photoUrl: any; // the url of the photo to display
  sysImage = '';
  submitted: boolean = false;
  captured: boolean = false;
  uploaded: boolean = false;
  oninit: boolean = false;
  showImage: boolean = false;
  DefualtPhoto: Boolean = false;
  bgc: any;
  url: any;
  hhh: any;
  heights: any = 200;
  widths: any = 200;
  pp: Photo = new Photo();
  sample = new Photo();
  user:UserPayload=new UserPayload();
  snapshot: any;
  constructor(
    // private formBuilder: FormBuilder,
    // private adminService: AdminService,
    private authService: AuthService,
    // private utilService: UtilService,
    private router: Router,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute ,
    private http: HttpClient, private sanitizer: DomSanitizer
  ) { 


    this.user = {
      id: 0,
      firstname:"",
      middlename:"",
      lastname:"",
      gender:"",
      email:"",
      phonenumber:"",
      reg_date:"",
      role:"",
      status:"",
      availability:"",
      online:"",
      action_date:""

      // files: [],
    };
    this.submitUserDetailtForm = this.formBuilder.group(
      {
        firstname: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        middlename: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        lastname: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        gender: new FormControl('Male'),
        email: new FormControl('', [
          Validators.required,
          Validators.maxLength(320),
          Validators.email,
        ]),
        phonenumber: new FormControl('', [Validators.required]),
        // role: new FormControl('', [Validators.required]),
      }, 
      { validators: phoneNumberValidator.MatchValidator }
      );
  }
  capture() {
    this.captured = true;
    this.uploaded = false;
    this.oninit = false;
  }
  uploade() {
    this.uploaded = true;
    this.captured = false;
    this.oninit = false;
  }

  public getSnapshot(): void {
    this.hhh = this.trigger.next(void 0);


  }
  public captureImg(webcamImage: WebcamImage): void {

    this.showImage = true;
    this.webcamImage = webcamImage.imageAsDataUrl;
    console.log("capture image:" + this.webcamImage)
    this.url = webcamImage!.imageAsDataUrl;

  }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  onFolderSelected(event: any) {
    this.showImage = true
    this.webcamImage = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.url = reader.result;
      this.webcamImage=this.url;
      console.log("'''''''''''''''''" + this.url)
    }
  }
  height(event: any) {
    console.log("height:" + this.heights);
    this.heights = event.target.value;
    console.log("height:" + this.heights);
  }
  width(event: any) {
    this.widths = event.target.value;
    console.log("widths:" + this.widths);
  }

  UpdateUserDetail()
  {
    if (
      this.submitUserDetailtForm.valid 
    ) {
      this.user = this.submitUserDetailtForm.value;
      this.submitted=true;
      this.authService.update_user_detail( this.user).subscribe(
        async (data: any) => {
          if (data == true) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Updated successfully',
            });
            window.location.reload();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error happen',
              text: 'Something went wrong!',
            });
          }
        },
        (error) => {
        }
      );
      
    }
  }
  onsubmit() {
    const base64String = this.webcamImage.split(',')[1];
    this.webcamImage = base64String;

    this.authService.capture( this.webcamImage).subscribe(
      async (data: any) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Submited successfully',
          });
          window.location.reload();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error happen',
            text: 'Something went wrong!',
          });
        }
      },
      (error) => {
      }
    );


  }

  getphoto() {
    this.authService.photo().subscribe(
      async (data: any) => {
        if(data==null)
        {
          this.DefualtPhoto=true;
        }
        else
        this.DefualtPhoto=false;
        console.log("photoooooo:"+JSON.stringify(data, null, 2))
        this.pp = data;
        this.url = 'data:image/jpeg;base64,'+this. pp.photo;

        console.log("photo is" + this.url);
      },
      (error) => {
      }
    );

  }
  UserDetail() {
    this.authService.detail().subscribe(
      async (data: any) => {
        this.user=data;

      },
      (error) => {
      }
    );

  }
  
  zoomChange(zoom: any) {
    if (zoom > 1) {
    // zoom out by setting magnification to 1
    this.magnification = 1;
    }
    }
    zoomout() {
   
      this.heights=300;
      this.widths=300;
      }

}

