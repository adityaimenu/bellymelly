import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  baseUrlOne = `http://13.234.241.183:3000/api`;
  // baseUrlTwoInd = `https://orders.bellymelly.com/proxy`;
  baseUrlTwoInd =`https://bellymelly.com/proxyindia`;

  baseUrlTwoUs = `https://bellymelly.com`; 

  baseUrlTwoAustralia = `https://bellymelly.com`;

  // baseUrlTwoUs = `http://staging.m4.imenu360.com/proxyapimodule`;
  // baseUrlTwoUs = `https://orders.imenu360.us`;


  restaurantsUrl=  `https://bellymelly.com`;

  baseUrlThree = `https://orders.bellymelly.com`;
  imageUrl = `https://s3.amazonaws.com/v1.0/`;
  bellyMellyUrl = '';
      
  constructor() { }
  nodeLoginUrl = `${this.baseUrlOne}/user/signIn`;
  registerUrl = `${this.baseUrlOne}/user/signUp`;
  verifyOtpUrl = `${this.baseUrlOne}/user/verifyOtp`;
  getUserProfileUrl = `${this.baseUrlOne}/user/getUserProfile`;
  editUserProfileUrl = `${this.baseUrlOne}/user/editUserProfile`;
  getLocationDataUrl = `${this.bellyMellyUrl}/GetLocationdetails.imsvc`;
  getNewTokenUrl = `${this.bellyMellyUrl}/GetNewToken.imsvc`;
  getMenuUrl = `${this.bellyMellyUrl}/GetMenuDetail.imsvc`;
  getChainDetailsUrl = `${this.bellyMellyUrl}/GetChainDetails.imsvc`;
  restLogin = `${this.bellyMellyUrl}/DoLogin.imsvc`;
  restLoginNew = `${this.bellyMellyUrl}/DoLogin_App.imsvc`;
  restSendSignUpOtpUrl = `${this.bellyMellyUrl}/SendSignupOTP.imsvc`;
  restNewUserSingUp = `${this.bellyMellyUrl}/NewUser.imsvc`;
  restSignUpUrl = `${this.bellyMellyUrl}/NewUser.imsvc`;
  orderPlaceUrl = `${this.bellyMellyUrl}/SetOrder.imsvc`;
  addUserAddressUrl = `${this.bellyMellyUrl}/SetUserAddress.imsvc`;
  getCouponListUrl = `${this.bellyMellyUrl}/GetUserCoupons.imsvc`;
  getOrderInfoUrl = `${this.bellyMellyUrl}/GetOrderInfo.imsvc`;
  getCurrentLocationDetail = `https://ipapi.co/json/`;
  saveCreditCard = `${this.bellyMellyUrl}/SaveCreditCardInfo.imsvc`;
  getPaytmDetailUrl = `${this.bellyMellyUrl}/SetTempOrder.imsvc`;
  sendOtpForgot = `${this.bellyMellyUrl}/SendForgetPasswordOTP.imsvc`;
  ResetPassword = `${this.bellyMellyUrl}/ResetPassword.imsvc`;
  ResetPassword_OTP = `${this.bellyMellyUrl}/ResetPassword_OTP.imsvc`;

  
  CheckAccountExists = `${this.bellyMellyUrl}/CheckAccountExists.imsvc`;
  DoFBLogin = `${this.bellyMellyUrl}/DoFBLogin.imsvc`;
  CheckGoogleAccountExists = `${this.bellyMellyUrl}/CheckGoogleAccountExists.imsvc`;
  DoGoogleLogin = `${this.bellyMellyUrl}/DoGoogleLogin.imsvc`;
  loginByCustomerIdUrl = `${this.bellyMellyUrl}/DoLoginByCustId.imsvc`;

  searchrRestaurants = `${this.restaurantsUrl}/AjaxServer_Location.aspx?Action=`
  

  
}
