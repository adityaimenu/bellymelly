import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../url/url.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private url: UrlService
  ) { }
  login(body: any) {
    return this.http.post(this.url.nodeLoginUrl, body);
  }
  register(body: any) {
    return this.http.post(this.url.registerUrl, body);
  }
  verifyOtp(body: any) {
    return this.http.post(this.url.verifyOtpUrl, body);
  }
  getLocationData(body: any) {
    return this.http.post(this.url.getLocationDataUrl, body);
  }
  getNewToken(body: any) {
    return this.http.post(this.url.getNewTokenUrl, body);
  }
  getMenu(body: any) {
    return this.http.post(this.url.getMenuUrl, body);
  }
  getChainDetail(body: any) {
    return this.http.post(this.url.getChainDetailsUrl, body);
  }
  loginRest(body: any) {
    return this.http.post(this.url.restLogin, body);
  }
  orderPlace(body: any) {
    return this.http.post(this.url.orderPlaceUrl, body);
  }
  addUserAddress(body: any) {
    return this.http.post(this.url.addUserAddressUrl, body);
  }
  restSignUp(body: any) {
    return this.http.post(this.url.restSignUpUrl, body);
  }
  getCouponList(body: any) {
    return this.http.post(this.url.getCouponListUrl, body);
  }
  editUserProfile(body: any) {
    return this.http.post(this.url.editUserProfileUrl, body);
  }
  getUserProfile() {
    return this.http.get(this.url.getUserProfileUrl);
  }
  getOrderInfo(body: any) {
    return this.http.post(this.url.getOrderInfoUrl, body);
  }
  getCurrentLocation() {
    return this.http.get(this.url.getCurrentLocationDetail);
  }
  saveCard(body: any) {
    return this.http.post(this.url.saveCreditCard, body);
  }
  newRestLogin(body: any) {
    return this.http.post(this.url.restLoginNew, body);
  }
  sendSignUpOtp(body: any) {
    return this.http.post(this.url.restSendSignUpOtpUrl, body);
  }
  newUserSignUpRest(body:  any) {
    return this.http.post(this.url.restNewUserSingUp, body);
  }
  getPaytmDetail(body: any) {
    return this.http.post(this.url.getPaytmDetailUrl, body);
  }
  sendOtpForgot(body: any) {
    return this.http.post(this.url.sendOtpForgot, body);
  }
  ResetPassword(body: any) {
    return this.http.post(this.url.ResetPassword, body);
  }
  ResetPassword_OTP(body: any) {
    return this.http.post(this.url.ResetPassword_OTP, body);
  }
  

  CheckAccountExists(body: any) {
    return this.http.post(this.url.CheckAccountExists, body);
  }
  DoFBLogin(body: any) {
    return this.http.post(this.url.DoFBLogin, body);
  }
  CheckGoogleAccountExists(body: any) {
    return this.http.post(this.url.CheckGoogleAccountExists, body);
  }
  DoGoogleLogin(body: any) {
    return this.http.post(this.url.DoGoogleLogin, body);
  }
  loginByCustomerId(body: any) {
    return this.http.post(this.url.loginByCustomerIdUrl, body);
  }


  searchrRestaurants(body) {
    return this.http.post(this.url.searchrRestaurants+`${body}`,body);
  }
  
 
}
