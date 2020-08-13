import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import * as js from '../../../../assets/js/custom';
import { ActivatedRoute, Router } from "@angular/router";
import { PlaceOrderBody } from "../../../requests/place-order-body";
import { LocalStorageService } from "angular-web-storage";
import { ApiService } from "../../../services/api/api.service";
import { RestLoginBody } from "../../../requests/rest-login-body";
import { User } from "../../../models/user";
import { ToastrManager } from "ng6-toastr-notifications";
import * as _ from 'lodash';
import { UrlService } from "../../../services/url/url.service";
import { RestSignUpBody, SignUpCustomerData } from "../../../requests/Rest-sign-up-body";
import { GetCouponListBody } from "../../../requests/get-coupon-list-body";
import { CouponList } from "../../../models/coupon-list";
import { CouponsComponent } from "../coupons/coupons.component";
import { LocationServiceService } from "../../../services/location-services/location-service.service";
import { CommonService } from "../../../services/common/common.service";
import { ObservableService } from "../../../services/observable-service/observable.service";
import * as moment from "moment-timezone";
import { CardDetailBody } from "../../../requests/card-detail-body";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { PaytmRequestBody } from "../../../requests/paytm-request-body";
import { LoginService } from 'src/app/services/login/login.service';
import { ModalComponent } from "../dish-items/modal/modal.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, StripeCardComponent, Element as StripeElement, ElementOptions, ElementsOptions } from "@nomadreservations/ngx-stripe";
declare var $: any;
declare var swal: any

// import { setTimeout } from 'timers';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  user: any;
  orderFailedResp: any;
  mobUrl: string;
  paymentUrl = '';
  tId: string;
  loginBody: any;
  history = window.history;
  selectedTip: number;
  addressList: any[] = [];
  OrderHistory: any;
  itemList: any[] = [];
  imageUrl: string;
  locationDetails: any;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  couponList: Array<CouponList> = [];
  getCouponListBody = new GetCouponListBody();
  placeOrderBody = new PlaceOrderBody();
  restLoginBody = new RestLoginBody();
  restSignUpBody = new RestSignUpBody();
  selectedIndex: number;
  selectedAddress: any;
  selectedAddressEdit: any;
  addressStatus: boolean;
  Number = Number;
  deliveryCharges = 0;
  isDeliveryFree = false;
  appliedPromoCode: any;
  signUpBody = new SignUpCustomerData();
  JSON = JSON;
  orderData: any;
  selectedServiceDetail: any;
  country: string;
  totalAmmountData: number = 0;
  flags = {
    isPromoApplied: false,
    deliveryNotAvailable: false,
    isOrderPlaced: false,
    isCCPayment: false,
    isOrderByPaytm: false,
    placeorderButton: false
  };
  selectedAddOnObj: any;
  type: number;
  addOnList: Array<any> = [];
  fullItem: any;
  orderId = '';
  currency: string;
  SpecialInstructions: string;
  isShowforSuggestion: boolean = false;
  timeData = [];
  timeData1 = [];
  selectedTime: string;
  getLocationDetail: any;
  @ViewChild(CouponsComponent, { static: false }) couponComp: CouponsComponent;
  cardBody = new CardDetailBody();
  expDate = { month: '', year: '' };
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
  @ViewChild(ModalComponent, { static: false }) public modal: ModalComponent;
  options = {
    types: []
  };
  getPaytmBody = new PaytmRequestBody();
  paytmDetails: any;
  restUser: any;
  newLoginBody = { tId: '', data: { custId: 0, isBMPortal: 1 } };
  checkCountry: boolean = false;
  loginRestUserId: number;
  queryString: string;
  queryStringM: string;
  // NGOName:string;
  PaymentTypes: boolean = false;
  PaymentTypesCOD: boolean = false;

  selectedAddressData = [];
  donateValue: number;
  tipvalueSelected: number;
  donateValSelected: number;
  placeorderData1: any;
  ngoData = []
  public min: Date = new Date();
  laterDate: string;
  TimeSelection: number = 0;
  todayDate: string;
  DueOn: string;


  stripeKey = '';
  error1: any;
  complete = false;
  element: StripeElement;
  cardOptions: ElementOptions = {
    // hidePostalCode: true,
    style: {
      base: {
        iconColor: '#276fd3',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  maxDate: Date;
  DineInTableNum: string;
  ASAPOnOFf: string = 'F';
  LTOnOff: string = 'F';
  FOOnOff: string = 'F';
  Discounts: any;
  openCloseTime: string;
  // @Output() placeorderData1 = new EventEmitter();
  @Output() onPlaceOrder = new EventEmitter();
  todayOpenClose:boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private api: ApiService,
    private router: Router,
    private toaster: ToastrManager,
    private url: UrlService,
    private locationService: LocationServiceService,
    private common: CommonService,
    private observable: ObservableService,
    private loginService: LoginService,
    private _stripe: StripeService
  ) {
    this.maxDate = new Date();

    this.maxDate.setDate(this.maxDate.getDate() + 7);
  }

  ngOnInit() {

    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }

    // js.donactecontentopen();
    // this.getLocation();
    // this.observable.setIsCheckout(false);
    this.tId = this.localStorage.get('BM_tId');
    this.newLoginBody.tId = this.tId;
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });

    this.observable.isAddressSelected().subscribe((address: any) => {

      this.selectedAddressData = address;
      if (address) {
        this.onSelectAddress(address, address.index);
        if (address.selectedIndex) {
          this.addressList[address.selectedIndex] = address;
        } else {
          this.addressList.push(address)
          this.addressList = this.addressList.reverse()
        }
      }
      // if (address) {
      //   this.onSelectAddress(address, address.index);
      //   this.addressList.push(address)

      //   // this.loginRest();
      // }
    });


    this.selectedTip = 0;
    this.addressStatus = false;
    js.closeCheck();
    this.imageUrl = this.url.imageUrl;
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
    this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hasing
    if (!this.localStorage.get('cartItem')) {

      if (window.location.hostname == 'localhost') {
        this.router.navigateByUrl(`/${this.country}/${this.mobUrl}`); //testing
      } else {
        this.router.navigateByUrl(`/${this.mobUrl}`); //live
      }
    }
    // this.mobUrl = window.location.hash.replace('#/', '').split('/')[1]; // With hashing
    // this.country = window.location.hash.replace('#/', '').split('/')[0]; // With hashing
    this.paymentUrl = `${this.country}/${this.mobUrl}`;
    this.user = this.localStorage.get('BM_USER');

    this.newLoginBody.data.custId = this.user.id;
    this.appliedPromoCode = this.localStorage.get('selectedCouponBM');
    if (this.appliedPromoCode) this.flags.isPromoApplied = true;
    this.loginBody = this.localStorage.get('BM_LoginBody');
    if (this.loginBody) this.restLoginBody.data = { username: this.loginBody.data.username, password: this.loginBody.data.password };
    this.locationDetails = this.localStorage.get('BM_LocationDetail');

    this.locationDetails.ngo.forEach(element => {
      if (element.Show == 1) {
        if (element.RecId == this.locationDetails.FeaturedNgoId) {

          this.ngoSelect(element);
        }
        this.ngoData.push(element)
      }
    });

    this.ngoData.forEach(element => {

    });
    const paymentTypeExistCC = _.find(this.locationDetails.PaymentTypes, { Type: 'CC' });
    if (paymentTypeExistCC) {
      this.PaymentTypes = true;
    }
    const paymentTypeExistCOD = _.find(this.locationDetails.PaymentTypes, { Type: '$$' });
    if (paymentTypeExistCOD) {
      this.PaymentTypesCOD = true;
    }
    if (this.locationDetails && this.locationDetails.Cuisines.length) this.locationDetails.Cuisines = _.map(this.locationDetails.Cuisines, 'name');
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    const a = _.findIndex(this.placeOrderBody.data.orderData.ItemList, { isShowforSuggestion: 'True' });
    if (a != -1) {
      this.isShowforSuggestion = true;
    }

    //     this.observable.getdinein().subscribe((response: any) => {
    //     })
    if (!this.tId) return this.router.navigateByUrl(`/${this.mobUrl}`);
    this.restLoginBody.tId = this.tId;
    this.orderData = this.placeOrderBody.data.orderData;
    if (this.placeOrderBody.data.orderData.ServiceId == 1) {
      $('.onNext').removeClass('active');
      $('.ngoSection').addClass('active');
      this.opendonate();
      this.closeAddress();
      // $('.payment-sec').addClass('active');
    }

    this.getLocation();
    setTimeout(() => {
      js.swipper();
    }, 1000);
    const loginIUser1 = this.localStorage.get('BM_USER');
    this.addressList = loginIUser1.AddressBook;
    if (this.placeOrderBody.data.orderData.ServiceId == 2 || this.placeOrderBody.data.orderData.ServiceId == 5) {
      this.onChangeTip(20, true);
    }
    this.todayDate = moment().format("YYYY-MM-DD");
    this.laterDate = moment().add(1, 'day').format('YYYY-MM-DD');
    if (this.locationDetails.PaymentProviderStripe == 'T') {
      this._stripe.changeKey(atob(this.locationDetails.PublishableKey));
    }
    this.openCloseTime = this.common.showOpenCloseTime(this.locationDetails)
    this.todayOpenClose =  this.common.onlyCheckRestaurentOpenClose(this.locationDetails)
    this.checkoutTracking(this.placeOrderBody)
  }
  checkoutTracking(data) {
    const a = this.localStorage.get('placeOrderData');
    const orderData = a.data.orderData;
    const service = orderData.ServiceId == 1 ? 'Pick UP' : orderData.ServiceId == 2 ? 'Delivery' : orderData.ServiceId == 3 ? 'Curbside' : orderData.ServiceId == 5 ? 'Dine In' : '';
    const itemsData = orderData.ItemList
    orderData.ItemList.forEach(element => {
      element.id = element.Id;
      element.name = element.Name;
      element.brand = this.mobUrl;
      element.category = element.catName;
      if (element.ItemAddOnList.length > 0) {
        const variant = []
        element.ItemAddOnList.forEach(ele => {
          variant.push(ele.Name)
        });
        element.variant = variant.toString();
      } else {
        element.variant = '';
      }
      element.quantity = element.Qty;
      element.price = element.UnitPrice;
      delete element.categoryId
      delete element.Name
      delete element.Id
      delete element.PortionId
      delete element.UnitPrice
      delete element.Qty
      delete element.Amt
      delete element.SpecialInstructions
      delete element.NameOfThePerson
      delete element.ItemAddOnList
      delete element.isShowforSuggestion
      delete element.ItemModList
      delete element.max
    });
    js.checkout(service, itemsData)
  }

  loginRest() {
    this.api.loginByCustomerId(this.newLoginBody).subscribe((response: any) => {
      if (response.serviceStatus === 'S') {
        this.addressList = response.data.AddressBook;
        this.OrderHistory = response.data.OrderHistory;
        const serviceId = this.placeOrderBody.data.orderData.ServiceId
        const RestChainIdExist = _.find(this.OrderHistory, { ChainId: this.locationDetails.RestChainId })
        if ((this.placeOrderBody.data.orderData.ServiceId == 5 && this.country == 'us') || this.country == 'au')
          if (RestChainIdExist) {
            const a = _.filter(this.locationDetails.Discounts, function (e) { return e.Service.ServiceId == serviceId && e.Lookup.LookupName == "Online"; });

            if (a.length > 0) {
              this.Discounts = _.filter(this.locationDetails.Discounts, function (e) { return e.Service.ServiceId == serviceId && e.Lookup.LookupName == "Online"; });
            } else {
              this.Discounts = _.filter(this.locationDetails.Discounts, function (e) { return e.Service.ServiceId == serviceId && e.Lookup.LookupName == "FirstOrder" });
            }
            if (this.Discounts.length > 0) {
              setTimeout(function () {
                document.getElementById('applyCoupon').click();
              }, 1000)
            }
          } else {
            const a = _.filter(this.locationDetails.Discounts, function (e) { return e.Service.ServiceId == serviceId && e.Lookup.LookupName == "FirstOrder"; });
            if (a.length > 0) {
              this.Discounts = _.filter(this.locationDetails.Discounts, function (e) { return e.Service.ServiceId == serviceId && e.Lookup.LookupName == "FirstOrder"; });
            } else {
              this.Discounts = _.filter(this.locationDetails.Discounts, function (e) { return e.Service.ServiceId == serviceId && e.Lookup.LookupName == "Online" });
            }

            if (this.Discounts.length > 0) {
              setTimeout(function () {
                document.getElementById('applyCoupon').click();
              }, 1000)
            }
          }

        this.localStorage.set('BM_USER', response.data);
        this.loginRestUserId = response.data.id;
        this.afterResp(response);
        this.placeOrderBody.data.orderData.CustId = response.data.id;
        this.getCouponList(response.data.id)
      }
    });
    // const response = this.localStorage.get('BM_USER')
    // this.placeOrderBody.data.orderData.CustId = response.id;

    // this.addressList = response.AddressBook;
    // this.loginRestUserId = response.id;
    // this.afterResp(response);
    // this.getCouponList(response.id)
  }

  getLocation() {
    if (this.country.toUpperCase() == 'IN') {
      this.common.setCurrency(true);
      this.url.bellyMellyUrl = this.url.baseUrlTwoInd;
      this.checkCountry = true;
    } else if (this.country.toUpperCase() == 'US') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoUs;
    } else if (this.country.toUpperCase() == 'AU') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoAustralia;
    }

    this.loginRest();
  }

  itemTotal() {
    return _.sumBy(this.itemList, 'Amt');
  }



  afterResp(response) {

    const loginIUser = response.data;
    this.restUser = loginIUser;
    this.placeOrderBody.data.orderData.CustId = loginIUser.id;
    this.localStorage.set('BM_Rest_User', loginIUser);

    this.selectedServiceDetail = _.find(this.locationDetails.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });

    if (this.placeOrderBody) {
      this.itemList = this.placeOrderBody.data.orderData.ItemList;
      if (this.placeOrderBody.data.orderData.DeliveryInfo) {
        const id = this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId;
        this.selectedAddress = this.placeOrderBody.data.orderData.DeliveryInfo;
        this.selectedIndex = _.findIndex(this.addressList, { CustAddressBookId: this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId });
      } else {
        this.selectedAddress = null;
      }
      this.localStorage.set('placeOrderData', this.placeOrderBody);
    }
  }



  onChangeTip(value, flag) {


    this.placeOrderBody = this.localStorage.get('placeOrderData');
    this.placeOrderBody.data.orderData.tipvalueSelected = value
    if (flag) {
      this.selectedTip = this.placeOrderBody.data.orderData.PreTaxAmt * value / 100;
      this.placeOrderBody.data.orderData.TipAmt = this.selectedTip;
      if (this.placeOrderBody.data.orderData.donateValSelected) {

        const a = this.placeOrderBody.data.orderData.PreTaxAmt * this.placeOrderBody.data.orderData.donateValSelected / 100;
        this.placeOrderBody.data.orderData.donateValueWithPrcent = Number(a.toFixed(2));
      }

      this.placeOrderBody.data.orderData.TotalAmt = this.itemTotal() + Number(this.placeOrderBody.data.orderData.TipAmt) + Number(this.placeOrderBody.data.orderData.SrvcFee);

      this.localStorage.set('placeOrderData', this.placeOrderBody);

    } else {
      this.selectedTip = 0;
      this.placeOrderBody.data.orderData.TipAmt = 0;
      this.localStorage.set('placeOrderData', this.placeOrderBody);
    }

  }

  async onSelectAddress(obj, i) {
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    document.getElementById('closeChangeLocationResp').click();
    const locationDetailsData = this.localStorage.get('BM_LocationDetail');
    if (this.placeOrderBody.data.orderData.ServiceId == 2) {
      this.localStorage.set('placeOrderData', this.placeOrderBody);
      const service = _.find(locationDetailsData.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });
      if (service.DeliveryZones) {
        this.locationService.getDeliveryPrice({ latitude: Number(obj.Latitude), longitude: Number(obj.Longitude) }, service).then((result: any) => {
          if (!result.length) {
            if (locationDetailsData.MiscMask.split('')[2] == 0) {
              this.error('You are outside our normal delivery area. The system will let you place an order but we recommend you call the restaurant directly before placing the order to confirm they can make the delivery.');
            }
            if (locationDetailsData.MiscMask.split('')[2] == 1) {
              this.flags.deliveryNotAvailable = true;
              this.localStorage.set('BM_Is_Delivery', false);
              return this.error('Your delivery address is outside our delivery zones. Currently we are not able to provide service to these areas. Please select the address or select another order type.');
            } else {
              this.localStorage.set('BM_Is_Delivery', true);
              this.deliveryCharges = service.DeliveryZones[service.DeliveryZones.length - 1].FixedCharge;
              this.selectedAddress = obj;
              this.selectedIndex = i;
              this.placeOrderBody.data.orderData.DeliveryInfo = obj;
              this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId = obj.custAddrId ? obj.custAddrId : obj.CustAddressBookId;
              this.placeOrderBody.data.orderData.DeliveryInfo.ZIP = obj.zip ? obj.zip : obj.ZIP;
              this.localStorage.set('BM_Is_Delivery', true);
              this.placeOrderBody.data.orderData.SrvcFee = this.deliveryCharges;
              this.localStorage.set('placeOrderData', this.placeOrderBody);
              this.opendonate();
              this.closeAddress();
            }
          } else {
            this.deliveryCharges = result[0].FixedCharge;
            this.selectedAddress = obj;
            this.selectedIndex = i;
            this.placeOrderBody.data.orderData.DeliveryInfo = obj;
            this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId = obj.custAddrId ? obj.custAddrId : obj.CustAddressBookId;
            this.placeOrderBody.data.orderData.DeliveryInfo.ZIP = obj.zip ? obj.zip : obj.ZIP;
            this.localStorage.set('BM_Is_Delivery', true);
            this.placeOrderBody.data.orderData.SrvcFee = this.deliveryCharges;
            this.localStorage.set('placeOrderData', this.placeOrderBody);
            this.opendonate();
            this.closeAddress();
          }
        });
      } else {
        if (this.locationDetails.MiscMask.split('')[2] == 1) {
          this.flags.deliveryNotAvailable = true;
          this.localStorage.set('BM_Is_Delivery', false);
          return this.error('Your delivery address is outside our delivery zones. Currently we are not able to provide service to these areas. Please select the address or select another order type.');
        } else {
          this.isDeliveryFree = true;
          this.deliveryCharges = 0;
          this.selectedAddress = obj;
          this.selectedIndex = i;
          this.placeOrderBody.data.orderData.DeliveryInfo = obj;
          // this.placeOrderBody.data.orderData.DeliveryInfo.Instructions = obj.custAddrId?obj.custAddrId:obj.CustAddressBookId;
          this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId = obj.custAddrId ? obj.custAddrId : obj.CustAddressBookId;
          this.placeOrderBody.data.orderData.DeliveryInfo.ZIP = obj.zip ? obj.zip : obj.ZIP;
          this.deliveryCharges = this.common.servicesDelivery(service, this.itemTotal());
          this.placeOrderBody.data.orderData.SrvcFee = Math.round(this.deliveryCharges);
          this.localStorage.set('BM_Is_Delivery', true);
          if (this.deliveryCharges > 0) {
            this.isDeliveryFree = false;
            // this.localStorage.set('BM_Is_Delivery', false);
          }
          this.localStorage.set('placeOrderData', this.placeOrderBody);
          this.opendonate();
          this.closeAddress();
        }
      }
    } else {
      this.selectedAddress = obj;
      this.selectedIndex = i;
      this.placeOrderBody.data.orderData.DeliveryInfo = obj;
      this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId = obj.custAddrId ? obj.custAddrId : obj.CustAddressBookId;
      this.placeOrderBody.data.orderData.DeliveryInfo.ZIP = obj.zip ? obj.zip : obj.ZIP;
      this.localStorage.set('BM_Is_Delivery', true);
      this.placeOrderBody.data.orderData.SrvcFee = this.deliveryCharges;
      this.localStorage.set('placeOrderData', this.placeOrderBody);
      this.opendonate();
      this.closeAddress();
    }
  }

  onEditAddress(obj, i) {
    this.selectedAddressEdit = obj;
    this.selectedIndex = i;
    const data = { selectedAddressEdit: obj, selectedIndex: i }
    this.observable.setEditAddress(data)
  }

  onUpdateQty(index, type) {

    if (type) {
      if (this.itemList[index].Qty >= this.itemList[index].max) return;
      this.itemList[index].Qty = this.itemList[index].Qty + 1;
      let amt = 0;
      if (this.itemList[index].ItemAddOnList.length) {
        this.itemList[index].ItemAddOnList.forEach(ele => {
          amt += _.sumBy(ele.AddOnOptions, 'Amt');
        });
      }
      this.itemList[index].Amt = (this.itemList[index].UnitPrice + amt) * this.itemList[index].Qty;
      const tax = this.itemTotal() * this.locationDetails.Tax;
      this.placeOrderBody.data.orderData.TaxAmt = tax;
      this.placeOrderBody.data.orderData.PreTaxAmt = this.itemTotal();
      this.placeOrderBody.data.orderData.TotalAmt = this.itemTotal() + tax;

      this.placeOrderBody.data.orderData.ItemList = this.itemList;
      if (this.placeOrderBody.data.orderData.TipAmt) {
        this.selectedTip = this.itemTotal() * this.placeOrderBody.data.orderData.tipvalueSelected / 100;
        this.placeOrderBody.data.orderData.TipAmt = this.selectedTip;
      }

      if (this.placeOrderBody.data.orderData.donateValSelected) {
        const a = this.itemTotal() * this.placeOrderBody.data.orderData.donateValSelected / 100;
        this.placeOrderBody.data.orderData.donateValueWithPrcent = Number(a.toFixed(2));
        this.placeOrderBody.data.orderData.DonateValue = Number(a.toFixed(2));
      }
      this.localStorage.set('placeOrderData', this.placeOrderBody);
      if (this.localStorage.get('selectedCouponBM')) this.couponComp.applyCoupon(this.localStorage.get('selectedCouponBM'), this.appliedPromoCode.discountType);
    } else {


      if (this.itemList[index].Qty > 1) {
        this.itemList[index].Qty = this.itemList[index].Qty - 1;
        let amt = 0;
        if (this.itemList[index].ItemAddOnList.length) {
          this.itemList[index].ItemAddOnList.forEach(ele => {
            amt += _.sumBy(ele.AddOnOptions, 'Amt');
          });
        }
        this.itemList[index].Amt = (this.itemList[index].UnitPrice + amt) * this.itemList[index].Qty;
        const tax = this.itemTotal() * this.locationDetails.Tax;
        this.placeOrderBody.data.orderData.TaxAmt = tax;

        this.placeOrderBody.data.orderData.PreTaxAmt = this.itemTotal();
        this.placeOrderBody.data.orderData.TotalAmt = this.itemTotal() + tax;

        this.placeOrderBody.data.orderData.ItemList = this.itemList;

        if (this.placeOrderBody.data.orderData.TipAmt) {
          this.selectedTip = this.itemTotal() * this.placeOrderBody.data.orderData.tipvalueSelected / 100;
          this.placeOrderBody.data.orderData.TipAmt = this.selectedTip;
        }

        if (this.placeOrderBody.data.orderData.donateValSelected) {
          const a = this.itemTotal() * this.placeOrderBody.data.orderData.donateValSelected / 100;
          this.placeOrderBody.data.orderData.donateValueWithPrcent = Number(a.toFixed(2));
          this.placeOrderBody.data.orderData.DonateValue = Number(a.toFixed(2));
        }
        this.localStorage.set('placeOrderData', this.placeOrderBody);
        if (this.localStorage.get('selectedCouponBM')) this.couponComp.applyCoupon(this.localStorage.get('selectedCouponBM'), this.appliedPromoCode.discountType);
      } else {
        js.removeFromCart(this.itemList[index].Name, this.itemList[index].Id, this.itemList[index].Amt, this.mobUrl, this.itemList[index].CatName?this.itemList[index].CatName:this.itemList[index].catName, [], 1);
        this.itemList.splice(index, 1);
        this.placeOrderBody.data.orderData.ItemList = this.itemList;
        this.placeOrderBody.data.orderData.PreTaxAmt = this.itemTotal();
        const tax = this.itemTotal() * this.locationDetails.Tax;
        this.placeOrderBody.data.orderData.TaxAmt = tax;
        this.placeOrderBody.data.orderData.TotalAmt = this.itemTotal() + tax;
        this.placeOrderBody.data.orderData.CouponAmt = 0;
        this.placeOrderBody.data.orderData.TipAmt = 0;
        if (this.placeOrderBody.data.orderData.donateValSelected) {
          const a = this.itemTotal() * this.placeOrderBody.data.orderData.donateValSelected / 100;
          this.placeOrderBody.data.orderData.donateValueWithPrcent = Number(a.toFixed(2));
          this.placeOrderBody.data.orderData.DonateValue = Number(a.toFixed(2));
        }
        this.placeOrderBody.data.orderData.SrvcFee = 0;
        this.selectedTip = 0;
        this.placeOrderBody.data.orderData.tipvalueSelected = 0;
        this.localStorage.set('placeOrderData', this.placeOrderBody);
        if (this.localStorage.get('selectedCouponBM')) this.couponComp.applyCoupon(this.localStorage.get('selectedCouponBM'), this.appliedPromoCode.discountType);
      }
    }
  }

  getCouponList(userId) {

    const userData = this.localStorage.get('BM_USER')
    // this.loginRestUserId = userData.id;
    this.getCouponListBody.tId = this.tId;

    // if (this.loginRestUserId) {
    //   this.getCouponListBody.data = { custId: this.loginRestUserId }
    // } else {
    this.getCouponListBody.data = { custId: userId }
    // }


    // this.api.getCouponList(this.getCouponListBody).subscribe((response: any) => {

    //   if (response.serviceStatus === 'S') {
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
          if (userData.Coupons.length) {
            userData.Coupons.forEach(element => {
              if (ele.Id == element.Id) tempArray.push(element);
            });
          }
        });
      }
      this.couponList = this.couponList.concat(tempArray);
    }
    // }
    // });
  }

  isPromoApply(placeOrderData) {
    this.flags.isPromoApplied = true;
    this.placeOrderBody = placeOrderData;
    this.appliedPromoCode = this.localStorage.get('selectedCouponBM');
    this.placeOrderBody.data.orderData.TotalAmt = this.placeOrderBody.data.orderData.TotalAmt - placeOrderData.data.orderData.CouponAmt;
  }

  removePromo() {
    this.flags.isPromoApplied = false;
    this.placeOrderBody.data.orderData.CouponAmt = 0;
    this.placeOrderBody.data.orderData.PreTaxAmt = this.itemTotal();
    this.placeOrderBody.data.orderData.CouponType = null;
    this.placeOrderBody.data.orderData.RestChainCouponId = null;
    this.placeOrderBody.data.orderData.CustCouponId = null;
    this.placeOrderBody.data.orderData.TaxAmt = this.placeOrderBody.data.orderData.PreTaxAmt * this.locationDetails.Tax;
    this.placeOrderBody.data.orderData.TotalAmt = this.placeOrderBody.data.orderData.PreTaxAmt + this.placeOrderBody.data.orderData.TaxAmt;

    this.placeOrderBody.data.orderData.DiscountAmt = null;
    this.placeOrderBody.data.orderData.DiscountType = null;
    this.localStorage.set('placeOrderData', this.placeOrderBody);
    this.localStorage.remove('selectedCouponBM');
  }

  placeOrderResp(val) {


    this.locationDetails = this.localStorage.get('BM_LocationDetail');

    this.placeOrderBody = this.localStorage.get('placeOrderData');


    if (this.localStorage.get('specialOfferData')) {
      const specialOff = this.localStorage.get('specialOfferData');
      if (specialOff.length > 0) {

        if (this.placeOrderBody.data.orderData.PreTaxAmt < specialOff[0]['Amt1']) return this.error(`To qualify for the Free item the order must be over ${this.currency}${specialOff[0]['Amt1']}`)
      }

    }


    this.placeOrderBody.data.orderData.PaymentTypeId = val;


    const selectedService = _.find(this.locationDetails.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });
    if (this.itemTotal() < parseInt(selectedService.MinOrder)) return this.error(`Minimum order for this restaurant is ${this.currency}${parseInt(selectedService.MinOrder)}.`);

    const current = moment();
    const start = moment(moment().startOf('year'));
    const diff = current.diff(start, 'days');
    if (Number(this.locationDetails.Calendar.OpenOrCloseYearMask.charAt(diff)) == 0) {
      this.openSwal();
    } else {
      // const day = _.find(this.locationDetails.Schedule, {Day: this.days[new Date().getDay()]});
      // if ((moment().format('HH:mm') < moment(day.OT1, 'HH:mm:ss').format('HH:mm')) || (moment().format('HH:mm') > moment(day.CT1, 'HH:mm:ss').format('HH:mm'))) {
      //   this.openSwal();
      // }

      const day = _.find(this.locationDetails.Schedule, { Day: this.days[new Date().getDay()] });
      var currentTime = moment();    // e.g. 11:00 pm

      var startTime1 = moment(day.OT1, "HH:mm:ss");
      var endTime1 = moment(day.CT1, "HH:mm:ss");
      if (startTime1.hour() >= 12 && endTime1.hour() <= 12 || endTime1.isBefore(startTime1)) {
        endTime1.add(1, "days");
        if (currentTime.hour() <= 12) {
          currentTime.add(1, "days");
        }
      }
      var isBetween = currentTime.isBetween(startTime1, endTime1);   // TRUE

      if (isBetween == false) {
        var startTime2 = moment(day.OT2, "HH:mm:ss");
        var endTime2 = moment(day.CT2, "HH:mm:ss");
        if (startTime2.hour() >= 12 && endTime2.hour() <= 12 || endTime1.isBefore(startTime2)) {
          endTime2.add(1, "days");
          if (currentTime.hour() <= 12) {
            currentTime.add(1, "days");
          }
        }
        var isBetween1 = currentTime.isBetween(startTime2, endTime2);   // TRUE     
        if (isBetween1 == false) {
          if (this.placeOrderBody.data.orderData.TimeSelection == 0) {
            // this.openSwal();
          }

        }
      }
    }
    if (!this.placeOrderBody.data.orderData.ItemList.length) return this.error('Sorry your cart is empty, Please select item first.');
    if (this.placeOrderBody.data.orderData.ServiceId == 2 && !this.placeOrderBody.data.orderData.DeliveryInfo) return this.error('Please select delivery info first.');
    if (this.placeOrderBody.data.orderData.ServiceId == 2 && !this.localStorage.get('BM_Is_Delivery')) return this.error('Your delivery address is outside our delivery zones. Currently we are not able to provide service to these areas. Please select the address or select another order type.');
    if (!this.placeOrderBody.data.orderData.PaymentTypeId) return this.error('Please select payment type first.');
    if (this.placeOrderBody.data.orderData.ServiceId == 5) {

      if (!this.placeOrderBody.data.orderData.CustId) return
      // if (!this.DineInTableNum) return this.error('Please enter table number');
      this.placeOrderBody.data.orderData.DineInTableNum = this.DineInTableNum;
    }
    this.flags.isOrderPlaced = true;
    this.placeOrderBody.data.orderData.CreatedOn = moment().format();

    if (this.country.toUpperCase() != 'IN') {

      if (this.placeOrderBody.data.orderData.PaymentTypeId == 2) {
        this.placeOrderBody.data.orderData.CCInfo = this.cardBody;
        const dueon = this.placeOrderBody.data.orderData.DueOn.split(' ')
        this.placeOrderBody.data.orderData.CCInfo.date = dueon[0]
        this.placeOrderBody.data.orderData.CCInfo.time = moment(dueon[1], 'HH:mm:ss').format("hh:mm a");
      } else {
        this.placeOrderBody.data.orderData.CCInfo = {
          CCFName: null,
          CCLName: null,
          CCMName: null,
          CCAddr1: null,
          CCAddr2: null,
          CCCity: null,
          CCState: null,
          CCZIP: null,
          CCNumber: null,
          CCCVV: null,
          CCExpDate: null
        };
      }


      if (this.placeOrderBody.data.orderData.ServiceId == 2) {
        this.placeOrderBody.data.orderData.DeliveryInfo = {
          Name: this.restUser.FName ? this.restUser.FName : this.restUser.LName,
          AddressId: this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId ? this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId : null,
          Addr1: this.placeOrderBody.data.orderData.DeliveryInfo.Addr1 ? this.placeOrderBody.data.orderData.DeliveryInfo.Addr1 : null,
          Addr2: this.placeOrderBody.data.orderData.DeliveryInfo.Addr2 ? this.placeOrderBody.data.orderData.DeliveryInfo.Addr2 : null,
          City: this.placeOrderBody.data.orderData.DeliveryInfo.City ? this.placeOrderBody.data.orderData.DeliveryInfo.City : null,
          State: this.placeOrderBody.data.orderData.DeliveryInfo.State ? this.placeOrderBody.data.orderData.DeliveryInfo.State : null,
          Zip: this.placeOrderBody.data.orderData.DeliveryInfo.ZIP ? this.placeOrderBody.data.orderData.DeliveryInfo.ZIP : this.placeOrderBody.data.orderData.DeliveryInfo.zip,
          Telephone: this.restUser.Tel ? this.restUser.Tel : null,
          Instructions: this.placeOrderBody.data.orderData.DeliveryInfo.Instructions ? this.placeOrderBody.data.orderData.DeliveryInfo.Instructions : null,
        };
      } else {
        this.placeOrderBody.data.orderData.DeliveryInfo = {
          Name: this.restUser.FName ? this.restUser.FName : this.restUser.fname ? this.restUser.fname : null,
          Addr1: null,
          Addr2: null,
          City: null,
          State: null,
          Zip: null,
          Telephone: this.restUser.Tel ? this.restUser.Tel : null,
          Instructions: null
        };
      }
    }


    // this.placeOrderBody.data.orderData.TotalAmt = Number(this.placeOrderBody.data.orderData.TotalAmt) + Number(this.placeOrderBody.data.orderData.TipAmt) + Number(this.placeOrderBody.data.orderData.SrvcFee);

    this.placeOrderBody.data.orderData.SpecialInstructions = this.SpecialInstructions
    this.totalAmmountData = this.itemTotal() + Number(this.placeOrderBody.data.orderData.TipAmt) + Number(this.placeOrderBody.data.orderData.TaxAmt) + Number(this.placeOrderBody.data.orderData.SrvcFee);
    if (this.placeOrderBody.data.orderData.CustCouponId == null && this.placeOrderBody.data.orderData.RestChainCouponId == null) this.placeOrderBody.data.orderData.CouponAmt = null;
    this.placeOrderBody.data.orderData.TotalAmt = Number(this.totalAmmountData.toFixed(2)) - (this.placeOrderBody.data.orderData.CouponAmt || this.placeOrderBody.data.orderData.DiscountAmt || 0).toFixed(2);

    if (this.locationDetails.PaymentProviderStripe == 'T' && this.placeOrderBody.data.orderData.PaymentTypeId == 2) {

      this.placeOrderBody.data.orderData.StripeToken = this.cardBody.StripeToken;
    }
    var time1 = moment(this.placeOrderBody.data.orderData.DueOn).format('YYYY-MM-DD HH:mm:ss');
    var time2 = moment().format('YYYY-MM-DD HH:mm:ss');

    if (this.placeOrderBody.data.orderData.TimeSelection == 0) {
      const service = _.find(this.locationDetails.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });
      this.placeOrderBody.data.orderData.DueOn = moment().add(service.ReadyInMin, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    }
    if (this.placeOrderBody.data.orderData.TimeSelection != 0) {
      if (time1 < time2) {
        $('.clickShecdule').trigger('click')
        return
      }
    }

    delete this.placeOrderBody.data.orderData.NGOName;
    delete this.placeOrderBody.data.orderData.donateValueWithPrcent;


    this.api.orderPlace(this.placeOrderBody).subscribe((response: any) => {
      this.flags.isOrderPlaced = false;
      if (response.serviceStatus === 'S') {
        this.orderId = response.data.OrderNumber;
        this.orderData = this.placeOrderBody.data.orderData;
        this.localStorage.remove('placeOrderData');
        this.localStorage.remove('cartItem');
        this.observable.setSpecialOffer(false)
        this.localStorage.set('specialOfferData', null)
        $('#cc_payment_modal').modal('hide')
        // document.getElementById('openOrderSuccess').click();
        this.localStorage.set('thankyouData', { orderId: this.orderId, data: this.orderData, locationDetails: this.locationDetails })
        this.observable.setthankyouData({ orderId: this.orderId, data: this.orderData, locationDetails: this.locationDetails })
        if (window.location.hostname == 'localhost') {
          this.router.navigateByUrl(`${this.country}/${this.mobUrl}/thankyou`); //testing
        } else {
          this.router.navigateByUrl(`${this.mobUrl}/thankyou`);
        }

        // this.orderData.ItemList.forEach(element => {
        //   element.id=element.Id;
        //   element.name = element.Name;
        //   element.list_name = 'ItemAddOnList';
        //   element.brand = element.Name;
        //   element.category = element.categoryId;
        //   element.variant = element.Name;
        //   element.list_position = element.Name;
        //   element.quantity = element.Qty;
        //   element.price = element.UnitPrice;
        // });
        // this.googleAnalyticsService.eventEmitter('purchase', this.orderId, this.mobUrl, 'USD',this.orderData.TotalAmt,this.orderData.TaxAmt.toFixed(2),0,this.orderData.ItemList);
        // js.eventEmitter('purchase', this.orderId, this.mobUrl, 'USD',this.orderData.TotalAmt,this.orderData.TaxAmt.toFixed(2),0,this.orderData.ItemList);
      } else {
        this.onOrderFailed(JSON.parse(atob(response.data)))
      }
    }, error => {
      this.flags.isOrderPlaced = false;
    });
  }
  onOrderSuccess(data) {
    this.orderId = data.orderId;
    this.orderData = data.data;
  }

  openSwal() {
    swal({
      title: 'Warning',
      text: 'The restaurant is currently closed but you can place an order for a future date.',
      icon: 'warning',
      button: {
        text: 'Close',
        closeModal: false
      },
      dangerMode: true
    })
      .then((willDelete) => {
        swal.close();
      });
  }

  openAddOnPopup(item, data) {

    this.addOnList = item.AddOnList;
    this.fullItem = item;
    this.type = 1;
    this.selectedAddOnObj = data;

    this.observable.setAddOn(item);

    setTimeout(() => {
      this.modal.onCloseAddOnModal();
      js.openFancyBox();
    }, 200);

  }

  donateval() {

    if (this.placeOrderBody.data.orderData.donateValSelected) {
      this.placeOrderBody.data.orderData.DonateValue = 1
    } else {
      this.placeOrderBody.data.orderData.DonateValue = 0;
    }
    this.localStorage.set('placeOrderData', this.placeOrderBody);
    return this.placeOrderBody.data.orderData.DonateValue;
  }

  getSelectedAddOn(data) {
    const id = data.price.id;
    const list = data.list;
    let amt = 0;
    if (list.length) {
      list.forEach(ele => {
        amt += _.sumBy(ele.AddOnOptions, 'Amt');
      });
    }
    const a = [];
    this.fullItem.addQuantity = data.qty;
    this.fullItem.addedItems += 1;
    const i = _.findIndex(this.itemList, { Id: this.fullItem.Id });
    if (i > -1) this.itemList[i].addedItems += 1;
    js.addToCart(this.fullItem.Name, this.fullItem.Id, (this.fullItem[data.price.key.toUpperCase()] + amt) * data.qty, this.mobUrl, this.fullItem.data.CatName, list > 0 ? list:[], 1);
    this.itemList.push({
      Amt: (this.fullItem[data.price.key.toUpperCase()] + amt) * data.qty,
      Id: this.fullItem.Id,
      ItemAddOnList: list,
      ItemModList: [],
      Name: this.fullItem.Name,
      PortionId: id,
      Qty: 1,
      catId: data.catId,
      CatName:this.fullItem.data.CatName,
      SpecialInstructions: "",
      NameOfThePerson: '',
      UnitPrice: this.fullItem[data.price.key.toUpperCase()],
      max: data.max
    });
    this.placeOrderBody = this.localStorage.get('placeOrderData')
    this.placeOrderBody.data.orderData.ItemList = this.itemList;
    this.placeOrderBody.data.orderData.PreTaxAmt = this.itemTotal();
    this.placeOrderBody.data.orderData.TaxAmt = this.locationDetails.Tax * this.itemTotal();
    this.placeOrderBody.data.orderData.TotalAmt = this.placeOrderBody.data.orderData.PreTaxAmt + this.placeOrderBody.data.orderData.TaxAmt;

    this.localStorage.set('placeOrderData', this.placeOrderBody);
    if (this.localStorage.get('selectedCouponBM')) this.couponComp.applyCoupon(this.localStorage.get('selectedCouponBM'), this.appliedPromoCode.discountType);
    this.placeorderData1 = this.placeOrderBody;
  }

  addVariationToCart(item, data) {
    this.placeOrderBody = this.localStorage.get('placeOrderData')
    this.itemList.push({
      Amt: item.P1,
      Id: item.Id,
      ItemAddOnList: [],
      ItemModList: [],
      Name: item.Name,
      PortionId: data.P1.Id,
      Qty: 1,
      catId: data.catId,
      SpecialInstructions: "",
      NameOfThePerson: '',
      UnitPrice: item.P1,
      max: item.MaxQ
    });
    this.placeOrderBody.data.orderData.ItemList = this.itemList;
    this.placeOrderBody.data.orderData.PreTaxAmt = this.itemTotal();
    this.placeOrderBody.data.orderData.TaxAmt = this.locationDetails.Tax * this.itemTotal();
    this.placeOrderBody.data.orderData.TotalAmt = this.placeOrderBody.data.orderData.PreTaxAmt + this.placeOrderBody.data.orderData.TaxAmt;

    this.localStorage.set('placeOrderData', this.placeOrderBody);
  }

  onSelectCcPayment() {
    if (this.placeOrderBody.data.orderData.ServiceId == 2 && !this.placeOrderBody.data.orderData.DeliveryInfo) {
      $('.unchekRadioPayment').prop('checked', false)
      return this.error('Please select delivery address first.');
    } else if (this.placeOrderBody.data.orderData.ServiceId == 5) {
      if (!this.DineInTableNum) {
        $('.unchekRadioPayment').prop('checked', false)
        return this.error('Please enter table number');
      }
    }
    this.placeOrderBody.data.orderData.PaymentTypeId = 2;
    this.flags.isCCPayment = true;
    document.getElementById('open_cc_modal').click();
  }

  onSelectCODPayment() {
    if (this.placeOrderBody.data.orderData.ServiceId == 2 && !this.placeOrderBody.data.orderData.DeliveryInfo) {
      $('.unchekRadioPayment').prop('checked', false)
      return this.error('Please select delivery address first.');
    }
    else if (this.placeOrderBody.data.orderData.ServiceId == 5) {
      if (!this.DineInTableNum) {
        $('.unchekRadioPayment').prop('checked', false)
        return this.error('Please enter table number');
      }
    }
    this.placeOrderBody.data.orderData.PaymentTypeId = 3;
  }

  SpecialInstructionsF(val) {
    this.SpecialInstructions = val;
    this.placeOrderBody.data.orderData.SpecialInstructions = val
  }

  onCloseCcPaymentModal() {
    this.flags.isCCPayment = false;
    $('.unchekRadioPayment').prop("checked", false);
    $("#cc_us label input").prop("checked", false);
  }

  public handleAddressChange(address: Address) {
    this.cardBody.CCAddr1 = address.formatted_address;
    this.cardBody.CCAddr2 = address.vicinity;
    address.address_components.forEach(ele => {
      const index = ele.types.indexOf('administrative_area_level_1');
      const cityIndex = ele.types.indexOf('locality');
      const zipIndex = ele.types.indexOf('postal_code');
      if (cityIndex > -1) this.cardBody.CCCity = ele.long_name;
      if (index > -1) this.cardBody.CCState = ele.long_name;
      if (zipIndex > -1) this.cardBody.CCZIP = ele.long_name;
    });
  }

  onOrderFailed(data) {

    this.orderFailedResp = data;
    document.getElementById('openErrorInfoModal').click();
  }

  placeOrderByPaytm() {
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    if (this.localStorage.get('specialOfferData')) {
      const specialOff = this.localStorage.get('specialOfferData');
      if (specialOff.length > 0) {
        if (this.placeOrderBody.data.orderData.PreTaxAmt < specialOff[0]['Amt1']) return this.error(`To qualify for the Free item the order must be over ${this.currency}${specialOff[0]['Amt1']}`)
      }
    }

    if (this.placeOrderBody.data.orderData.ServiceId == 2 && !this.placeOrderBody.data.orderData.DeliveryInfo) return this.error('Please select delivery address first.');
    const selectedService = _.find(this.locationDetails.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });
    if (this.itemTotal() < parseInt(selectedService.MinOrder)) return this.error(`Minimum order for this restaurant is ${this.currency}${parseInt(selectedService.MinOrder)}.`);
    this.getPaytmBody.tId = this.tId;
    this.placeOrderBody.data.orderData.PaymentTypeId = 4;
    this.placeOrderBody.data.orderData.CreatedOn = moment().format();

    this.placeOrderBody.data.orderData.CouponAmt = null;
    // delete this.placeOrderBody.data.orderData.NGOName;
    delete this.placeOrderBody.data.orderData.donateValueWithPrcent;

    this.placeOrderBody.data.orderData.CCInfo = {
      CCFName: null,
      CCLName: null,
      CCMName: null,
      CCAddr1: null,
      CCAddr2: null,
      CCCity: null,
      CCState: null,
      CCZIP: null,
      CCNumber: null,
      CCCVV: null,
      CCExpDate: null
    };
    this.placeOrderBody.data.orderData.DeliveryInfo = {
      Name: this.restUser.FName,
      Addr1: null,
      Addr2: null,
      City: null,
      State: null,
      Zip: null,
      Telephone: this.restUser.Tel,
      Instructions: null
    };
    this.placeOrderBody.data.orderData.ItemList.forEach(ele => {
      delete ele.Name;
      delete ele.max;
    });
    // delete this.placeOrderBody.data.orderData.isPrinterMsgOk;
    const data = {
      locationId: this.locationDetails.Id,
      TotalAmt: this.placeOrderBody.data.orderData.TotalAmt,
      tempOrderData: {
        CustEmail: this.restUser.username,
        CustId: this.restUser.id,
        CustPhone: this.restUser.Tel,
        paytmCustId: Math.floor(1000000000000 + Math.random() * 9000000000000),
        OrderJSON: JSON.stringify(this.placeOrderBody.data.orderData),
        RestTimeStamp: moment().format(),
        ReturnURL: `http://13.234.241.183/website/#/${this.paymentUrl}`
      }
    };
    this.getPaytmBody.data = data;
    this.flags.isOrderByPaytm = true;
    this.common.getPaytmDetail(this.getPaytmBody).then((response: any) => {
      this.paytmDetails = response.data;
      setTimeout(() => {
        $('#paytmForm').submit();
      }, 200);
    }).catch(error => {
      this.flags.isOrderByPaytm = false;
    })
  }


  placeOrderCC() {
    if (this.locationDetails.PaymentProviderStripe == 'F') {
      if (Number(this.expDate.month) > 12) return this.toaster.errorToastr('Please enter valid date.');
      if (this.expDate.year.length < 2) return this.toaster.errorToastr('Please enter valid year.');
      if (this.expDate.month.length < 2) this.expDate.month = `0${this.expDate.month}`;
      for (let index = 0; index < 6; index++) {
        this.cardBody.CCNumber = this.cardBody.CCNumber.replace("-", "");
      }
    }
    this.cardBody.service = 1;
    this.cardBody.date = 'LT';
    this.cardBody.time = 'ASAP';
    this.cardBody.tipPaidbBy = 'on';
    this.cardBody.txtPaytronixGiftCard = '';
    this.cardBody.CCType = 2;
    this.cardBody.hacode = '';
    this.cardBody.CCCVV = this.cardBody.CCCVV ? this.cardBody.CCCVV : '';
    this.cardBody.CCNumber = this.cardBody.CCNumber ? this.cardBody.CCNumber : '';
    this.cardBody.CCZIP = this.cardBody.CCZIP ? this.cardBody.CCZIP : '';
    this.cardBody.expMonth = this.cardBody.expMonth ? this.cardBody.expMonth : '';
    this.cardBody.expYear = this.cardBody.expYear ? this.cardBody.expYear : '';
    this.cardBody.CCExpDate = this.expDate.month ? `${this.expDate.month}/${this.expDate.year}` : '';
    this.placeOrderResp(2);
  }

  ngoSelect(val) {
    // Old functionality
    // this.placeOrderBody = this.localStorage.get('placeOrderData');
    // this.placeOrderBody.data.orderData.NGOId = val.RecId;
    // this.placeOrderBody.data.orderData.DonateCode = val.DonateCode;
    // this.placeOrderBody.data.orderData.ngoSelectedVal = val.DonateValue;
    // this.placeOrderBody.data.orderData.NGOName = val.Name;
    // this.placeOrderBody.data.orderData.donateValSelected = val.DonateValue;
    // const a = this.itemTotal() * val.DonateValue / 100;
    // this.placeOrderBody.data.orderData.donateValueWithPrcent = Number(a.toFixed(2));
    // this.placeOrderBody.data.orderData.DonateValue = Number(a.toFixed(2));

    this.placeOrderBody = this.localStorage.get('placeOrderData');
    this.placeOrderBody.data.orderData.NGOId = val.RecId;
    this.placeOrderBody.data.orderData.DonateCode = val.DonateCode;
    this.placeOrderBody.data.orderData.ngoSelectedVal = '1';
    this.placeOrderBody.data.orderData.NGOName = val.Name;
    this.placeOrderBody.data.orderData.donateValSelected = 1;
    this.placeOrderBody.data.orderData.donateValueWithPrcent = 1;
    this.placeOrderBody.data.orderData.DonateValue = 1
    this.localStorage.set('placeOrderData', this.placeOrderBody);
    this.closedonate();
    if (this.placeOrderBody.data.orderData.ServiceId != 2) {
      this.skiptip()
    }
  }


  opendonate() {
    $('.step1').removeClass("active")
    $('.tip-part').removeClass("active")
    $('.payment-sec').removeClass("active")
    $('.ngoSection').addClass("active")
    $('.donate-content').css("display", "block")
    $('.payment-sec-datail').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.add-new').hide()
    $('.donate').css("display", "block")
    $('.web-up-arrow').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.section-content1').css("display", "none")
    $('.add-tip').css("display", "none")
    $('.donate').css("display", "block")
    $('.openwebdonation').css("display", "none")
    $('.closewebdonation').css("display", "block")
  }

  closedonate() {
    $('.donate-content').css("display", "none")
    // $('.payment-sec .item').css("display" , "block")
    $('.payment-sec-datail').css("display", "none")
    $('.donate').css("display", "none")
    $('.openwebdonation').css("display", "block")
    $('.openwebdonation i').css("display", "block")
    $('.add-tip').css("display", "block")
    $('.tip-part').addClass("active")
    $('.ngoSection').removeClass("active")
    $('.step1').removeClass("active")
    $('.payment-sec').removeClass("active")
    $('.web-skip').css("display", "block")
    $('.openwebtip i').css("display", "none")
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
  }
  skiptip() {

    this.selectedTip = 0;
    this.placeOrderBody.data.orderData.tipvalueSelected = 0;
    this.placeOrderBody.data.orderData.TipAmt = 0;
    $('.tip-part').removeClass("active")
    $('.payment-sec').addClass("active")
    $('.add-tip').css("display", "none")
    $('.payment-sec-datail').css("display", "block")
    $('.web-skip').css("display", "none")
    $('.openwebtip').css("display", "block")
    $('.openwebtip i').css("display", "block")
    $('.openwebpayment').css("display", "none")
    $('.donate').css("display", "none")
    $('.add-new').hide()
    $('.closewebpayment').css("display", "block")
  }
  openwebdonation() {
    $('.donate-content').css("display", "block")
    // $('.openwebdonation i').css("display" , "none")
    $('.donate').css("display", "block")
    $('.payment-sec-datail').css("display", "none")
    $('.section-content1').css("display", "none")
    $('.tip-part').removeClass("active")
    $('.ngoSection').addClass("active")
    $('.step1').removeClass("active")
    $('.payment-sec').removeClass("active")
    $('.add-tip').css("display", "none")
    $('.add-new').hide()
    $('.web-skip').css("display", "none")
    $('.openwebtip i').css("display", "block")
    $('.openwebdonation').css("display", "nobne")
    $('.closewebdonation').css("display", "block")
    $('.web-up-arrow').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.openwebpayment').css("display", "block")
    $('.closewebpayment').css("display", "none")
    $('.add-new').hide()
  }
  closewebdonation() {
    $('.donate-content').hide()
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
    $('.donate').css("display", "none")
    $('.add-new').hide()
  }
  openAddressclick() {
    $('.section-content1').css("display", "block")
  }
  closeAddress() {
    $('.section-content1').css("display", "none")
  }
  opentip() {
    $('.add-tip').css("display", "block")
    $('li .add-tip').addClass("active")
  }
  closetip() {
    $('.web-view .add-tip').css("display", "none")
    $('li .add-tip').removeClass("active")
    $('.payment-sec .item').css("display", "block")
    $('.tip-part').removeClass("active")
    $('.ngoSection').removeClass("active")
    $('.step1').removeClass("active")
    $('.payment-sec').addClass("active")
    $('.payment-sec-datail').css("display", "block")
    $('.openwebtip i').css("display", "none")
    $('.web-skip').css("display", "none")
    $('.openwebpayment').css("display", "none")
    $('.openwebtip i').css("display", "block")
    $('.donate').css("display", "none")
    $('.add-new').hide()
    $('.closewebpayment').css("display", "block")
  }
  openwebpayment() {
    $('.add-tip').css("display", "none")
    $('li .add-tip').removeClass("active")
    $('.payment-sec .item').css("display", "block")
    $('.tip-part').removeClass("active")
    $('.ngoSection').removeClass("active")
    $('.step1').removeClass("active")
    $('.payment-sec').addClass("active")
    $('.payment-sec-datail').css("display", "block")
    $('.openwebtip i').css("display", "block")
    $('.section-content1').css("display", "none")
    $('.web-skip').css("display", "none")
    $('.donate-content').css("display", "none")
    $('.openwebpayment').css("display", "none")
    $('.closewebpayment').css("display", "block")
    $('.web-up-arrow').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.donate').css("display", "none")
    $('.add-new').hide()
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
  }
  closewebpayment() {
    $('.payment-sec-datail').hide()
    $('.openwebpayment').css("display", "block")
    $('.closewebpayment').css("display", "none")
    $('.web-up-arrow').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.donate').css("display", "none")
    $('.add-new').hide()
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
  }
  closemobiledonation() {
    $('.mobile-donation').css("display", "none")
    $('.openmobiledonation i').css("display", "block")
    $('.mobile-skip').css("display", "none")
    $('.mobsearch').css("display", "none")
  }
  openmobiledonation() {
    $('.mobile-donation').css("display", "block")
    // $('.mobile-donation').css('transition-duration','3s');
    $('.mobile-skip').css("display", "block")
    $('.mobsearch').css("display", "block")
    $('.openmobiledonation i').css("display", "none")
    $('.mobile-skip .skip').css("display", "inline")

  }
  openmobiledonate() {
    $('.mobile-donation').css("display", "block")
  }
  openstep2() {
    // $('.donate-content').css("display" , "block")
    // $('.step1').removeClass("active")
    // $('.tip-part').removeClass("active")
    // $('.payment-sec').removeClass("active")
    // $('.ngoSection').addClass("active")
    // $('.section-content1').css("display" , "none")
  }

  openstepe1() {
    $('.add-tip').css("display", "none")
    $('li .add-tip').removeClass("active")
    $('.payment-sec .item').css("display", "block")
    $('.tip-part').removeClass("active")
    $('.ngoSection').removeClass("active")
    $('.step1').addClass("active")
    $('.payment-sec').removeClass("active")
    $('.payment-sec-datail').css("display", "none")
    $('.donate-content').css("display", "none")
    $('.section-content1').css("display", "block")
    $('.add-new').show()
    $('.web-skip').css("display", "none")
    $('.openwebtip i').css("display", "block")
    $('.web-down-arrow').css("display", "none")
    $('.web-up-arrow').css("display", "block")
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
    $('.openwebpayment').css("display", "block")
    $('.closewebpayment').css("display", "none")
    $('.donate').css("display", "none")

  }
  closestepe1() {
    $('.section-content1').hide()
    $('.web-up-arrow').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
    $('.add-new').hide()
    $('.donate').css("display", "none")
  }
  openwebdtip() {
    $('.add-tip').css("display", "block")
    $('.tip-part').addClass("active")
    // $('.payment-sec .item').css("display" , "none")
    $('.openwebtip i').css("display", "none")
    $('.web-skip').css("display", "block")
    $('.ngoSection').removeClass("active")
    $('.step1').removeClass("active")
    $('.payment-sec').removeClass("active")
    $('.payment-sec-datail').css("display", "none")
    $('.donate-content').css("display", "none")
    $('.section-content1').css("display", "none")
    $('.add-new').hide()
    $('.donate').css("display", "none")
    $('.web-up-arrow').css("display", "none")
    $('.web-down-arrow').css("display", "block")
    $('.openwebdonation').css("display", "block")
    $('.closewebdonation').css("display", "none")
    $('.openwebpayment').css("display", "block")
    $('.closewebpayment').css("display", "none")
  }

  closewebskip() {
    $('.mobile-donation').css("display", "none")
    $('.openwebdonation i').css("display", "block")
    $('.mobsearch').css("display", "none")
    $('.openmobiledonation i').css("display", "block")
    $('.mobile-skip .skip').css("display", "none")
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    this.placeOrderBody.data.orderData.NGOId = '';
    this.placeOrderBody.data.orderData.DonateCode = '';
    this.placeOrderBody.data.orderData.DonateValue = 0;
    this.placeOrderBody.data.orderData.donateValueWithPrcent = null;
    this.localStorage.set('placeOrderData', this.placeOrderBody);
    this.donateValue = null;

  }

  timesection(val) {
    if (val == 2) {
      if (!this.selectedTime) return this.error('Select time');;
    }
    var ReadyInMin = this.locationDetails.Services.find(x => x.Id === this.placeOrderBody.data.orderData.ServiceId);

    this.TimeSelection = val;
    if (this.TimeSelection == 0) {
      this.DueOn = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    if (this.TimeSelection == 1 && !this.DueOn) return this.error('Select time');
    if (this.TimeSelection == 2 && !this.laterDate) return this.error('Select date');
    if (this.TimeSelection == 2 && !this.DueOn) return this.error('Select time');
    this.placeOrderBody.data.orderData.TimeSelection = this.TimeSelection;
    if (this.TimeSelection == 0) {
      this.DueOn = moment(this.DueOn, 'YYYY-MM-DD HH:mm:ss').add(ReadyInMin.ReadyInMin, 'minutes').format('YYYY-MM-DD HH:mm');
    }



    this.placeOrderBody.data.orderData.DueOn = this.DueOn;
    $('.dlvrytym').click()
    $('#shecdule1').modal('hide')
    $("div").removeClass("modal-backdrop")
  }

  selectTime(val) {
    this.DueOn = val;
    this.selectedTime = this.DueOn;
  }

  clearTime() {
    this.timeData1 = []
    this.DueOn = null;
    this.selectedTime = null
    $(".selectOption").prop("selected", false)
    $(".selectOptionSelected").prop("selected", true)
  }



  shecdule1() {
    if (this.locationDetails.Menus[0].ASAP == 'T') {
      this.ASAPOnOFf = 'T';
    }
    if (this.locationDetails.Menus[0].LT == 'T') {
      this.LTOnOff = 'T';
    }
    if (this.locationDetails.Menus[0].FO == 'T') {
      this.FOOnOff = 'T';
    }
    this.timeData = this.common.checkRestaurentTimeSchedule(this.locationDetails);
    $('#shecdule1').modal('show');
  }

  shecdule2() {
    this.timeData = this.common.checkRestaurentTimeSchedule(this.locationDetails);
  }

  dateTime(date, time) {
    const timeData = moment(time, 'HH:mm:ss').format("hh:mm a");
    return timeData;
  }

  selectedTimeF(val) {
    const time = val.split(' ')[1];
    const timeData = moment(time, 'HH:mm').format("hh:mm a");
    return timeData;
  }

  laterDateDate(date) {
    this.selectedTime = null;
    $(".selectOption").prop("selected", false)
    $(".selectOptionSelected").prop("selected", true)
    this.timeData1 = []
    this.laterDate = moment(date).format('YYYY-MM-DD');
    if (this.todayDate == this.laterDate) {
      this.selectedTime = null;
      return this.error('Select next day date')
    }

    var today = '';
    const dayFind = moment(date).day()
    if (dayFind == 1) {
      var today = 'Mon';
    }
    else if (dayFind == 2) {
      var today = 'Tue';
    }
    else if (dayFind == 3) {
      var today = 'Wed';
    }
    else if (dayFind == 4) {
      var today = 'Thu';
    }
    else if (dayFind == 5) {
      var today = 'Fri';
    }
    else if (dayFind == 6) {
      var today = 'Sat';
    }
    else if (dayFind == 0) {
      var today = 'Sun';
    }
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');
    const day = _.find(this.getLocationDetail.Schedule, { Day: today });
    if (day.Closed == "T") {
      this.selectedTime = null;
      return this.error('This day restaurant is closed');
    }
    this.timeData1 = this.common.checkRestaurentTimeScheduleLaterToday(day);
  }

  queryStringF(val) {
    if (val.length > 0) {
      this.ngoData = this.locationDetails.ngo;
    }
    else {
      this.ngoData = []
      this.locationDetails.ngo.forEach(element => {
        if (element.Show == 1) {
          this.ngoData.push(element)

        }
      });
    }

  }

  cardUpdated(result) {
    this.element = result.element;
    this.complete = result.card.complete;
    if (this.complete) {
      // this._stripe.changeKey(this.stripeKey);
    }
    this.error = undefined;
  }

  keyUpdated() {
    this._stripe.changeKey(this.stripeKey);
  }



  getCardToken() {
    if (!this.element) return this.error('Enter card information')
    this.flags.placeorderButton = true;
    this._stripe.createPaymentMethod({ type: 'card', card: this.element, billing_details: { name: 'Jenny Rosen', }, }).subscribe(result => {
      if (result.paymentMethod) {
        this.flags.placeorderButton = true;
        setTimeout(() => {
          this.flags.placeorderButton = false;
        }, 2000);
        this.cardBody.StripeToken = result.paymentMethod.id;
        this.placeOrderCC()
      } else if (result.error) {
        this.flags.placeorderButton = false;
        alert(result.error.message)

      }
    })
  }

  shecdule() {
    if (this.locationDetails.Menus[0].ASAP == 'T') {
      this.ASAPOnOFf = 'T';
    }
    if (this.locationDetails.Menus[0].LT == 'T') {
      this.LTOnOff = 'T';
    }
    if (this.locationDetails.Menus[0].FO == 'T') {
      this.FOOnOff = 'T';
    }

    // $('#collapseOne').trigger('click')
    // $('#collapseOne').modal('show');
    // $("div").removeClass("modal-backdrop")
  }
  carmakeF(val) {
    this.placeOrderBody.data.orderData.carmake = val;
  }
  carmodelF(val) {
    this.placeOrderBody.data.orderData.carmodel = val;
  }
  carcolorF(val) {
    this.placeOrderBody.data.orderData.carcolor = val;
  }
  carplatenumberF(val) {
    this.placeOrderBody.data.orderData.carplatenumber = val;
  }
  tableF(val) {
    this.DineInTableNum = val;
   
  }
  dineinsend(){
    if(!this.DineInTableNum) return this.error('Please Enter Your Table Number: ')
    this.closedonate();
      this.closeAddress();
      this.localStorage.set('dineinExist', this.DineInTableNum)
      this.observable.setdinein(this.DineInTableNum)
    
   
   
  }

  SendAddToCartEvent() {
    //  this.googleAnalyticsService.eventEmitter("purchase", "transaction_id", "affiliation", "USD", 10);
  }

  cashMobile() {
    $('.cashMobileClick').trigger('click');
  }
  creditMobile() {
    $('.creditMobileClick').trigger('click');
  }

  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

  success = (message: string) => {
    this.toaster.successToastr(message);
  }
}
