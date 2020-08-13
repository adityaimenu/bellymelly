import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../services/api/api.service";
import {LocalStorageService} from "angular-web-storage";
import {ToastrManager} from "ng6-toastr-notifications";
import {RestLoginBody} from "../../../requests/rest-login-body";
import {LoginService} from "../../../services/login/login.service";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {UpdateProfileData, UpdateUserProfileBody} from "../../../requests/update-user-profile-body";
import {OrderDataDetail, PlaceOrderBody} from "../../../requests/place-order-body";
import {CommonService} from "../../../services/common/common.service";
import {UrlService} from "../../../services/url/url.service";
import { GetCouponListBody } from 'src/app/requests/get-coupon-list-body';
import * as _ from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  Math = Math;
  restLoginBody = new RestLoginBody();
  updateUserForm: FormGroup;
  getCouponListBody = new GetCouponListBody();
  tId: string;
  restUser: any;
  user: any;
  history =  window.history;
  addressList: Array<any> = [];
  orderHistory: Array<any> = [];
  couponList: Array<any> = [];
  cardList: Array<any> = [];
  updateBody = new UpdateProfileData();
  updateProfileBody = new UpdateUserProfileBody();
  getOrderInfoBody = {tId: '', data: {orderId: 0}};
  placeOrderBody = new PlaceOrderBody();
  orderData = new OrderDataDetail();
  cartList: any[] = [];
  newLoginBody = {tId: '', data:{custId:0,isBMPortal:1}};
  selectedAddress: any;
  flags = {
    isUpdated: false
  };
  currency: string;
  mobUrl: string;
  country: string;
  loginRestUserId:number;
  locationDetails: any;
  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService,
    private toaster: ToastrManager,
    private loginService: LoginService,
    private router: Router,
    private common: CommonService,
    private url: UrlService
  ) { }

  ngOnInit() {
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hashing
    this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hashing
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
  
    const loginBody = this.localStorage.get('BM_LoginBody');
    this.tId = this.localStorage.get('BM_tId');
    this.updateProfileBody.tId = this.tId;
    this.restLoginBody.tId = this.tId;
    this.getOrderInfoBody.tId = this.tId;
    const user = this.localStorage.get('BM_USER');
    this.newLoginBody.tId = this.tId;
    this.newLoginBody.data.custId = user.id;

    this.getLocation();

   this.locationDetails = this.localStorage.get('BM_LocationDetail');

  }
  getLocation() {
    if (this.country.toUpperCase() == 'IN') {
      this.common.setCurrency(true);
      this.url.bellyMellyUrl = this.url.baseUrlTwoInd;
    } else if (this.country.toUpperCase() == 'US') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoUs;
    } else if (this.country.toUpperCase() == 'AU')  {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoAustralia;
    }
    this.loginRest();
  }
  loginRest() {
    this.api.loginByCustomerId(this.newLoginBody).subscribe((response: any) => {

      if (response.serviceStatus === 'S') {
        this.localStorage.set('BM_Rest_User', response.data);
        this.loginRestUserId = response.data.id;
        this.restUser = response.data;
        this.updateBody.fName = this.restUser.FName;
        this.updateBody.eMail = this.restUser.Email;
        this.updateBody.tel = this.restUser.Tel;
        this.addressList = response.data.AddressBook;
        this.orderHistory = response.data.OrderHistory;
       
        this.cardList = response.data.CCInfo;
        this.updateBody.custId = this.restUser.id;
        // this.getProfile();
        // this.getCouponList()
      }
    });
  }
  getProfile() {
    this.api.getUserProfile().subscribe((response: any) => {
      if (!response.success) return;
      this.user = response.data;
      this.loginService.setUser(this.user);
    });
  }
  updateUser() {
    this.updateProfileBody.data = {customerData: this.updateBody};
    this.flags.isUpdated = true;
    this.api.editUserProfile(this.updateProfileBody).subscribe((response: any) => {
      this.flags.isUpdated = false;
      if (!response.success) return;
      this.toaster.successToastr('Profile updated successfully !!');
      document.getElementById('closeEditProfileModal').click();
      // this.loginRest();
    }, error => {
      this.flags.isUpdated = false;
    });
  }
  getOrderInfo(orderId) {
    this.getOrderInfoBody.data.orderId = orderId;
    this.api.getOrderInfo(this.getOrderInfoBody).subscribe((response: any) => {
      if (response.serviceStatus === 'S') {
        response.data.ItemList.forEach(ele => {
          let amount = 0;
          if (ele.ItemAddOnList.length) {
            ele.ItemAddOnList.forEach(addOn => {
              const addOnList = [];
              addOn.AddOnOptions.forEach(element => {
                amount += Number(element.Price);
                addOnList.push({
                  AddOnOptionModifier1: null,
                  AddOnOptionModifier2: null,
                  Amt: Number(element.Price),
                  Dflt: null,
                  DisplayType: null,
                  Id: element.Id,
                  Name: element.Name,
                  PortionId: element.PortionId,
                  Qty: element.Qty,
                  UnitPrice: Number(element.Price),
                  isSelected: true
                });
              });
              addOn.AddOnOptions = addOnList;
            });
          }
          this.cartList.push({
            Id: ele.Id,
            ItemAddOnList: ele.ItemAddOnList,
            Name: ele.Name,
            P1: Number(ele.Price) * Number(ele.Qty) + amount,
            addQuantity: Number(ele.Qty),
            CatId: ele.CatId,
            instr: ele.Description,
            isAdded: true,
            portionId: Number(ele.PortionId),
            price: Number(ele.Price),
            specialOffer: null
          })
        });
        this.localStorage.set('cartItem', this.cartList);
        // this.router.navigateByUrl(`/${this.country}/${this.mobUrl}`);
        this.router.navigateByUrl(`/${this.mobUrl}`);
      }
    })
  }
  onSelectAddress(address) {
    this.selectedAddress = address;
  }
  logout() {
    this.loginService.setVal(false);
    this.localStorage.clear();
    this.router.navigateByUrl('/');
  }




  getCouponList() {

    const userData = this.localStorage.get('BM_USER')

    this.getCouponListBody.tId = this.tId;

    if(this.loginRestUserId){
      this.getCouponListBody.data = {custId: this.loginRestUserId}
    }else{
      this.getCouponListBody.data = {custId: userData.id}
    }
  

    this.api.getCouponList(this.getCouponListBody).subscribe((response: any) => {
      if (response.serviceStatus === 'S') {
        if (this.locationDetails && this.locationDetails.Coupons.length) {
          this.couponList = _.filter(this.locationDetails.Coupons, o => {
            return o.CType == 'Generic';
          });
          const list = _.filter(this.locationDetails.Coupons, o => {
            return o.CType == 'Specific';
          });
          const tempArray = [];
          if (list.length) {
            list.forEach(ele => {
              if (response.data.length) {
                response.data.forEach(element => {
                  if (ele.Id == element.Id) tempArray.push(element);
                });
              }
            });
          }
          this.couponList = this.couponList.concat(tempArray);
        }
      }
    });
  }

}

