import { Component, OnInit } from '@angular/core';
import { RegisterBody, UserRegisterBody } from "../../../requests/user-register-body";
import { ApiService } from "../../../services/api/api.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { LocalStorageService } from "angular-web-storage";
import { LoginService } from "../../../services/login/login.service";
import { fakeAsync } from "@angular/core/testing";
import { LoginBody } from "../../../requests/login-body";
import { CommonService } from "../../../services/common/common.service";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { ActivatedRoute, Router } from "@angular/router";
import { del } from "selenium-webdriver/http";
declare var $: any;
import * as js from 'src/assets/js/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerBody = new UserRegisterBody();
  loginBody = new LoginBody();
  signUpBody = new RegisterBody();
  isCheckoutWithoutLogin = false;
  password: string;
  baseUrl: string;
  flags = {
    isRegister: false,
    isOtpSent: false,
    isOtpVerified: false
  };
  fnameError: string;
  emailError: string;
  tellError: string;
  passwordError: string;
  checkemail: boolean;
  getLocationDetail: any;
  constructor(
    private api: ApiService,
    private toaster: ToastrManager,
    private localStorage: LocalStorageService,
    private loginService: LoginService,
    private common: CommonService,
    private observable: ObservableService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    js.enterOnlyNum();
    this.observable.getIsCheckoutWithoutLogin().subscribe((value: boolean) => {
      this.isCheckoutWithoutLogin = value;
    });
    this.activatedRoute.params.subscribe((response: any) => {
      this.baseUrl = location.hash.replace('#/', '').split('/')[0] + '/' + response.mobUrl;
      this.baseUrl = location.pathname.replace('/', '').split('/')[0] + '/' + response.mobUrl;
      // this.baseUrl = response.mobUrl;
    });
    this.loginBody.data = { username: '', password: '', isBMPortal: 1 };
    this.signUpBody.tId = this.localStorage.get('BM_tId');
    this.signUpBody.data = { password: '', checkOTP: 1, locname: '', customerData: { fName: '',lName:'', cell: '', mName: '', eMail: '', tel: '', mobileOptIn: 1, otp: '' } };
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');

  }
  signIn() {
    $.fancybox.close();
    document.getElementById('openLoginModalBtn').click();
  }
  sendOtp() {
    if (!this.signUpBody.data.customerData.fName) return this.fnameError = 'Enter Your First Name';
    if (!this.signUpBody.data.customerData.lName) return this.fnameError = 'Enter Your Last Name';
    if (!this.signUpBody.data.customerData.eMail) return this.emailError = 'Enter Your Email';
    if (!this.signUpBody.data.customerData.tel) return this.tellError = 'Enter Your Mobile No';
    if (Number(this.signUpBody.data.customerData.tel.length) < 10) return this.toaster.errorToastr('Enter Mobile No Minmum 10 Digits');
    if (!this.password) return this.passwordError = 'Enter Password';
    if (this.password.length <= 7) return this.error('Enter password minimum 8 digit')
    this.checkemail = this.confirmEmail(this.signUpBody.data.customerData.eMail);
    if (this.checkemail == false) {
      return this.toaster.errorToastr('Enter Correct Email')
    }
    delete this.signUpBody.data.customerData.otp;
    delete this.signUpBody.data.customerData.mobileOptIn;
    delete this.signUpBody.data.password;
    this.signUpBody.tId = this.localStorage.get('BM_tId');
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');
    this.signUpBody.data.locname = this.getLocationDetail.Name;
    this.flags.isRegister = true;
    this.api.sendSignUpOtp(this.signUpBody).subscribe((response: any) => {
      this.flags.isRegister = false;
      if (response.serviceStatus != 'S') return;
      this.flags.isOtpSent = true;
      this.toaster.successToastr('Otp sent successfully!');

      //     $('#registerModal .fancybox-button.fancybox-close-small').click(function () {

      // this.flags.isOtpSent = false;
      //           })
    });
  }
  goback() {
    this.flags.isOtpSent = false;
  }

  ResendsendOtp() {

    const data = { tId: this.localStorage.get('BM_tId'), data: { customerData: { fName: this.signUpBody.data.customerData.fName,lName: this.signUpBody.data.customerData.lName, cell: '', mName: '', email: this.signUpBody.data.customerData.eMail, tel: this.signUpBody.data.customerData.tel } } }
    this.api.sendSignUpOtp(data).subscribe((response: any) => {
      if (response.serviceStatus != 'S') return;
      this.success('OTP has been resent.');
    })
  }

  verify() {
    if (!this.signUpBody.data.customerData.otp) return this.toaster.errorToastr('Please enter otp first.');
    this.flags.isOtpVerified = true;
    this.signUpBody.data.password = this.password;
    this.signUpBody.data.customerData.mobileOptIn = 1;


    this.api.newUserSignUpRest(this.signUpBody).subscribe((response: any) => {
      this.flags.isOtpVerified = false;
      if (response.serviceStatus != 'S') return;
      this.loginBody.data = { username: this.signUpBody.data.customerData.eMail, password: this.signUpBody.data.password, isBMPortal: 1 };
      this.signUpBody = new RegisterBody();
      this.login();
    })
  }
  login() {
    this.loginBody.tId = this.common.loginToken;
    this.api.newRestLogin(this.loginBody).subscribe((response: any) => {
      if (response.serviceStatus != 'S') {
        return this.error(response.message);
      }
      this.localStorage.set('BM_LoginBody', this.loginBody);
      this.localStorage.set('BM_USER', response.data);
      this.loginService.setVal(true);
      this.loginService.setUser(response.data);
      if (this.isCheckoutWithoutLogin) {
        this.router.navigateByUrl(`/${this.baseUrl}/checkout`);
      }
      $.fancybox.close();
      location.reload();
    })
  }
  confirmEmail(email) {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
    if (!pattern.test(email)) {
      return false;
    }
    else {
      return true;
    }
  }
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

  success = (message: string) => {
    this.toaster.successToastr(message);
  }

}
